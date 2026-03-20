# Usamos o SDK do .NET 8 (ou 9, dependendo da sua versão)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dev
WORKDIR /app

# Copia os arquivos de projeto e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o restante do código
COPY . .

# Expõe a porta padrão do ASP.NET Core
EXPOSE 8080

# Comando para rodar com "Hot Reload" (atualiza ao salvar)
ENTRYPOINT ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:8080"]