// components/EncomendasList.jsx

function Encomendas({encomendas}) {
    if (!encomendas.length || !encomendas) {
        return <p className="text-center text-gray-500 mt-4">Nenhuma encomenda encontrada.</p>;
    }
    
    return (
    <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-4xl">
        <h2 className="text-gray-700 text-xl font-bold mb-6 text-center">
        Encomendas Registradas
        </h2>
        <div className="overflow-x-auto"></div>
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                    <th className="py-2 px-4 border">Remetente</th>
                    <th className="py-2 px-4 border">Destinatário</th>
                    <th className="py-2 px-4 border">Apartamento</th>
                    <th className="py-2 px-4 border">Hora da Entrega</th>
                </tr>
            </thead>
            <tbody>
                {encomendas.map((item) => (
                    <tr key={item.id} className="text-center border-t">
                    <td className="py-2 px-4 border">{item.remetente}</td>
                    <td className="py-2 px-4 border">{item.morador}</td>
                    <td className="py-2 px-4 border">{item.apartamento}</td>
                    <td className="py-2 px-4 border">{item.horaEntrega}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
    }
    
    export default Encomendas;
    