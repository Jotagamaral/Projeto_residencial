// components/ReclamacoesList.jsx

function ReclamacoesList({ reclamacoes }) {
    if (!reclamacoes.length) {
        return <p className="text-center text-gray-500 mt-4">Nenhuma Reclamação encontrado.</p>;
    }
    
    return (
        <div className="mt-6 px-4">
            <h2 className="text-2xl font-bold mb-4">Reclamações</h2>
            <div className="grid gap-4">
            {reclamacoes.map((Reclamacoes) => (
                <div key={Reclamacoes.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600">{Reclamacoes.reclamacao}</p>
                {Reclamacoes.nome == 'null' ? (
                    <p className="text-sm text-gray-400 mt-2">Anônimo</p>
                ) : (
                    <p className="text-sm text-gray-400 mt-2">{Reclamacoes.nome}</p>
                )}
                </div>
            ))}
            </div>
        </div>
        );
    }
    
    export default ReclamacoesList;
    