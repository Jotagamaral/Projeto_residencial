// DTOs/ReclamacaoUpdateDto.cs
// O morador só pode alterar o texto, não o status.
using System.ComponentModel.DataAnnotations;

namespace backend_novo.DTOs;
public class ReclamacaoUpdateDto : ReclamacaoCreateDto { }