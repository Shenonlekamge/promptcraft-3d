const Navbar = () => {
  return (
    <div className="w-full bg-zinc-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold text-green-400">PromptCraft 3D</h1>
      <button className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
        Login
      </button>
    </div>
  );
};

export default Navbar;