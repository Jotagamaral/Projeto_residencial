// Models/CategoriaReclamacao.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB013_CATEGORIA_RECLAMACAO")]
public class CategoriaReclamacao
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_CATEGORIA_RECLAMACAO")]
    public long Id { get; set; }

    [Column("NO_CATEGORIA_RECLAMACAO")]
    [Required]
    [StringLength(20)]
    public string Nome { get; set; } = "ABERTA";
}