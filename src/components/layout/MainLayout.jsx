import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#050a14' }}>
      {/* CRT scan line overlay */}
      <div className="scan-overlay" />
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 grid-pattern">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
