using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using backend_novo.Data;

namespace backend_novo.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context; 

        public AuthService(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<LoginResponseDTO> AutenticarAsync(LoginDto dto)
        {
            // Busca no banco Usuarios com Categoria Acesso
            var usuario = await _context.Usuario
                .Include(u => u.Categoria) 
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Ativo);

            // Validação do usuário e da senha (BCrypt)
            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            {
                return new LoginResponseDTO
                {
                    Message = "Email ou senha inválidos.",
                    Token = null,
                    User = null
                };
            }

            // Dados retornados do Banco
            var idUsuario = usuario.Id;
            var emailUsuario = usuario.Email;
            var nomeUsuario = usuario.Nome; 
            var cpfUsuario = usuario.Cpf;
            
            // Role de Categoria Acesso
            var roleDoUsuario = usuario.Categoria?.CategoriaAcessoNome ?? "Teste Null"; 

            // Criar as Claims (Dados embutidos no token)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, idUsuario.ToString()),
                new Claim(ClaimTypes.Email, emailUsuario),
                new Claim(ClaimTypes.Role, roleDoUsuario) 
            };

            // Gerar a chave e o token
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secret = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret não configurada.");
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var expirationMinutes = double.TryParse(jwtSettings["ExpirationInMinutes"], out var exp) ? exp : 60;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expirationMinutes),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // Retornar o DTO preenchido com sucesso
            return new LoginResponseDTO
            {
                Message = "Login realizado com sucesso.",
                Token = tokenString,
                User = new UserResponseDTO
                {
                    Id = idUsuario,
                    Nome = nomeUsuario,
                    Cpf = cpfUsuario,
                    Categoria = roleDoUsuario
                }
            };
        }
    }
}