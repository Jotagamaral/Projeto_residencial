import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import RegisterPage from "./pages/RegisterPage"; // Renomeei RegistePage para RegisterPage
import LoginPage from "./pages/LoginPage";
import Encomendas from "./pages/Encomendas/Encomendas";
import CadastroEncomenda from "./pages/Encomendas/CadastroEncomenda";
import Reclamacoes from "./pages/Reclamacoes/Reclamacoes";

import { AuthProvider } from './context/AuthContext'; // Importar AuthProvider
import PrivateRoute from './components/PrivateRoute'; // Importar PrivateRoute
import Reservas from "./pages/Reservas/Reservas";
import CadastroReclamacao from "./pages/Reclamacoes/CadastroReclamacoes";
import CadastroAvisos from "./pages/Avisos/CadastroAvisos";

function App() {
  return (
    <Router>
      <AuthProvider> {/* Envolva toda a aplicação com o AuthProvider */}
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          {/* Rotas Protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/encomendas" element={<Encomendas />} />
            <Route path="/reclamacoes" element={<Reclamacoes />} />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/cadastro_reclamacao" element={<CadastroReclamacao />} />
            <Route path="/cadastro_encomendas" element={<CadastroEncomenda />} />
            <Route path="/cadastro_aviso" element={<CadastroAvisos />} />    

            {/* Adicione outras rotas protegidas aqui */}
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;