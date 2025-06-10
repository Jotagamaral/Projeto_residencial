import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { publicarReclamacao } from '../../services/reclamacoeService';
import { useNavigate } from 'react-router-dom';

function CadastroReclamacao() {
    const [textoReclamacao, setTextoReclamacao] = useState('');
    const [nomeMorador, setNomeMorador] = useState('');
    const [anonimo, setAnonimo] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const navigate = useNavigate()

    useEffect(() => {
        
        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const userObject = JSON.parse(userString);
                setCurrentUserId(userObject.id);

                if(userObject.nome){
                    setNomeMorador(userObject.nome)
                }
                
            } catch (e) {
                console.error("Erro ao parsear dados do usuário do localStorage:", e);
            }
        }
    }, []);

    const handleSubmit = async (event) => {

        event.preventDefault();
        const reclamacoesData = {
            nome: anonimo ? null : nomeMorador,
            reclamacao: textoReclamacao,
            moradorId: currentUserId  

        };

        try {
            await publicarReclamacao(reclamacoesData)
            
            setTextoReclamacao('');
            setNomeMorador('');
            setAnonimo(false);
            
            navigate('/reclamacoes')

        } catch (error) {
            console.error("[CadastroReclamacoes.jsx]: ", error)
        }
        
    };

    return (
        <div className="flex bg-gray-100 min-h-screen">
            <CustomSidebar />
            <div className="w-full">
                <Navbar />
                <div className="w-full flex flex-col items-center justify-center py-8">
                    <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md ">
                        <h2 className="block text-gray-700 text-xl font-bold mb-6 text-center ">
                        Cadastrar Reclamação
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textoReclamacao">
                                    Reclamação:
                                </label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-y"
                                    id="textoReclamacao"
                                    placeholder="Texto da Reclamação"
                                    value={textoReclamacao}
                                    onChange={(e) => setTextoReclamacao(e.target.value)}
                                    required
                                    rows={4}
                                />
                            </div>
                        <div className="mb-4 flex items-center">
                            <input
                                id="anonimo"
                                type="checkbox"
                                checked={anonimo}
                                onChange={() => setAnonimo(!anonimo)}
                                className="mr-2"
                            />
                            <label htmlFor="anonimo" className="text-gray-700 text-sm font-bold">
                            Reclamação anônima
                            </label>
                        </div>
                        {!anonimo && (
                            <div className="mb-4">
                            <label 
                                className="block text-gray-700 text-sm font-bold mb-2" 
                                htmlFor="nomeMorador" 
                                >
                                Nome do Morador:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight 
                                            focus:outline-none focus:shadow-outline
                                            disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed  disabled:border-gray-300"
                                id="nomeMorador"
                                type="text"
                                placeholder="Nome do Morador"
                                value={nomeMorador}
                                disabled = {true}
                                onChange={(e) => setNomeMorador(e.target.value)}
                                required={!anonimo}
                            />
                            </div>
                        )}
                        <div className="flex justify-center">
                            <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                            >
                            Cadastrar Reclamação
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastroReclamacao;