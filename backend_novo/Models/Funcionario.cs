using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("CSTB003_FUNCIONARIO")]
public class Funcionario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_FUNCIONARIO")]
    public long Id { get; set; }

    [Column("ID_USER")]
    [Required]
    public long IdUser { get; set; }

    [Column("ID_CATEGORIA_CARGO")]
    [Required]
    public long IdCategoriaCargo { get; set; }

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    // Relacionamentos
    [ForeignKey("IdCategoriaCargo")]
    public virtual CategoriaCargo? CategoriaCargo { get; set; }
    
    [ForeignKey("IdUser")]
    public virtual Usuario? Usuario { get; set; }


}