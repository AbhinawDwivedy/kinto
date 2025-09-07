import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import TopBar from './TopBar';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />
      <main className="flex-1 pb-16 pt-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;