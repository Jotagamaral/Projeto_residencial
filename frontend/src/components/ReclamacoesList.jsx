function ReclamacoesList({ reclamacoes }) {
  if (!reclamacoes.length) {
    return (
      <div className='bg-white p-8 rounded-2xl shadow-md text-center'>
        <p className='text-gray-500'>Nenhuma Reclamação encontrada.</p>
      </div>
    );
  }

  return (
    <div className='grid gap-4'>
      {reclamacoes.map((item) => (
        <div
          key={item.id}
          className='bg-white p-5 rounded-2xl shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-all duration-300'
        >
          <p className='text-gray-700'>{item.reclamacao}</p>
          <p className='text-sm text-gray-400 mt-3'>
            {item.nome === 'null' ? 'Anônimo' : item.nome}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ReclamacoesList;
