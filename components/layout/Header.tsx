'use client';

export function Header() {
  return (
    <header className="fixed top-0 right-0 left-64 bg-neutral-800 border-b border-neutral-700 h-16 px-6 flex items-center justify-between z-40">
      <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="text-neutral-300 hover:text-white">🔔</button>
        <button className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white font-semibold">
          U
        </button>
      </div>
    </header>
  );
}
