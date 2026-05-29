using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.models;

[Table("CSTB004_VISITANTE")]
public class Visitante
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_VISITANTE")]
    public long Id { get; set; }

    [Column("NO_PESSOA")]
    [Required]
    [StringLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Column("NR_CPF")]
    [StringLength(11)]
    public string? Cpf { get; set; }

    [Column("NR_RG")]
    [Required]
    [StringLength(20)]
    public string Rg { get; set; } = string.Empty;

    [Column("NR_TELEFONE")]
    [StringLength(15)]
    public string? Telefone { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    // Relacionamentos
    [InverseProperty("Visitante")]
    public virtual ICollection<AcessoVisitante>? Acessos { get; set; } = [];
}
