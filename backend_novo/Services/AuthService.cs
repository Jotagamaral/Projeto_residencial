using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend_novo.DTOs;
using backend_novo.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
// Adicione o using do seu DbContext / Repositório aqui

namespace backend_novo.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        // Injete seu repositório ou DbContext aqui. Exemplo:
        // private readonly MeuDbContext _context;

        public AuthService(IConfiguration configuration /*, MeuDbContext context */)
        {
            _configuration = configuration;
            // _context = context;
        }

        public async Task<string> AutenticarAsync(LoginDto dto)
        {
            // 1. Buscar o usuário no banco de dados (Exemplo usando EF Core)
            // var usuario = await _context.Usuarios
            //     .Include(u => u.CategoriaAcesso) 
            //     .FirstOrDefaultAsync(u => u.EmPessoal == dto.Email && u.LgAtivo);

            // Simulando a busca para fins de compilação:
            var usuarioExiste = true; // Substitua pela lógica do banco
            var senhaValida = true;   // Substitua pela validação de hash (BCrypt, etc.)
            var roleDoUsuario = "Morador"; // Isso deve vir da tabela CSTB010_CATEGORIA_ACESSO

            if (!usuarioExiste || !senhaValida)
            {
                throw new Exception("Email ou senha inválidos."); 
            }

            // 2. Criar as Claims (Dados embutidos no token)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1"), // ID_USER
                new Claim(ClaimTypes.Email, dto.Email),
                new Claim(ClaimTypes.Role, roleDoUsuario) // AQUI ESTÁ A LÓGICA DE ROLES
            };

            // 3. Gerar a chave e o token
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings["Secret"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpirationInMinutes"])),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}