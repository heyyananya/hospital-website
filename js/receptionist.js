/* Superspeciality Doctors Consultation - Front Desk Receptionist Dashboard Controller */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session verification check
  const currentUser = JSON.parse(localStorage.getItem("phh_current_user"));
  if (!currentUser || currentUser.role !== "receptionist") {
    alert("Session expired or unauthorized receptionist access. Redirecting to secure gateway.").then(() => {
      window.location.href = "portal-login.html";
    });
    return;
  }

  // Set Profile Information
  document.getElementById("receptionist-db-user-name").textContent = currentUser.name;

  // 2. Fetch Central Database States
  let doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
  let appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
  
  let slots = JSON.parse(localStorage.getItem("phh_slots")) || [];

  // Helper to format date as YYYY-MM-DD
  function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  const todayDateStr = getTodayDateString();



  // Helper to parse date and time string to Date object
  function parseSlotDateTime(dateStr, timeStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [time, ampm] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  }

  function parseSlotEndDateTime(dateStr, timeStr) {
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
  }

  function autoExpireSlots() {
    let allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
    const now = new Date();
    let changed = false;

    allSlots.forEach(s => {
      if (s.status === "Available") {
        const slotTimeObj = parseSlotEndDateTime(s.date, s.time);
        if (slotTimeObj < now) {
          s.status = "Expired";
          changed = true;
        }
      }
    });

    if (changed) {
      localStorage.setItem("phh_slots", JSON.stringify(allSlots));
      window.dispatchEvent(new Event("storage_local"));
    }
  }

  function autoUpdateAppointmentStatuses() {
    let allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
    
    const now = new Date();
    const todayStr = getTodayDateString();
    let changed = false;

    allAppts.forEach(app => {
      if (!app) return;

      if (app.status === "Confirmed") {
        app.status = "Upcoming";
        changed = true;
      }

      if (app.diagnosis && app.status !== "Completed") {
        app.status = "Completed";
        changed = true;
      }

      if (app.status !== "Completed" && app.status !== "Cancelled" && app.status !== "Declined") {
        const slotTimeObj = parseSlotEndDateTime(app.date, app.slot);
        if (slotTimeObj < now) {
          app.status = "Completed";
          changed = true;
        }
      }


    });

    if (changed) {
      localStorage.setItem("phh_appointments", JSON.stringify(allAppts));
      appointments = allAppts;
      window.dispatchEvent(new Event("storage_local"));
    }
  }

  // Toast message controller
  function showToast(message) {
    const toast = document.getElementById("toast-notification");
    const toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  }

  // 3. Tab Routing Engine
  const sidebarButtons = document.querySelectorAll(".sidebar-nav-btn");
  sidebarButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sidebarButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".dashboard-body-panel").forEach(panel => {
        panel.classList.remove("active");
      });

      const tabName = btn.getAttribute("data-db-tab");
      const targetPanel = document.getElementById(`db-panel-${tabName}`);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // 4. Data Synchronizer
  function syncReceptionistDashboardData() {
    autoUpdateAppointmentStatuses();
    appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
    

    // 4a. Update stats
    const todayAppointments = appointments.filter(app => app.date === todayDateStr);
    const completedAppts = todayAppointments.filter(app => app.status === "Completed" || app.diagnosis);
    const pendingAppts = todayAppointments.filter(app => ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor"].includes(app.status) && !app.diagnosis);

    document.getElementById("rep-stat-today").textContent = todayAppointments.length;
    document.getElementById("rep-stat-checkin").textContent = completedAppts.length;
    document.getElementById("rep-stat-waiting").textContent = pendingAppts.length;

    // 4b. Render Today's Overview Table
    const overviewTbody = document.getElementById("receptionist-today-appointments-tbody");
    overviewTbody.innerHTML = "";

    const filteredToday = todayAppointments;

    if (filteredToday.length === 0) {
      overviewTbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state-card" style="margin: 20px auto;">
              <div class="empty-state-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
              <h4>No Appointments Today</h4>
              <p>There are no pre-booked appointments for today. You can register walk-in patients in the Walk-in Registry tab.</p>
            </div>
          </td>
        </tr>`;
    } else {
      filteredToday.forEach(app => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-appt-id", app.id);
        
        let statusClass = "upcoming";
        if (app.status === "Confirmed" || app.status === "Upcoming") statusClass = "upcoming";
        else if (app.status === "Cancelled" || app.status === "Declined") statusClass = "cancelled";
        else if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor") statusClass = "rescheduled";
        else if (app.status === "Completed") statusClass = "completed";
        else if (app.status === "Ongoing") statusClass = "ongoing";

        // Determine if actions are enabled
        const isCancelled = app.status === "Cancelled" || app.status === "Declined";
        const isCompleted = app.status === "Completed" || !!app.diagnosis;
        const isPending = ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor"].includes(app.status) && !app.diagnosis;

        tr.innerHTML = `
          <td>
            <strong>${app.patientName}</strong><br>
            <small style="color:var(--text-secondary); display:block; margin-top:2px;">
              <i class="fa-solid fa-phone" style="font-size:0.75rem;"></i> ${app.patientPhone}<br>
              <i class="fa-solid fa-envelope" style="font-size:0.75rem;"></i> ${app.patientEmail || 'N/A'}
            </small>
          </td>
          <td><strong>${app.doctorName}</strong></td>
          <td>${app.slot}</td>
          <td><code>${app.id}</code></td>
          <td><code style="color:var(--text-secondary);">${app.payId || 'OFFLINE'}</code></td>
          <td><span class="badge-status ${statusClass}">${app.status === "Confirmed" ? "Upcoming" : app.status}</span></td>
        `;
        overviewTbody.appendChild(tr);
      });
    }



    // 4d. Render Doctors Status Board
    const doctorsTbody = document.getElementById("receptionist-doctors-tbody");
    doctorsTbody.innerHTML = "";

    doctors.filter(doc => doc.status !== 'Pending').forEach(doc => {
      const tr = document.createElement("tr");

      let badgeClass = "neutral";
      if (doc.status === "Available") badgeClass = "success";
      else if (doc.status === "Busy") badgeClass = "danger";
      else if (doc.status === "Running Late") badgeClass = "warning";
      else if (doc.status === "Left Hospital" || doc.status === "Offline") badgeClass = "neutral";

      tr.innerHTML = `
        <td><strong>${doc.name}</strong></td>
        <td>${doc.specialty}</td>
        <td>${doc.days}</td>
        <td>${doc.time}</td>
        <td><span style="font-weight:600; color:var(--status-available);">₹${doc.fee}</span></td>
        <td>
          <select class="form-control receptionist-doc-status-select" data-id="${doc.id}" style="padding: 4px 10px; font-size: 0.8rem; height: auto; width: auto; font-weight:700;">
            <option value="Available" ${doc.status === 'Available' ? 'selected' : ''}>Available</option>
            <option value="Busy" ${doc.status === 'Busy' ? 'selected' : ''}>Busy</option>
            <option value="Running Late" ${doc.status === 'Running Late' ? 'selected' : ''}>Running Late</option>
            <option value="Left Hospital" ${doc.status === 'Left Hospital' ? 'selected' : ''}>Left Hospital</option>
            <option value="Offline" ${doc.status === 'Offline' ? 'selected' : ''}>Offline</option>
          </select>
        </td>
        <td>
          <button class="btn btn-secondary btn-action-sm trigger-status-save" data-id="${doc.id}"><i class="fa-solid fa-floppy-disk"></i> Save</button>
        </td>
      `;
      doctorsTbody.appendChild(tr);
    });

    // Bind event handlers
    bindReceptionistActionTriggers();
  }



  // 5. Button Actions Binding
  function bindReceptionistActionTriggers() {
    // Doctor status save button
    document.querySelectorAll(".trigger-status-save").forEach(btn => {
      btn.addEventListener("click", () => {
        const docId = btn.getAttribute("data-id");
        const select = document.querySelector(`.receptionist-doc-status-select[data-id="${docId}"]`);
        if (select) {
          const statusVal = select.value;
          const docIdx = doctors.findIndex(d => d.id === docId);
          if (docIdx !== -1) {
            doctors[docIdx].status = statusVal;
            localStorage.setItem("phh_doctors", JSON.stringify(doctors));
            window.dispatchEvent(new Event("storage_local"));
            showToast(`Doctor availability set to: ${statusVal}`);
            syncReceptionistDashboardData();
          }
        }
      });
    });
  }

  // 6. Walk-In Registration Flow
  const walkinDept = document.getElementById("walkin-dept-select");
  const walkinDoc = document.getElementById("walkin-doc-select");
  const walkinSlotsWrapper = document.getElementById("walkin-slots-wrapper");
  const walkinSlotsGrid = document.getElementById("walkin-slots-grid");
  const walkinSelectedSlot = document.getElementById("walkin-selected-slot");

  // Populate doctor select based on specialty selection
  if (walkinDept) {
    walkinDept.addEventListener("change", () => {
      const selectedDept = walkinDept.value;
      walkinDoc.innerHTML = '<option value="" disabled selected></option>';
      updateFilledState(walkinDoc);
      
      const deptDocs = doctors.filter(d => d.specialty === selectedDept && d.status !== "Offline" && d.status !== "Pending");
      deptDocs.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.status})`;
        walkinDoc.appendChild(opt);
      });
      
      walkinSlotsWrapper.style.display = "none";
      walkinSelectedSlot.value = "";
    });
  }

  // Populate slots grid based on doctor selection
  if (walkinDoc) {
    walkinDoc.addEventListener("change", () => {
      const selectedDocId = walkinDoc.value;
      const hoursDisplay = document.getElementById("walkin-hours-display");
      walkinSelectedSlot.value = "";

      if (!selectedDocId) {
        walkinSlotsWrapper.style.display = "none";
        return;
      }
      
      const docSlots = slots.filter(s => s.doctorId === selectedDocId && s.date === todayDateStr);
      const activeDoc = doctors.find(d => d.id === selectedDocId);
      const docTime = activeDoc ? activeDoc.time : "10:00 AM - 05:00 PM";

      // Look for a scheduled shift today
      const slotRecord = docSlots.find(s => s.status === "Available");
      
      if (slotRecord) {
        walkinSelectedSlot.value = slotRecord.time;
        if (hoursDisplay) {
          hoursDisplay.textContent = slotRecord.time;
        }
      } else {
        // Fallback to doctor's default profile timing
        walkinSelectedSlot.value = docTime;
        if (hoursDisplay) {
          hoursDisplay.textContent = `${docTime} (Unscheduled Shift)`;
        }
      }

      walkinSlotsWrapper.style.display = "block";
    });
  }

  // Walk-in form submit
  const walkinForm = document.getElementById("receptionist-walkin-form");
  if (walkinForm) {
    walkinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("walkin-patient-name").value.trim();
      const phone = document.getElementById("walkin-patient-phone").value.trim();
      const email = document.getElementById("walkin-patient-email").value.trim() || "";
      const dept = walkinDept.value;
      const docId = walkinDoc.value;
      const slotTime = walkinSelectedSlot.value;
      const symptoms = document.getElementById("walkin-symptoms").value.trim();

      if (!name || !phone || !dept || !docId || !slotTime || !symptoms) {
        alert("Please fill in all details.");
        return;
      }



      const bookingId = "PHH-W" + Math.floor(100000 + Math.random() * 900000);
      const doctorObj = doctors.find(d => d.id === docId);

      const newAppointment = {
        id: bookingId,
        patientName: name,
        patientEmail: email,
        patientPhone: phone,
        doctorId: docId,
        doctorName: doctorObj.name,
        dept: dept,
        date: todayDateStr,
        slot: slotTime,
        
        payId: "OFFLINE_CASH",
        fee: doctorObj.fee,
        symptoms: symptoms,
        status: "Upcoming",
        diagnosis: "",
        prescriptions: ""
      };

      appointments.push(newAppointment);
      localStorage.setItem("phh_appointments", JSON.stringify(appointments));

      window.dispatchEvent(new Event("storage_local"));
      showToast(`Walk-in registered! Patient: ${name}`);
      
      // Reset form
      walkinForm.reset();
      document.querySelectorAll(".form-control").forEach(updateFilledState);
      walkinSlotsWrapper.style.display = "none";
      walkinSelectedSlot.value = "";

      // Redirect tab to overview
      const overviewTabBtn = document.querySelector('[data-db-tab="receptionist-home"]');
      if (overviewTabBtn) overviewTabBtn.click();
      
      syncReceptionistDashboardData();
    });
  }

  // 7. General Search Engine
  const searchInput = document.getElementById("search-query");
  const searchStatus = document.getElementById("search-status");
  const searchTbody = document.getElementById("receptionist-search-tbody");

  function renderSearchQuery() {
    if (!searchTbody) return;
    const query = searchInput.value.toLowerCase().trim();
    const status = searchStatus.value;

    searchTbody.innerHTML = "";

    const filtered = appointments.filter(app => {
      // Status filter
      if (status !== "All") {
        const appStatus = app.status === "Confirmed" ? "Upcoming" : app.status;
        if (appStatus !== status) return false;
      }

      // Query text filter
      if (!query) return true;
      return (
        app.id.toLowerCase().includes(query) ||
        app.patientName.toLowerCase().includes(query) ||
        app.patientPhone.includes(query) ||
        app.doctorName.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query)
      );
    });

    if (filtered.length === 0) {
      searchTbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; color:var(--text-secondary); padding: 30px;">
            No matching patient appointments found in the database.
          </td>
        </tr>`;
    } else {
      filtered.forEach(app => {
        const tr = document.createElement("tr");

        let statusClass = "upcoming";
        if (app.status === "Confirmed" || app.status === "Upcoming") statusClass = "upcoming";
        else if (app.status === "Cancelled" || app.status === "Declined") statusClass = "cancelled";
        else if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor") statusClass = "rescheduled";
        else if (app.status === "Completed") statusClass = "completed";
        else if (app.status === "Ongoing") statusClass = "ongoing";

        tr.innerHTML = `
          <td><code>${app.id}</code></td>
          
          <td><strong>${app.patientName}</strong></td>
          <td>${app.patientPhone}</td>
          <td>${app.doctorName}</td>
          <td>${app.date} / ${app.slot}</td>
          <td><span class="badge-status ${statusClass}">${app.status === "Confirmed" ? "Upcoming" : app.status}</span></td>
        `;
        searchTbody.appendChild(tr);
      });
    }
  }

  if (searchInput) searchInput.addEventListener("input", renderSearchQuery);
  if (searchStatus) searchStatus.addEventListener("change", renderSearchQuery);

  // 8. Overview Quick search filtering (instant hide rows)
  const overviewSearch = document.getElementById("overview-search-input");
  if (overviewSearch) {
    overviewSearch.addEventListener("input", () => {
      const q = overviewSearch.value.toLowerCase().trim();
      const rows = document.querySelectorAll("#receptionist-today-appointments-tbody tr");
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(q)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // 9. Floating inputs label filling handlers
  function updateFilledState(input) {
    let isFilled = false;
    if (input.tagName === "SELECT") {
      const selectedOption = input.options[input.selectedIndex];
      isFilled = (selectedOption && selectedOption.textContent.trim() !== "");
    } else if (input.type === "date" || input.type === "time") {
      isFilled = true;
    } else if (input.placeholder && input.placeholder.trim() !== "") {
      isFilled = true;
    } else {
      isFilled = (input.value !== "");
    }

    if (isFilled) {
      input.parentElement.classList.add("filled");
    } else {
      input.parentElement.classList.remove("filled");
    }
  }

  const formControls = document.querySelectorAll(".form-control");
  formControls.forEach(input => {
    updateFilledState(input);
    
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });
    
    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused");
      updateFilledState(input);
    });

    input.addEventListener("change", () => {
      updateFilledState(input);
    });

    input.addEventListener("input", () => {
      updateFilledState(input);
    });
  });



  // 10. Logout handler
  document.getElementById("receptionist-logout").addEventListener("click", () => {
    window.customConfirm("Are you sure you want to log out of the Receptionist Workstation?").then(confirmed => {
      if (confirmed) {
        localStorage.removeItem("phh_current_user");
        window.location.href = "portal-login.html";
      }
    });
  });

  // 11. Initial execution load
  autoExpireSlots();
  setInterval(autoExpireSlots, 30000);
  syncReceptionistDashboardData();
  renderSearchQuery();

  // Helper for active re-sync
  function performSync() {
    autoUpdateAppointmentStatuses();
    doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];

    slots = JSON.parse(localStorage.getItem("phh_slots")) || [];
    
    syncReceptionistDashboardData();
    renderSearchQuery();
  }

  // Inter-tab same browser sync listener
  window.addEventListener("storage", (e) => {
    if (e.key === "phh_appointments" ||  e.key === "phh_doctors" || e.key === "phh_slots") {
      performSync();
    }
  });

  // Local sync handler
  window.addEventListener("storage_local", () => {
    performSync();
  });

  // Robust Periodic Sync Polling Fallback (for file:// protocol compatibility)
  let lastDoctorsStr = localStorage.getItem("phh_doctors");
  let lastAppointmentsStr = localStorage.getItem("phh_appointments");
  
  let lastSlotsStr = localStorage.getItem("phh_slots");

  setInterval(() => {
    let changed = false;
    
    const currentDocsStr = localStorage.getItem("phh_doctors");
    if (currentDocsStr !== lastDoctorsStr) {
      lastDoctorsStr = currentDocsStr;
      changed = true;
    }

    const currentApptsStr = localStorage.getItem("phh_appointments");
    if (currentApptsStr !== lastAppointmentsStr) {
      lastAppointmentsStr = currentApptsStr;
      changed = true;
    }



    const currentSlotsStr = localStorage.getItem("phh_slots");
    if (currentSlotsStr !== lastSlotsStr) {
      lastSlotsStr = currentSlotsStr;
      changed = true;
    }

    if (changed) {
      performSync();
    }
  }, 1000);

  // Sidebar mobile toggle drawer trigger
  const sideNav = document.getElementById("dashboard-sidebar");
  const sideOverlay = document.getElementById("sidebar-overlay");
  const sideToggleBtn = document.getElementById("sidebar-toggle-trigger");

  if (sideToggleBtn && sideNav && sideOverlay) {
    sideToggleBtn.addEventListener("click", () => {
      sideNav.classList.add("active");
      sideOverlay.classList.add("active");
    });

    sideOverlay.addEventListener("click", () => {
      sideNav.classList.remove("active");
      sideOverlay.classList.remove("active");
    });

    document.querySelectorAll(".sidebar-nav-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        sideNav.classList.remove("active");
        sideOverlay.classList.remove("active");
      });
    });
  }
});
