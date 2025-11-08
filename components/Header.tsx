
import React from 'react';
import { UserCircleIcon, Cog6ToothIcon, Bars3Icon } from './icons';

interface HeaderProps {
  breadcrumbs: string[];
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ breadcrumbs, onMenuClick }) => {
  return (
    <header className="relative z-20 flex-shrink-0 bg-dark-card/50 backdrop-blur-xl border-b border-dark-border shadow-lg">
      <div className="flex items-center justify-between p-4 h-16">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              <span className={`font-medium ${index === breadcrumbs.length - 1 ? 'text-white' : 'hover:text-white'}`}>
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2">/</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <UserCircleIcon className="w-6 h-6 text-gray-300" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Cog6ToothIcon className="w-6 h-6 text-gray-300" />
          </button>
          <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden">
            <Bars3Icon className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
