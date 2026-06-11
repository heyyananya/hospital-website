/* Superspeciality Doctors Consultation - Patient Dashboard Controller */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session verification check
  const currentUser = JSON.parse(localStorage.getItem("phh_current_user"));
  if (!currentUser || currentUser.role !== "patient") {
    alert("Session expired or unauthorized portal access. Redirecting to secure gateway.").then(() => {
      window.location.href = "portal-login.html";
    });
    return;
  }

  // Set Profile Information
  document.getElementById("patient-db-user-name").textContent = currentUser.name;
  document.getElementById("patient-db-welcome-heading").textContent = `Welcome, ${currentUser.name}!`;
  const phoneDisplay = document.getElementById("patient-db-phone-display");
  if (phoneDisplay) {
    phoneDisplay.textContent = currentUser.phone || "N/A";
  }
  
  // Set Profile Card info
  const profName = document.getElementById("pat-profile-name");
  if (profName) profName.textContent = currentUser.name || "N/A";
  const profPhone = document.getElementById("pat-profile-phone");
  if (profPhone) profPhone.textContent = currentUser.phone || "N/A";
  const profEmail = document.getElementById("pat-profile-email");
  if (profEmail) profEmail.textContent = currentUser.email || "N/A";

  // 2. Fetch Central State Database
  let appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
  

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

  // 3b. Helpers


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

  // 4. Data Synchronizer
  function syncPatientDashboardData() {
    try {
      console.log("syncPatientDashboardData called");
      console.log("currentUser:", currentUser);
      console.log("appointments:", appointments);

      const activeTbody = document.getElementById("patient-active-appointments-tbody");
      const historyTbody = document.getElementById("patient-all-appointments-tbody");

      console.log("activeTbody element:", activeTbody);
      console.log("historyTbody element:", historyTbody);

      if (activeTbody) activeTbody.innerHTML = "";
      if (historyTbody) historyTbody.innerHTML = "";

      // Filter appointments belonging to this patient using robust case-insensitive email and 10-digit normalized phone matching
      const myAppointments = appointments.filter(app => {
        if (!app) return false;
        
        // Match by phone number if both are available
        const appPhone = app.patientPhone ? app.patientPhone.replace(/\D/g, "").slice(-10) : "";
        const userPhone = currentUser.phone ? currentUser.phone.replace(/\D/g, "").slice(-10) : "";
        const phoneMatches = appPhone && userPhone && (appPhone === userPhone);
        
        // Match by email if both are valid
        const appEmail = app.patientEmail ? app.patientEmail.trim().toLowerCase() : "";
        const userEmail = currentUser.email ? currentUser.email.trim().toLowerCase() : "";
        const isValidEmail = (email) => email && email.includes("@") && email !== "n/a";
        const emailMatches = isValidEmail(appEmail) && isValidEmail(userEmail) && (appEmail === userEmail);
        
        return phoneMatches || emailMatches;
      });
      console.log("myAppointments filtered list:", myAppointments);

      const activeAppointments = myAppointments.filter(a => 
        a && ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor"].includes(a.status)
      );

      const patStatCount = document.getElementById("pat-stat-count");
      if (patStatCount) {
        patStatCount.textContent = activeAppointments.length;
      }

      // Render Notifications Alert
      const notifBox = document.getElementById("patient-notifications-box");
      if (notifBox) {
        const rescheduledAppts = myAppointments.filter(a => a && a.status === "Rescheduled by Doctor");
        if (rescheduledAppts.length > 0) {
          notifBox.style.display = "block";
          notifBox.innerHTML = rescheduledAppts.map(a => `
            <div class="glass-card" style="border: 1px solid rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.04); padding: 15px; border-radius: var(--border-radius); display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; text-align: left;">
              <div style="color: var(--status-late); font-size: 1.5rem;"><i class="fa-solid fa-bell"></i></div>
              <div style="flex: 1;">
                <strong style="color: var(--dark); display: block; margin-bottom: 4px;">Appointment Rescheduled by Doctor</strong>
                <span style="font-size: 0.85rem; color: var(--text-secondary); display: block; line-height: 1.4;">
                  Dr. ${a.doctorName} has rescheduled your appointment to a new slot: 
                  <strong>${a.date} (${a.slot})</strong>.
                </span>
                <span style="font-size: 0.8rem; color: var(--text-secondary); display: block; margin-top: 4px; font-style: italic;">
                  Reason: ${a.rescheduleReason || 'N/A'} (Updated: ${a.rescheduledAt ? new Date(a.rescheduledAt).toLocaleString() : 'N/A'})
                </span>
                <div style="margin-top: 8px; font-size: 0.75rem; color: var(--text-secondary);">
                  <i class="fa-solid fa-envelope"></i> Placeholder email notification sent to ${a.patientEmail || 'N/A'} | <i class="fa-solid fa-message"></i> SMS sent to ${a.patientPhone}
                </div>
              </div>
            </div>
          `).join("");
        } else {
          notifBox.style.display = "none";
        }
      }

      // Render Feedback Prompt Box
      const feedbackPromptBox = document.getElementById("patient-feedback-prompt-box");
      if (feedbackPromptBox) {
        const reviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
        const unreviewedCompletedAppts = myAppointments.filter(app => 
          app && app.status === "Completed" && !reviews.some(r => r.appointmentId === app.id || r.appointment_id === app.id)
        );

        if (unreviewedCompletedAppts.length > 0) {
          feedbackPromptBox.style.display = "block";
          feedbackPromptBox.innerHTML = unreviewedCompletedAppts.map(a => `
            <div class="glass-card" style="border: 1px solid rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.04); padding: 20px; border-radius: var(--border-radius); display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 12px; text-align: left;">
              <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
                <div style="color: #ffb800; font-size: 1.8rem;"><i class="fa-solid fa-star"></i></div>
                <div>
                  <strong style="color: var(--dark); display: block; margin-bottom: 4px; font-size: 1.05rem;">How was your consultation with Dr. ${a.doctorName}?</strong>
                  <span style="font-size: 0.85rem; color: var(--text-secondary); display: block; line-height: 1.4;">
                    Your appointment on <strong>${a.date}</strong> at <strong>${a.slot}</strong> is marked as completed. Please take a moment to rate their care.
                  </span>
                </div>
              </div>
              <button class="btn btn-primary rate-btn-trigger" data-id="${a.id}" data-doc-id="${a.doctorId}" data-doc-name="${a.doctorName}" style="padding: 10px 20px; font-size: 0.85rem; border-radius: 8px; cursor: pointer; flex-shrink: 0; background: #ffb800; border-color: #ffb800; color: #1e293b; font-weight: 700;">
                Rate Consultation
              </button>
            </div>
          `).join("");

          // Bind review triggers
          feedbackPromptBox.querySelectorAll(".rate-btn-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
              const apptId = btn.getAttribute("data-id");
              const docId = btn.getAttribute("data-doc-id");
              const docName = btn.getAttribute("data-doc-name");
              openFeedbackModal(apptId, docId, docName);
            });
          });
        } else {
          feedbackPromptBox.style.display = "none";
        }
      }

      // Render active consultations card grid (if existing)
      const cardsSection = document.getElementById("patient-active-cards-section");
      if (cardsSection) {
        cardsSection.innerHTML = "";
        if (activeAppointments.length > 0) {
          const heading = document.createElement("h3");
          heading.style.margin = "0 0 20px 0";
          heading.style.fontSize = "1.2rem";
          heading.style.color = "var(--dark)";
          heading.innerHTML = `<i class="fa-solid fa-clock"></i> Your Active Consultations`;
          cardsSection.appendChild(heading);

          const grid = document.createElement("div");
          grid.style.display = "grid";
          grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(320px, 1fr))";
          grid.style.gap = "20px";
          grid.style.marginBottom = "30px";

          activeAppointments.forEach(app => {
            if (!app) return;
            const card = document.createElement("div");
            card.className = "glass-card";
            card.style.padding = "25px";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.gap = "15px";
            card.style.position = "relative";
            card.style.borderLeft = "5px solid var(--primary)";

            let statusBadgeClass = "upcoming";
            if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor") statusBadgeClass = "rescheduled";
            else if (app.status === "Ongoing") statusBadgeClass = "ongoing";
            else if (app.status === "Completed") statusBadgeClass = "completed";
            else if (app.status === "Cancelled" || app.status === "Declined") statusBadgeClass = "cancelled";

            card.innerHTML = `
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <h4 style="margin:0; font-size:1.15rem; color:var(--dark); font-weight:700;">${app.doctorName}</h4>
                  <p style="margin:4px 0 0 0; font-size:0.85rem; color:var(--text-secondary);">${app.dept}</p>
                </div>
                <span class="badge-status ${statusBadgeClass}">${app.status}</span>
              </div>
              
              <div style="font-size:0.9rem; color:var(--dark); display:flex; flex-direction:column; gap:8px; margin:5px 0;">
                <div><i class="fa-solid fa-calendar-day" style="color:var(--primary); width:20px;"></i> <strong>Date:</strong> ${app.date}</div>
                <div><i class="fa-solid fa-clock" style="color:var(--primary); width:20px;"></i> <strong>Time Slot:</strong> ${app.slot}</div>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
                <div style="display:flex; gap:12px; width:100%;">
                  <button class="btn btn-secondary w-100 reschedule-btn-trigger" data-id="${app.id}" style="padding:10px; font-size:0.85rem; display:inline-flex; align-items:center; justify-content:center; gap:6px; cursor:pointer;">
                    <i class="fa-solid fa-calendar-check"></i> Reschedule
                  </button>
                  <button class="btn btn-primary w-100 cancel-btn-trigger" data-id="${app.id}" style="padding:10px; font-size:0.85rem; background:#ef4444; border-color:#ef4444; display:inline-flex; align-items:center; justify-content:center; gap:6px; cursor:pointer;">
                    <i class="fa-solid fa-trash-can"></i> Cancel
                  </button>
                </div>
                <button class="btn btn-primary w-100 dashboard-download-receipt-btn" data-id="${app.id}" style="padding:10px; font-size:0.85rem; background:var(--status-available); border-color:var(--status-available); color:#fff; display:inline-flex; align-items:center; justify-content:center; gap:6px; cursor:pointer;">
                  <i class="fa-solid fa-file-pdf"></i> Download Receipt
                </button>
              </div>
            `;
            grid.appendChild(card);
          });
          cardsSection.appendChild(grid);
        }
      }

      if (myAppointments.length === 0) {
        if (activeTbody) {
          activeTbody.innerHTML = `
            <tr>
              <td colspan="5">
                <div class="empty-state-card" style="margin: 20px auto;">
                  <div class="empty-state-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
                  <h4>No Active Consultations</h4>
                  <p>You do not have any confirmed appointment slots active today. Use the homepage booking scheduler to register.</p>
                </div>
              </td>
            </tr>`;
        }
        if (historyTbody) {
          historyTbody.innerHTML = `
            <tr>
              <td colspan="5">
                <div class="empty-state-card" style="margin: 20px auto;">
                  <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
                  <h4>No Consultation Logs</h4>
                  <p>No historical medical visits are associated with this patient account profile yet.</p>
                </div>
              </td>
            </tr>`;
        }
        return;
      }

      myAppointments.forEach(app => {
        if (!app) return;
        const isActive = ["Upcoming", "Confirmed", "Ongoing", "Rescheduled", "Rescheduled by Doctor"].includes(app.status);
        if (isActive && activeTbody) {
          const tr = document.createElement("tr");
          let statusBadgeClass = "upcoming";
          if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor") statusBadgeClass = "rescheduled";
          else if (app.status === "Ongoing") statusBadgeClass = "ongoing";
          else if (app.status === "Completed") statusBadgeClass = "completed";
          else if (app.status === "Cancelled" || app.status === "Declined") statusBadgeClass = "cancelled";

          tr.innerHTML = `
            <td><strong>${app.doctorName}</strong></td>
            <td>${app.dept}</td>
            <td>${app.date} / ${app.slot}</td>
            <td><span class="badge-status ${statusBadgeClass}">${app.status}</span></td>
            <td>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary btn-action-sm reschedule-btn-trigger" data-id="${app.id}" style="padding:6px 12px; font-size:0.8rem; cursor:pointer;"><i class="fa-solid fa-calendar-days"></i> Reschedule</button>
                <button class="btn btn-primary btn-action-sm cancel-btn-trigger" data-id="${app.id}" style="padding:6px 12px; font-size:0.8rem; background:#ef4444; border-color:#ef4444; cursor:pointer;"><i class="fa-solid fa-xmark"></i> Cancel</button>
              </div>
            </td>
          `;
          activeTbody.appendChild(tr);
        }

        // History Table
        const trHist = document.createElement("tr");
        let histStatusClass = "neutral";
        if (app.status === "Confirmed" || app.status === "Upcoming") histStatusClass = "upcoming";
        else if (app.status === "Completed") histStatusClass = "completed";
        else if (app.status === "Cancelled" || app.status === "Declined") histStatusClass = "cancelled";
        else if (app.status === "Rescheduled" || app.status === "Rescheduled by Doctor") histStatusClass = "rescheduled";
        else if (app.status === "Ongoing") histStatusClass = "ongoing";

        trHist.innerHTML = `
          <td><code>${app.id}</code></td>
          <td><strong>${app.doctorName}</strong></td>
          <td>${app.date}</td>
          <td>${app.slot}</td>
          <td><span class="badge-status ${histStatusClass}">${app.status}</span></td>
          <td>
            <button class="btn btn-secondary btn-action-sm dashboard-download-receipt-btn" data-id="${app.id}" style="padding:6px 12px; font-size:0.8rem; border-color:var(--primary); color:var(--primary); background:transparent; cursor:pointer;">
              <i class="fa-solid fa-download"></i> PDF
            </button>
          </td>
        `;
        historyTbody.appendChild(trHist);
      });

      if (activeTbody && activeTbody.children.length === 0) {
        activeTbody.innerHTML = `
          <tr>
            <td colspan="5">
              <div class="empty-state-card" style="margin: 20px auto;">
                <div class="empty-state-icon"><i class="fa-solid fa-calendar-xmark"></i></div>
                <h4>No Active Consultations</h4>
                <p>You do not have any confirmed appointment slots active today. Use the homepage booking scheduler to register.</p>
              </div>
            </td>
          </tr>`;
      }

      // Bind cancellation buttons
      document.querySelectorAll(".cancel-btn-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
          const apptId = btn.getAttribute("data-id");
          openCancelModal(apptId);
        });
      });

      // Bind receipt download buttons
      document.querySelectorAll(".dashboard-download-receipt-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const apptId = btn.getAttribute("data-id");
          const matchedApp = myAppointments.find(a => a && a.id === apptId);
          if (matchedApp) {
            window.downloadReceiptPDF(matchedApp);
          } else {
            alert("Receipt details not found.");
          }
        });
      });

      // Bind reschedule buttons
      document.querySelectorAll(".reschedule-btn-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
          const apptId = btn.getAttribute("data-id");
          openRescheduleModal(apptId);
        });
      });
    } catch (error) {
      console.error("Critical error in syncPatientDashboardData:", error);
    }
  }

  // Cancellation Modal Flows
  let selectedApptIdForCancel = null;

  function openCancelModal(apptId) {
    selectedApptIdForCancel = apptId;
    const modal = document.getElementById("cancel-confirm-modal");
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("active"), 10);
      document.body.classList.add("modal-open");
    }
  }

  function closeCancelModal() {
    const modal = document.getElementById("cancel-confirm-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      setTimeout(() => {
        if (!modal.classList.contains("active")) {
          modal.style.display = "none";
        }
      }, 400);
    }
    selectedApptIdForCancel = null;
  }

  const cancelKeepBtn = document.getElementById("cancel-keep-btn");
  if (cancelKeepBtn) {
    cancelKeepBtn.addEventListener("click", closeCancelModal);
  }

  const cancelConfirmModal = document.getElementById("cancel-confirm-modal");
  if (cancelConfirmModal) {
    cancelConfirmModal.addEventListener("click", (e) => {
      if (e.target === cancelConfirmModal) {
        closeCancelModal();
      }
    });
  }

  const cancelConfirmBtn = document.getElementById("cancel-confirm-btn");
  if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener("click", () => {
      if (!selectedApptIdForCancel) return;
      
      let allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      const appIndex = allAppts.findIndex(a => a.id === selectedApptIdForCancel);
      if (appIndex !== -1) {
        const app = allAppts[appIndex];
        app.status = "Cancelled";

        // Release slot
        let allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
        const slotIndex = allSlots.findIndex(s => s.doctorId === app.doctorId && s.date === app.date && s.time === app.slot);
        if (slotIndex !== -1) {
          allSlots[slotIndex].status = "Available";
          allSlots[slotIndex].bookingId = "";
          localStorage.setItem("phh_slots", JSON.stringify(allSlots));
        }

        localStorage.setItem("phh_appointments", JSON.stringify(allAppts));
        window.dispatchEvent(new Event("storage_local"));
        
        closeCancelModal();
        performPatientSync();
        if (window.showSuccessToast) window.showSuccessToast("Appointment successfully cancelled. The time slot has been reopened.");
        else alert("Appointment successfully cancelled. The time slot has been reopened.");
      }
    });
  }

  // Rescheduling Modal Flows
  let selectedApptIdForReschedule = null;

  function openRescheduleModal(apptId) {
    selectedApptIdForReschedule = apptId;
    const modal = document.getElementById("reschedule-modal");
    if (!modal) return;

    const rescheduleApptIdInput = document.getElementById("reschedule-appt-id");
    if (rescheduleApptIdInput) rescheduleApptIdInput.value = apptId;

    const app = appointments.find(a => a.id === apptId);
    if (!app) return;

    let allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
    const now = new Date();
    
    // Filter future available visiting dates (slots) for the same doctor
    const availableSlots = allSlots.filter(s => {
      if (s.doctorId !== app.doctorId || s.status !== "Available") return false;
      const slotTimeObj = parseSlotEndDateTime(s.date, s.time);
      return slotTimeObj > now;
    });

    const dateSelect = document.getElementById("reschedule-date");
    const slotsWrapper = document.getElementById("reschedule-slots-wrapper");
    const hoursDisplay = document.getElementById("reschedule-hours-display");
    const confirmBtn = document.getElementById("reschedule-confirm-btn");
    const selectedSlotInput = document.getElementById("reschedule-selected-slot");

    // Reset fields
    dateSelect.innerHTML = '<option value="" disabled selected>Select Date</option>';
    slotsWrapper.style.display = "none";
    confirmBtn.disabled = true;
    selectedSlotInput.value = "";

    if (availableSlots.length === 0) {
      dateSelect.innerHTML = '<option value="" disabled selected>No dates available today/future</option>';
      modal.style.display = "flex";
      return;
    }

    // Populate dates
    const uniqueDates = [...new Set(availableSlots.map(s => s.date))].sort();
    uniqueDates.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      dateSelect.appendChild(opt);
    });

    dateSelect.onchange = () => {
      const selectedDate = dateSelect.value;
      selectedSlotInput.value = "";
      confirmBtn.disabled = true;

      const slotRecord = availableSlots.find(s => s.date === selectedDate);
      if (!slotRecord) {
        if (hoursDisplay) hoursDisplay.textContent = "";
        slotsWrapper.style.display = "none";
        return;
      }

      selectedSlotInput.value = slotRecord.time;
      if (hoursDisplay) {
        hoursDisplay.textContent = slotRecord.time;
      }
      confirmBtn.disabled = false;
      slotsWrapper.style.display = "block";
    };

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
    document.body.classList.add("modal-open");
  }

  function closeRescheduleModal() {
    const modal = document.getElementById("reschedule-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      setTimeout(() => {
        if (!modal.classList.contains("active")) {
          modal.style.display = "none";
        }
      }, 400);
    }
    selectedApptIdForReschedule = null;
  }

  const rescheduleCloseBtn = document.getElementById("reschedule-close-btn");
  if (rescheduleCloseBtn) {
    rescheduleCloseBtn.addEventListener("click", closeRescheduleModal);
  }

  const rescheduleModal = document.getElementById("reschedule-modal");
  if (rescheduleModal) {
    rescheduleModal.addEventListener("click", (e) => {
      if (e.target === rescheduleModal) {
        closeRescheduleModal();
      }
    });
  }

  const rescheduleConfirmBtn = document.getElementById("reschedule-confirm-btn");
  if (rescheduleConfirmBtn) {
    rescheduleConfirmBtn.addEventListener("click", () => {
      const apptId = document.getElementById("reschedule-appt-id").value;
      const newDate = document.getElementById("reschedule-date").value;
      const newTime = document.getElementById("reschedule-selected-slot").value;

      if (!apptId || !newDate || !newTime) {
        if (window.showErrorToast) window.showErrorToast("Please select a visiting date.");
        else alert("Please select a visiting date.");
        return;
      }

      let allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      const appIndex = allAppts.findIndex(a => a.id === apptId);
      if (appIndex === -1) return;

      const app = allAppts[appIndex];
      const oldDate = app.date;
      const oldTime = app.slot;

      // Expiry check
      const slotTimeObj = parseSlotEndDateTime(newDate, newTime);
      if (slotTimeObj < new Date()) {
        if (window.showErrorToast) window.showErrorToast("This date shift has already expired. Please select a future date.");
        else alert("This date shift has already expired. Please select a future date.");
        openRescheduleModal(apptId);
        return;
      }

      // Release old slot and occupy new slot in local storage schedules
      let allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
      
      // Find and release old slot
      const oldSlotIndex = allSlots.findIndex(s => s.doctorId === app.doctorId && s.date === oldDate && s.time === oldTime);
      if (oldSlotIndex !== -1) {
        allSlots[oldSlotIndex].status = "Available";
        allSlots[oldSlotIndex].bookingId = "";
      }

      // Find and occupy new slot
      const newSlotIndex = allSlots.findIndex(s => s.doctorId === app.doctorId && s.date === newDate && s.time === newTime);
      if (newSlotIndex !== -1) {
        allSlots[newSlotIndex].status = "Confirmed";
        allSlots[newSlotIndex].bookingId = apptId;
      }

      // Save slots
      localStorage.setItem("phh_slots", JSON.stringify(allSlots));

      // Update booking
      app.date = newDate;
      app.slot = newTime;
      app.status = "Rescheduled";
      app.oldSlot = `${oldDate} (${oldTime})`;
      app.newSlot = `${newDate} (${newTime})`;
      app.rescheduledBy = "Patient";
      app.rescheduledAt = new Date().toISOString();

      // Save databases
      localStorage.setItem("phh_appointments", JSON.stringify(allAppts));

      window.dispatchEvent(new Event("storage_local"));
      
      closeRescheduleModal();
      performPatientSync();

      if (window.showSuccessToast) window.showSuccessToast("Appointment successfully rescheduled. Your slot has been updated.");
      else alert(`Appointment successfully rescheduled. Your slot has been updated.`);
    });
  }

  // 5. SVG check-in QR Renderer removed as QR checking is replaced by registered phone checkin.



  // 7. Logout handler
  document.getElementById("patient-logout").addEventListener("click", () => {
    window.customConfirm("Are you sure you want to log out of the Patient Portal?").then(confirmed => {
      if (confirmed) {
        localStorage.removeItem("phh_current_user");
        window.location.href = "portal-login.html";
      }
    });
  });

  // Initial Sync Run
  autoExpireSlots();
  setInterval(autoExpireSlots, 30000);
  syncPatientDashboardData();

  function getTodayDateString() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  // Helper for patient sync execution
  function performPatientSync() {
    autoUpdateAppointmentStatuses();
    appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];

    syncPatientDashboardData();
  }

  window.addEventListener("storage", (e) => {
    if (e.key === "phh_appointments" || e.key === "phh_reviews") {
      performPatientSync();
    }
  });

  // Local sync trigger
  window.addEventListener("storage_local", () => {
    performPatientSync();
  });

  // Robust Periodic Sync Polling Fallback (for file:// protocol compatibility)
  let lastAppointmentsStr = localStorage.getItem("phh_appointments");
  let lastReviewsStr = localStorage.getItem("phh_reviews");

  setInterval(() => {
    let changed = false;

    const currentApptsStr = localStorage.getItem("phh_appointments");
    if (currentApptsStr !== lastAppointmentsStr) {
      lastAppointmentsStr = currentApptsStr;
      changed = true;
    }

    const currentReviewsStr = localStorage.getItem("phh_reviews");
    if (currentReviewsStr !== lastReviewsStr) {
      lastReviewsStr = currentReviewsStr;
      changed = true;
    }

    if (changed) {
      performPatientSync();
    }
  }, 1000);

  // Feedback Modal Interaction Handlers
  function openFeedbackModal(apptId, docId, docName) {
    const modal = document.getElementById("feedback-modal");
    if (!modal) return;
    
    document.getElementById("feedback-appt-id").value = apptId;
    document.getElementById("feedback-doctor-id").value = docId;
    document.getElementById("feedback-doctor-name-input").value = docName;
    document.getElementById("feedback-doctor-name").textContent = docName;
    document.getElementById("feedback-review-text").value = "";
    document.getElementById("feedback-rating").value = "5";
    
    // Reset stars to default 5 stars
    const starBtns = modal.querySelectorAll(".star-btn");
    starBtns.forEach(star => {
      star.style.color = "#ffb800";
    });

    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
    document.body.classList.add("modal-open");
  }

  function closeFeedbackModal() {
    const modal = document.getElementById("feedback-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
      setTimeout(() => {
        if (!modal.classList.contains("active")) {
          modal.style.display = "none";
        }
      }, 400);
    }
  }

  // Bind close triggers
  const feedbackCloseBtn = document.getElementById("feedback-close-btn");
  if (feedbackCloseBtn) {
    feedbackCloseBtn.addEventListener("click", closeFeedbackModal);
  }
  const feedbackModalEl = document.getElementById("feedback-modal");
  if (feedbackModalEl) {
    feedbackModalEl.addEventListener("click", (e) => {
      if (e.target === feedbackModalEl) {
        closeFeedbackModal();
      }
    });
  }

  // Bind interactive stars selection
  const starBtns = document.querySelectorAll(".star-btn");
  starBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const val = parseInt(btn.getAttribute("data-value"), 10);
      document.getElementById("feedback-rating").value = val;
      starBtns.forEach(star => {
        const starVal = parseInt(star.getAttribute("data-value"), 10);
        if (starVal <= val) {
          star.style.color = "#ffb800";
        } else {
          star.style.color = "#cbd5e1";
        }
      });
    });
  });

  // Submit feedback form
  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const apptId = document.getElementById("feedback-appt-id").value;
      const docId = document.getElementById("feedback-doctor-id").value;
      const docName = document.getElementById("feedback-doctor-name-input").value;
      const rating = parseInt(document.getElementById("feedback-rating").value, 10);
      const reviewText = document.getElementById("feedback-review-text").value.trim();
      
      if (!apptId || !docId || isNaN(rating) || !reviewText) {
        alert("Please provide a rating and write a review.");
        return;
      }
      
      const newReview = {
        appointmentId: apptId,
        doctorId: docId,
        patientName: currentUser.name || "Patient",
        rating: rating,
        review: reviewText,
        createdAt: new Date().toISOString()
      };
      
      let currentReviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
      // Remove previous duplicate for this appointment if any
      currentReviews = currentReviews.filter(r => r.appointmentId !== apptId && r.appointment_id !== apptId);
      currentReviews.push(newReview);
      
      // Save reviews to localStorage (triggers syncAdaptor automatically!)
      localStorage.setItem("phh_reviews", JSON.stringify(currentReviews));
      
      closeFeedbackModal();
      
      // Update local storage and UI local sync
      setTimeout(() => {
        if (window.syncDatabaseToLocal) {
          window.syncDatabaseToLocal().then(() => {
            performPatientSync();
          });
        } else {
          performPatientSync();
        }
      }, 300);

      if (window.showSuccessToast) window.showSuccessToast("Thank you for your feedback!");
      else alert("Thank you for your feedback!");
    });
  }

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
