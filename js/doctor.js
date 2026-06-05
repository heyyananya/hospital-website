/* Superspeciality Doctors Consultation - Doctor Workspace Controller */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session verification check
  const currentUser = JSON.parse(localStorage.getItem("phh_current_user"));
  if (!currentUser || currentUser.role !== "doctor") {
    alert("Session expired or unauthorized portal access. Redirecting to secure gateway.").then(() => {
      window.location.href = "portal-login.html";
    });
    return;
  }

  // Set Profile details
  document.getElementById("doc-db-name-label").textContent = currentUser.name;
  document.getElementById("doc-db-welcome-heading").textContent = `Welcome, ${currentUser.name}!`;

  // 2. Fetch Central Database States
  let doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
  let appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
  
  let slots = JSON.parse(localStorage.getItem("phh_slots")) || [];

  // Helper to update sidebar status badge styling
  function updateSidebarStatusBadge(status) {
    const badge = document.getElementById("doc-sidebar-status-badge");
    if (!badge) return;
    badge.textContent = status;
    badge.className = "badge-status"; // reset
    if (status === "Available") {
      badge.classList.add("success");
    } else if (status === "Busy") {
      badge.classList.add("danger");
    } else if (status === "Running Late") {
      badge.classList.add("warning");
    } else if (status === "Left Hospital" || status === "Offline") {
      badge.classList.add("neutral");
    } else {
      badge.classList.add("neutral");
    }
  }

  // Resolve active doctor ID dynamically via a robust fallback matcher
  function getActiveDocId() {
    let activeDoc = doctors.find(d => d && (d.id === (currentUser.docId || currentUser.id) || d.name === currentUser.name || d.email === currentUser.email));
    return activeDoc ? activeDoc.id : (currentUser.docId || currentUser.id);
  }

  // Set current selected status dropdown match and sidebar badge
  let activeDoc = doctors.find(d => d && d.id === getActiveDocId());
  if (activeDoc) {
    const selectEl = document.getElementById("doc-status-select");
    if (selectEl) selectEl.value = activeDoc.status;
    updateSidebarStatusBadge(activeDoc.status);
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

  // Helper to format date as YYYY-MM-DD
  function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Parse time slots to get end time of appointment
  function parseSlotEndDateTime(dateStr, timeStr) {
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
  }

  // Automates lifecycle changes based on queue state and time
  function autoUpdateAppointmentStatuses() {
    let allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];

    const now = new Date();
    const todayStr = getTodayDateString();
    let changed = false;

    allAppts.forEach(app => {
      if (!app) return;

      // Confirmed -> Upcoming normalization
      if (app.status === "Confirmed") {
        app.status = "Upcoming";
        changed = true;
      }

      // Auto-complete if diagnosed
      if (app.diagnosis && app.status !== "Completed") {
        app.status = "Completed";
        changed = true;
      }

      // Auto-complete if time passed
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
      appointments = allAppts; // Update internal variable reference
      window.dispatchEvent(new Event("storage_local"));
    }
  }

  // 4. Data Synchronizer
  function syncDoctorDashboardData() {
    autoUpdateAppointmentStatuses();
    appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];


    const activeTbody = document.getElementById("doc-patients-tbody");

    if (activeTbody) activeTbody.innerHTML = "";

    // Filter appointments belonging to this doctor
    const myAppointments = appointments.filter(app => 
      app && ((app.doctorId && app.doctorId === getActiveDocId()) || 
      (app.doctorName === currentUser.name))
    );

    const todayCount = myAppointments.length;
    const pendingCount = myAppointments.filter(a => a && ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor"].includes(a.status)).length;
    const completedCount = myAppointments.filter(a => a && a.status === "Completed").length;

    const statToday = document.getElementById("doc-stat-today");
    const statPending = document.getElementById("doc-stat-pending");
    const statDone = document.getElementById("doc-stat-done");


    if (statToday) statToday.textContent = todayCount;
    if (statPending) statPending.textContent = pendingCount;
    if (statDone) statDone.textContent = completedCount;


    if (myAppointments.length === 0) {
      if (activeTbody) {
        activeTbody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="empty-state-card" style="margin: 40px auto; padding: 40px; text-align: center; border-radius: 12px; background: rgba(255,255,255,0.4); border: 1px dashed rgba(0, 102, 255, 0.15); box-shadow: none;">
                <div class="empty-state-icon" style="background: rgba(0, 102, 255, 0.04); color: var(--primary); margin: 0 auto 15px;"><i class="fa-solid fa-calendar-times"></i></div>
                <h4 style="font-size: 1.2rem; font-weight: 700; color: var(--dark); margin-bottom: 8px;">No consultations scheduled today</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 320px; margin: 0 auto;">Appointments booked by patients will appear here in real-time. Use the calendar tab to schedule visiting shifts.</p>
              </div>
            </td>
          </tr>
        `;
      }
      return;
    }

    myAppointments.forEach(app => {
      const tr = document.createElement("tr");
      
      let statusBadge = "upcoming";
      if (app.status === "Cancelled" || app.status === "Declined") {
        statusBadge = "cancelled";
      } else if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor") {
        statusBadge = "rescheduled";
      } else if (app.status === "Completed") {
        statusBadge = "completed";
      } else if (app.status === "Ongoing") {
        statusBadge = "ongoing";
      }

      tr.innerHTML = `
        <td>
          <strong>${app.patientName}</strong><br>
          <small style="color:var(--text-secondary); display:block; margin-top:2px;">
            <i class="fa-solid fa-phone" style="font-size:0.75rem;"></i> ${app.patientPhone || 'N/A'}<br>
            <i class="fa-solid fa-envelope" style="font-size:0.75rem;"></i> ${app.patientEmail || 'N/A'}
          </small>
        </td>
        <td><strong>${app.date}</strong><br><small style="color:var(--text-secondary);">${app.slot}</small></td>
        <td><span style="font-size:0.85rem; color:var(--text-secondary); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;" title="${app.symptoms}">${app.symptoms}</span></td>
        <td>
          <span style="font-size:0.85rem; font-weight:600; color:var(--status-available);">₹${app.fee}</span><br>
          <code style="font-size:0.7rem; color:var(--text-secondary);">${app.payId || 'N/A'}</code>
        </td>
        <td><span class="badge-status ${statusBadge}">${app.status === "Confirmed" ? "Upcoming" : app.status}</span></td>
        <td>
          <div style="display:flex; gap:6px;">
            ${app.status !== "Cancelled" && app.status !== "Completed" ? `
              <button class="btn btn-primary btn-ripple reschedule-btn" style="padding:6px 12px; font-size:0.8rem; border-radius:6px; border: 1.5px solid var(--status-late); color: var(--status-late); background: transparent; cursor:pointer;" data-id="${app.id}"><i class="fa-solid fa-clock-rotate-left"></i> Reschedule</button>
            ` : ''}
            ${app.status === "Completed" ? `<span style="font-weight:600; color:#64748b; font-size:0.85rem; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-circle-check"></i> Consulted</span>` : ''}
            ${app.status === "Cancelled" ? `<span style="color:#ef4444; font-size:0.85rem; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-ban"></i> Cancelled</span>` : ''}
          </div>
        </td>
      `;
      if (activeTbody) activeTbody.appendChild(tr);
    });



    document.querySelectorAll(".reschedule-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        openRescheduleModal(btn.getAttribute("data-id"));
      });
    });
  }


  // 5. Action Handlers





  // 8. Doctor Availability Status updates
  const statusSelect = document.getElementById("doc-status-select");
  const updateStatusBtn = document.getElementById("doc-btn-update-status");

  function saveStatusChange(statusVal) {
    let docIdx = doctors.findIndex(d => d && d.id === getActiveDocId());
    if (docIdx === -1) {
      docIdx = doctors.findIndex(d => d && (d.name === currentUser.name || d.email === currentUser.email));
    }
    if (docIdx !== -1) {
      doctors[docIdx].status = statusVal;
      localStorage.setItem("phh_doctors", JSON.stringify(doctors));
      updateSidebarStatusBadge(statusVal);
      syncDoctorDashboardData();
      
      // Explicitly trigger a local storage event on the same window so same-window modules sync instantly
      window.dispatchEvent(new Event("storage_local"));
    }
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", () => {
      saveStatusChange(statusSelect.value);
    });
  }

  if (updateStatusBtn) {
    updateStatusBtn.addEventListener("click", () => {
      const statusVal = statusSelect ? statusSelect.value : document.getElementById("doc-status-select").value;
      saveStatusChange(statusVal);
      alert(`Shift availability badge updated to: ${statusVal}`);
    });
  }

  // 9. Schedule & Slots Management Logic
  const schedForm = document.getElementById("doc-schedule-form");
  const profileForm = document.getElementById("doc-timings-profile-form");
  const datesGrid = document.getElementById("doc-dates-grid");

  function parseTimeRangeTo24h(timeStr) {
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
  }

  function initDefaultHours() {
    try {
      const activeId = getActiveDocId();
      if (!activeId) return;
      const currentDoc = doctors.find(d => d && d.id === activeId);
      if (currentDoc) {
        const timings = parseTimeRangeTo24h(currentDoc.time);
        const startTimeInput = document.getElementById("profile-sched-start");
        const endTimeInput = document.getElementById("profile-sched-end");
        if (startTimeInput) {
          startTimeInput.value = timings.start;
          updateFilledState(startTimeInput);
        }
        if (endTimeInput) {
          endTimeInput.value = timings.end;
          updateFilledState(endTimeInput);
        }
      }
    } catch (err) {
      console.error("Error in initDefaultHours:", err);
    }
  }

  initDefaultHours();

  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        const startTime = document.getElementById("profile-sched-start").value;
        const endTime = document.getElementById("profile-sched-end").value;
        const submitBtn = profileForm.querySelector("button[type='submit']");
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "Save Fixed Hours";

        if (!startTime || !endTime) {
          alert("Please select default start and end times.");
          return;
        }

        function convertTo12h(time24h) {
          const [hoursStr, minutesStr] = time24h.split(":");
          let hours = parseInt(hoursStr, 10);
          const ampm = hours >= 12 ? "PM" : "AM";
          hours = hours % 12;
          hours = hours ? hours : 12;
          return `${hours}:${minutesStr} ${ampm}`;
        }

        const start12 = convertTo12h(startTime);
        const end12 = convertTo12h(endTime);
        const newTimingsRange = `${start12} - ${end12}`;

        const activeId = getActiveDocId();
        let docIdx = doctors.findIndex(d => d && d.id === activeId);
        if (docIdx === -1) {
          docIdx = doctors.findIndex(d => d && (d.name === currentUser.name || d.email === currentUser.email));
        }
        
        if (docIdx === -1) {
          alert("Could not find your doctor profile in the system.");
          return;
        }

        // Set Loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;
        }

        // 1. Update doctors array
        const updatedDoctors = [...doctors];
        updatedDoctors[docIdx] = {
          ...updatedDoctors[docIdx],
          time: newTimingsRange
        };

        // 2. Update slots array for this doctor
        const updatedSlots = slots.map(s => {
          if (s && s.doctorId === activeId) {
            return {
              ...s,
              time: newTimingsRange
            };
          }
          return s;
        });

        const apiBase = window.API_BASE || '';

        // 3. Save doctors list to database
        const resDocs = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_doctors', data: updatedDoctors })
        });
        const docsData = await resDocs.json();

        if (!resDocs.ok || !docsData.success) {
          throw new Error(docsData.error || "Failed to save doctor timings to database.");
        }

        // 4. Save slots list to database
        const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
        });
        const slotsData = await resSlots.json();

        if (!resSlots.ok || !slotsData.success) {
          throw new Error(slotsData.error || "Failed to save updated visiting date timings to database.");
        }

        // 5. Success pathway - update memory and local storage
        doctors = updatedDoctors;
        slots = updatedSlots;
        localStorage.setItem("phh_doctors", JSON.stringify(doctors));
        localStorage.setItem("phh_slots", JSON.stringify(slots));

        alert("Fixed consultation hours saved successfully!");

        // Trigger UI updates
        populateShiftDates();
      } catch (err) {
        console.error("Error in profileForm submit:", err);
        alert(err.message || "Failed to save settings. Please verify your connection.");
      } finally {
        const submitBtn = profileForm.querySelector("button[type='submit']");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Save Fixed Hours`;
        }
      }
    });
  }

  if (schedForm) {
    schedForm.addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        const dateStr = document.getElementById("sched-date").value;
        const submitBtn = schedForm.querySelector("button[type='submit']");
        const originalBtnHTML = submitBtn ? submitBtn.innerHTML : "Add Date to Calendar";

        if (!dateStr) {
          alert("Please select a visiting date.");
          return;
        }

        // Validate past dates (excluding today in doctor local time)
        const [yr, mo, dy] = dateStr.split('-').map(Number);
        const selectedLocalDate = new Date(yr, mo - 1, dy);
        const today = new Date();
        today.setHours(0,0,0,0);
        
        if (selectedLocalDate < today) {
          alert("Cannot add past dates to the calendar.");
          return;
        }

        const activeId = getActiveDocId();
        const currentDoc = doctors.find(d => d && d.id === activeId);
        const docTime = (currentDoc && currentDoc.time) ? currentDoc.time : "10:00 AM - 05:00 PM";

        // Check if duplicate slot date
        if (slots.some(s => s && s.doctorId === activeId && s.date === dateStr)) {
          alert("This visiting date is already added to your calendar.");
          return;
        }

        // Add single slot representing the full date
        const newSlot = {
          id: "slot-" + activeId + "-" + dateStr,
          doctorId: activeId,
          doctorName: currentUser.name,
          date: dateStr,
          time: docTime,
          status: "Available",
          bookingId: ""
        };

        const updatedSlots = [...slots, newSlot];

        // Set Loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Adding...`;
        }

        // Save to Database via direct sync route
        const apiBase = window.API_BASE || '';
        const response = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            key: 'phh_slots',
            data: updatedSlots
          })
        });

        const resData = await response.json();

        if (response.ok && resData.success) {
          slots = updatedSlots;
          localStorage.setItem("phh_slots", JSON.stringify(slots));
          
          alert("Date added successfully");
          
          schedForm.reset();
          document.querySelectorAll(".form-control").forEach(updateFilledState);
          
          populateShiftDates();
        } else {
          throw new Error(resData.error || "Failed to save slot to database.");
        }
      } catch (err) {
        console.error("Error in schedForm submit:", err);
        alert(err.message || "Failed to communicate with database server. Please verify your connection.");
      } finally {
        const submitBtn = schedForm.querySelector("button[type='submit']");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Add Date to Calendar`;
        }
      }
    });
  }

  function populateShiftDates() {
    try {
      if (!datesGrid) return;
      datesGrid.innerHTML = "";
      
      const activeId = getActiveDocId();
      
      // Get slots for this doctor
      const mySlots = slots.filter(s => s && s.doctorId === activeId).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (mySlots.length === 0) {
        datesGrid.innerHTML = `
          <div style="grid-column: 1/-1;">
            <div class="empty-state-card" style="margin: 20px auto;">
              <div class="empty-state-icon"><i class="fa-solid fa-calendar-days"></i></div>
              <h4>No Visiting Dates</h4>
              <p>You have not added any visiting dates to your schedule yet. Add a date using the form on the left.</p>
            </div>
          </div>`;
        return;
      }

      mySlots.forEach(s => {
        if (!s) return;
        
        // Find pending appointments on this date
        const pendingAppsOnDate = appointments.filter(a => a && a.doctorId === activeId && a.date === s.date && !a.diagnosis && a.status !== 'Cancelled' && a.status !== 'Completed');

        const card = document.createElement("div");
        const status = (s.status || "Available").toLowerCase();
        card.className = `slot-pill-btn ${status}`;
        card.style.cssText = "display: flex; flex-direction: column; justify-content: space-between; padding: 15px; border-radius: 8px; cursor: pointer; text-align: left; position: relative; min-height: 100px; transition: all 0.2s ease; align-items: stretch;";
        
        card.innerHTML = `
          <div>
            <strong style="font-size: 1rem; display: block; margin-bottom: 4px; color: var(--dark);">${s.date}</strong>
            <span style="font-size: 0.75rem; opacity: 0.9; display: block; color: var(--text-secondary);">${s.time || '10:00 AM - 05:00 PM'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; width: 100%;">
            <small style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${s.status || 'Available'}</small>
            <div style="display: flex; gap: 8px; align-items: center;">
              ${pendingAppsOnDate.length > 0 ? `
                <button class="bulk-resched-btn" data-date="${s.date}" style="background: transparent; border: none; color: var(--status-late); cursor: pointer; font-size: 0.95rem; padding: 4px; display: inline-flex; align-items: center;" title="Bulk Reschedule ${pendingAppsOnDate.length} pending appointments">
                  <i class="fa-solid fa-calendar-days"></i>
                </button>
              ` : ''}
              <button class="delete-date-btn" data-id="${s.id}" style="background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.95rem; padding: 4px; display: inline-flex; align-items: center;" title="Delete Date">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;

        card.addEventListener("click", (e) => {
          if (e.target.closest(".delete-date-btn")) return;
          if (e.target.closest(".bulk-resched-btn")) return;
          
          if (s.status === "Available") {
            s.status = "Closed";
          } else {
            s.status = "Available";
          }
          localStorage.setItem("phh_slots", JSON.stringify(slots));
          window.dispatchEvent(new Event("storage_local"));
          populateShiftDates();
        });

        const deleteBtn = card.querySelector(".delete-date-btn");
        if (deleteBtn) {
          deleteBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            if (await window.customConfirm(`Are you sure you want to delete ${s.date} from your visiting dates?`)) {
              const index = slots.findIndex(slot => slot && slot.id === s.id);
              if (index !== -1) {
                slots.splice(index, 1);
                localStorage.setItem("phh_slots", JSON.stringify(slots));
                window.dispatchEvent(new Event("storage_local"));
                populateShiftDates();
              }
            }
          });
        }

        const bulkReschedBtn = card.querySelector(".bulk-resched-btn");
        if (bulkReschedBtn) {
          bulkReschedBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            openBulkRescheduleModal(s.date);
          });
        }

        datesGrid.appendChild(card);
      });
    } catch (err) {
      console.error("Error in populateShiftDates:", err);
    }
  }

  // 10. Floating labels controller
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

  // 10.b Appointment Reschedule Logic
  const MAX_DAILY_BOOKINGS = 10;

  // Single Reschedule Modal Open
  function openRescheduleModal(bookingId) {
    const app = appointments.find(a => a.id === bookingId);
    if (!app) {
      alert("Appointment details not found.");
      return;
    }

    const modal = document.getElementById("reschedule-modal");
    const nameLabel = document.getElementById("resched-patient-name");
    const idInput = document.getElementById("resched-booking-id");
    const dateSelect = document.getElementById("resched-date-select");
    const slotSelect = document.getElementById("resched-slot-select");
    const reasonInput = document.getElementById("resched-reason");

    if (!modal || !nameLabel || !idInput || !dateSelect || !slotSelect || !reasonInput) return;

    nameLabel.textContent = app.patientName;
    idInput.value = bookingId;
    reasonInput.value = "";
    updateFilledState(reasonInput);

    // Clear dropdowns
    dateSelect.innerHTML = '<option value="" disabled selected>Select Reschedule Date</option>';
    slotSelect.innerHTML = '<option value="" disabled selected>Select Available Time Slot</option>';
    updateFilledState(dateSelect);
    updateFilledState(slotSelect);

    const activeId = getActiveDocId();
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter slots for this doctor that are in the future/today and Available
    const availableSlots = slots.filter(s => {
      if (!s) return false;
      if (s.doctorId !== activeId || s.status !== "Available") return false;
      if (s.date < todayStr) return false;

      // Count active bookings for this doctor on this slot's date
      const activeBookingsCount = appointments.filter(a => 
        a && 
        a.doctorId === activeId && 
        a.date === s.date && 
        a.status !== "Cancelled" && 
        a.id !== bookingId
      ).length;

      return activeBookingsCount < MAX_DAILY_BOOKINGS;
    });

    if (availableSlots.length === 0) {
      alert("No available dates found on your calendar with booking capacity.");
      return;
    }

    // Populate date dropdown
    availableSlots.forEach(s => {
      const activeCount = appointments.filter(a => a && a.doctorId === activeId && a.date === s.date && a.status !== "Cancelled" && a.id !== bookingId).length;
      const opt = document.createElement("option");
      opt.value = s.date;
      opt.textContent = `${s.date} (Capacity: ${activeCount}/${MAX_DAILY_BOOKINGS})`;
      dateSelect.appendChild(opt);
    });

    // On date change, update slot/shift timings
    dateSelect.onchange = () => {
      const selectedDate = dateSelect.value;
      const slot = availableSlots.find(s => s.date === selectedDate);
      slotSelect.innerHTML = '';
      if (slot) {
        const opt = document.createElement("option");
        opt.value = slot.time;
        opt.textContent = slot.time;
        opt.selected = true;
        slotSelect.appendChild(opt);
      }
      updateFilledState(slotSelect);
      updateFilledState(dateSelect);
    };

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
  }

  const reschedCancelBtn = document.getElementById("resched-cancel-btn");
  if (reschedCancelBtn) {
    reschedCancelBtn.addEventListener("click", () => {
      const modal = document.getElementById("reschedule-modal");
      if (modal) {
        modal.classList.remove("active");
        setTimeout(() => modal.style.display = "none", 400);
      }
    });
  }

  const reschedForm = document.getElementById("reschedule-form");
  if (reschedForm) {
    reschedForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const bookingId = document.getElementById("resched-booking-id").value;
      const targetDate = document.getElementById("resched-date-select").value;
      const targetTime = document.getElementById("resched-slot-select").value;
      const reason = document.getElementById("resched-reason").value.trim();

      if (!bookingId || !targetDate || !targetTime || !reason) {
        alert("Please fill in all rescheduling details.");
        return;
      }

      const appIdx = appointments.findIndex(a => a && a.id === bookingId);
      if (appIdx === -1) {
        alert("Appointment not found.");
        return;
      }

      const activeId = getActiveDocId();
      const oldDate = appointments[appIdx].date;
      const oldTime = appointments[appIdx].slot;

      // Validate past dates
      const todayStr = new Date().toISOString().split('T')[0];
      if (targetDate < todayStr) {
        alert("Cannot reschedule to a past date.");
        return;
      }

      // Check doctor availability on that date
      const slotRecord = slots.find(s => s && s.doctorId === activeId && s.date === targetDate && s.status === "Available");
      if (!slotRecord) {
        alert("You are not available on the selected date.");
        return;
      }

      // Check capacity
      const activeBookingsCount = appointments.filter(a => 
        a && 
        a.doctorId === activeId && 
        a.date === targetDate && 
        a.status !== "Cancelled" && 
        a.id !== bookingId
      ).length;

      if (activeBookingsCount >= MAX_DAILY_BOOKINGS) {
        alert("Target slot date is fully booked.");
        return;
      }

      // Update slot capacity statuses
      const newTotalBookings = activeBookingsCount + 1;
      
      const updatedSlots = slots.map(s => {
        if (s && s.doctorId === activeId) {
          if (s.date === targetDate && newTotalBookings >= MAX_DAILY_BOOKINGS) {
            return { ...s, status: "Fully Booked" };
          }
          if (s.date === oldDate) {
            const oldDateActiveCount = appointments.filter(a => a && a.doctorId === activeId && a.date === oldDate && a.status !== "Cancelled" && a.id !== bookingId).length;
            if (oldDateActiveCount < MAX_DAILY_BOOKINGS && s.status === "Fully Booked") {
              return { ...s, status: "Available" };
            }
          }
        }
        return s;
      });

      const submitBtn = reschedForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;
      }

      try {
        
        const updatedAppointments = [...appointments];
        updatedAppointments[appIdx] = {
          ...updatedAppointments[appIdx],
          status: "Rescheduled by Doctor",
          date: targetDate,
          slot: targetTime,
          
          rescheduleReason: reason,
          oldSlot: `${oldDate} (${oldTime})`,
          newSlot: `${targetDate} (${targetTime})`,
          rescheduledBy: currentUser.name,
          rescheduledAt: new Date().toISOString()
        };

        const apiBase = window.API_BASE || '';

        // Save appointments
        const resAppts = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_appointments', data: updatedAppointments })
        });
        const apptsData = await resAppts.json();
        if (!resAppts.ok || !apptsData.success) {
          throw new Error(apptsData.error || "Failed to save rescheduled appointment to database.");
        }

        // Save slots
        const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
        });
        const slotsData = await resSlots.json();
        if (!resSlots.ok || !slotsData.success) {
          throw new Error(slotsData.error || "Failed to save slot updates to database.");
        }



        appointments = updatedAppointments;
        slots = updatedSlots;
        localStorage.setItem("phh_appointments", JSON.stringify(appointments));
        localStorage.setItem("phh_slots", JSON.stringify(slots));
        

        alert(`Appointment successfully rescheduled.`);

        const modal = document.getElementById("reschedule-modal");
        if (modal) {
          modal.classList.remove("active");
          setTimeout(() => modal.style.display = "none", 400);
        }

        syncDoctorDashboardData();
        populateShiftDates();
      } catch (err) {
        console.error("Reschedule submit error:", err);
        alert(err.message || "Failed to reschedule appointment.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Confirm Reschedule";
        }
      }
    });
  }

  // Bulk Reschedule Modal Open
  function openBulkRescheduleModal(oldDate) {
    const modal = document.getElementById("bulk-reschedule-modal");
    const dateLabel = document.getElementById("bulk-resched-old-date-label");
    const oldDateInput = document.getElementById("bulk-resched-old-date");
    const targetDateSelect = document.getElementById("bulk-resched-new-date-select");
    const reasonInput = document.getElementById("bulk-resched-reason");

    if (!modal || !dateLabel || !oldDateInput || !targetDateSelect || !reasonInput) return;

    const activeId = getActiveDocId();
    const pendingAppsOnDate = appointments.filter(a => 
      a && 
      a.doctorId === activeId && 
      a.date === oldDate && 
      !a.diagnosis && 
      a.status !== 'Cancelled' && 
      a.status !== 'Completed'
    );

    if (pendingAppsOnDate.length === 0) {
      alert("No pending appointments found on this date to reschedule.");
      return;
    }

    dateLabel.textContent = `${oldDate} (${pendingAppsOnDate.length} patient${pendingAppsOnDate.length > 1 ? 's' : ''})`;
    oldDateInput.value = oldDate;
    reasonInput.value = "";
    updateFilledState(reasonInput);

    targetDateSelect.innerHTML = '<option value="" disabled selected>Select Target Date</option>';
    updateFilledState(targetDateSelect);

    const todayStr = new Date().toISOString().split('T')[0];

    const availableTargets = slots.filter(s => {
      if (!s) return false;
      if (s.doctorId !== activeId || s.status !== "Available") return false;
      if (s.date === oldDate) return false;
      if (s.date < todayStr) return false;

      const activeBookingsCount = appointments.filter(a => 
        a && 
        a.doctorId === activeId && 
        a.date === s.date && 
        a.status !== "Cancelled"
      ).length;

      return (activeBookingsCount + pendingAppsOnDate.length) <= MAX_DAILY_BOOKINGS;
    });

    if (availableTargets.length === 0) {
      alert("No future visiting dates have enough booking capacity to accommodate all these patients.");
      return;
    }

    availableTargets.forEach(s => {
      const activeCount = appointments.filter(a => a && a.doctorId === activeId && a.date === s.date && a.status !== "Cancelled").length;
      const opt = document.createElement("option");
      opt.value = s.date;
      opt.textContent = `${s.date} (Available space: ${MAX_DAILY_BOOKINGS - activeCount}/${MAX_DAILY_BOOKINGS})`;
      targetDateSelect.appendChild(opt);
    });

    targetDateSelect.onchange = () => {
      updateFilledState(targetDateSelect);
    };

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
  }

  const bulkCancelBtn = document.getElementById("bulk-resched-cancel-btn");
  if (bulkCancelBtn) {
    bulkCancelBtn.addEventListener("click", () => {
      const modal = document.getElementById("bulk-reschedule-modal");
      if (modal) {
        modal.classList.remove("active");
        setTimeout(() => modal.style.display = "none", 400);
      }
    });
  }

  const bulkReschedForm = document.getElementById("bulk-reschedule-form");
  if (bulkReschedForm) {
    bulkReschedForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const oldDate = document.getElementById("bulk-resched-old-date").value;
      const targetDate = document.getElementById("bulk-resched-new-date-select").value;
      const reason = document.getElementById("bulk-resched-reason").value.trim();

      if (!oldDate || !targetDate || !reason) {
        alert("Please fill in all bulk rescheduling details.");
        return;
      }

      const activeId = getActiveDocId();
      const pendingApps = appointments.filter(a => 
        a && 
        a.doctorId === activeId && 
        a.date === oldDate && 
        !a.diagnosis && 
        a.status !== 'Cancelled' && 
        a.status !== 'Completed'
      );

      if (pendingApps.length === 0) {
        alert("No pending appointments found on the old date.");
        return;
      }

      // Check doctor availability on target date
      const targetSlot = slots.find(s => s && s.doctorId === activeId && s.date === targetDate && s.status === "Available");
      if (!targetSlot) {
        alert("You are not available on the selected target date.");
        return;
      }

      // Check remaining capacity on target date
      const activeBookingsCount = appointments.filter(a => 
        a && 
        a.doctorId === activeId && 
        a.date === targetDate && 
        a.status !== "Cancelled"
      ).length;

      if ((activeBookingsCount + pendingApps.length) > MAX_DAILY_BOOKINGS) {
        alert("Target date does not have enough capacity for all appointments.");
        return;
      }

      const targetTimeRange = targetSlot.time;
      const newTotalBookings = activeBookingsCount + pendingApps.length;

      const updatedSlots = slots.map(s => {
        if (s && s.doctorId === activeId) {
          if (s.date === targetDate && newTotalBookings >= MAX_DAILY_BOOKINGS) {
            return { ...s, status: "Fully Booked" };
          }
          if (s.date === oldDate) {
            return { ...s, status: "Available" };
          }
        }
        return s;
      });

      const submitBtn = bulkReschedForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Rescheduling...`;
      }

      try {
        const updatedAppointments = [...appointments];
        pendingApps.forEach(app => {
          const appIdx = updatedAppointments.findIndex(a => a && a.id === app.id);
          if (appIdx !== -1) {
            
            updatedAppointments[appIdx] = {
              ...updatedAppointments[appIdx],
              status: "Rescheduled by Doctor",
              date: targetDate,
              slot: targetTimeRange,
              
              rescheduleReason: reason,
              oldSlot: `${oldDate} (${app.slot})`,
              newSlot: `${targetDate} (${targetTimeRange})`,
              rescheduledBy: currentUser.name,
              rescheduledAt: new Date().toISOString()
            };
          }
        });

        const apiBase = window.API_BASE || '';

        // Save appointments
        const resAppts = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_appointments', data: updatedAppointments })
        });
        const apptsData = await resAppts.json();
        if (!resAppts.ok || !apptsData.success) {
          throw new Error(apptsData.error || "Failed to save rescheduled appointments.");
        }

        // Save slots
        const resSlots = await fetch(`${apiBase}/api/sync/save-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'phh_slots', data: updatedSlots })
        });
        const slotsData = await resSlots.json();
        if (!resSlots.ok || !slotsData.success) {
          throw new Error(slotsData.error || "Failed to update visiting date slot statuses.");
        }
        appointments = updatedAppointments;
        slots = updatedSlots;
        localStorage.setItem("phh_appointments", JSON.stringify(appointments));
        localStorage.setItem("phh_slots", JSON.stringify(slots));
        

        alert(`Successfully rescheduled ${pendingApps.length} appointments to ${targetDate}.`);

        const modal = document.getElementById("bulk-reschedule-modal");
        if (modal) {
          modal.classList.remove("active");
          setTimeout(() => modal.style.display = "none", 400);
        }

        syncDoctorDashboardData();
        populateShiftDates();
      } catch (err) {
        console.error("Bulk reschedule submit error:", err);
        alert(err.message || "Failed to bulk reschedule appointments.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Confirm Bulk Reschedule";
        }
      }
    });
  }

  // Modal window dismiss controllers
  window.addEventListener("click", (e) => {
    const reschedModal = document.getElementById("reschedule-modal");
    if (e.target === reschedModal) {
      reschedModal.classList.remove("active");
      setTimeout(() => reschedModal.style.display = "none", 400);
    }
    const bulkModal = document.getElementById("bulk-reschedule-modal");
    if (e.target === bulkModal) {
      bulkModal.classList.remove("active");
      setTimeout(() => bulkModal.style.display = "none", 400);
    }
  });

  // 11. Logout handler
  document.getElementById("doc-logout").addEventListener("click", () => {
    localStorage.removeItem("phh_current_user");
    window.location.href = "portal-login.html";
  });

  // Initial dashboard load sync
  syncDoctorDashboardData();
  populateShiftDates();

  // Helper for actual sync execution
  function performSync(key) {
    try {
      doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
      appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];

      slots = JSON.parse(localStorage.getItem("phh_slots")) || [];
      
      const activeId = getActiveDocId();
      if (activeId && (!key || key === "phh_doctors")) {
        const currentDoc = doctors.find(d => d && (d.id === activeId || d.name === currentUser.name || d.email === currentUser.email));
        if (currentDoc) {
          if (statusSelect) statusSelect.value = currentDoc.status;
          updateSidebarStatusBadge(currentDoc.status);
          
          // Sync timing inputs
          const timings = parseTimeRangeTo24h(currentDoc.time);
          const startTimeInput = document.getElementById("profile-sched-start");
          const endTimeInput = document.getElementById("profile-sched-end");
          if (startTimeInput) {
            startTimeInput.value = timings.start;
            updateFilledState(startTimeInput);
          }
          if (endTimeInput) {
            endTimeInput.value = timings.end;
            updateFilledState(endTimeInput);
          }
        }
      }
      
      syncDoctorDashboardData();
      populateShiftDates();
    } catch (err) {
      console.error("Error in performSync:", err);
    }
  }

  // Keep synced with state changes on other windows/tabs
  window.addEventListener("storage", (e) => {
    if (e.key === "phh_appointments" ||  e.key === "phh_doctors" || e.key === "phh_slots") {
      performSync(e.key);
    }
  });

  // Local sync trigger
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
});
