using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("CSTB014_CATEGORIA_RESERVA")]
public class CategoriaReserva
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_CATEGORIA_RESERVA")]
    public long Id { get; set; }

    [Column("NO_CATEGORIA_RESERVA")]
    [Required]
    [StringLength(20)]
    public string Nome { get; set; } = "CONFIRMADA";
}