function EncomendasList({ encomendas }) {
  if (!encomendas || !encomendas.length) {
    return (
      <div className='bg-white p-8 rounded-2xl shadow-md text-center'>
        <p className='text-gray-500'>Nenhuma encomenda encontrada.</p>
      </div>
    );
  }

  return (
    <div className='bg-white shadow-md rounded-2xl overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-blue-600 text-white text-sm uppercase'>
              <th className='py-3 px-4 text-left font-semibold'>Remetente</th>
              <th className='py-3 px-4 text-left font-semibold'>
                Destinatário
              </th>
              <th className='py-3 px-4 text-left font-semibold'>
                Apartamento
              </th>
              <th className='py-3 px-4 text-left font-semibold'>
                Hora da Entrega
              </th>
            </tr>
          </thead>
          <tbody>
            {encomendas.map((item, index) => (
              <tr
                key={item.id}
                className={`border-t border-gray-100 transition-all duration-200 hover:bg-blue-50 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className='py-3 px-4 text-gray-700'>{item.remetente}</td>
                <td className='py-3 px-4 text-gray-700'>{item.morador}</td>
                <td className='py-3 px-4 text-gray-700'>
                  {item.apartamento}
                </td>
                <td className='py-3 px-4 text-gray-700'>
                  {item.horaEntrega}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EncomendasList;
