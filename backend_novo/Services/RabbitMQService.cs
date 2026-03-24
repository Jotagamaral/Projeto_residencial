using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using backend_novo.Models;

namespace backend_novo.Services;

public class RabbitMQService : IMessageBusService, IDisposable
{
    private readonly IConnection? _connection;
    private IChannel? _channel;
    private readonly bool _isRabbitMqAvailable;

    public RabbitMQService(IConfiguration configuration)
    {

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
            // Tenta estabelecer a conexão
            _connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
            _isRabbitMqAvailable = true;
        }
        catch (Exception)
        {
            // Falhou
            Console.WriteLine($"[AVISO] RabbitMQ indisponível no host {host}:{port}. O sistema funcionará em modo de degradação graciosa (Logs apenas no console).");
            _isRabbitMqAvailable = false;
        }
    }

    public void PublishLog(Log log)
    {
        if (!_isRabbitMqAvailable)
        {
            Console.WriteLine($"[LOG BYPASS - RabbitMQ Offline] Ação: {log.Action} | Entidade: {log.EntityName} | Usuário: {log.UserId}");
            return;
        }

        if (_channel == null || _channel.IsClosed)
        {
            _channel = _connection!.CreateChannelAsync().GetAwaiter().GetResult();
            
            // Declarar a fila
            _channel.QueueDeclareAsync(queue: "audit_logs", durable: true, 
                                       exclusive: false, autoDelete: false)
                    .GetAwaiter().GetResult();
        }

        var message = JsonSerializer.Serialize(log);
        var body = Encoding.UTF8.GetBytes(message);

        _channel.BasicPublishAsync(exchange: string.Empty, 
                                   routingKey: "audit_logs", 
                                   body: body)
                .GetAwaiter().GetResult();
    }

    public void Dispose()
    {
        _channel?.Dispose();
        _connection?.Dispose();
    }
}