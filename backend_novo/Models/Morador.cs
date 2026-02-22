using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("moradores")]
public class Morador
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("nome")]
    public string Nome { get; set; } = string.Empty;

    [Column("rg")]
    public string? Rg { get; set; }

    [Required]
    [Column("cpf")]
    public string Cpf { get; set; } = string.Empty;

    [Column("telefone")]
    public string? Telefone { get; set; }

    [Required]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Column("apartamento")]
    public int Apartamento { get; set; }

    [Required]
    [Column("bloco")]
    public char Bloco { get; set; }

    [Column("fk_user")]
    public long? FkUser { get; set; }

    [ForeignKey("FkUser")]
    public User? User { get; set; }
}
