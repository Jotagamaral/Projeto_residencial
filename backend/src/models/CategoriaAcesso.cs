using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.models;

[Table("CSTB010_CATEGORIA_ACESSO")]
public class CategoriaAcesso
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_CATEGORIA_ACESSO")]
    public long CategoriaAcessoId { get; set; }

    [Column("NO_CATEGORIA_ACESSO")]
    [Required]
    public string CategoriaAcessoNome { get; set; } = string.Empty;

}
