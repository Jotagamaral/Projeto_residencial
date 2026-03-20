using System.Security.Claims;
using backend_novo.Data;
using backend_novo.DTOs;
using backend_novo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend_novo.Filters;

public class AuditLogActionFilter : IAsyncActionFilter
{
    private readonly AppDbContext _context;
    private readonly ILogger<AuditLogActionFilter> _logger;

    public AuditLogActionFilter(AppDbContext context, ILogger<AuditLogActionFilter> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var executedContext = await next();

        try
        {
            var routeValues = context.ActionDescriptor.RouteValues;
            var controllerName = routeValues.TryGetValue("controller", out var controller)
                ? controller
                : "unknown";
            var actionName = routeValues.TryGetValue("action", out var action)
                ? action
                : MapActionByMethod(context.HttpContext.Request.Method);

            var log = new Log
            {
                UserId = ResolveUserId(context, executedContext.Result),
                EntityName = controllerName ?? "unknown",
                EntityId = ResolveEntityId(context, executedContext.Result),
                Action = actionName ?? MapActionByMethod(context.HttpContext.Request.Method),
                Method = context.HttpContext.Request.Method,
                CreatedAt = DateTimeOffset.UtcNow
            };

            _context.Logs.Add(log);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Falha ao persistir log de auditoria.");
        }
    }

    private static long? ResolveUserId(ActionExecutingContext context, IActionResult? result)
    {
        var nameIdentifier = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                             ?? context.HttpContext.User.FindFirst("sub")?.Value;
        if (long.TryParse(nameIdentifier, out var parsedUserId))
        {
            return parsedUserId;
        }

        if (result is ObjectResult { Value: LoginResponseDTO loginResponse } && loginResponse.User is not null)
        {
            return loginResponse.User.Id;
        }

        return null;
    }

    private static long? ResolveEntityId(ActionExecutingContext context, IActionResult? result)
    {
        if (TryParseToLong(context.RouteData.Values["id"], out var routeId))
        {
            return routeId;
        }

        if (context.ActionArguments.TryGetValue("id", out var argumentId) && TryParseToLong(argumentId, out var parsedId))
        {
            return parsedId;
        }

        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument is null)
            {
                continue;
            }

            var idProperty = argument.GetType().GetProperty("Id");
            if (idProperty is null)
            {
                continue;
            }

            var value = idProperty.GetValue(argument);
            if (TryParseToLong(value, out var dtoId))
            {
                return dtoId;
            }
        }

        if (result is ObjectResult { Value: not null } responseValue)
        {
            if (TryGetIdFromObject(responseValue.Value, out var responseId))
            {
                return responseId;
            }

            var userProperty = responseValue.Value.GetType().GetProperty("User");
            var userValue = userProperty?.GetValue(responseValue.Value);
            if (userValue is not null && TryGetIdFromObject(userValue, out var nestedUserId))
            {
                return nestedUserId;
            }
        }

        return null;
    }

    private static bool TryGetIdFromObject(object value, out long id)
    {
        var idProperty = value.GetType().GetProperty("Id");
        if (idProperty is null)
        {
            id = default;
            return false;
        }

        return TryParseToLong(idProperty.GetValue(value), out id);
    }

    private static bool TryParseToLong(object? value, out long parsed)
    {
        switch (value)
        {
            case null:
                parsed = default;
                return false;
            case long longValue:
                parsed = longValue;
                return true;
            case int intValue:
                parsed = intValue;
                return true;
            default:
                return long.TryParse(value.ToString(), out parsed);
        }
    }

    private static string MapActionByMethod(string method)
    {
        return method.ToUpperInvariant() switch
        {
            "POST" => "create",
            "PUT" => "update",
            "PATCH" => "update",
            "DELETE" => "delete",
            "GET" => "read",
            _ => "execute"
        };
    }
}
