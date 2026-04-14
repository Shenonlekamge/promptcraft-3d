import Navbar from "../components/Navbar";
import PromptPanel from "../components/PromptPanel";
import PreviewPanel from "../components/PreviewPanel";

const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <Navbar />

      <div className="flex flex-1">
        <div className="w-1/3 border-r border-zinc-700">
          <PromptPanel />
        </div>

        <div className="w-2/3">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;