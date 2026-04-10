import { execSync } from 'child_process';
const testCommits = () => {
    console.log('Iniciando validação do Pipeline de Versão...\n');

    const cases = [
        { msg: "feat: adiciona nova funcionalidade", expected: true },
        { msg: "fix: corrige erro de calculo", expected: true },
        { msg: "chore: atualiza dependencias", expected: true },
        { msg: "doc: adiciona readme", expected: false },
        { msg: "arrumando o projeto", expected: false },
        { msg: "FEAT: versao em maiuscula", expected: false }
    ];

    let passedAll = true;

    cases.forEach(({ msg, expected }) => {
        try {
            execSync(`echo "${msg}" | npx commitlint --config ./commitlint.config.mjs`);
            if (expected) {
                console.log(`Sucesso esperado: "${msg}"`);
            } else {
                console.log(`Falha: O commit "${msg}" deveria ter sido rejeitado!`);
                passedAll = false;
            }
        } catch (error) {
            if (!expected) {
                console.log(`Bloqueio correto: "${msg}" foi rejeitado.`);
            } else {
                console.log(`Erro: O commit "${msg}" é válido mas foi bloqueado.`);
                passedAll = false;
            }
            throw error;
        }
    });

    if (passedAll) {
        console.log('\nTudo certo. Controle de versão está funcionando devidamente.');
        process.exit(0);
    } else {
        console.log('\nErro. Existem falhas na configuração do Commitlint.');
        process.exit(1);
    }
};

testCommits();