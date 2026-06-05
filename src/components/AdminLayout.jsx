import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
function AdminLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // 1. Session verification check
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("phh_current_user"));
    } catch (e) {
      console.error("Error parsing user session:", e);
    }

    if (!user || user.role !== "admin") {
      alert("Unauthorized access. Access to the Admin Console is restricted to system administrators.").then(() => {
        localStorage.removeItem("phh_current_user");
        localStorage.removeItem("phh_jwt_token");
        window.location.href = "portal-login.html";
      });
      return;
    }

    setCurrentUser(user);

    // 2. Initial state loading and count mapping
    const loadState = () => {
      try {
        const reqs = JSON.parse(localStorage.getItem("phh_doctor_requests")) || [];
        setPendingCount(reqs.length);
      } catch (e) {
        console.error("Error loading doctor requests count:", e);
      }
    };

    loadState();

    // Listen for storage events (database syncing)
    const handleStorageChange = (e) => {
      if (e.key === "phh_doctor_requests") {
        loadState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("storage_local", loadState);

    // Backup polling check
    const interval = setInterval(loadState, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage_local", loadState);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    const confirmed = await window.customConfirm("Are you sure you want to log out of the Admin Console?");
    if (confirmed) {
      localStorage.removeItem("phh_current_user");
      localStorage.removeItem("phh_jwt_token");
      window.location.href = "portal-login.html";
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-slate-900 text-slate-100 flex flex-col justify-between fixed top-0 bottom-0 left-0 z-50 shadow-xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-heart-pulse text-cyan-400 text-2xl"></i>
              <div className="flex flex-col text-sm font-black text-white leading-tight">
                <span>Superspeciality</span>
                <span>Doctors</span>
                <span>Consultation</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white text-xl p-1 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Close Sidebar"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            <NavLink 
              to="/overview" 
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-left ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              style={{ textDecoration: 'none' }}
            >
              <i className="fa-solid fa-house-user text-base"></i>
              <span>Overview Panel</span>
            </NavLink>

            <NavLink 
              to="/doctors" 
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-left ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              style={{ textDecoration: 'none' }}
            >
              <i className="fa-solid fa-user-doctor text-base"></i>
              <span>Manage Doctors</span>
            </NavLink>

            <NavLink 
              to="/requests" 
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-left ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              style={{ textDecoration: 'none' }}
            >
              <i className="fa-solid fa-user-clock text-base"></i>
              <span>Manage Requests</span>
              {pendingCount > 0 && (
                <span className="ml-auto inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                  {pendingCount}
                </span>
              )}
            </NavLink>

            <NavLink 
              to="/bookings" 
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-left ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              style={{ textDecoration: 'none' }}
            >
              <i className="fa-solid fa-receipt text-base"></i>
              <span>Bookings Log</span>
            </NavLink>

            <NavLink 
              to="/reports" 
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-left ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              style={{ textDecoration: 'none' }}
            >
              <i className="fa-solid fa-chart-line text-base"></i>
              <span>Patient Reports</span>
            </NavLink>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg border border-slate-700">
              {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name || "Chief Admin"}</p>
              <p className="text-xs text-slate-400 truncate">
                {currentUser?.name === "Dr. Ajit B. Patel" ? "Chief Admin Doctor" : "System Administrator"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-200 text-slate-300 text-sm font-semibold border border-slate-700 hover:border-rose-900 transition-all duration-200"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Content */}
      <main className="flex-1 ml-0 lg:ml-64 p-4 md:p-8 min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 mb-8 border-b border-slate-200 gap-4">
          <div className="flex items-start gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-700 hover:text-slate-900 text-xl p-2 rounded-md hover:bg-slate-100 transition-colors mt-0.5"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Administrative Workspace Console</h2>
              <p className="text-sm text-slate-500">Register clinic profiles and inspect billing logs.</p>
            </div>
          </div>
          <a 
            href="index.html" 
            className="flex items-center gap-2 py-2 px-5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-150 shadow-sm flex-shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <i className="fa-solid fa-house"></i>
            <span>Back to Homepage</span>
          </a>
        </header>

        {/* Dynamic Route Content */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
