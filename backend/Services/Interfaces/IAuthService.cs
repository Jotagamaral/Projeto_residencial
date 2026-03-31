using backend.DTOs;

namespace backend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> AutenticarAsync(LoginDto dto);
    }
}