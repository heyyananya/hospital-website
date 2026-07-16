import React, { useEffect, useState } from 'react';

function OverviewPanel() {
  const [revenue, setRevenue] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const loadStats = () => {
    try {
      const appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      const doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];

      const totalRevenue = appointments.reduce((acc, app) => {
        const isActive = ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor", "Completed"].includes(app.status);
        return acc + (isActive ? (Number(app.fee) || 0) : 0);
      }, 0);

      setRevenue(totalRevenue);
      setBookingsCount(appointments.length);
      setDoctorsCount(doctors.length);
    } catch (e) {
      console.error("Error loading overview stats:", e);
    }
  };

  useEffect(() => {
    loadStats();
    
    try {
      const user = JSON.parse(localStorage.getItem("phh_current_user"));
      setCurrentUser(user);
    } catch (e) {
      console.error("Error loading current user in overview:", e);
    }

    window.addEventListener("storage", loadStats);
    window.addEventListener("storage_local", loadStats);
    const interval = setInterval(loadStats, 1000);

    return () => {
      window.removeEventListener("storage", loadStats);
      window.removeEventListener("storage_local", loadStats);
      clearInterval(interval);
    };
  }, []);

  const handleAddDept = async (e) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    try {
      const apiBase = window.API_BASE || "";
      const token = localStorage.getItem("phh_jwt_token");
      const response = await fetch(`${apiBase}/api/admin/add-department`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: deptName.trim(),
          description: deptDesc.trim()
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem("phh_departments", JSON.stringify(data.departments));
        window.dispatchEvent(new Event("storage_local"));
        
        setDeptName("");
        setDeptDesc("");
        if (window.showSuccessToast) {
          window.showSuccessToast(`Department "${deptName}" added successfully!`);
        } else {
          setMessage(`Department "${deptName}" added successfully!`);
          setIsError(false);
          setTimeout(() => setMessage(""), 5000);
        }
      } else {
        if (window.showErrorToast) {
          window.showErrorToast(data.message || "Failed to add department.");
        } else {
          setMessage(data.message || "Failed to add department.");
          setIsError(true);
        }
      }
    } catch (err) {
      console.error("Add department error:", err);
      if (window.showErrorToast) {
        window.showErrorToast("Failed to connect to the server.");
      } else {
        setMessage("Failed to connect to the server.");
        setIsError(true);
      }
    }
  };

  return (
    <div className="dashboard-body-panel active">
      <div className="db-stats-grid" style={{ width: '100%', maxWidth: 'none', margin: '0 0 35px' }}>
        <div className="glass-card db-stat-card">
          <div className="db-stat-icon" style={{ color: 'var(--status-available)', background: 'rgba(16, 185, 129, 0.08)' }}>
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div className="db-stat-info">
            <h4>₹{revenue}</h4>
            <p>Consultations Revenue</p>
          </div>
        </div>
        
        <div className="glass-card db-stat-card">
          <div className="db-stat-icon">
            <i className="fa-solid fa-hospital-user"></i>
          </div>
          <div className="db-stat-info">
            <h4>{bookingsCount}</h4>
            <p>Cumulative Bookings</p>
          </div>
        </div>

        <div className="glass-card db-stat-card">
          <div className="db-stat-icon" style={{ color: 'var(--status-late)', background: 'rgba(245, 158, 11, 0.08)' }}>
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div className="db-stat-info">
            <h4>{doctorsCount}</h4>
            <p>Enrolled Specialists</p>
          </div>
        </div>
      </div>

      {/* Chief Admin Console - Add Department Form */}
      {currentUser && (currentUser.username === 'ajit' || currentUser.name === 'Dr. Ajit B. Patel' || currentUser.id === '1') && (
        <div className="glass-card" style={{ padding: '25px', borderRadius: '12px', border: '1px solid rgba(0, 102, 255, 0.1)', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)' }}>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2" style={{ margin: 0 }}>
            <i className="fa-solid fa-folder-plus text-blue-600"></i>
            <span>Chief Admin Console: Add New Department</span>
          </h3>
          <p className="text-xs text-slate-500 mb-6" style={{ margin: '4px 0 20px' }}>Create new medical departments and specialties. These will dynamically update registration and scheduling across all panels.</p>
          
          <form onSubmit={handleAddDept} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-[20px]">
              <div className={`form-group ${deptName ? 'filled' : ''} ${focusedField === 'deptName' ? 'focused' : ''}`} style={{ position: 'relative', margin: 0 }}>
                <input 
                  type="text" 
                  className="form-control" 
                  value={deptName} 
                  onChange={e => setDeptName(e.target.value)}
                  onFocus={() => setFocusedField('deptName')}
                  onBlur={() => setFocusedField('')}
                  required 
                />
                <label className="floating-label">Department Name</label>
              </div>

              <div className={`form-group ${deptDesc ? 'filled' : ''} ${focusedField === 'deptDesc' ? 'focused' : ''}`} style={{ position: 'relative', margin: 0 }}>
                <input 
                  type="text" 
                  className="form-control" 
                  value={deptDesc} 
                  onChange={e => setDeptDesc(e.target.value)}
                  onFocus={() => setFocusedField('deptDesc')}
                  onBlur={() => setFocusedField('')}
                />
                <label className="floating-label">Description (Optional)</label>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
              {message && (
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isError ? '#ef4444' : '#10b981' }}>
                  {message}
                </div>
              )}
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ 
                  marginLeft: 'auto', 
                  padding: '10px 24px', 
                  fontSize: '0.85rem', 
                  fontWeight: '700',
                  borderRadius: '6px',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Create Department
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default OverviewPanel;
