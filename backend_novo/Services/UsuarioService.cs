using backend_novo.DTOs;
using backend_novo.Models;
using backend_novo.Repositories.Interfaces;
using backend_novo.Services.Interfaces;
using backend_novo.Data;

namespace backend_novo.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository     _usuarioRepository;
    private readonly IMoradorRepository     _moradorRepository;
    private readonly IFuncionarioRepository _funcionarioRepository;
    private readonly AppDbContext           _context;

    public UsuarioService(
        IUsuarioRepository      usuarioRepository,
        IMoradorRepository      moradorRepository,
        IFuncionarioRepository  funcionarioRepository,
        AppDbContext            context
        )
    {
        _usuarioRepository      = usuarioRepository;
        _moradorRepository      = moradorRepository;
        _funcionarioRepository  = funcionarioRepository;
        _context                = context;
    }

    public async Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto)
    {
        // Verificar se o CPF já está cadastrado
        var usuarioExistente = await _usuarioRepository.getByCpfAsync(dto.Cpf);
        if (usuarioExistente != null)
            throw new Exception("Este CPF já está em uso.");

        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Cria o usuário principal
            var novoUsuario = new Usuario
            {
                Nome = dto.Nome,
                Cpf = dto.Cpf,
                Email = dto.Email,
                Rg = dto.Rg,
                Celular = dto.Celular,
                Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                CategoriaAcessoId = dto.CategoriaAcessoId,
                Ativo = true
            };

            // Pegar o ID_USER
            var usuarioSalvo = await _usuarioRepository.AdicionarAsync(novoUsuario);
            await _context.SaveChangesAsync();

            MoradorResponseDto? detalhesMorador = null;
            FuncionarioResponseDto? detalhesFuncionario = null;
            string nomeCategoria = "";


            // Tipo de Acesso
            if (dto.CategoriaAcessoId == 2) // MORADOR
            {
                if (dto.Apartamento == null || string.IsNullOrEmpty(dto.Bloco))
                    throw new ArgumentException("Apartamento e Bloco são obrigatórios para moradores.");

                var novoMorador = new Morador
                {
                    IdUser = usuarioSalvo.Id,
                    Bloco = dto.Bloco,
                    Apartamento = dto.Apartamento.Value,
                    Ativo = true
                };
                await _moradorRepository.AdicionarAsync(novoMorador);

                nomeCategoria = "MORADOR";
                detalhesMorador = new MoradorResponseDto
                {
                    Bloco = novoMorador.Bloco,
                    Apartamento = novoMorador.Apartamento.Value
                };

            }
            else if (dto.CategoriaAcessoId == 3) // FUNCIONARIO
            {
                if (dto.CargoId == null)
                    throw new ArgumentException("A Categoria do Cargo (ID) é obrigatória para funcionários.");

                var novoFuncionario = new Funcionario
                {
                    IdUser = usuarioSalvo.Id,
                    IdCategoriaCargo = dto.CargoId.Value,
                    Ativo = true
                };
                await _funcionarioRepository.AdicionarAsync(novoFuncionario);

                nomeCategoria = "FUNCIONARIO";
                detalhesFuncionario = new FuncionarioResponseDto
                {
                    CargoId = novoFuncionario.IdCategoriaCargo,
                };
            }

            // Salva e confirma
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new UsuarioResponseDto 
            { 
                Id = usuarioSalvo.Id, 
                Nome = usuarioSalvo.Nome, 
                Email = usuarioSalvo.Email, 
                Cpf = usuarioSalvo.Cpf,
                CategoriaAcesso = nomeCategoria,
                DetalhesMorador = detalhesMorador,
                DetalhesFuncionario = detalhesFuncionario
            };
        }
        catch (Exception)
        {
            // Erro desfaz a operação
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<IEnumerable<UsuarioResponseDto>> ListarAtivosAsync()
    {
        // Por enquanto, apenas para compilar, vamos retornar uma lista vazia ou erro
        // Depois você implementa a lógica real com o repositório
        var usuarios = await _usuarioRepository.ListarTodosAsync();
        return usuarios.Where(u => u.Ativo).Select(u => new UsuarioResponseDto 
        {
            Id = u.Id,
            Nome = u.Nome,
            Email = u.Email
        });
    }

    
}