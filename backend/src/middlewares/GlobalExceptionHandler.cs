using backend.src.exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.src.middlewares;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext, 
        Exception exception, 
        CancellationToken cancellationToken)
    {
        // Status HTTP baseado no tipo da exceção
        var statusCode = exception switch
        {
            AppException appEx => appEx.StatusCode,
            
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            
            _ => StatusCodes.Status500InternalServerError 
        };

        // Loga o erro
        if (statusCode == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Erro interno: {Message}", exception.Message);
        else
            _logger.LogWarning("Violação de regra de negócio: {Message}", exception.Message);

        // Monta a resposta
        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = statusCode == 500 ? "Erro interno no servidor" : "Ocorreu um erro ao processar a requisição",
            Detail = statusCode == 500 ? "Ocorreu um erro inesperado. Contate o suporte." : exception.Message,
            Instance = httpContext.Request.Path
        };

        // Retorna o JSON
        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}