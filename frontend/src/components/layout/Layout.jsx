import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md text-body-md antialiased">
      <Sidebar />
      <div className="md:ml-[280px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-background">
          <div className="max-w-[1440px] mx-auto px-md md:px-xl pt-xs md:pt-sm pb-md md:pb-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
