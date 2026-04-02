using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("CSTB001_USER")]
public class Usuario
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_USER")]
    public long Id { get; set; }

    [Column("NR_CPF")]
    [Required, StringLength(11)]
    public string Cpf { get; set; } = string.Empty;

    [Column("NO_PESSOA")]
    [Required, StringLength(150)]
    public string Nome { get; set; } = string.Empty;

    [Column("NR_RG")]
    public string? Rg { get; set; } = string.Empty; // O ? = pode ser Null

    [Column("EM_PESSOAL")]
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Column("NR_CELULAR")]
    public string? Celular { get; set; } = string.Empty;

    [Column("TX_SENHA")]
    [Required]
    public string Senha { get; set; } = string.Empty;

    [Column("LG_ATIVO")]
    [Required]
    public bool Ativo { get; set; } = true;

    // Relacionamento

    [Column("ID_CATEGORIA_ACESSO")]
    [Required]
    public long CategoriaAcessoId { get; set; }
    

    [ForeignKey("CategoriaAcessoId")]
    public virtual CategoriaAcesso? Categoria { get; set; } // Objeto do relacionamento

}
