import {
  FaHome,
  FaComments,
  FaCalendarAlt,
  FaBox,
  FaUser,
  FaUserTie,
  FaCogs,
  FaUsers,
  FaBullhorn,
} from 'react-icons/fa';

export const menuStructure = [
  { title: 'Home', href: '/home', icon: FaHome },
  { title: 'Reclamacoes', href: '/reclamacoes', icon: FaComments },
  { title: 'Reservas', href: '/reservas', icon: FaCalendarAlt },
  { title: 'Encomendas', href: '/encomendas', icon: FaBox },
  { title: 'Perfil', href: '/perfil', icon: FaUser },
  {
    title: 'Operação',
    icon: FaUsers,
    roles: ['FUNCIONARIO', 'ADMIN'],
    children: [
      { title: 'Visitantes', href: '/visitantes', icon: FaUsers },
      { title: 'Novos avisos', href: '/cadastro_aviso', icon: FaBullhorn },
    ]
  },
  {
    title: 'Administração',
    icon: FaCogs,
    roles: ['ADMIN'],
    children: [
      { title: 'Funcionários', href: '/funcionarios', icon: FaUserTie },
      { title: 'Moradores', href: '/moradores', icon: FaHome },
      { title: 'Configurações', href: '/configuracoes', icon: FaCogs },
    ]
  }
  
];
