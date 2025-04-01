import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

function Home() {
  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <div className="flex justify-center gap-4 mt-10">
          <Card title="Reclamações" />
          <Card title="Reservas" />
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <Card title="Avisos" />
          <Card title="Encomendas" />
        </div>
      </div>
    </div>
  );
}

export default Home;
