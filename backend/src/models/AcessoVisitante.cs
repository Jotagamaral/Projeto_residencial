using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.models;

[Table("CSTB_ACESSO_VISITANTE")]
public class AcessoVisitante
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_ACESSO")]
    public long Id { get; set; }

    [Column("ID_VISITANTE")]
    [Required]
    public long IdVisitante { get; set; }

    [Column("ID_MORADOR")]
    [Required]
    public long IdMorador { get; set; }

    [Column("ID_FUNCIONARIO")]
    [Required]
    public long IdFuncionario { get; set; }

    [Column("DT_ENTRADA")]
    [Required]
    public DateTime DataEntrada { get; set; }

    [Column("DT_SAIDA")]
    public DateTime? DataSaida { get; set; }

    // Relacionamentos
    [ForeignKey("IdVisitante")]
    public virtual Visitante? Visitante { get; set; }

    [ForeignKey("IdMorador")]
    public virtual Morador? Morador { get; set; }

    [ForeignKey("IdFuncionario")]
    public virtual Funcionario? Funcionario { get; set; }
}
