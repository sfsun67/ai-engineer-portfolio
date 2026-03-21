import { Outlet, useLocation, Link } from "react-router";
import { Terminal, ChevronRight, Home as HomeIcon } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="min-h-screen bg-pixel-grid font-mono text-gray-800">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b-2 border-black pixel-shadow-sm mb-8 m-4">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2 overflow-hidden whitespace-nowrap">
            <div className="flex space-x-1.5 mr-4 shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#E43B44] border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-[#F4D330] border border-black"></div>
              <div className="w-3 h-3 rounded-full bg-[#4DA65C] border border-black"></div>
            </div>
            
            <nav className="flex items-center text-sm sm:text-base font-semibold text-gray-700">
              <Link to="/" className="hover:text-[#1D79E4] flex items-center transition-colors">
                <Terminal className="w-4 h-4 mr-2 text-[#4DA65C]" />
                ~/portfolio
              </Link>
              
              {pathnames.length > 0 && (
                <>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
                  <span className="text-gray-500 truncate">projects</span>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400 shrink-0" />
                  <span className="text-[#F48B29] truncate">{pathnames[pathnames.length - 1]}</span>
                </>
              )}
            </nav>
          </div>
          
          <div className="hidden sm:flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase">
            <span>[Status: OK]</span>
            <span className="text-[#4DA65C]">Super_Individual_v1.0</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <Outlet />
      </main>
      
      {/* Footer / Mascot Placeholder */}
      <footer className="fixed bottom-4 right-4 z-30 opacity-70 hover:opacity-100 transition-opacity">
         <div className="relative group cursor-help">
           {/* Simple CSS Oscar Green Trash Can mascot stand-in */}
           <div className="w-12 h-12 bg-[#4DA65C] border-2 border-black pixel-shadow rounded-t-none rounded-b-lg flex items-center justify-center">
             <div className="w-8 h-2 bg-gray-800 absolute -top-2 rounded-t-md"></div>
             <div className="flex space-x-1 mt-2">
               <div className="w-2 h-2 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full ml-0.5 mt-0.5"></div></div>
               <div className="w-2 h-2 bg-white rounded-full"><div className="w-1 h-1 bg-black rounded-full ml-0.5 mt-0.5"></div></div>
             </div>
           </div>
           <div className="absolute bottom-full right-0 mb-2 w-max bg-white text-xs border-2 border-black pixel-shadow-sm p-2 hidden group-hover:block font-sans">
             "Hello there, visitor."
           </div>
         </div>
      </footer>
    </div>
  );
}
