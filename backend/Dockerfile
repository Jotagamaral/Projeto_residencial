# Compilação (SDK do .NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"

COPY . .
WORKDIR "/src/backend"
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Execução (Runtime do .NET 10)
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Garante que o ASP.NET ouça na porta correta
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]