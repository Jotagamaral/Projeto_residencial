using System.Text;
using System.Text.Json;
using backend.src.context;
using backend.src.models;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace backend.workers;

public class LogWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConnection? _connection;
    private IChannel? _channel;
    private readonly bool _isRabbitMqAvailable;

    public LogWorker(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        _serviceProvider = serviceProvider;
        
        var host = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
        var port = Environment.GetEnvironmentVariable("RABBITMQ_PORT") ?? "5672";
        var user = Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest";
        var pass = Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest";

        var factory = new ConnectionFactory() 
        { 
            HostName = host,
            Port = int.Parse(port),
            UserName = user,
            Password = pass
        };
        
        try
        {
            _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
            _isRabbitMqAvailable = true;
        }
        catch (Exception)
        {
            _isRabbitMqAvailable = false;
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!_isRabbitMqAvailable || _connection == null)
        {
            Console.WriteLine("[AVISO WORKER] RabbitMQ offline. O Worker de gravação de logs não foi iniciado nesta sessão.");
            return;
        }
        _channel = await _connection.CreateChannelAsync(cancellationToken: stoppingToken);

        await _channel.QueueDeclareAsync(
            queue: "audit_logs", 
            durable: true, 
            exclusive: false, 
            autoDelete: false, 
            cancellationToken: stoppingToken);

        var consumer = new AsyncEventingBasicConsumer(_channel);

        consumer.ReceivedAsync += async (model, ea) =>
        {
            try
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                var log = JsonSerializer.Deserialize<Log>(message);

                if (log != null)
                {
    
                    using var scope = _serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    context.Logs.Add(log);
                    await context.SaveChangesAsync(stoppingToken);
                }

                await _channel.BasicAckAsync(ea.DeliveryTag, multiple: false, cancellationToken: stoppingToken);
            }
            catch (Exception)
            {
                await _channel.BasicNackAsync(ea.DeliveryTag, multiple: false, requeue: true, cancellationToken: stoppingToken);
            }
        };

        
        await _channel.BasicConsumeAsync(queue: "audit_logs", autoAck: false, consumer: consumer, cancellationToken: stoppingToken);

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }

    public override void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
        base.Dispose();
    }
}