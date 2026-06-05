import React, { useEffect, useState } from 'react';

function BookingsLog() {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = () => {
    try {
      const appts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      setAppointments(appts);
    } catch (e) {
      console.error("Error loading appointments:", e);
    }
  };

  useEffect(() => {
    loadAppointments();

    window.addEventListener("storage", loadAppointments);
    window.addEventListener("storage_local", loadAppointments);
    const interval = setInterval(loadAppointments, 1000);

    return () => {
      window.removeEventListener("storage", loadAppointments);
      window.removeEventListener("storage_local", loadAppointments);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-receipt text-blue-600"></i>
            <span>Hospital Transaction Audit Log</span>
          </h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Booking Ref</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Patient Details</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Specialist</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Specialty</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Date & Slot</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Billing Fee</th>
                <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[140px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12">
                    <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                      <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-4 border border-slate-200/60">
                        <i className="fa-solid fa-receipt"></i>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-1">No Transactions Registered</h4>
                      <p className="text-xs text-slate-500">Patient booking fee transactions and queue checkout receipts will be compiled here once they occur.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                [...appointments].reverse().map(app => {
                  let statusBadgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200/80";
                  if (app.status === "Cancelled" || app.status === "Declined") {
                    statusBadgeClass = "bg-rose-50 text-rose-700 border border-rose-200/80";
                  } else if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor" || app.status === "Ongoing") {
                    statusBadgeClass = "bg-amber-50 text-amber-700 border border-amber-200/80";
                  } else if (app.status === "Completed") {
                    statusBadgeClass = "bg-slate-50 text-slate-700 border border-slate-200/80";
                  }

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-4 px-6 align-middle font-mono text-xs font-bold text-slate-600">
                        {app.id}
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 leading-none mb-1">{app.patientName}</p>
                          <p className="text-xs text-slate-500 font-medium">{app.patientPhone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle font-bold text-slate-900">
                        {app.doctorName}
                      </td>
                      <td className="py-4 px-6 align-middle font-medium text-slate-700">
                        {app.dept}
                      </td>
                      <td className="py-4 px-6 align-middle">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950">{app.date}</p>
                          <p className="text-xs text-slate-500 font-medium">{app.slot}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 align-middle font-bold text-slate-900">
                        ₹{app.fee}
                      </td>
                      <td className="py-4 px-6 align-middle text-center">
                        <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full ${statusBadgeClass}`}>
                          {app.status === "Confirmed" ? "UPCOMING" : app.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingsLog;
