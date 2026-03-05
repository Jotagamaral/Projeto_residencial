using backend_novo.DTOs;

namespace backend_novo.Services.Interfaces;

public interface IAuthService
{
    // O LoginDto você já deve ter criado no passo anterior
    Task<string> AutenticarAsync(LoginDto dto);
}