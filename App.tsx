import React, { useState, useCallback, useMemo } from 'react';
import { Page, SubMenu, SubMenuItem } from './types';
import Header from './components/Header';
import LeftSubMenu from './components/LeftSubMenu';
import MegaMenu from './components/MegaMenu';
import CrmDashboard from './components/CrmDashboard';
import CreativeStudio from './components/CreativeStudio';
import ContentAnalyzer from './components/ContentAnalyzer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AutomationBuilder from './components/AutomationBuilder';
import SocialContentStudio from './components/SocialContentStudio';
import ChatBot from './components/ChatBot';
import { HomeIcon, BoltIcon, SparklesIcon, ChartBarIcon, CpuChipIcon, PhotoIcon, VideoCameraIcon, DocumentTextIcon, MegaphoneIcon, CalendarDaysIcon, PencilIcon } from './components/icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('CRM');
  const [currentSubPage, setCurrentSubPage] = useState<string>('Overview');
  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);

  const subMenus: Record<Page, SubMenu> = useMemo(() => ({
    'CRM': {
      title: 'CRM Control',
      items: [
        { id: 'Overview', label: 'Overview', icon: <HomeIcon /> },
        { id: 'Contacts', label: 'Contacts', icon: <SparklesIcon /> },
        { id: 'Pipelines', label: 'Pipelines', icon: <SparklesIcon /> },
        { id: 'Audit Trail', label: 'Audit Trail', icon: <SparklesIcon /> },
      ]
    },
    'Creative': {
        title: 'Creative Studio',
        items: [
            { id: 'ImageGen', label: 'Image Generation', icon: <PhotoIcon /> },
            { id: 'ImageEdit', label: 'Image Editor', icon: <SparklesIcon /> },
            { id: 'VideoGen', label: 'Video Generation', icon: <VideoCameraIcon /> },
        ]
    },
    'Social': {
        title: 'Social Studio',
        items: [
            { id: 'Composer', label: 'Composer', icon: <PencilIcon /> },
            { id: 'Calendar', label: 'Calendar', icon: <CalendarDaysIcon /> },
            { id: 'Inbox', label: 'Inbox', icon: <MegaphoneIcon /> },
        ]
    },
    'Analyzer': {
        title: 'Content Analyzer',
        items: [
            { id: 'Image', label: 'Image Analysis', icon: <PhotoIcon /> },
            { id: 'Video', label: 'Video Analysis', icon: <VideoCameraIcon /> },
            { id: 'Audio', label: 'Audio Transcription', icon: <DocumentTextIcon /> },
        ]
    },
    'Analytics': {
      title: 'Analytics',
      items: [
        { id: 'Real-time', label: 'Real-time', icon: <ChartBarIcon /> },
        { id: 'Projections', label: 'Projections', icon: <CpuChipIcon /> },
      ]
    },
    'Automation': {
      title: 'Automation',
      items: [
        { id: 'Builder', label: 'Builder', icon: <BoltIcon /> },
        { id: 'Workflows', label: 'Workflows', icon: <SparklesIcon /> },
      ]
    },
  }), []);

  const handlePageChange = useCallback((page: Page) => {
    setCurrentPage(page);
    setCurrentSubPage(subMenus[page].items[0].id);
    setMegaMenuOpen(false);
  }, [subMenus]);

  const handleSubPageChange = useCallback((item: SubMenuItem) => {
    setCurrentSubPage(item.id);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'CRM':
        return <CrmDashboard />;
      case 'Creative':
        return <CreativeStudio />;
       case 'Social':
        return <SocialContentStudio />;
      case 'Analyzer':
        return <ContentAnalyzer />;
      case 'Analytics':
        return <AnalyticsDashboard />;
      case 'Automation':
        return <AutomationBuilder />;
      default:
        return <CrmDashboard />;
    }
  };

  const breadcrumbs = [ 'Apex Control 360', currentPage, currentSubPage ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg bg-grid-dark-border/[0.2] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-dark-bg [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      <Header 
        breadcrumbs={breadcrumbs} 
        onMenuClick={() => setMegaMenuOpen(!isMegaMenuOpen)} 
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSubMenu 
          menu={subMenus[currentPage]}
          activeItem={currentSubPage}
          onItemClick={handleSubPageChange}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative text-white">
          {renderPage()}
        </main>
      </div>
      <MegaMenu 
        isOpen={isMegaMenuOpen} 
        onClose={() => setMegaMenuOpen(false)}
        onNavigate={handlePageChange}
        currentPage={currentPage}
      />
      <ChatBot />
    </div>
  );
};

export default App;
