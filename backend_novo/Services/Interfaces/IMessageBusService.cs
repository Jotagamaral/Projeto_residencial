// Services/IMessageBusService.cs
using backend_novo.Models;
public interface IMessageBusService
{
    void PublishLog(Log log);
}
