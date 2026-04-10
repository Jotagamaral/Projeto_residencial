import { useMemo } from 'react';

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function AvisoList({ avisos }) {
  const ordenados = useMemo(() => {
    return [...avisos].sort((a, b) => {
      const ta = a.dataInicio ? new Date(a.dataInicio).getTime() : 0;
      const tb = b.dataInicio ? new Date(b.dataInicio).getTime() : 0;
      return tb - ta || (b.id || 0) - (a.id || 0);
    });
  }, [avisos]);

  if (!ordenados.length) {
    return (
      <div className='bg-white p-8 rounded-2xl shadow-md text-center'>
        <p className='text-gray-500'>Nenhum aviso encontrado.</p>
      </div>
    );
  }

  return (
    <div className='space-y-3 max-h-[500px] overflow-y-auto'>
      {ordenados.map((aviso) => (
        <div
          key={aviso.id}
          className='bg-white p-5 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-600 hover:shadow-md transition-all duration-300'
        >
          <p className='text-gray-900 font-semibold text-sm'>{aviso.titulo}</p>
          <p className='text-gray-700 text-sm mt-2 whitespace-pre-wrap'>
            {aviso.descricao}
          </p>
          <p className='text-xs text-gray-400 mt-3'>
            Publicado em{' '}
            {aviso.dataInicio
              ? formatadorData.format(new Date(aviso.dataInicio))
              : '—'}
          </p>
          {aviso.dataExpiracao && (
            <p className='text-xs text-gray-400 mt-1'>
              Válido até{' '}
              {formatadorData.format(new Date(aviso.dataExpiracao))}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default AvisoList;
