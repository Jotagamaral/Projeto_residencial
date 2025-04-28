// components/AvisoList.jsx

function AvisoList({ avisos }) {
    if (!avisos.length) {
        return <p className="text-center text-gray-500 mt-4">Nenhum aviso encontrado.</p>;
        }
    
        return (
        <div className="mt-6 px-4">
            <h2 className="text-2xl font-bold mb-4">Avisos</h2>
            <div className="grid gap-4">
            {avisos.map((aviso) => (
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
    