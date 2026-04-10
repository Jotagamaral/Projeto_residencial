using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB011_CATEGORIA_CARGO")]
public class CategoriaCargo
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_CATEGORIA_CARGO")]
    public long Id { get; set; }

    [Column("NO_CATEGORIA_CARGO")]
    [Required]
    public string Nome { get; set; } = string.Empty;
    
    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;
}