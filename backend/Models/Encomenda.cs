using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB005_ENCOMENDA")]
public class Encomenda
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_ENCOMENDA")]
    public long Id { get; set; }

    [Column("ID_MORADOR")]
    [Required]
    public long IdMorador { get; set; }

    [Column("ID_FUNCIONARIO")]
    [Required]
    public long IdFuncionario { get; set; }

    [Column("NO_REMETENTE")]
    [Required]
    public string Remetente { get; set; } = string.Empty;

    [Column("ID_CATEGORIA_ENCOMENDA")]
    [Required]
    public long IdCategoriaEncomenda { get; set; }

    [Column("DT_RECEBIDO")]
    [Required]
    public DateTime DataRecebido { get; set; } = DateTime.UtcNow;

    [Column("DT_RETIRADO")]
    public DateTime? DataRetirado { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    [ForeignKey("IdMorador")]
    public virtual Morador? Morador { get; set; }

    [ForeignKey("IdFuncionario")]
    public virtual Funcionario? Funcionario { get; set; }

    [ForeignKey("IdCategoriaEncomenda")]
    public virtual CategoriaEncomenda? Categoria { get; set; }
}
