const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-x-2">
        <img src="/logo.png" alt="Logo" className="w-14 h-14" />
        <h1 className="text-2xl font-bold">Squash</h1>
      </div>
      <button className="btn btn-secondary">Log Out</button>
    </header>
  );
};

export default Header;