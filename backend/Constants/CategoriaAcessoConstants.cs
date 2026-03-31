namespace backend.Constants;

public static class CategoriaAcessoConstants
{
    // IDs Numéricos
    public const long ADMIN_ID = 1;
    public const long MORADOR_ID = 2;
    public const long FUNCIONARIO_ID = 3;

    // Nomes das Roles
    public const string ADMIN_ROLE = "ADMIN";
    public const string MORADOR_ROLE = "MORADOR";
    public const string FUNCIONARIO_ROLE = "FUNCIONARIO";

    // Método utilitário: Transforma o ID do banco na String do Token
    public static string ObterNomeRole(long id)
    {
        return id switch
        {
            ADMIN_ID => ADMIN_ROLE,
            MORADOR_ID => MORADOR_ROLE,
            FUNCIONARIO_ID => FUNCIONARIO_ROLE,
            _ => throw new ArgumentException($"ID de Categoria de Acesso inválido: {id}")
        };
    }
}