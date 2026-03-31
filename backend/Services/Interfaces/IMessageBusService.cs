// Services/IMessageBusService.cs
using backend.Models;

namespace backend.Services.Interfaces;
public interface IMessageBusService
{
    Task PublishLogAsync(Log log);
}