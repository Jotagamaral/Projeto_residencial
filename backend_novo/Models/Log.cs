using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_novo.Models;

[Table("logs")]
public class Log
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Column("user_id")]
    public long? UserId { get; set; }

    [Required]
    [Column("entity_name")]
    public string EntityName { get; set; } = string.Empty;

    [Column("entity_id")]
    public long? EntityId { get; set; }

    [Required]
    [Column("action")]
    public string Action { get; set; } = string.Empty;

    [Required]
    [Column("method")]
    public string Method { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
