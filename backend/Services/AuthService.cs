using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.DTOs;
using backend.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Exceptions; 

namespace backend.Services
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
            var cpfLimpo = dto.Cpf.Trim();

            var usuario = await _context.Usuario
                .Include(u => u.Categoria) 
                .FirstOrDefaultAsync(u => u.Cpf == cpfLimpo && u.Ativo);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.Senha))
            {
                throw new UnauthorizedAccessException("CPF ou senha inválidos.");
            }

            // Dados retornados do Banco
            var idUsuario = usuario.Id;
            var emailUsuario = usuario.Email;
            var nomeUsuario = usuario.Nome; 
            var cpfUsuario = usuario.Cpf;
            
            // Role de Categoria Acesso
            var roleDoUsuario = usuario.Categoria?.CategoriaAcessoNome ?? "Null"; 

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

            // Retornar o DTO
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