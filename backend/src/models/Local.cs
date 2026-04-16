using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.models;

[Table("CSTB008_LOCAL")]
public class Local
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_LOCAL")]
    public long Id { get; set; }

    [Column("NO_LOCAL")]
    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Column("NR_CAPACIDADE")]
    [Required]
    public int Capacidade { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;
}