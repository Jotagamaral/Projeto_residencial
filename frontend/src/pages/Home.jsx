import Navbar from "../components/Navbar";
import CustomSidebar from "../components/CustomSidebar";
import Card from "../components/Card";

function Home() {
  return (
    <div className="flex bg-gray-100">
      <CustomSidebar/>
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
