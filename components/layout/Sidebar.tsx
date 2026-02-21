'use client';

import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  active: string;
}

export function Sidebar({ active }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { href: '/trading', label: 'Trading', icon: '📊' },
    { href: '/portfolio', label: 'Portfolio', icon: '💼' },
    { href: '/ai-insights', label: 'AI Insights', icon: '🤖' },
    { href: '/history', label: 'History', icon: '📋' },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-neutral-800 border-r border-neutral-700 transition-all duration-200 fixed h-screen left-0 top-0 flex flex-col pt-20`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 left-4 p-2 hover:bg-neutral-700 rounded-lg"
      >
        ☰
      </button>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
              active === item.href
                ? 'bg-indigo-600 text-white'
                : 'text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-neutral-700">
        {!collapsed && (
          <button className="w-full px-4 py-2 text-sm bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg">
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}
