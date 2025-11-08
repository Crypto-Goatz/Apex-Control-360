
import React from 'react';
import { SubMenu, SubMenuItem } from '../types';

interface LeftSubMenuProps {
  menu: SubMenu;
  activeItem: string;
  onItemClick: (item: SubMenuItem) => void;
}

const LeftSubMenu: React.FC<LeftSubMenuProps> = ({ menu, activeItem, onItemClick }) => {
  return (
    <nav className="hidden md:flex flex-col items-center w-20 bg-dark-card/30 border-r border-dark-border p-4 space-y-4 relative z-10">
      <h2 className="text-xs font-bold text-gray-500 tracking-wider uppercase">{menu.title}</h2>
      <div className="flex flex-col items-center space-y-2">
        {menu.items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item)}
            className={`p-3 rounded-lg transition-all duration-200 group relative ${
              activeItem === item.id 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title={item.label}
          >
            {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}
            <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-gray-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default LeftSubMenu;
