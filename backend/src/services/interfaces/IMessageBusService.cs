// Services/IMessageBusService.cs
using backend.src.models;

namespace backend.src.services.interfaces;
public interface IMessageBusService
{
    Task PublishLogAsync(Log log);
}