using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;

public class LoginDTO
{
    [Required]
    public string Cpf { get; set; } = string.Empty;

    [Required]
    public string Senha { get; set; } = string.Empty;
}
