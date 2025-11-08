import React from 'react';
import { Page } from '../types';
import { HomeIcon, BoltIcon, SparklesIcon, ChartBarIcon, CpuChipIcon, MegaphoneIcon } from './icons';
import { XMarkIcon } from './icons';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const menuItems: { page: Page; label: string; icon: React.ReactNode; description: string }[] = [
  { page: 'CRM', label: 'CRM Control Room', icon: <HomeIcon />, description: 'Sync MCP & GoHighLevel modules.' },
  { page: 'Creative', label: 'Creative Studio', icon: <SparklesIcon />, description: 'Generate AI images and videos.' },
  { page: 'Social', label: 'Social Content Studio', icon: <MegaphoneIcon />, description: 'Draft, schedule, and publish content.' },
  { page: 'Analyzer', label: 'Content Analyzer', icon: <CpuChipIcon />, description: 'Understand images, video, and audio.' },
  { page: 'Analytics', label: 'Analytics Cockpit', icon: <ChartBarIcon />, description: 'View real-time and predictive data.' },
  { page: 'Automation', label: 'Automation Builder', icon: <BoltIcon />, description: 'Construct complex workflows.' },
];

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-dark-bg/80 backdrop-blur-xl border-l border-dark-border shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Navigation</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-8 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`w-full text-left p-4 rounded-lg flex items-center space-x-4 transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-brand-primary text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="p-2 bg-white/10 rounded-md">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6" })}
                </div>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm opacity-80">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;
