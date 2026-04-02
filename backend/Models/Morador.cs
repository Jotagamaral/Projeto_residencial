using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB002_MORADOR")]
public class Morador
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_MORADOR")]
    public long Id { get; set; }

    [Column("ID_USER")]
    [Required]
    public long IdUser { get; set; }

    [Column("IC_BLOCO")]
    [StringLength(10)]
    public string? Bloco { get; set; }

    [Column("NR_APARTAMENTO")]
    public int? Apartamento { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    // Relacionamento
    [ForeignKey("IdUser")]
    public virtual Usuario? Usuario { get; set; }
}