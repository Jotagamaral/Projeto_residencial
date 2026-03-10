using backend_novo.DTOs;

namespace backend_novo.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> AutenticarAsync(LoginDto dto);
    }
}