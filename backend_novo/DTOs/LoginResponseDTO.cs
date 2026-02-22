namespace backend_novo.DTOs;

public class LoginResponseDTO
{
    public string Message { get; set; } = string.Empty;
    public UserResponseDTO? User { get; set; }
    public string? Token { get; set; }
}

public class UserResponseDTO
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cpf { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
}
