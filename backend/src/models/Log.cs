using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.src.models;

[Table("CSTB999_LOG")]
public class Log
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_LOG")]
    public long Id { get; set; }

    [Column("ID_USER")]
    public long? UserId { get; set; }

    [Column("NO_ENTIDADE")]
    [MaxLength(255)]
    public string EntityName { get; set; } = string.Empty;

    [Column("ID_ENTIDADE")]
    public long? EntityId { get; set; }

    [Column("TX_ACAO")]
    [MaxLength(255)]
    public string Action { get; set; } = string.Empty;

    [Column("TX_METODO")]
    [MaxLength(16)]
    public string Method { get; set; } = string.Empty;

    [Column("DT_CRIACAO")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}