using Microsoft.AspNetCore.Http;

namespace backend.Exceptions;

public class BusinessRuleException : AppException
{
    public BusinessRuleException(string message) 
        : base(message, StatusCodes.Status400BadRequest)
    {
    }
}