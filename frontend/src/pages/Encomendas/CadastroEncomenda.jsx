// pages/CadastroEncomenda.jsx
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import CustomSidebar from '../../components/CustomSidebar';
import { useNavigate } from 'react-router-dom';
import { publicarEncomenda, buscarMoradores } from '../../services/encomendasService'

function CadastroEncomenda() {
    const [remetente, setRemetente] = useState('');
    const [moradorId, setMoradorId] = useState('');
    const [funcionarioId, setFuncionarioId] = useState(null)
    const [listaMoradores, setListaMoradores] = useState([])

    const navigate = useNavigate();

    useEffect( () => {

        const carregarDados = async () =>{
            
            const userString = localStorage.getItem('user');
            if (userString) {
                try {
                    const userObject = JSON.parse(userString);
                    setFuncionarioId(userObject.id);
                    
                } catch (e) {
                    console.error("Erro ao parsear dados do usuário do localStorage:", e);
                }
            }

            try {
                const moradoresRetorno = await buscarMoradores()
                setListaMoradores(moradoresRetorno)
                
            } catch (error) {
                console.error("Erro ao buscar por moradores: ", error)
            }
        }

        carregarDados();

    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validações básicas antes de enviar
        if (!remetente.trim()) {
            alert("O remetente é obrigatório!");
            return;
        }
        if (!moradorId) {
            alert("Selecione um destinatário (morador)!");
            return;
        }
        if (!funcionarioId) {
            alert("ID do funcionário não disponível. Tente relogar.");
            return;
        }

         // Pega o horário atual no formato YYYY-MM-DDTHH:MM:SS
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');
        // A data/hora formatada que você precisa enviar para o backend
        const formattedHoraEntrega = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        const encomendaData = {
            remetente: remetente,
            moradorId: moradorId, //id do morador
            funcionarioId: funcionarioId,
            horaEntrega: formattedHoraEntrega //pegar timestamp do submit YYYY-MM-DDT00:00:00

        };

        try {

            await publicarEncomenda(encomendaData)
            
            setRemetente('');

            navigate('/encomendas')
            
        } catch (error) {
            console.error("[CadastroEncomendas.jsx]: ", error)
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
                        Cadastrar Encomenda
                    </h2>
                    <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remetente">
                                Remetente:
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="remetente"
                                type="text"
                                placeholder="Nome do Remetente"
                                value={remetente}
                                onChange={(e) => setRemetente(e.target.value)}
                                required
                            />
                            </div>
                            {/* Select Destinatário (Morador) */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="moradorId">
                                    Destinatário (Morador):
                                </label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="moradorId"
                                    value={moradorId}
                                    onChange={(e) => setMoradorId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecione um morador</option>
                                    {listaMoradores.map((morador) => (
                                        <option key={morador.id} value={morador.id}>
                                            {morador.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Cadastrar Encomenda
                                </button>
                            </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastroEncomenda;