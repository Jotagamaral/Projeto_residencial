# Compilação (Build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o projeto e restaura
COPY ["backend/*.csproj", "backend/"]
RUN dotnet restore "backend/backend.csproj"

# Copia todo o código e compila
COPY . .
WORKDIR "/src/backend"
RUN dotnet publish "backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Execução (Runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# O Render define a porta automaticamente, o .NET deve ouvir nela
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]