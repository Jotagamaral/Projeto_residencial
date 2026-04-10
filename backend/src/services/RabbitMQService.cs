using RabbitMQ.Client;
using System.Text;
using System.Text.Json;
using backend.src.models;
using backend.src.services.interfaces;

namespace backend.src.services;

// Implementamos IAsyncDisposable para limpar recursos de rede corretamente
public class RabbitMQService : IMessageBusService, IAsyncDisposable
{
    private readonly ConnectionFactory _factory;
    private IConnection? _connection;
    private IChannel? _channel;

    // Controles de estado para garantir execução segura em ambiente Singleton
    private bool _connectionAttempted = false;
    private bool _isRabbitMqAvailable = false;
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

    public RabbitMQService(IConfiguration configuration)
    {
        var host = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
        var port = Environment.GetEnvironmentVariable("RABBITMQ_PORT") ?? "5672";
        var user = Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "guest";
        var pass = Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "guest";

        _factory = new ConnectionFactory()
        {
            HostName = host,
            Port = int.Parse(port),
            UserName = user,
            Password = pass,
            RequestedConnectionTimeout = TimeSpan.FromSeconds(1),
            SocketReadTimeout = TimeSpan.FromSeconds(1),
            SocketWriteTimeout = TimeSpan.FromSeconds(1)
        };
    }

    private async Task EnsureConnectionAsync()
    {

        if (_connectionAttempted) return;

        await _semaphore.WaitAsync();
        try
        {
            // Verificação dupla de segurança
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
        catch (Exception)
        {
            Console.WriteLine($"[AVISO] RabbitMQ indisponível no host {_factory.HostName}:{_factory.Port}. O sistema funcionará em modo de degradação graciosa.");
            _isRabbitMqAvailable = false;
        }
        finally
        {
            _semaphore.Release();
        }
    }

    public async Task PublishLogAsync(Log log)
    {
        // Garante que a conexão foi tentada pelo menos uma vez
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
            // Se o RabbitMQ cair enquanto o sistema estiver rodando, ele desativa o envio e não trava a API.
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