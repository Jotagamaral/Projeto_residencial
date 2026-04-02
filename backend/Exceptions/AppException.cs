namespace backend.Exceptions;

/// <summary>
/// Classe base para todas as exceções customizadas da aplicação.
/// </summary>
public abstract class AppException : Exception
{
    public int StatusCode { get; }

    protected AppException(string message, int statusCode) : base(message)
    {
        StatusCode = statusCode;
    }
}