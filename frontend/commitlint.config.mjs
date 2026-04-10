export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // Novas funcionalidades
                'fix',      // Correção de bugs
                'docs',     // Documentação
                'style',    // Estética (css, formatação)
                'refactor', // Melhoria de código sem mudar lógica
                'perf',     // Performance
                'test',     // Testes
                'build',    // Scripts de build
                'ci',       // Integração Contínua
                'chore',    // Outras tarefas (ex: atualizar npm)
                'revert'    // Reverter commits
            ],
        ],
    },
};