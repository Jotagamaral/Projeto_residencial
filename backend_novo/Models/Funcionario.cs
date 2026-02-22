using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("funcionarios")]
public class Funcionario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [Column("rg")]
    public string Rg { get; set; } = string.Empty;

    [Required]
    [Column("cpf")]
    public string Cpf { get; set; } = string.Empty;

    [Required]
    [Column("telefone")]
    public string Telefone { get; set; } = string.Empty;

    [Required]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("cargo")]
    public string Cargo { get; set; } = string.Empty;

    [Column("fk_user")]
    public long? FkUser { get; set; }

    [ForeignKey("FkUser")]
    public User? User { get; set; }
}
