using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB009_RESERVA")]
public class Reserva
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_RESERVA")]
    public long Id { get; set; }

    [Column("ID_MORADOR")]
    [Required]
    public long IdMorador { get; set; }

    [Column("ID_LOCAL")]
    [Required]
    public long IdLocal { get; set; }

    [Column("DT_INICIO")]
    [Required]
    public DateTime DataInicio { get; set; }

    [Column("DT_FIM")]
    [Required]
    public DateTime DataFim { get; set; }

    [Column("ID_CATEGORIA_RESERVA")]
    [Required]
    public long IdCategoriaReserva { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    // Relacionamentos

    [ForeignKey("IdMorador")]
    public virtual Morador? Morador { get; set; }

    [ForeignKey("IdLocal")]
    public virtual Local? Local { get; set; }

    [ForeignKey("IdCategoriaReserva")]
    public virtual CategoriaReserva? Categoria { get; set; }
}