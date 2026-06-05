import React, { useEffect, useState } from 'react';

function ManageRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    try {
      const reqs = JSON.parse(localStorage.getItem("phh_doctor_requests")) || [];
      setRequests(reqs);
    } catch (e) {
      console.error("Error loading doctor requests:", e);
    }
  };

  useEffect(() => {
    loadRequests();

    window.addEventListener("storage", loadRequests);
    window.addEventListener("storage_local", loadRequests);
    const interval = setInterval(loadRequests, 1000);

    return () => {
      window.removeEventListener("storage", loadRequests);
      window.removeEventListener("storage_local", loadRequests);
      clearInterval(interval);
    };
  }, []);

  const handleApprove = async (docId) => {
    try {
      const apiBase = window.API_BASE || '';
      const response = await fetch(`${apiBase}/api/admin/approve-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ docId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("phh_doctors", JSON.stringify(data.doctors));
        localStorage.setItem("phh_doctor_requests", JSON.stringify(data.doctorRequests));
        
        // Dispatch event for components to pick up local changes immediately
        window.dispatchEvent(new Event("storage_local"));
        
        if (window.showSuccessToast) window.showSuccessToast(data.message || "Doctor has been successfully approved.");
        else alert(data.message || "Doctor has been successfully approved.");
      } else {
        if (window.showErrorToast) window.showErrorToast(data.message || "Failed to approve doctor request.");
        else alert(data.message || "Failed to approve doctor request.");
      }
    } catch (err) {
      console.error("Doctor approval error:", err);
      if (window.showErrorToast) window.showErrorToast("Failed to approve doctor request due to a server error.");
      else alert("Failed to approve doctor request due to a server error.");
    }
  };

  const handleReject = async (doc) => {
    const confirmed = await window.customConfirm(`Are you sure you want to reject and delete the profile registration for ${doc.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      const apiBase = window.API_BASE || '';
      const response = await fetch(`${apiBase}/api/admin/reject-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ docId: doc.id })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("phh_doctors", JSON.stringify(data.doctors));
        localStorage.setItem("phh_doctor_requests", JSON.stringify(data.doctorRequests));
        
        window.dispatchEvent(new Event("storage_local"));
        
        if (window.showSuccessToast) window.showSuccessToast(data.message || "Doctor request has been successfully rejected.");
        else alert(data.message || "Doctor request has been successfully rejected.");
      } else {
        if (window.showErrorToast) window.showErrorToast(data.message || "Failed to reject doctor request.");
        else alert(data.message || "Failed to reject doctor request.");
      }
    } catch (err) {
      console.error("Doctor rejection error:", err);
      if (window.showErrorToast) window.showErrorToast("Failed to reject doctor request due to a server error.");
      else alert("Failed to reject doctor request due to a server error.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-user-clock text-amber-500"></i>
            <span>Pending Doctor Approvals</span>
          </h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Specialist Details</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Specialty & Fee</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Schedule & Shift</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12">
                    <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-4 border border-slate-200/60">
                        <i className="fa-solid fa-user-clock"></i>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">No Pending Requests</h4>
                      <p className="text-xs text-slate-500">When new specialist doctors register via the portal, their requests will appear here for review.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 leading-none mb-1">{doc.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{doc.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950">{doc.specialty}</p>
                        <p className="text-xs text-slate-500 font-medium">Fee: ₹{doc.fee}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-middle">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-950">{doc.days}</p>
                        <p className="text-xs text-slate-500 font-medium">{doc.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 align-middle text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold transition-all duration-150 shadow-sm"
                          onClick={() => handleApprove(doc.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-all duration-150 shadow-sm"
                          onClick={() => handleReject(doc)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageRequests;
