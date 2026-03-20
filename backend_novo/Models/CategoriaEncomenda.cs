using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("CSTB012_CATEGORIA_ENCOMENDA")]
public class CategoriaEncomenda
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_CATEGORIA_ENCOMENDA")]
    public long Id { get; set; }

    [Column("NO_CATEGORIA_ENCOMENDA")]
    [Required]
    [StringLength(20)]
    public string Nome { get; set; } = "PENDENTE";
}
