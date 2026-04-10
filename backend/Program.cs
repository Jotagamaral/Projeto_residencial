// Token JWT
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// Sistema
using backend.Data;
using backend.Filters;
using backend.Repositories;
using backend.Repositories.Interfaces;
using backend.Services;
using backend.Services.Interfaces;
using backend.Workers;
using backend.Middlewares;


using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

// Environment
using dotenv.net;
using Npgsql;
using System.Net;
using System.Net.Sockets;

DotEnv.Load();

static string BuildDatabaseConnectionString(string rawConnectionString)
{
    var csb = new NpgsqlConnectionStringBuilder(rawConnectionString);

    if (!string.IsNullOrWhiteSpace(csb.Host) && Uri.CheckHostName(csb.Host) == UriHostNameType.Dns)
    {
        try
        {
            var addresses = Dns.GetHostAddresses(csb.Host);
            var ipv4 = addresses.FirstOrDefault(a => a.AddressFamily == AddressFamily.InterNetwork);
            var ipv6 = addresses.FirstOrDefault(a => a.AddressFamily == AddressFamily.InterNetworkV6);
            var chosenAddress = ipv4 ?? ipv6;
            if (chosenAddress is not null)
            {
                csb.Host = chosenAddress.AddressFamily == AddressFamily.InterNetworkV6
                    ? $"[{chosenAddress}]"
                    : chosenAddress.ToString();
            }
        }
        catch
        {
        }
    }

    if (csb.CommandTimeout <= 0)
    {
        csb.CommandTimeout = 90;
    }

    if (csb.Timeout <= 0)
    {
        csb.Timeout = 15;
    }

    if (csb.KeepAlive <= 0)
    {
        csb.KeepAlive = 30;
    }

    // === INÍCIO DA ALTERAÇÃO ===
    // Estas duas linhas impedem o Entity Framework de travar o pool de conexões do Supabase na porta 6543
    csb.MaxAutoPrepare = 0;
    csb.NoResetOnClose = true;
    // === FIM DA ALTERAÇÃO ===

    return csb.ConnectionString;
}


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Filters.AddService<AuditLogActionFilter>();
});
builder.Services.AddEndpointsApiExplorer();

// Handler Exceptions
builder.Services.AddExceptionHandler<GlobalExceptionHandler>(); // <-- ADICIONE AQUI
builder.Services.AddProblemDetails(); // <-- ADICIONE AQUI (necessário para formatar a resposta)

// Leitura de dados das requisões
builder.Services.AddHttpContextAccessor();

// Swagger com Token
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Api - CondoSync", Version = "v1" });

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Insira o token JWT desta maneira: Bearer {seu token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Conexão Banco de dados

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION") ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("ERRO CRÍTICO: A string de conexão com o banco de dados (DB_CONNECTION) não foi encontrada.");
}

connectionString = BuildDatabaseConnectionString(connectionString);

// Autenticação e Autorização
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
    ?? builder.Configuration["Jwt:Key"]
    ?? builder.Configuration["JwtSettings:Secret"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("ERRO CRÍTICO: A chave do JWT (JWT_KEY) não foi encontrada.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions =>
        npgsqlOptions
            .CommandTimeout(90)
            .EnableRetryOnFailure(5, TimeSpan.FromSeconds(5), null)));

var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false; // Em produção, mude para true
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();


//? Adição dos Serviços

//*  Moradores - Funcionários
builder.Services.AddScoped<IMoradorRepository, MoradorRepository>();
builder.Services.AddScoped<IFuncionarioRepository, FuncionarioRepository>();

//*  Usuários
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IAuthService, AuthService>();

//*  Reservas
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IReservaService, ReservaService>();

//*  Reclamações
builder.Services.AddScoped<IReclamacaoRepository, ReclamacaoRepository>();
builder.Services.AddScoped<IReclamacaoService, ReclamacaoService>();

//*  Encomendas
builder.Services.AddScoped<IEncomendaRepository, EncomendaRepository>();
builder.Services.AddScoped<IEncomendaService, EncomendaService>();

//*  Avisos
builder.Services.AddScoped<IAvisoRepository, AvisoRepository>();
builder.Services.AddScoped<IAvisoService, AvisoService>();

//* RabbitMQ
builder.Services.AddSingleton<IMessageBusService, RabbitMQService>();
builder.Services.AddHostedService<LogWorker>();
builder.Services.AddScoped<AuditLogActionFilter>();

// CORS
builder.Services.AddCors(options =>
{
   options.AddPolicy("CondoSyncPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("CondoSyncPolicy");

// Exceptions
app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();

app.Run();
