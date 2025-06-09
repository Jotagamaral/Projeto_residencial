// components/AvisoList.jsx

function AvisoList({ avisos }) {
    if (!avisos.length) {
        return <p className="text-center text-gray-500 mt-4">Nenhum aviso encontrado.</p>;
    }

    // Função para converter dd/MM/yyyy para Date
    function parseDataBR(dataStr) {
        if (!dataStr) return new Date(0);
        const [dia, mes, ano] = dataStr.split('/');
        return new Date(`${ano}-${mes}-${dia}`);
    }

    // Ordena do mais novo para o mais antigo
    const avisosOrdenados = [...avisos].sort(
        (a, b) => parseDataBR(b.data) - parseDataBR(a.data)
    );
    
    return (
        <div className="mt-6 px-4 max-h-[600px] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Avisos</h2>
            <div className="grid gap-4">
            {avisosOrdenados.map((aviso) => (
                <div key={aviso.id} className="bg-white p-4 rounded-lg shadow-md">
                <p className="text-gray-600">{aviso.aviso}</p>
                <p className="text-sm text-gray-400 mt-2">{(aviso.data)}</p>
                </div>
            ))}
            </div>
        </div>
        );
    }
    
    export default AvisoList;
    