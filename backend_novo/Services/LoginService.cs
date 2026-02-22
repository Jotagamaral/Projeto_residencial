using backend_novo.DTOs;
using backend_novo.Repositories;

namespace backend_novo.Services;

public class LoginService : ILoginService
{
    private readonly IUserRepository _userRepository;
    private readonly IMoradorRepository _moradorRepository;
    private readonly IFuncionarioRepository _funcionarioRepository;

    public LoginService(
        IUserRepository userRepository,
        IMoradorRepository moradorRepository,
        IFuncionarioRepository funcionarioRepository)
    {
        _userRepository = userRepository;
        _moradorRepository = moradorRepository;
        _funcionarioRepository = funcionarioRepository;
    }

    public async Task<LoginResponseDTO> AuthenticateAsync(LoginDTO loginDto)
    {
        var cpf = loginDto.Cpf.Trim();
        var user = await _userRepository.GetByCpfAsync(cpf);

        if (user is null)
        {
            return new LoginResponseDTO { Message = "Usuário não encontrado." };
        }

        if (user.Senha != loginDto.Senha)
        {
            return new LoginResponseDTO { Message = "Senha incorreta." };
        }

        long id = 0;
        string nome = string.Empty;

        if (user.Categoria == "MORADOR")
        {
            var morador = await _moradorRepository.GetByCpfAsync(cpf);
            if (morador is not null)
            {
                id = morador.Id;
                nome = morador.Nome;
            }
        }
        else if (user.Categoria == "FUNCIONARIO")
        {
            var funcionario = await _funcionarioRepository.GetByCpfAsync(cpf);
            if (funcionario is not null)
            {
                id = funcionario.Id;
                nome = funcionario.Nome;
            }
        }

        return new LoginResponseDTO
        {
            Message = "Login realizado com sucesso!",
            User = new UserResponseDTO
            {
                Id = id,
                Nome = nome,
                Cpf = user.Cpf,
                Categoria = user.Categoria
            },
            Token = "dummy-jwt-token"
        };
    }
}
