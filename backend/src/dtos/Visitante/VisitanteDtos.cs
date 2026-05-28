using System.ComponentModel.DataAnnotations;

namespace backend.src.dtos.Visitante;

public class RegistrarEntradaDto
{
    [Required(ErrorMessage = "O CPF é obrigatório.")]
    [StringLength(11, MinimumLength = 11, ErrorMessage = "O CPF deve ter exatamente 11 caracteres.")]
    public string Cpf { get; set; } = string.Empty;

    [Required(ErrorMessage = "O RG é obrigatório.")]
    [StringLength(20)]
    public string Rg { get; set; } = string.Empty;

    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(150)]
    public string Nome { get; set; } = string.Empty;

    [StringLength(15)]
    public string? Telefone { get; set; }

    [Required(ErrorMessage = "O ID do morador é obrigatório.")]
    public long IdMorador { get; set; }

    [Required(ErrorMessage = "O ID do funcionário é obrigatório.")]
    public long IdFuncionario { get; set; }
}

public class AtualizarVisitanteDto
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    [StringLength(150)]
    public string Nome { get; set; } = string.Empty;

    [StringLength(11)]
    public string? Cpf { get; set; }

    [Required(ErrorMessage = "O RG é obrigatório.")]
    [StringLength(20)]
    public string Rg { get; set; } = string.Empty;

    [StringLength(15)]
    public string? Telefone { get; set; }
}

public class RegistrarAcessoExistenteDto
{
    [Required(ErrorMessage = "O ID do morador é obrigatório.")]
    public long IdMorador { get; set; }

    [Required(ErrorMessage = "O ID do funcionário é obrigatório.")]
    public long IdFuncionario { get; set; }
}

public class VisitanteResponseDto
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Cpf { get; set; }
    public string Rg { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public bool Ativo { get; set; }
}

public class VisitanteComAcessoDto
{
    public long Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Cpf { get; set; }
    public string Rg { get; set; } = string.Empty;
    public string? Telefone { get; set; }
    public long? IdAcessoAtual { get; set; }
    public long? IdMorador { get; set; }
    public long? IdFuncionario { get; set; }
    public DateTime? DataEntrada { get; set; }
    public DateTime? DataSaida { get; set; }
    public bool EmAberto { get; set; }
}

public class AcessoVisitanteResponseDto
{
    public long Id { get; set; }
    public VisitanteResponseDto? Visitante { get; set; }
    public long IdMorador { get; set; }
    public long IdFuncionario { get; set; }
    public DateTime DataEntrada { get; set; }
    public DateTime? DataSaida { get; set; }
}
