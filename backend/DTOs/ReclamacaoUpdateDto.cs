// DTOs/ReclamacaoUpdateDto.cs
// O morador só pode alterar o texto, não o status.
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;
public class ReclamacaoUpdateDto : ReclamacaoCreateDto { }