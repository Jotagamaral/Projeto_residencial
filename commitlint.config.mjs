export default {
    extends: ['@commitlint/config-conventional'],
    ignores: [
        (message) => message.includes('Merge'),
        (message) => message.includes('chore(release)'),
        (message) => message.includes('chore(deps)'),
        (message) => message.includes('chore(deps-dev)'),
        (message) => message.includes('[skip ci]'),
        (message) => message.includes('ci:'),
    ],
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