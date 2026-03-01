function AvisoList({ avisos }) {
  if (!avisos.length) {
    return (
      <div className='bg-white p-8 rounded-2xl shadow-md text-center'>
        <p className='text-gray-500'>Nenhum aviso encontrado.</p>
      </div>
    );
  }

  function parseDataBR(dataStr) {
    if (!dataStr) return new Date(0);
    const [dia, mes, ano] = dataStr.split('/');
    return new Date(`${ano}-${mes}-${dia}`);
  }

  const avisosOrdenados = [...avisos].sort(
    (a, b) => parseDataBR(b.data) - parseDataBR(a.data)
  );

  return (
    <div className='space-y-3 max-h-[500px] overflow-y-auto'>
      {avisosOrdenados.map((aviso) => (
        <div
          key={aviso.id}
          className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-600 hover:shadow-md transition-all duration-300'
        >
          <p className='text-gray-700 text-sm'>{aviso.aviso}</p>
          <p className='text-xs text-gray-400 mt-3'>{aviso.data}</p>
        </div>
      ))}
    </div>
  );
}

export default AvisoList;
