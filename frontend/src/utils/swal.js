import Swal from 'sweetalert2';

export const alertSucesso = (titulo, texto) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'success',
    confirmButtonColor: '#4f46e5', // indigo-600
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold'
    }
  });
};

export const alertErro = (titulo, texto) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'error',
    confirmButtonColor: '#f43f5e', // rose-500
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold'
    }
  });
};

export const alertAviso = (titulo, texto) => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    confirmButtonColor: '#3b82f6', // blue-500
    confirmButtonText: 'OK',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold'
    }
  });
};

export const confirmarAcao = async (titulo, texto, confirmText = 'Confirmar') => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', // red-500
    cancelButtonColor: '#6b7280', // gray-500
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'rounded-2xl',
      confirmButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold m-1',
      cancelButton: 'rounded-xl px-5 py-2.5 text-sm font-semibold m-1'
    }
  });
  return result.isConfirmed;
};
