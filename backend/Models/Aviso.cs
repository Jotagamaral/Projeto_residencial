using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB007_AVISO")]
public class Aviso
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_AVISO")]
    public long Id { get; set; }

    [Column("ID_USER")]
    [Required]
    public long IdUser { get; set; }

    [Column("TX_TITULO")]
    [Required]
    [MaxLength(100)]
    public string Titulo { get; set; } = string.Empty;

    [Column("DS_AVISO")]
    [Required]
    public string Descricao { get; set; } = string.Empty;

    [Column("DT_INICIO")]
    public DateTime? DataInicio { get; set; }

    [Column("DT_EXPIRACAO")]
    public DateTime? DataExpiracao { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    [ForeignKey(nameof(IdUser))]
    public virtual Usuario? Usuario { get; set; }
}
