import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importe o contexto de autenticação

const PrivateRoute = () => {
// Obtém o estado de autenticação diretamente do contexto
const { isAuthenticated } = useAuth();


if (isAuthenticated) {
    console.log("Usuário autenticado. Permitindo acesso à rota protegida.");
} else {
    console.log("Usuário não autenticado. Redirecionando para a página de login.");
}

return isAuthenticated ? (<Outlet />) : (<Navigate to="/login" replace />);
};

export default PrivateRoute;