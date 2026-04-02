using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using NSubstitute;

namespace backend.Tests;
public abstract class TestBase
{
    protected IHttpContextAccessor CriarHttpContextAccessorMock(long userId)
    {
        var httpContextAccessor = Substitute.For<IHttpContextAccessor>();
        
        // Simula as Claims (identidade) do Token JWT
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, userId.ToString()) };
        var identity = new ClaimsIdentity(claims, "TestAuth");
        var user = new ClaimsPrincipal(identity);

        var context = new DefaultHttpContext { User = user };
        httpContextAccessor.HttpContext.Returns(context);

        return httpContextAccessor;
    }
}