// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom"; // importar o Link do react-router-dom

// Componentes internos
function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
    >
      {children}
    </button>
  );
}

function Card({ children }) {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      {children}
    </div>
  );
}

function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}

// Landing Page
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-8 flex justify-between items-center bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">CondoSync</h1>
        <nav className="space-x-6">
          <a href="#features" className="text-gray-700 hover:text-blue-600">Serviços</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">Sobre</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contato</a>
        </nav>
        <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Entrar
          </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 bg-gray-50">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 leading-tight">
            Gerencie seu condomínio com <span className="text-blue-600">praticidade</span>
          </h2>
          <p className="text-lg text-gray-600">
            O <strong>CondoSync</strong> simplifica a gestão condominial: cadastre moradores, controle espaços comuns e otimize sua administração.
          </p>
          <Link
            to="/cadastro"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Comece Agora!
          </Link>

        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <img
            src="https://img.freepik.com/free-vector/apartment-rent-abstract-concept_335657-3006.jpg"
            alt="Gestão de Condomínios"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 md:px-20 py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Serviços do CondoSync
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent>
              <h4 className="text-xl font-semibold mb-4">Cadastro de Moradores</h4>
              <p className="text-gray-600">
                Organize os dados dos moradores de forma simples e segura e anonimizada.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="text-xl font-semibold mb-4">Reserva de Espaços</h4>
              <p className="text-gray-600">
                Gerencie aluguel e reservas dos espaços comuns com poucos cliques.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h4 className="text-xl font-semibold mb-4">Gestão Simplificada</h4>
              <p className="text-gray-600">
                Relatórios e controle centralizado para síndicos e administradores.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-8 md:px-20 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-gray-800">Sobre o CondoSync</h3>
          <p className="text-lg text-gray-600">
            Criado para modernizar a vida em condomínios, o CondoSync oferece uma experiência intuitiva que conecta moradores, síndicos e administradores em um só lugar.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 md:px-20 py-20 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-gray-800">Entre em Contato</h3>
          <p className="text-gray-600">
            Ficou interessado? Fale conosco e descubra como o CondoSync pode transformar a gestão do seu condomínio.
          </p>
          <a
            href="https://wa.me/5561982704201?text=Gostaria%20de%20esclarecer%20minhas%20dúvidas%20sobre%20o%20CondoSync."
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Fale Conosco
          </a>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} CondoSync. Todos os direitos reservados.</p>

      </footer>
    </div>
  );
}
