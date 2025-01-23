import MainPage from "../components/ui/home";
import Navbar from "../components/ui/navbar";


export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden bg-cover bg-center"
      >
        <Navbar />
        <MainPage />
      </div>
    </>
  );
}
