using System.Linq;
using Microsoft.EntityFrameworkCore;
using backend.src.models;
using backend.src.repositories.interfaces;
using backend.src.services.interfaces;
using backend.src.context;
using backend.src.constants;
using backend.src.exceptions;

using backend.src.dtos.Usuario;
using backend.src.dtos.Morador;
using backend.src.dtos.Funcionario;

namespace backend.src.services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository     _usuarioRepository;
    private readonly IMoradorRepository     _moradorRepository;
    private readonly IFuncionarioRepository _funcionarioRepository;
    private readonly ICacheService         _cacheService;
    private readonly AppDbContext           _context;

    public UsuarioService(
        IUsuarioRepository      usuarioRepository,
        IMoradorRepository      moradorRepository,
        IFuncionarioRepository  funcionarioRepository,
        ICacheService           cacheService,
        AppDbContext            context
        )
    {
        _usuarioRepository      = usuarioRepository;
        _moradorRepository      = moradorRepository;
        _funcionarioRepository  = funcionarioRepository;
        _cacheService           = cacheService;
        _context                = context;
    }

    public async Task<UsuarioResponseDto> CriarUsuarioAsync(UsuarioCreateDto dto)
    {
        var strategy = _context.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(async () =>
        {
            // Verificar se o CPF já está cadastrado
            var usuarioExistente = await _usuarioRepository.getByCpfAsync(dto.Cpf);
            if (usuarioExistente != null)
                throw new BusinessRuleException("Este CPF já está em uso."); 

            // Verificar se o E-mail já está cadastrado
            if (!string.IsNullOrWhiteSpace(dto.Email))
            {
                var emailEmUso = await _context.Usuario.AnyAsync(u => u.Email != null && u.Email.ToLower() == dto.Email.ToLower());
                if (emailEmUso)
                    throw new BusinessRuleException("Este e-mail já está em uso.");
            }

            // Verificar se o RG já está cadastrado
            if (!string.IsNullOrWhiteSpace(dto.Rg))
            {
                if (!dto.Rg.All(char.IsDigit))
                    throw new BusinessRuleException("O RG deve conter apenas números.");

                var rgEmUso = await _context.Usuario.AnyAsync(u => u.Rg != null && u.Rg.ToLower() == dto.Rg.ToLower());
                if (rgEmUso)
                    throw new BusinessRuleException("Este RG já está em uso.");
            }

            // Impede criar Admin
            if (dto.CategoriaAcessoId == CategoriaAcessoConstants.ADMIN_ID)
            {
                throw new UnauthorizedAccessException("Não é permitido registrar usuários administradores através desta rota.");
            }

            // Validação de Categorias Inválidas
            if (dto.CategoriaAcessoId != CategoriaAcessoConstants.MORADOR_ID && 
                dto.CategoriaAcessoId != CategoriaAcessoConstants.FUNCIONARIO_ID)
            {
                throw new BusinessRuleException("Categoria de acesso inválida."); 
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
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

                var usuarioSalvo = await _usuarioRepository.AdicionarAsync(novoUsuario);
                await _context.SaveChangesAsync();

                MoradorResponseDto? detalhesMorador = null;
                FuncionarioResponseDto? detalhesFuncionario = null;
                string nomeCategoria = "";

                if (dto.CategoriaAcessoId == CategoriaAcessoConstants.MORADOR_ID)
                {
                    if (dto.Apartamento == null || string.IsNullOrEmpty(dto.Bloco))
                        throw new BusinessRuleException("Apartamento e Bloco são obrigatórios para moradores."); 

                    var novoMorador = new Morador
                    {
                        IdUser = usuarioSalvo.Id,
                        Bloco = dto.Bloco,
                        Apartamento = dto.Apartamento.Value,
                        Ativo = true
                    };
                    await _moradorRepository.AdicionarAsync(novoMorador);
                    nomeCategoria = "MORADOR";
                    detalhesMorador = new MoradorResponseDto { Bloco = novoMorador.Bloco, Apartamento = novoMorador.Apartamento.Value };
                }
                else if (dto.CategoriaAcessoId == CategoriaAcessoConstants.FUNCIONARIO_ID)
                {
                    if (dto.CargoId == null)
                        throw new BusinessRuleException("A Categoria do Cargo (ID) é obrigatória para funcionários."); 

                    var novoFuncionario = new Funcionario
                    {
                        IdUser = usuarioSalvo.Id,
                        IdCategoriaCargo = dto.CargoId.Value,
                        Ativo = true
                    };
                    await _funcionarioRepository.AdicionarAsync(novoFuncionario);
                    nomeCategoria = "FUNCIONARIO";
                    detalhesFuncionario = new FuncionarioResponseDto { CargoId = novoFuncionario.IdCategoriaCargo };
                    
                    // Invalida o cache de funcionários
                    await _cacheService.RemoveAsync("funcionarios:ativos:todos");
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new UsuarioResponseDto 
                { 
                    Id = usuarioSalvo.Id, 
                    Nome = usuarioSalvo.Nome, 
                    Email = usuarioSalvo.Email, 
                    Cpf = usuarioSalvo.Cpf,
                    CategoriaAcesso = nomeCategoria,
                    Detalhes = (object?)detalhesMorador ?? detalhesFuncionario
                };
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw; // O bloco catch continua genérico para conseguir reverter o banco e repassar o erro customizado para o middleware
            }
        });
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

    public async Task<UsuarioResponseDto> ObterPerfilAdminPorUserIdAsync(long userId)
    {
        // Busca o usuário garantindo que ele está ativo e traz o nome da categoria
        var admin = await _context.Usuario
            .Include(u => u.Categoria)
            .FirstOrDefaultAsync(u => u.Id == userId && u.Ativo);

        if (admin == null)
            throw new NotFoundException("Administrador não encontrado ou inativo no sistema.");

        

        return new UsuarioResponseDto
        {
            Id = admin.Id,
            Nome = admin.Nome,
            Email = admin.Email,
            Cpf = admin.Cpf,
            Telefone = admin.Celular ?? "Sem Telefone",
            CategoriaAcesso = CategoriaAcessoConstants.ADMIN_ROLE,
            Detalhes = null
        };
    }

    public async Task<UsuarioResponseDto> AtualizarDadosPessoaisAdminAsync(long userId, FuncionarioUpdateDadosPessoaisDto dto)
    {
        var admin = await _context.Usuario
            .FirstOrDefaultAsync(u => u.Id == userId && u.Ativo && u.CategoriaAcessoId == CategoriaAcessoConstants.ADMIN_ID)
            ?? throw new NotFoundException("Administrador não encontrado.");

        // Validar e-mail, CPF e RG em uso por outros usuários
        var cpfEmUso = await _context.Usuario.AnyAsync(u => u.Id != userId && u.Cpf == dto.Cpf.Trim());
        if (cpfEmUso)
            throw new BusinessRuleException("Este CPF já está em uso.");

        var emailEmUso = await _context.Usuario.AnyAsync(u => u.Id != userId && u.Email.ToLower() == dto.Email.Trim().ToLower());
        if (emailEmUso)
            throw new BusinessRuleException("Este e-mail já está em uso.");

        if (!string.IsNullOrWhiteSpace(dto.Rg))
        {
            if (!dto.Rg.All(char.IsDigit))
                throw new BusinessRuleException("O RG deve conter apenas números.");

            var rgEmUso = await _context.Usuario.AnyAsync(u => u.Id != userId && u.Rg != null && u.Rg.ToLower() == dto.Rg.Trim().ToLower());
            if (rgEmUso)
                throw new BusinessRuleException("Este RG já está em uso.");
        }

        admin.Nome = dto.Nome.Trim();
        admin.Email = dto.Email.Trim();
        admin.Cpf = dto.Cpf.Trim();
        admin.Rg = string.IsNullOrWhiteSpace(dto.Rg) ? null : dto.Rg.Trim();
        admin.Celular = string.IsNullOrWhiteSpace(dto.Telefone) ? null : dto.Telefone.Trim();

        _context.Usuario.Update(admin);
        await _context.SaveChangesAsync();

        return new UsuarioResponseDto
        {
            Id = admin.Id,
            Nome = admin.Nome,
            Email = admin.Email,
            Cpf = admin.Cpf,
            Telefone = admin.Celular ?? "Sem Telefone",
            CategoriaAcesso = CategoriaAcessoConstants.ADMIN_ROLE,
            Detalhes = null
        };
    }

    public async Task AlterarSenhaAdminAsync(long userId, FuncionarioAlterarSenhaDto dto)
    {
        var admin = await _context.Usuario
            .FirstOrDefaultAsync(u => u.Id == userId && u.Ativo && u.CategoriaAcessoId == CategoriaAcessoConstants.ADMIN_ID)
            ?? throw new NotFoundException("Administrador não encontrado.");

        bool senhaValida = BCrypt.Net.BCrypt.Verify(dto.SenhaAtual, admin.Senha);
        if (!senhaValida)
            throw new BusinessRuleException("A senha atual está incorreta.");

        admin.Senha = BCrypt.Net.BCrypt.HashPassword(dto.NovaSenha);

        _context.Usuario.Update(admin);
        await _context.SaveChangesAsync();
    }
}