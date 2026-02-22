using backend_novo.DTOs;

namespace backend_novo.Services;

public interface ILoginService
{
    Task<LoginResponseDTO> AuthenticateAsync(LoginDTO loginDto);
}
