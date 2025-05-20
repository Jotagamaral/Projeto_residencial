import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import RegisterPage from "./pages/RegistePage";
import LoginPage from "./pages/LoginPage";
import Encomendas from "./pages/Encomendas/Encomendas";
import CadastroEncomenda from "./pages/Encomendas/CadastroEncomenda";
import Reclamacoes from "./pages/Reclamacoes/Reclamacoes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/encomendas" element={<Encomendas />} />
        <Route path="/cadastro_encomendas" element={<CadastroEncomenda />} />
        <Route path="/reclamacoes" element={<Reclamacoes />} />
      </Routes>
    </Router>
  );
}

export default App;
