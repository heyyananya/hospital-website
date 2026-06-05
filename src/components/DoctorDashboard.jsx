import React, { useState, useEffect } from 'react';

const MAX_DAILY_BOOKINGS = 10;

const getApiBase = () => {
  if (typeof window !== 'undefined' && window.API_BASE !== undefined) {
    return window.API_BASE;
  }
  const h = window.location.hostname;
  const p = window.location.port;
  const local = h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.') || h.startsWith('172.') || h.endsWith('.local');
  return (local && p !== '5000') ? `http://${h}:5000` : '';
};

export default function DoctorDashboard() {
  // 1. Session verification & states
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("phh_current_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!currentUser || currentUser.role !== "doctor") {
      alert("Session expired or unauthorized portal access. Redirecting to secure gateway.").then(() => {
        window.location.href = "portal-login.html";
      });
    }
  }, [currentUser]);

  const [doctors, setDoctors] = useState(() => JSON.parse(localStorage.getItem("phh_doctors")) || []);
  const [appointments, setAppointments] = useState(() => JSON.parse(localStorage.getItem("phh_appointments")) || []);
  const [slots, setSlots] = useState(() => JSON.parse(localStorage.getItem("phh_slots")) || []);

  const [activeTab, setActiveTab] = useState("doc-patients");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Search, Filter & Pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal states
  const [selectedAppt, setSelectedAppt] = useState(null); // View Details Modal
  const [rescheduleAppt, setRescheduleAppt] = useState(null); // Reschedule Modal (Appt Object)
  const [reschedDate, setReschedDate] = useState("");
  const [reschedSlot, setReschedSlot] = useState("");
  const [reschedReason, setReschedReason] = useState("");
  const [cancelConfirmAppt, setCancelConfirmAppt] = useState(null); // Cancel Confirmation Modal (Appt Object)
  
  const [bulkReschedDate, setBulkReschedDate] = useState(""); // Bulk Reschedule Modal Date
  const [bulkTargetDate, setBulkTargetDate] = useState("");
  const [bulkReason, setBulkReason] = useState("");

  // Timing states
  const [profileStart, setProfileStart] = useState("");
  const [profileEnd, setProfileEnd] = useState("");
  const [newVisitingDate, setNewVisitingDate] = useState("");
  const [liveStatus, setLiveStatus] = useState("Available");

  // Get active doctor ID
  const getActiveDocId = () => {
    if (!currentUser) return "";
    const activeDoc = doctors.find(d => d && (d.id === (currentUser.docId || currentUser.id) || d.name === currentUser.name || d.email === currentUser.email));
    return activeDoc ? activeDoc.id : (currentUser.docId || currentUser.id);
  };

  const activeDocId = getActiveDocId();

  // Search Patients by Date states
  const [searchDate, setSearchDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [searchPatients, setSearchPatients] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchPatientName, setSearchPatientName] = useState("");
  const [searchStatusFilter, setSearchStatusFilter] = useState("All");
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const searchPageSize = 5;

  const fetchPatientsByDate = async (targetDate) => {
    const dateToSearch = targetDate || searchDate;
    if (!dateToSearch) {
      setSearchError("Please select a valid date.");
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    try {
      const apiBase = getApiBase();
      const headers = {
        'Authorization': `Bearer ${activeDocId}`,
        'Content-Type': 'application/json'
      };
      const response = await fetch(`${apiBase}/api/doctor/appointments-by-date?date=${dateToSearch}`, {
        headers
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchPatients(data.patients || []);
        setSearchCurrentPage(1); // Reset to first page
      } else {
        setSearchError(data.message || "Failed to fetch patient bookings.");
        setSearchPatients([]);
      }
    } catch (err) {
      console.error("Error fetching appointments by date:", err);
      setSearchError("Database connection failed. Please ensure the backend server is active.");
      setSearchPatients([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "doc-search-by-date" && activeDocId) {
      fetchPatientsByDate(searchDate);
    }
  }, [activeTab, activeDocId]);

  // Filter search patients locally by name and status
  const filteredSearchPatients = searchPatients.filter(p => {
    const matchesName = p.patientName.toLowerCase().includes(searchPatientName.toLowerCase());
    const matchesStatus = searchStatusFilter === "All" || p.status === searchStatusFilter;
    return matchesName && matchesStatus;
  });

  // Paginate search results
  const searchTotalPages = Math.ceil(filteredSearchPatients.length / searchPageSize) || 1;
  const paginatedSearchPatients = filteredSearchPatients.slice(
    (searchCurrentPage - 1) * searchPageSize,
    searchCurrentPage * searchPageSize
  );

  const handlePrintAndPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Popup blocker enabled. Please allow popups to print/export.");
      return;
    }
    const htmlContent = `
      <html>
        <head>
          <title>Patient List - ${searchDate}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; }
            h2 { color: #1e3a8a; margin-bottom: 5px; font-weight: 800; }
            p { color: #64748b; font-size: 0.9rem; margin-top: 0; margin-bottom: 25px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px 16px; text-align: left; font-size: 0.85rem; }
            th { background-color: #f8fafc; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; }
            td { color: #334155; }
            tr:nth-child(even) { background-color: #f8fafc; }
          </style>
        </head>
        <body>
          <h2>Patient List - Superspeciality Doctors Consultation</h2>
          <p>Selected Appointment Date: <strong>${searchDate}</strong> &nbsp;|&nbsp; Total Bookings: <strong>${filteredSearchPatients.length}</strong></p>
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone Number</th>
                <th>Symptoms</th>
                <th>Appointment Time</th>
                <th>Payment Status</th>
                <th>Appointment Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSearchPatients.map(p => `
                <tr>
                  <td><strong>${p.patientName}</strong></td>
                  <td>${p.patientPhone || 'Not Available'}</td>
                  <td>${p.symptoms || 'No Symptoms Mentioned'}</td>
                  <td>${p.slot || 'Pending'}</td>
                  <td>₹${p.fee} (Paid)</td>
                  <td>${p.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top: 50px; display: flex; justify-content: flex-end; page-break-inside: avoid;">
            <div style="text-align: center; width: 220px;">
              <div style="border-bottom: 1px solid #94a3b8; margin-bottom: 8px; height: 45px;"></div>
              <p style="font-size: 0.85rem; font-weight: 700; color: #475569; margin: 0;">Chief Admin</p>
              <p style="font-size: 0.75rem; color: #94a3b8; margin: 2px 0 0 0;">Authorized Signature</p>
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportCSV = () => {
    const headers = ["Patient Name", "Phone Number", "Symptoms", "Appointment Time", "Payment Status", "Appointment Status"];
    const rows = filteredSearchPatients.map(p => [
      p.patientName,
      p.patientPhone || 'Not Available',
      p.symptoms || 'No Symptoms Mentioned',
      p.slot || 'Pending',
      `₹${p.fee}`,
      p.status
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patient_list_${searchDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load state on storage events and set status initial states
  useEffect(() => {
    const handleSync = () => {
      const docs = JSON.parse(localStorage.getItem("phh_doctors")) || [];
      const appts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      const slts = JSON.parse(localStorage.getItem("phh_slots")) || [];
      setDoctors(docs);
      setAppointments(appts);
      setSlots(slts);
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("storage_local", handleSync);

    const interval = setInterval(handleSync, 2000);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("storage_local", handleSync);
      clearInterval(interval);
    };
  }, []);

  // Initialize form controls once doctor details are loaded
  useEffect(() => {
    const doc = doctors.find(d => d && d.id === activeDocId);
    if (doc) {
      setLiveStatus(doc.status || "Available");
      const timings = parseTimeRangeTo24h(doc.time);
      setProfileStart(timings.start);
      setProfileEnd(timings.end);
    }
  }, [doctors, activeDocId]);

  // Helper: Format hours profile
  const parseTimeRangeTo24h = (timeStr) => {
    if (!timeStr) return { start: "10:00", end: "17:00" };
    const parts = timeStr.split("-").map(p => p.trim());
    if (parts.length !== 2) return { start: "10:00", end: "17:00" };
    
    function convertTo24h(time12h) {
      const match = time12h.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
      if (!match) return "10:00";
      let hours = parseInt(match[1], 10);
      const minutes = match[2] ? match[2] : "00";
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      const hoursStr = hours < 10 ? "0" + hours : hours;
      return `${hoursStr}:${minutes}`;
    }
    
    return {
      start: convertTo24h(parts[0]),
      end: convertTo24h(parts[1])
    };
  };

  const convertTo12h = (time24h) => {
    if (!time24h) return "10:00 AM";
    const [hoursStr, minutesStr] = time24h.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutesStr} ${ampm}`;
  };



  // Helper to format date as YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Parse time slots to get end time of appointment
  const parseSlotEndDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    let endTimePart = "5:00 PM";
    if (timeStr && timeStr.includes("-")) {
      const parts = timeStr.split("-");
      endTimePart = parts[1].trim();
    } else if (timeStr) {
      endTimePart = timeStr.trim();
    }

    const match = endTimePart.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
    let hours = 17;
    let minutes = 0;
    
    if (match) {
      hours = parseInt(match[1], 10);
      minutes = match[2] ? parseInt(match[2], 10) : 0;
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
    }

    const dateObj = new Date(year, month - 1, day, hours, minutes, 0, 0);
    
    let startTimeHour = 10;
    if (timeStr && timeStr.includes("-")) {
      const startPart = timeStr.split("-")[0].trim();
      const startMatch = startPart.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
      if (startMatch) {
        startTimeHour = parseInt(startMatch[1], 10);
        const startAmPm = startMatch[3].toUpperCase();
        if (startAmPm === "PM" && startTimeHour < 12) startTimeHour += 12;
        if (startAmPm === "AM" && startTimeHour === 12) startTimeHour = 0;
      }
    }

    if (hours < startTimeHour) {
      dateObj.setDate(dateObj.getDate() + 1);
    }

    return dateObj;
  };

  // 2. Tab filtering and calculations
  const myAppointments = appointments.filter(app => 
    app && ((app.doctorId && app.doctorId === activeDocId) || (app.doctorName === currentUser?.name))
  );

  const todayCount = myAppointments.length;
  const pendingCount = myAppointments.filter(a => a && ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor", "Pending"].includes(a.status)).length;
  const completedCount = myAppointments.filter(a => a && a.status === "Completed").length;

  // Filtered Appointments
  const filteredAppointments = myAppointments.filter(app => {
    const nameMatch = app.patientName?.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = app.patientPhone?.includes(searchTerm);
    const symptomsMatch = app.symptoms?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = app.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const queryMatch = nameMatch || phoneMatch || symptomsMatch || idMatch;

    if (statusFilter === "All") return queryMatch;
    
    const normalizedAppStatus = app.status === "Confirmed" ? "Upcoming" : app.status;
    return queryMatch && (normalizedAppStatus === statusFilter);
  });

  // Pagination Math
  const totalItems = filteredAppointments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Synchronizers
  const saveAppointments = (newAppts) => {
    setAppointments(newAppts);
    localStorage.setItem("phh_appointments", JSON.stringify(newAppts));
    window.dispatchEvent(new Event("storage_local"));
  };

  const saveSlots = (newSlots) => {
    setSlots(newSlots);
    localStorage.setItem("phh_slots", JSON.stringify(newSlots));
    window.dispatchEvent(new Event("storage_local"));
  };

  // Actions
  const handleSaveFixedHours = async (e) => {
    e.preventDefault();
    if (!profileStart || !profileEnd) {
      alert("Please select default start and end times.");
      return;
    }

    const start12 = convertTo12h(profileStart);
    const end12 = convertTo12h(profileEnd);
    const newTimingsRange = `${start12} - ${end12}`;

    const docIdx = doctors.findIndex(d => d && d.id === activeDocId);
    if (docIdx === -1) {
      alert("Could not find your doctor profile in the system.");
      return;
    }

    try {
      const updatedDoctors = [...doctors];
      updatedDoctors[docIdx] = { ...updatedDoctors[docIdx], time: newTimingsRange };

      const updatedSlots = slots.map(s => {
        if (s && s.doctorId === activeDocId) {
          return { ...s, time: newTimingsRange };
        }
        return s;
      });

      const apiBase = getApiBase();
      
      const resDocs = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_doctors', data: updatedDoctors })
      });
      const docsData = await resDocs.json();

      if (!resDocs.ok || !docsData.success) {
        throw new Error(docsData.error || "Failed to save doctor timings.");
      }

      const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
      });
      const slotsData = await resSlots.json();

      if (!resSlots.ok || !slotsData.success) {
        throw new Error(slotsData.error || "Failed to save updated visiting date timings.");
      }

      setDoctors(updatedDoctors);
      localStorage.setItem("phh_doctors", JSON.stringify(updatedDoctors));
      saveSlots(updatedSlots);

      if (window.showSuccessToast) window.showSuccessToast("Fixed consultation hours saved successfully!");
      else alert("Fixed consultation hours saved successfully!");
    } catch (err) {
      console.error(err);
      if (window.showErrorToast) window.showErrorToast(err.message || "Failed to save timings. Please verify your connection.");
      else alert(err.message || "Failed to save timings. Please verify your connection.");
    }
  };

  const handleAddVisitingDate = async (e) => {
    e.preventDefault();
    if (!newVisitingDate) {
      alert("Please select a visiting date.");
      return;
    }

    const [yr, mo, dy] = newVisitingDate.split('-').map(Number);
    const selectedLocalDate = new Date(yr, mo - 1, dy);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (selectedLocalDate < today) {
      alert("Cannot add past dates to the calendar.");
      return;
    }

    const currentDoc = doctors.find(d => d && d.id === activeDocId);
    const docTime = currentDoc?.time || "10:00 AM - 05:00 PM";

    if (slots.some(s => s && s.doctorId === activeDocId && s.date === newVisitingDate)) {
      alert("This visiting date is already added to your calendar.");
      return;
    }

    const newSlot = {
      id: `slot-${activeDocId}-${newVisitingDate}`,
      doctorId: activeDocId,
      doctorName: currentUser?.name || "Doctor",
      date: newVisitingDate,
      time: docTime,
      status: "Available",
      bookingId: ""
    };

    const updatedSlots = [...slots, newSlot];

    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
      });
      const resData = await response.json();

      if (response.ok && resData.success) {
        saveSlots(updatedSlots);
        if (window.showSuccessToast) window.showSuccessToast("Visiting date added successfully.");
        else alert("Visiting date added successfully.");
        setNewVisitingDate("");
      } else {
        throw new Error(resData.error || "Failed to save slot.");
      }
    } catch (err) {
      console.error(err);
      if (window.showErrorToast) window.showErrorToast(err.message || "Failed to add date. Please check connection.");
      else alert(err.message || "Failed to add date. Please check connection.");
    }
  };

  const handleToggleSlotAvailability = (slot) => {
    const updatedSlots = slots.map(s => {
      if (s && s.id === slot.id) {
        return { ...s, status: s.status === "Available" ? "Closed" : "Available" };
      }
      return s;
    });
    saveSlots(updatedSlots);
  };

  const handleDeleteSlotDate = async (slot) => {
    const confirmed = await window.customConfirm(`Are you sure you want to delete ${slot.date} from your visiting dates?`);
    if (confirmed) {
      const updatedSlots = slots.filter(s => s && s.id !== slot.id);
      saveSlots(updatedSlots);
    }
  };

  const handleUpdateAvailabilityStatus = async () => {
    let docIdx = doctors.findIndex(d => d && d.id === activeDocId);
    if (docIdx === -1) {
      docIdx = doctors.findIndex(d => d && (d.name === currentUser?.name || d.email === currentUser?.email));
    }
    if (docIdx !== -1) {
      const updatedDoctors = [...doctors];
      updatedDoctors[docIdx].status = liveStatus;

      try {
        const apiBase = getApiBase();
        const res = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_doctors', data: updatedDoctors })
        });
        if (res.ok) {
          setDoctors(updatedDoctors);
          localStorage.setItem("phh_doctors", JSON.stringify(updatedDoctors));
          window.dispatchEvent(new Event("storage_local"));
          if (window.showSuccessToast) window.showSuccessToast(`Live availability badge updated to: ${liveStatus}`);
          else alert(`Live availability badge updated to: ${liveStatus}`);
        } else {
          if (window.showErrorToast) window.showErrorToast("Failed to sync availability update.");
          else alert("Failed to sync availability update.");
        }
      } catch (err) {
        console.error(err);
        if (window.showErrorToast) window.showErrorToast("Failed to sync availability update due to server connection issues.");
        else alert("Failed to sync availability update due to server connection issues.");
      }
    }
  };

  // Reschedule Logic
  const handleOpenRescheduleModal = (appt) => {
    setRescheduleAppt(appt);
    setReschedDate("");
    setReschedSlot("");
    setReschedReason("");
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleAppt || !reschedDate || !reschedSlot || !reschedReason) {
      alert("Please fill in all details.");
      return;
    }

    const appIdx = appointments.findIndex(a => a && a.id === rescheduleAppt.id);
    if (appIdx === -1) {
      alert("Appointment not found.");
      return;
    }

    const oldDate = rescheduleAppt.date;
    const oldTime = rescheduleAppt.slot;

    // Validate past dates
    const todayStr = getTodayDateString();
    if (reschedDate < todayStr) {
      alert("Cannot reschedule to a past date.");
      return;
    }

    // Check doctor availability on that date
    const slotRecord = slots.find(s => s && s.doctorId === activeDocId && s.date === reschedDate && s.status === "Available");
    if (!slotRecord) {
      alert("You are not available on the selected date.");
      return;
    }

    // Check capacity
    const activeBookingsCount = appointments.filter(a => 
      a && a.doctorId === activeDocId && a.date === reschedDate && a.status !== "Cancelled" && a.id !== rescheduleAppt.id
    ).length;

    if (activeBookingsCount >= MAX_DAILY_BOOKINGS) {
      alert("Target slot date is fully booked.");
      return;
    }

    const newTotalBookings = activeBookingsCount + 1;
    const updatedSlots = slots.map(s => {
      if (s && s.doctorId === activeDocId) {
        if (s.date === reschedDate && newTotalBookings >= MAX_DAILY_BOOKINGS) {
          return { ...s, status: "Fully Booked" };
        }
        if (s.date === oldDate) {
          const oldDateActiveCount = appointments.filter(a => a && a.doctorId === activeDocId && a.date === oldDate && a.status !== "Cancelled" && a.id !== rescheduleAppt.id).length;
          if (oldDateActiveCount < MAX_DAILY_BOOKINGS && s.status === "Fully Booked") {
            return { ...s, status: "Available" };
          }
        }
      }
      return s;
    });

    try {
      const updatedAppointments = [...appointments];
      updatedAppointments[appIdx] = {
        ...updatedAppointments[appIdx],
        status: "Rescheduled by Doctor",
        date: reschedDate,
        slot: reschedSlot,
        rescheduleReason: reschedReason,
        oldSlot: `${oldDate} (${oldTime})`,
        newSlot: `${reschedDate} (${reschedSlot})`,
        rescheduledBy: currentUser?.name || "Doctor",
        rescheduledAt: new Date().toISOString()
      };

      const apiBase = getApiBase();

      const resAppts = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_appointments', data: updatedAppointments })
      });
      const apptsData = await resAppts.json();

      if (!resAppts.ok || !apptsData.success) {
        throw new Error(apptsData.error || "Failed to save rescheduled appointment.");
      }

      const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
      });
      const slotsData = await resSlots.json();

      if (!resSlots.ok || !slotsData.success) {
        throw new Error(slotsData.error || "Failed to save slot updates.");
      }

      saveAppointments(updatedAppointments);
      saveSlots(updatedSlots);
      setRescheduleAppt(null);
      if (window.showSuccessToast) window.showSuccessToast(`Appointment successfully rescheduled.`);
      else alert(`Appointment successfully rescheduled.`);
    } catch (err) {
      console.error(err);
      if (window.showErrorToast) window.showErrorToast(err.message || "Failed to reschedule appointment.");
      else alert(err.message || "Failed to reschedule appointment.");
    }
  };

  // Cancel Appointment Logic
  const handleCancelAppointment = async () => {
    if (!cancelConfirmAppt) return;
    const appIdx = appointments.findIndex(a => a && a.id === cancelConfirmAppt.id);
    if (appIdx === -1) {
      alert("Appointment not found.");
      return;
    }

    try {
      const updatedAppointments = [...appointments];
      updatedAppointments[appIdx] = {
        ...updatedAppointments[appIdx],
        status: "Cancelled"
      };

      // Open slot capacity back up if necessary
      const activeBookingsCount = updatedAppointments.filter(a => 
        a && a.doctorId === activeDocId && a.date === cancelConfirmAppt.date && a.status !== "Cancelled"
      ).length;

      const updatedSlots = slots.map(s => {
        if (s && s.doctorId === activeDocId && s.date === cancelConfirmAppt.date && activeBookingsCount < MAX_DAILY_BOOKINGS && s.status === "Fully Booked") {
          return { ...s, status: "Available" };
        }
        return s;
      });

      const apiBase = getApiBase();

      const resAppts = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_appointments', data: updatedAppointments })
      });
      const apptsData = await resAppts.json();

      if (!resAppts.ok || !apptsData.success) {
        throw new Error(apptsData.error || "Failed to update cancellation.");
      }

      const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
      });
      const slotsData = await resSlots.json();

      if (!resSlots.ok || !slotsData.success) {
        throw new Error(slotsData.error || "Failed to sync slot state.");
      }

      saveAppointments(updatedAppointments);
      saveSlots(updatedSlots);
      setCancelConfirmAppt(null);
      if (window.showSuccessToast) window.showSuccessToast(`Appointment successfully cancelled.`);
      else alert(`Appointment successfully cancelled.`);
    } catch (err) {
      console.error(err);
      if (window.showErrorToast) window.showErrorToast(err.message || "Failed to cancel appointment.");
      else alert(err.message || "Failed to cancel appointment.");
    }
  };

  // Bulk Reschedule Logic
  const handleOpenBulkRescheduleModal = (dateStr) => {
    const pendingAppsOnDate = appointments.filter(a => 
      a && a.doctorId === activeDocId && a.date === dateStr && !a.diagnosis && a.status !== 'Cancelled' && a.status !== 'Completed'
    );
    if (pendingAppsOnDate.length === 0) {
      alert("No pending appointments found on this date to reschedule.");
      return;
    }
    setBulkReschedDate(dateStr);
    setBulkTargetDate("");
    setBulkReason("");
  };

  const handleBulkRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!bulkReschedDate || !bulkTargetDate || !bulkReason) {
      alert("Please fill in all details.");
      return;
    }

    const pendingApps = appointments.filter(a => 
      a && a.doctorId === activeDocId && a.date === bulkReschedDate && !a.diagnosis && a.status !== 'Cancelled' && a.status !== 'Completed'
    );

    const targetSlot = slots.find(s => s && s.doctorId === activeDocId && s.date === bulkTargetDate && s.status === "Available");
    if (!targetSlot) {
      alert("You are not available on the selected target date.");
      return;
    }

    const activeBookingsCount = appointments.filter(a => 
      a && a.doctorId === activeDocId && a.date === bulkTargetDate && a.status !== "Cancelled"
    ).length;

    if ((activeBookingsCount + pendingApps.length) > MAX_DAILY_BOOKINGS) {
      alert("Target date does not have enough capacity for all appointments.");
      return;
    }

    const targetTimeRange = targetSlot.time;
    const newTotalBookings = activeBookingsCount + pendingApps.length;

    const updatedSlots = slots.map(s => {
      if (s && s.doctorId === activeDocId) {
        if (s.date === bulkTargetDate && newTotalBookings >= MAX_DAILY_BOOKINGS) {
          return { ...s, status: "Fully Booked" };
        }
        if (s.date === bulkReschedDate) {
          return { ...s, status: "Available" };
        }
      }
      return s;
    });

    try {
      const updatedAppointments = [...appointments];
      pendingApps.forEach(app => {
        const appIdx = updatedAppointments.findIndex(a => a && a.id === app.id);
        if (appIdx !== -1) {
          updatedAppointments[appIdx] = {
            ...updatedAppointments[appIdx],
            status: "Rescheduled by Doctor",
            date: bulkTargetDate,
            slot: targetTimeRange,
            rescheduleReason: bulkReason,
            oldSlot: `${bulkReschedDate} (${app.slot})`,
            newSlot: `${bulkTargetDate} (${targetTimeRange})`,
            rescheduledBy: currentUser?.name || "Doctor",
            rescheduledAt: new Date().toISOString()
          };
        }
      });

      const apiBase = getApiBase();

      const resAppts = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_appointments', data: updatedAppointments })
      });
      const apptsData = await resAppts.json();

      if (!resAppts.ok || !apptsData.success) {
        throw new Error(apptsData.error || "Failed to save rescheduled appointments.");
      }

      const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
      });
      const slotsData = await resSlots.json();

      if (!resSlots.ok || !slotsData.success) {
        throw new Error(slotsData.error || "Failed to update visiting date slot statuses.");
      }

      saveAppointments(updatedAppointments);
      saveSlots(updatedSlots);
      setBulkReschedDate("");
      if (window.showSuccessToast) window.showSuccessToast(`Successfully rescheduled ${pendingApps.length} appointments to ${bulkTargetDate}.`);
      else alert(`Successfully rescheduled ${pendingApps.length} appointments to ${bulkTargetDate}.`);
    } catch (err) {
      console.error(err);
      if (window.showErrorToast) window.showErrorToast(err.message || "Failed to bulk reschedule appointments.");
      else alert(err.message || "Failed to bulk reschedule appointments.");
    }
  };



  const handleLogout = async () => {
    const confirmed = await window.customConfirm("Are you sure you want to log out of the Doctor Workstation?");
    if (confirmed) {
      localStorage.removeItem("phh_current_user");
      window.location.href = "portal-login.html";
    }
  };

  // Get status color coding helper
  const getStatusBadgeClass = (status) => {
    const s = status === "Confirmed" ? "Upcoming" : status;
    switch (s) {
      case "Upcoming":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/80";
      case "Completed":
        return "bg-blue-50 text-blue-700 border border-blue-200/80";
      case "Cancelled":
      case "Declined":
        return "bg-rose-50 text-rose-700 border border-rose-200/80";
      case "Pending":
      case "Rescheduled":
      case "Rescheduled by Doctor":
        return "bg-amber-50 text-amber-700 border border-amber-200/80";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200/80";
    }
  };

  // Get dynamic dates list for reschedule dates selection
  const getRescheduleAvailableDates = (excludeBookingId) => {
    const todayStr = getTodayDateString();
    return slots.filter(s => {
      if (!s) return false;
      if (s.doctorId !== activeDocId || s.status !== "Available") return false;
      if (s.date < todayStr) return false;

      const activeBookingsCount = appointments.filter(a => 
        a && a.doctorId === activeDocId && a.date === s.date && a.status !== "Cancelled" && a.id !== excludeBookingId
      ).length;

      return activeBookingsCount < MAX_DAILY_BOOKINGS;
    });
  };

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
            <button
              onClick={() => { setActiveTab("doc-home"); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 w-full text-left ${activeTab === 'doc-home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fa-solid fa-house-medical text-base"></i>
              <span>Home Console</span>
            </button>

            <button
              onClick={() => { setActiveTab("doc-patients"); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 w-full text-left ${activeTab === 'doc-patients' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fa-solid fa-users-line text-base"></i>
              <span>Patient List</span>
            </button>

            <button
              onClick={() => { setActiveTab("doc-schedule"); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 w-full text-left ${activeTab === 'doc-schedule' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fa-solid fa-calendar-check text-base"></i>
              <span>Schedule Manager</span>
            </button>

            <button
              onClick={() => { setActiveTab("doc-status"); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 w-full text-left ${activeTab === 'doc-status' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fa-solid fa-user-clock text-base"></i>
              <span>Status Panel</span>
            </button>

            <button
              onClick={() => { setActiveTab("doc-search-by-date"); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 w-full text-left ${activeTab === 'doc-search-by-date' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className="fa-solid fa-calendar-day text-base"></i>
              <span>Search by Date</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg border border-slate-700">
              {currentUser?.name ? currentUser.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'DR'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser?.name || "Dr. Rajesh Shah"}</p>
              <p className="text-xs text-slate-400 truncate">Visiting Specialist</p>
              <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 ${liveStatus === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : liveStatus === 'Busy' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                {liveStatus}
              </span>
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
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">Welcome, Doctor!</h2>
              <p className="text-sm text-slate-500">View patient details, manage appointments, and view your schedule.</p>
            </div>
          </div>
          <a
            href="index.html"
            className="flex items-center gap-2 py-2 px-5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all duration-150 shadow-sm flex-shrink-0"
          >
            <i className="fa-solid fa-house"></i>
            <span>Back to Homepage</span>
          </a>
        </header>

        {/* Tab: Home */}
        {activeTab === "doc-home" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-calendar-day"></i>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900">{todayCount}</h4>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Bookings Today</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-spinner animate-spin"></i>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900">{pendingCount}</h4>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Consultations</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
                <div className="w-14 h-14 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-slate-900">{completedCount}</h4>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Diagnosed Visits</p>
                </div>
              </div>
            </div>


          </div>
        )}

        {/* Tab: Patient List (Appointment Worklist) */}
        {activeTab === "doc-patients" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header + Search/Filter Panel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Appointment Worklist</h3>
                
                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <i className="fa-solid fa-magnifying-glass text-xs"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search patient, phone, symptoms..."
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 min-w-[240px]"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="py-2 pl-3 pr-8 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs w-[120px]">Patient ID</th>
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Patient Details</th>
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Appt Date & Slot</th>
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs max-w-[200px]">Symptoms</th>
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-right">Payment</th>
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[130px]">Appt Status</th>
                      <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[120px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12">
                          <div className="flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                            <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-2xl mb-4 border border-slate-200/60">
                              <i className="fa-solid fa-calendar-xmark"></i>
                            </div>
                            <h4 className="text-base font-bold text-slate-900 mb-1">No Consultations Found</h4>
                            <p className="text-xs text-slate-500">No appointments fit the chosen filter or search query. Re-adjust filters or configure visiting shifts inside calendar tab.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedAppointments.map(app => {
                        return (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                            {/* Patient ID */}
                            <td className="py-4 px-6 font-bold align-middle">
                              <span className="inline-block px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold tracking-wider">
                                {app.id || "N/A"}
                              </span>
                            </td>

                            {/* Patient Details */}
                            <td className="py-4 px-6 align-middle">
                              <div className="space-y-1">
                                <p className="font-bold text-slate-900 leading-none">{app.patientName || "Guest Patient"}</p>
                                <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                                  <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-phone text-[10px] w-3 text-slate-400"></i>
                                    <span>{app.patientPhone || "Not Provided"}</span>
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <i className="fa-solid fa-envelope text-[10px] w-3 text-slate-400"></i>
                                    <span className="truncate">{app.patientEmail && app.patientEmail !== 'N/A' ? app.patientEmail : "Not Provided"}</span>
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Appointment Date & Time */}
                            <td className="py-4 px-6 align-middle">
                              <div className="space-y-0.5">
                                <p className="font-bold text-slate-950">{app.date || "Not Available"}</p>
                                <p className="text-xs text-slate-500 font-medium">{app.slot || "Not Assigned"}</p>
                              </div>
                            </td>

                            {/* Symptoms */}
                            <td className="py-4 px-6 align-middle max-w-[200px]">
                              <p className="text-xs text-slate-600 line-clamp-2" title={app.symptoms || "No Symptoms Provided"}>
                                {app.symptoms || "No Symptoms Provided"}
                              </p>
                            </td>

                            {/* Payment */}
                            <td className="py-4 px-6 align-middle text-right">
                              <div className="space-y-0.5">
                                <p className="font-black text-emerald-600">₹{app.fee || "0"}</p>
                                <code className="text-[10px] text-slate-400 font-mono tracking-tighter" title={app.payId || "OFFLINE_CASH"}>
                                  {app.payId && app.payId !== 'N/A' ? app.payId : "OFFLINE_CASH"}
                                </code>
                              </div>
                            </td>

                            {/* Appointment Status */}
                            <td className="py-4 px-6 align-middle text-center">
                              <span className={`badge-status text-[10px] font-extrabold px-2.5 py-1 rounded-full ${getStatusBadgeClass(app.status)}`}>
                                {app.status === "Confirmed" ? "Upcoming" : app.status || "Pending"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 align-middle text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setSelectedAppt(app)}
                                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition-colors duration-150"
                                  title="View Details"
                                >
                                  <i className="fa-solid fa-eye text-xs"></i>
                                </button>
                                
                                {app.status !== "Cancelled" && app.status !== "Completed" && (
                                  <>
                                    <button
                                      onClick={() => handleOpenRescheduleModal(app)}
                                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 text-slate-600 flex items-center justify-center border border-slate-200 transition-all duration-150"
                                      title="Reschedule"
                                    >
                                      <i className="fa-solid fa-clock-rotate-left text-xs"></i>
                                    </button>
                                    
                                    <button
                                      onClick={() => setCancelConfirmAppt(app)}
                                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 flex items-center justify-center border border-slate-200 transition-all duration-150"
                                      title="Cancel Appointment"
                                    >
                                      <i className="fa-solid fa-xmark text-xs"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination bar */}
              {totalItems > 0 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">
                    Showing <strong className="text-slate-800">{(currentPage - 1) * pageSize + 1}</strong> to{" "}
                    <strong className="text-slate-800">{Math.min(currentPage * pageSize, totalItems)}</strong> of{" "}
                    <strong className="text-slate-800">{totalItems}</strong> entries
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition-colors duration-150"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-7.5 h-7.5 flex items-center justify-center rounded-lg text-xs font-semibold border transition-all duration-150 ${currentPage === idx + 1 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:hover:bg-white transition-colors duration-150"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Schedule Manager */}
        {activeTab === "doc-schedule" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Left Column forms */}
            <div className="lg:col-span-5 space-y-6">
              {/* Profile timings setting */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-clock text-blue-600"></i>
                  <span>Fixed Consultation Hours</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">Set your fixed starting and ending times once. These timings apply automatically to every visiting date you schedule.</p>
                
                <form onSubmit={handleSaveFixedHours} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Shift Start Time</label>
                      <input
                        type="time"
                        value={profileStart}
                        onChange={(e) => setProfileStart(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500">Shift End Time</label>
                      <input
                        type="time"
                        value={profileEnd}
                        onChange={(e) => setProfileEnd(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 bg-slate-50"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-blue-500/10"
                  >
                    <i className="fa-solid fa-floppy-disk mr-2"></i>
                    Save Fixed Hours
                  </button>
                </form>
              </div>

              {/* Add visiting date form */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-plus text-blue-600"></i>
                  <span>Add Visiting Date</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">Add specific dates you will be visiting the clinic. Patients will be able to book for these dates.</p>
                
                <form onSubmit={handleAddVisitingDate} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Select Visiting Date</label>
                    <input
                      type="date"
                      value={newVisitingDate}
                      onChange={(e) => setNewVisitingDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 bg-slate-50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-blue-500/10"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Add Date to Calendar
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column calendar grid */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-calendar-days text-blue-600"></i>
                  <span>Visiting Dates Calendar</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">Toggle a date's availability or delete it from your calendar.</p>
                
                {/* Grid slots display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {slots.filter(s => s && s.doctorId === activeDocId).sort((a, b) => new Date(a.date) - new Date(b.date)).length === 0 ? (
                    <div className="col-span-full py-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-xl mx-auto mb-3 border border-slate-200/60">
                        <i className="fa-solid fa-calendar-minus"></i>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">No Visiting Dates Scheduled</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-[240px] mx-auto">Use the forms on the left to initialize visiting dates and default consultation hours.</p>
                    </div>
                  ) : (
                    slots.filter(s => s && s.doctorId === activeDocId).sort((a, b) => new Date(a.date) - new Date(b.date)).map(s => {
                      const pendingAppsOnDate = appointments.filter(a => a && a.doctorId === activeDocId && a.date === s.date && !a.diagnosis && a.status !== 'Cancelled' && a.status !== 'Completed');
                      
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleToggleSlotAvailability(s)}
                          className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] ${s.status === 'Available' ? 'bg-emerald-50/40 hover:bg-emerald-50 border-emerald-200/80 hover:shadow-sm' : s.status === 'Fully Booked' ? 'bg-rose-50/10 border-rose-200/80 cursor-not-allowed opacity-80' : 'bg-slate-100/50 hover:bg-slate-100 border-slate-200/60'}`}
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <strong className="text-sm text-slate-900 leading-tight block">{s.date}</strong>
                              <span className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${s.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : s.status === 'Fully Booked' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'}`}>
                                {s.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium block mt-1">{s.time || '10:00 AM - 05:00 PM'}</span>
                          </div>

                          <div className="flex justify-end items-center mt-3 pt-3 border-t border-slate-200/40 gap-2">
                            {pendingAppsOnDate.length > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenBulkRescheduleModal(s.date); }}
                                className="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center transition-colors duration-150"
                                title={`Bulk Reschedule ${pendingAppsOnDate.length} Patients`}
                              >
                                <i className="fa-solid fa-calendar-days text-xs"></i>
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteSlotDate(s); }}
                              className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-colors duration-150"
                              title="Delete visiting date"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* slots legend */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-200/60 text-xs text-slate-500 mt-6">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200/80"></span>
                  <span>Available (Click to Close)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200/60"></span>
                  <span>Closed (Click to Open)</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Status Panel */}
        {activeTab === "doc-status" && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-xl animate-fadeIn space-y-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-circle-nodes text-blue-600"></i>
              <span>Manage Live Availability Status</span>
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">Toggle your status to update the homepage specialist cards in real time, notifying incoming patients about shift delays or emergency duties.</p>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Your Live Shift Status</label>
                <select
                  value={liveStatus}
                  onChange={(e) => setLiveStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Running Late">Running Late</option>
                  <option value="Left Hospital">Left Hospital</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <button
                onClick={handleUpdateAvailabilityStatus}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-blue-500/10"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                Update Public Badge
              </button>
            </div>
          </div>
        )}

        {/* Tab: Search Patients by Date */}
        {activeTab === "doc-search-by-date" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Date Search & Export Controls */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                
                {/* Search Form Controls */}
                <div className="flex flex-wrap items-end gap-4 flex-1">
                  <div className="flex flex-col gap-1.5 min-w-[200px] w-full sm:w-auto">
                    <label className="text-xs font-bold text-slate-500">Select Appointment Date</label>
                    <input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150 w-full sm:w-auto"
                    />
                  </div>
                  
                  <button
                    onClick={() => fetchPatientsByDate(searchDate)}
                    disabled={searchLoading}
                    className="py-2 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-blue-500/10 flex items-center gap-2 w-full sm:w-auto justify-center disabled:cursor-not-allowed"
                  >
                    {searchLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Fetching Patients...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <span>Search Patients</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Export Options */}
                {searchPatients.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
                    <button
                      onClick={handlePrintAndPDF}
                      className="py-2 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 shadow-sm"
                    >
                      <i className="fa-solid fa-print"></i>
                      <span>Print / Save PDF</span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="py-2 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-1.5 shadow-sm"
                    >
                      <i className="fa-solid fa-file-csv"></i>
                      <span>Export CSV</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Dynamic Filtering Row */}
              {searchPatients.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Name Filter */}
                  <div className="relative flex-1 max-w-md w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <i className="fa-solid fa-magnifying-glass text-xs"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search patient by name..."
                      value={searchPatientName}
                      onChange={(e) => { setSearchPatientName(e.target.value); setSearchCurrentPage(1); }}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                    />
                  </div>

                  {/* Status Dropdown Filter */}
                  <div className="flex items-center gap-2 min-w-[200px] w-full sm:w-auto">
                    <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Status:</span>
                    <select
                      value={searchStatusFilter}
                      onChange={(e) => { setSearchStatusFilter(e.target.value); setSearchCurrentPage(1); }}
                      className="w-full sm:w-auto px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Confirmed">Upcoming</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                </div>
              )}
            </div>

            {/* Total Count Badge */}
            {!searchLoading && !searchError && searchPatients.length > 0 && (
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-slate-700">
                  Total Patients for Selected Date: <span className="text-blue-600 font-extrabold">{filteredSearchPatients.length}</span>
                </span>
              </div>
            )}

            {/* Main Content Area */}
            {searchLoading ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-medium text-slate-500">Querying database. Please wait...</p>
              </div>
            ) : searchError ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-sm font-medium flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-lg"></i>
                <span>{searchError}</span>
              </div>
            ) : filteredSearchPatients.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-200/60 shadow-sm">
                  <i className="fa-solid fa-calendar-xmark text-slate-400"></i>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5 font-sans">No patients booked for selected date.</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">Appointments will appear here once patients book appointments.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Patient Name</th>
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Phone</th>
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Symptoms</th>
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Appointment Date</th>
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Appointment Time</th>
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[130px]">Status</th>
                        <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedSearchPatients.map(p => {
                        let statusBadge = "bg-emerald-50 text-emerald-700 border border-emerald-200/80";
                        if (p.status === "Cancelled" || p.status === "Declined") {
                          statusBadge = "bg-rose-50 text-rose-700 border border-rose-200/80";
                        } else if (p.status === "Completed") {
                          statusBadge = "bg-slate-50 text-slate-700 border border-slate-200/80";
                        } else if (p.status === "Rescheduled" || p.status === "Rescheduled by Doctor" || p.status === "Ongoing") {
                          statusBadge = "bg-amber-50 text-amber-700 border border-amber-200/80";
                        }
                        
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                            <td className="py-4 px-6 align-middle font-bold text-slate-900">
                              {p.patientName || 'Not Available'}
                            </td>
                            <td className="py-4 px-6 align-middle font-medium text-slate-600">
                              {p.patientPhone || 'Not Available'}
                            </td>
                            <td className="py-4 px-6 align-middle text-slate-500 max-w-[200px] truncate" title={p.symptoms}>
                              {p.symptoms || 'No Symptoms Mentioned'}
                            </td>
                            <td className="py-4 px-6 align-middle font-semibold text-slate-700">
                              {p.date || 'Not Available'}
                            </td>
                            <td className="py-4 px-6 align-middle font-semibold text-slate-700">
                              {p.slot || 'Pending'}
                            </td>
                            <td className="py-4 px-6 align-middle text-center">
                              <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full ${statusBadge}`}>
                                {p.status === "Confirmed" ? "UPCOMING" : p.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-6 align-middle">
                              <div className="flex flex-col">
                                <span className="font-bold text-emerald-600">₹{p.fee}</span>
                                <span className="text-[10px] text-slate-400 font-mono">Paid (Ref: {p.payId || 'Not Available'})</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {searchTotalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <span className="text-xs text-slate-500 font-medium">
                      Showing Page {searchCurrentPage} of {searchTotalPages}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSearchCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={searchCurrentPage === 1}
                        className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150 animate-fadeIn"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setSearchCurrentPage(prev => Math.min(prev + 1, searchTotalPages))}
                        disabled={searchCurrentPage === searchTotalPages}
                        className="px-3 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150 animate-fadeIn"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* VIEW DETAILS MODAL */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoomIn">
            <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-circle-info text-blue-600"></i>
                <span>Appointment Detail Ledger</span>
              </h3>
              <button
                onClick={() => setSelectedAppt(null)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </header>

            <div className="p-6 space-y-4 text-sm text-slate-700 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking Reference</p>
                  <p className="font-mono font-bold text-slate-900">{selectedAppt.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Status</p>
                  <span className={`inline-block text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full mt-0.5 ${getStatusBadgeClass(selectedAppt.status)}`}>
                    {selectedAppt.status === 'Confirmed' ? 'Upcoming' : selectedAppt.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-4 border-b border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Credentials</p>
                <div className="space-y-1 bg-slate-50 border border-slate-200/60 rounded-xl p-3.5">
                  <p className="font-bold text-slate-900 text-base leading-none mb-1">{selectedAppt.patientName}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <i className="fa-solid fa-phone text-slate-400 w-3"></i>
                    <span>{selectedAppt.patientPhone || "Not Provided"}</span>
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <i className="fa-solid fa-envelope text-slate-400 w-3"></i>
                    <span>{selectedAppt.patientEmail && selectedAppt.patientEmail !== 'N/A' ? selectedAppt.patientEmail : "Not Provided"}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled Date</p>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedAppt.date}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scheduled Shift Slot</p>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedAppt.slot}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Symptoms</p>
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3.5 text-xs leading-relaxed text-slate-600">
                  {selectedAppt.symptoms || "No clinical symptoms specified."}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultation Fee</p>
                  <p className="font-black text-emerald-600 text-lg">₹{selectedAppt.fee || "0"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment ID Ref</p>
                  <code className="text-xs font-mono text-slate-500 leading-none mt-1 block">
                    {selectedAppt.payId && selectedAppt.payId !== 'N/A' ? selectedAppt.payId : "OFFLINE_CASH"}
                  </code>
                </div>
              </div>
            </div>

            <footer className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAppt(null)}
                className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all duration-150"
              >
                Close Ledger
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleAppt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoomIn">
            <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-blue-600"></i>
                <span>Reschedule Appointment</span>
              </h3>
              <button
                onClick={() => setRescheduleAppt(null)}
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </header>

            <form onSubmit={handleRescheduleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a new date and time slot for <strong className="text-slate-900 font-extrabold">{rescheduleAppt.patientName}</strong>. This will release their old slot and update their dashboard automatically.
                </p>

                {/* Date Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Select Reschedule Date</label>
                  <select
                    value={reschedDate}
                    onChange={(e) => {
                      setReschedDate(e.target.value);
                      // Auto-populate corresponding slot details
                      const matchSlot = getRescheduleAvailableDates(rescheduleAppt.id).find(s => s.date === e.target.value);
                      setReschedSlot(matchSlot ? matchSlot.time : "");
                    }}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                  >
                    <option value="" disabled>Select Date</option>
                    {getRescheduleAvailableDates(rescheduleAppt.id).map(s => {
                      const activeCount = appointments.filter(a => a && a.doctorId === activeDocId && a.date === s.date && a.status !== "Cancelled" && a.id !== rescheduleAppt.id).length;
                      return (
                        <option key={s.id} value={s.date}>
                          {s.date} (Capacity: {activeCount}/{MAX_DAILY_BOOKINGS})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Time Slot Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Select Available Time Slot</label>
                  <input
                    type="text"
                    value={reschedSlot}
                    readOnly
                    placeholder="Auto-populated shift duration"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-500 focus:outline-none cursor-not-allowed"
                  />
                </div>

                {/* Reason for Rescheduling */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Reason for Rescheduling</label>
                  <input
                    type="text"
                    value={reschedReason}
                    onChange={(e) => setReschedReason(e.target.value)}
                    placeholder="Enter reason (e.g. shift delay, emergency)"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                  />
                </div>
              </div>

              <footer className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setRescheduleAppt(null)}
                  className="py-2 px-5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all duration-150 shadow-md shadow-blue-500/10"
                >
                  Confirm Reschedule
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {cancelConfirmAppt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-sm w-full overflow-hidden p-6 text-center animate-zoomIn space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-3xl mx-auto border border-rose-100">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">Cancel Appointment?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel the appointment for <strong className="text-slate-950 font-extrabold">{cancelConfirmAppt.patientName}</strong>? This action will reopen the slot immediately.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancelConfirmAppt(null)}
                className="w-1/2 py-2 px-4 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 transition-colors duration-150"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="w-1/2 py-2 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-bold transition-colors duration-150 shadow-md shadow-rose-500/10"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK RESCHEDULE MODAL */}
      {bulkReschedDate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden animate-zoomIn">
            <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-calendar-days text-blue-600"></i>
                <span>Bulk Reschedule Appointments</span>
              </h3>
              <button
                onClick={() => setBulkReschedDate("")}
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </header>

            <form onSubmit={handleBulkRescheduleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Bulk reschedule all pending appointments on <strong className="text-slate-900 font-extrabold">{bulkReschedDate}</strong> to another available date. This will automatically assign patients to the available slots on the new date.
                </p>

                {/* Target Date Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Select Target Date</label>
                  <select
                    value={bulkTargetDate}
                    onChange={(e) => setBulkTargetDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                  >
                    <option value="" disabled>Select Target Date</option>
                    {slots.filter(s => {
                      if (!s) return false;
                      if (s.doctorId !== activeDocId || s.status !== "Available") return false;
                      if (s.date === bulkReschedDate) return false;
                      if (s.date < getTodayDateString()) return false;

                      const activeBookingsCount = appointments.filter(a => 
                        a && a.doctorId === activeDocId && a.date === s.date && a.status !== "Cancelled"
                      ).length;

                      const pendingAppsCount = appointments.filter(a => 
                        a && a.doctorId === activeDocId && a.date === bulkReschedDate && !a.diagnosis && a.status !== 'Cancelled' && a.status !== 'Completed'
                      ).length;

                      return (activeBookingsCount + pendingAppsCount) <= MAX_DAILY_BOOKINGS;
                    }).map(s => {
                      const activeCount = appointments.filter(a => a && a.doctorId === activeDocId && a.date === s.date && a.status !== "Cancelled").length;
                      return (
                        <option key={s.id} value={s.date}>
                          {s.date} (Available Space: {MAX_DAILY_BOOKINGS - activeCount}/{MAX_DAILY_BOOKINGS})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Reason for Rescheduling */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Reason for Rescheduling</label>
                  <input
                    type="text"
                    value={bulkReason}
                    onChange={(e) => setBulkReason(e.target.value)}
                    placeholder="Enter reason for bulk change"
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
                  />
                </div>
              </div>

              <footer className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setBulkReschedDate("")}
                  className="py-2 px-5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all duration-150 shadow-md shadow-blue-500/10"
                >
                  Confirm Bulk Reschedule
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
