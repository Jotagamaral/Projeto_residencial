using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using backend.src.models;
using backend.src.services.interfaces;

namespace backend.src.services;

public class RabbitMQService : IMessageBusService, IAsyncDisposable
{
    private readonly ConnectionFactory _factory;
    private IConnection? _connection;
    private IChannel? _channel;

    private bool _connectionAttempted = false;
    private bool _isRabbitMqAvailable = false;
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

    public RabbitMQService(IConfiguration configuration)
    {
        _factory = new ConnectionFactory()
        {
            RequestedConnectionTimeout = TimeSpan.FromSeconds(5),
            SocketReadTimeout = TimeSpan.FromSeconds(5),
            SocketWriteTimeout = TimeSpan.FromSeconds(5)
        };

        // Tenta buscar a URL completa (Produção / CloudAMQP)
        var rabbitUrl = Environment.GetEnvironmentVariable("RABBITMQ_URL");

        if (!string.IsNullOrEmpty(rabbitUrl))
        {
            _factory.Uri = new Uri(rabbitUrl);
        }
        else
        {
            // Fallback para variáveis individuais (Localhost / Docker)
            var host = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
            var port = Environment.GetEnvironmentVariable("RABBITMQ_PORT") ?? "5672";
            var user = Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest";
            var pass = Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest";

            _factory.HostName = host;
            _factory.Port = int.Parse(port);
            _factory.UserName = user;
            _factory.Password = pass;
        }
    }

    private async Task EnsureConnectionAsync()
    {
        if (_connectionAttempted) return;

        await _semaphore.WaitAsync();
        try
        {
            if (_connectionAttempted) return;

            _connectionAttempted = true;
            _connection = await _factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.QueueDeclareAsync(
                queue: "audit_logs", 
                durable: true, 
                exclusive: false, 
                autoDelete: false);

            _isRabbitMqAvailable = true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AVISO] RabbitMQ indisponível ({ex.Message}). O sistema funcionará em modo de degradação graciosa.");
            _isRabbitMqAvailable = false;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task PublishLogAsync(Log log)
    {
        await EnsureConnectionAsync();

        if (!_isRabbitMqAvailable || _channel == null)
        {
            Console.WriteLine($"[LOG BYPASS - RabbitMQ Offline] Ação: {log.Action} | Entidade: {log.EntityName} | Usuário: {log.UserId}");
            return;
        }

        try
        {
            var message = JsonSerializer.Serialize(log);
            var body = Encoding.UTF8.GetBytes(message);

            await _channel.BasicPublishAsync(
                exchange: string.Empty,
                routingKey: "audit_logs",
                body: body);
        }
        catch (Exception)
        {
            _isRabbitMqAvailable = false;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null) await _channel.DisposeAsync();
        if (_connection is not null) await _connection.DisposeAsync();
        _semaphore.Dispose();
    }
}