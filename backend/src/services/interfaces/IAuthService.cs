using backend.src.dtos.Login;

namespace backend.src.services.interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDTO> AutenticarAsync(LoginDto dto);
    }
}