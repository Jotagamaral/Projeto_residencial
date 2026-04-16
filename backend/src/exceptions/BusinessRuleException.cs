namespace backend.src.exceptions;

public class BusinessRuleException : AppException
{
    public BusinessRuleException(string message) 
        : base(message, StatusCodes.Status400BadRequest)
    {
    }
}