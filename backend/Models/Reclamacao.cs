// Models/Reclamacao.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB006_RECLAMACAO")]
public class Reclamacao
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_RECLAMACAO")]
    public long Id { get; set; }

    [Column("ID_MORADOR")]
    [Required]
    public long IdMorador { get; set; }

    [Column("TX_TITULO")]
    [Required]
    [StringLength(100)]
    public string Titulo { get; set; } = string.Empty;

    [Column("DS_RECLAMACAO")]
    [Required]
    public string Descricao { get; set; } = string.Empty;

    [Column("ID_CATEGORIA_RECLAMACAO")]
    [Required]
    public long IdCategoriaReclamacao { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    // Relacionamentos
    [ForeignKey("IdMorador")]
    public virtual Morador? Morador { get; set; }

    [ForeignKey("IdCategoriaReclamacao")]
    public virtual CategoriaReclamacao? Categoria { get; set; }
}