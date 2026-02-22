using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("cpf")]
    public string Cpf { get; set; } = string.Empty;

    [Required]
    [Column("senha")]
    public string Senha { get; set; } = string.Empty;

    [Required]
    [Column("categoria")]
    public string Categoria { get; set; } = string.Empty;
}
