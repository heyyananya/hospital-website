/* Superspeciality Doctors Consultation - Admin Dashboard Controller */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Session verification check
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("phh_current_user"));
  } catch (e) {
    console.error("Error parsing current user session:", e);
  }

  if (!currentUser || currentUser.role !== "admin") {
    alert("Unauthorized access. Access to the Admin Console is restricted to system administrators.").then(() => {
      localStorage.removeItem("phh_current_user");
      window.location.href = "portal-login.html";
    });
    return;
  }

  // Set Profile details
  const nameEl = document.querySelector(".sidebar-user-name");
  if (nameEl) nameEl.textContent = currentUser.name;
  const roleEl = document.querySelector(".sidebar-user-role");
  if (roleEl) {
    if (currentUser.name === "Dr. Ajit B. Patel") {
      roleEl.textContent = "Chief Admin Doctor";
    } else {
      roleEl.textContent = "System Administrator";
    }
  }

  // 2. Fetch Central Database States
  let doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
  let doctorRequests = JSON.parse(localStorage.getItem("phh_doctor_requests")) || [];
  let appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
  let diseaseMap = JSON.parse(localStorage.getItem("phh_disease_map")) || {};

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
  function syncAdminDashboardData() {
    // Filter out pending and active doctors
    const activeDocs = doctors;
    const pendingDocs = doctorRequests;

    // Stat Metrics calculations
    const revenueSum = appointments.reduce((acc, app) => acc + (app.status === "Confirmed" ? app.fee : 0), 0);
    document.getElementById("admin-stat-revenue").textContent = `₹${revenueSum}`;
    document.getElementById("admin-stat-bookings").textContent = appointments.length;
    document.getElementById("admin-stat-docs").textContent = activeDocs.length;

    // Update pending requests count badge
    const badgeEl = document.getElementById("admin-request-badge");
    if (badgeEl) {
      if (pendingDocs.length > 0) {
        badgeEl.textContent = pendingDocs.length;
        badgeEl.style.display = "inline-block";
      } else {
        badgeEl.style.display = "none";
      }
    }

    // Transaction Audit log table
    const auditTbody = document.getElementById("admin-all-bookings-tbody");
    auditTbody.innerHTML = "";
    if (appointments.length === 0) {
      auditTbody.innerHTML = `
        <tr>
          <td colspan="8">
            <div class="empty-state-card" style="margin: 20px auto;">
              <div class="empty-state-icon"><i class="fa-solid fa-receipt"></i></div>
              <h4>No Transactions Registered</h4>
              <p>Patient booking fee transactions and queue checkout receipts will be compiled here once they occur.</p>
            </div>
          </td>
        </tr>`;
    } else {
      [...appointments].reverse().forEach(app => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${app.id}</td>
          <td><strong>${app.patientName}</strong><br><small>${app.patientPhone}</small></td>
          <td>${app.doctorName}</td>
          <td>${app.dept}</td>
          <td>${app.date} / ${app.slot}</td>
          <td>₹${app.fee}</td>
          <td><span class="badge-status success">${app.status === "Confirmed" ? "Upcoming" : app.status}</span></td>
        `;
        auditTbody.appendChild(tr);
      });
    }

    // Pending Approvals table
    const pendingBox = document.getElementById("admin-pending-box");
    const pendingTbody = document.getElementById("admin-pending-list-tbody");
    if (pendingBox && pendingTbody) {
      pendingTbody.innerHTML = "";
      if (pendingDocs.length === 0) {
        pendingTbody.innerHTML = `
          <tr>
            <td colspan="4">
              <div class="empty-state-card" style="margin: 20px auto;">
                <div class="empty-state-icon"><i class="fa-solid fa-user-clock"></i></div>
                <h4>No Pending Requests</h4>
                <p>When new specialist doctors register via the portal, their requests will appear here for review.</p>
              </div>
            </td>
          </tr>`;
      } else {
        pendingDocs.forEach(doc => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>
              <strong>${doc.name}</strong><br>
              <small style="color:var(--text-secondary);">${doc.email || 'No email'}</small>
            </td>
            <td>
              <strong>${doc.specialty}</strong><br>
              <small>Fee: ₹${doc.fee}</small>
            </td>
            <td>
              <strong>${doc.days}</strong><br>
              <small>${doc.time}</small>
            </td>
            <td>
              <div style="display:flex; gap:6px;">
                <button class="btn approve-pending-btn" style="padding:4px 8px; font-size:0.75rem; background:#10b981; color:#fff; border:none; border-radius:4px; cursor:pointer;" data-id="${doc.id}">Approve</button>
                <button class="btn reject-pending-btn" style="padding:4px 8px; font-size:0.75rem; background:#ef4444; color:#fff; border:none; border-radius:4px; cursor:pointer;" data-id="${doc.id}">Reject</button>
              </div>
            </td>
          `;
          pendingTbody.appendChild(tr);
        });
      }
    }

    // Doctors CRUD list table (Active only)
    const crudTbody = document.getElementById("admin-docs-list-tbody");
    crudTbody.innerHTML = "";
    activeDocs.forEach(doc => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="padding: 16px 20px; vertical-align: middle;">
          <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem; margin-bottom: 2px;">${doc.name}</div>
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 500;">${doc.exp} Experience</div>
        </td>
        <td style="padding: 16px 20px; vertical-align: middle; font-weight: 600; color: #475569;">
          ${doc.specialty}
        </td>
        <td style="padding: 16px 20px; vertical-align: middle;">
          <div style="font-weight: 700; color: #0f172a; font-size: 0.85rem; margin-bottom: 2px;">${doc.days}</div>
          <div style="font-size: 0.75rem; color: #475569; font-weight: 500;">${doc.time}</div>
        </td>
        <td style="padding: 16px 20px; vertical-align: middle; text-align: center;">
          <span class="badge-status ${doc.status === 'Available' ? 'success' : doc.status === 'Busy' ? 'danger' : doc.status === 'Running Late' ? 'warning' : 'neutral'}">
            ${doc.status}
          </span>
        </td>
        <td style="padding: 16px 20px; vertical-align: middle;">
          <div style="display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 700;">ID:</span>
            <code style="font-size: 0.75rem; color: #0f172a; font-family: monospace; font-weight: 800;">${doc.username || 'N/A'}</code>
          </div>
        </td>
        <td style="padding: 16px 20px; vertical-align: middle; text-align: center;">
          <div style="display: inline-flex; gap: 8px; justify-content: center; align-items: center;">
            <button class="btn btn-secondary edit-doc-btn" style="padding: 6px 12px; font-size: 0.75rem; font-weight: 700; border-radius: 6px; border: 1px solid #cbd5e1; background: #fff; color: #334155; cursor: pointer; transition: all 0.15s ease;" data-id="${doc.id}">Edit</button>
            <button class="btn btn-primary delete-doc-btn" style="padding: 6px 12px; font-size: 0.75rem; font-weight: 700; border-radius: 6px; border: none; background: #ef4444; color: #fff; cursor: pointer; transition: all 0.15s ease;" data-id="${doc.id}">Delete</button>
          </div>
        </td>
      `;
      crudTbody.appendChild(tr);
    });

    // Mappings table
    const mappingsTbody = document.getElementById("admin-disease-tbody");
    mappingsTbody.innerHTML = "";
    const activeMappings = Object.entries(diseaseMap);
    if (activeMappings.length === 0) {
      mappingsTbody.innerHTML = `
        <tr>
          <td colspan="3">
            <div class="empty-state-card" style="margin: 20px auto;">
              <div class="empty-state-icon"><i class="fa-solid fa-tags"></i></div>
              <h4>No Symptom Mappings</h4>
              <p>Enter new symptom keywords and department pairings above to guide patients instantly.</p>
            </div>
          </td>
        </tr>`;
    } else {
      activeMappings.forEach(([kw, dept]) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${kw}</strong></td>
          <td>${dept}</td>
          <td>
            <button class="btn btn-primary remove-mapping-btn" style="padding:4px 8px; font-size:0.75rem; background:#ef4444;" data-kw="${kw}">Remove</button>
          </td>
        `;
        mappingsTbody.appendChild(tr);
      });
    }

    // Bind event action elements
    document.querySelectorAll(".edit-doc-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        triggerEditDoctor(btn.getAttribute("data-id"));
      });
    });

    document.querySelectorAll(".delete-doc-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        deleteDoctor(btn.getAttribute("data-id"));
      });
    });

    document.querySelectorAll(".approve-pending-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        approveDoctor(btn.getAttribute("data-id"));
      });
    });

    document.querySelectorAll(".reject-pending-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        rejectDoctor(btn.getAttribute("data-id"));
      });
    });

    document.querySelectorAll(".remove-mapping-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        deleteSymptomMapping(btn.getAttribute("data-kw"));
      });
    });
  }

  // 5. Doctor Enrollment CRUD Handlers
  document.getElementById("admin-doctor-form").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const editId = document.getElementById("admin-doc-edit-id").value;
    const name = document.getElementById("admin-doc-name").value.trim();
    const dept = document.getElementById("admin-doc-dept").value;
    const exp = document.getElementById("admin-doc-exp").value.trim();
    const days = document.getElementById("admin-doc-days").value.trim();
    const time = document.getElementById("admin-doc-time").value.trim();
    const fee = parseInt(document.getElementById("admin-doc-fee").value);
    const status = document.getElementById("admin-doc-status").value;

    if (editId) {
      // Edit mode
      const idx = doctors.findIndex(d => d.id === editId);
      if (idx !== -1) {
        doctors[idx] = { ...doctors[idx], name, specialty: dept, exp, days, time, fee, status };
        alert("Specialist details updated.");
      }
    } else {
      // Add mode
      const generatedId = "PHH-" + Math.floor(100 + Math.random() * 900);
      const generatedPassword = Math.random().toString(36).slice(-6);

      const newDoc = {
        id: "doc-" + Math.floor(1000 + Math.random() * 9000),
        name, specialty: dept, exp, days, time, fee, status, rating: null,
        username: generatedId,
        password: generatedPassword,
        email: `${generatedId}@hub.com`
      };
      doctors.push(newDoc);
      
      // Show custom credentials modal instead of simple alert
      document.getElementById("cred-username").textContent = generatedId;
      document.getElementById("cred-password").textContent = generatedPassword;
      const credModal = document.getElementById("credential-modal");
      if (credModal) {
        credModal.style.display = "flex";
        setTimeout(() => credModal.classList.add("active"), 10);
        document.body.classList.add("modal-open");
      }

    }

    localStorage.setItem("phh_doctors", JSON.stringify(doctors));
    
    // Reset form styling
    resetDoctorForm();
    syncAdminDashboardData();
  });

  function triggerEditDoctor(docId) {
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      document.getElementById("admin-doc-form-title").textContent = `Edit Details: ${doc.name}`;
      document.getElementById("admin-doc-edit-id").value = doc.id;
      
      document.getElementById("admin-doc-name").value = doc.name;
      document.getElementById("admin-doc-dept").value = doc.specialty;
      document.getElementById("admin-doc-exp").value = doc.exp;
      document.getElementById("admin-doc-days").value = doc.days;
      document.getElementById("admin-doc-time").value = doc.time;
      document.getElementById("admin-doc-fee").value = doc.fee;
      document.getElementById("admin-doc-status").value = doc.status;

      document.querySelectorAll("#admin-doc-form .form-control").forEach(updateFilledState);

      document.getElementById("admin-doc-submit-btn").textContent = "Save Updates";
      document.getElementById("admin-doc-cancel-btn").style.display = "block";
    }
  }

  document.getElementById("admin-doc-cancel-btn").addEventListener("click", resetDoctorForm);

  function resetDoctorForm() {
    document.getElementById("admin-doctor-form").reset();
    document.getElementById("admin-doc-edit-id").value = "";
    document.getElementById("admin-doc-submit-btn").textContent = "Enroll Doctor";
    document.getElementById("admin-doc-cancel-btn").style.display = "none";
    document.getElementById("admin-doc-form-title").textContent = "Enroll New Specialist Doctor";
    document.querySelectorAll(".form-control").forEach(updateFilledState);
  }

  async function deleteDoctor(docId) {
    if (await window.customConfirm("Are you sure you want to remove this doctor from records?")) {
      doctors = doctors.filter(d => d.id !== docId);
      localStorage.setItem("phh_doctors", JSON.stringify(doctors));
      syncAdminDashboardData();
    }
  }

  async function approveDoctor(docId) {
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
        doctors = data.doctors;
        doctorRequests = data.doctorRequests;
        
        localStorage.setItem("phh_doctors", JSON.stringify(doctors));
        localStorage.setItem("phh_doctor_requests", JSON.stringify(doctorRequests));
        
        syncAdminDashboardData();
        alert(data.message || `Doctor has been successfully approved.`);
      } else {
        alert(data.message || "Failed to approve doctor request.");
      }
    } catch (err) {
      console.error("Doctor approval error:", err);
      alert("Failed to approve doctor request due to a server error.");
    }
  }

  async function rejectDoctor(docId) {
    const reqIndex = doctorRequests.findIndex(d => d.id === docId);
    if (reqIndex === -1) return;
    const doc = doctorRequests[reqIndex];
    if (!(await window.customConfirm(`Are you sure you want to reject and delete the profile registration for ${doc.name}?`))) {
      return;
    }

    try {
      const apiBase = window.API_BASE || '';
      const response = await fetch(`${apiBase}/api/admin/reject-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ docId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        doctors = data.doctors;
        doctorRequests = data.doctorRequests;
        
        localStorage.setItem("phh_doctors", JSON.stringify(doctors));
        localStorage.setItem("phh_doctor_requests", JSON.stringify(doctorRequests));
        
        syncAdminDashboardData();
        alert(data.message || `Doctor request has been successfully rejected.`);
      } else {
        alert(data.message || "Failed to reject doctor request.");
      }
    } catch (err) {
      console.error("Doctor rejection error:", err);
      alert("Failed to reject doctor request due to a server error.");
    }
  }

  // 6. Symptom Lookup definers
  document.getElementById("admin-disease-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = document.getElementById("admin-dis-keyword").value.trim().toLowerCase();
    const dept = document.getElementById("admin-dis-dept").value;

    if (!keyword || !dept) return;

    diseaseMap[keyword] = dept;
    localStorage.setItem("phh_disease_map", JSON.stringify(diseaseMap));
    
    document.getElementById("admin-disease-form").reset();
    document.querySelectorAll(".form-control").forEach(updateFilledState);

    alert(`Symptom word "${keyword}" successfully mapped to ${dept}`);
    syncAdminDashboardData();
  });

  async function deleteSymptomMapping(keyword) {
    if (await window.customConfirm(`Remove disease keyword mapping for "${keyword}"?`)) {
      delete diseaseMap[keyword];
      localStorage.setItem("phh_disease_map", JSON.stringify(diseaseMap));
      syncAdminDashboardData();
    }
  }

  // 7. Floating labels helper
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

  // 8. Logout handler
  document.getElementById("admin-logout").addEventListener("click", () => {
    localStorage.removeItem("phh_current_user");
    window.location.href = "portal-login.html";
  });

  // Initial Sync
  syncAdminDashboardData();

  // Helper for admin sync execution
  function performAdminSync() {
    doctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    doctorRequests = JSON.parse(localStorage.getItem("phh_doctor_requests")) || [];
    appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
    diseaseMap = JSON.parse(localStorage.getItem("phh_disease_map")) || {};
    syncAdminDashboardData();
  }

  // Watch for storage changes on other pages
  window.addEventListener("storage", (e) => {
    if (e.key === "phh_doctors" || e.key === "phh_doctor_requests" || e.key === "phh_appointments" || e.key === "phh_disease_map") {
      performAdminSync();
    }
  });

  // Local sync trigger
  window.addEventListener("storage_local", () => {
    performAdminSync();
  });

  // Robust Periodic Sync Polling Fallback (for file:// protocol compatibility)
  let lastDoctorsStr = localStorage.getItem("phh_doctors");
  let lastDoctorRequestsStr = localStorage.getItem("phh_doctor_requests");
  let lastAppointmentsStr = localStorage.getItem("phh_appointments");
  let lastDiseaseMapStr = localStorage.getItem("phh_disease_map");

  setInterval(() => {
    let changed = false;

    const currentDocsStr = localStorage.getItem("phh_doctors");
    if (currentDocsStr !== lastDoctorsStr) {
      lastDoctorsStr = currentDocsStr;
      changed = true;
    }

    const currentRequestsStr = localStorage.getItem("phh_doctor_requests");
    if (currentRequestsStr !== lastDoctorRequestsStr) {
      lastDoctorRequestsStr = currentRequestsStr;
      changed = true;
    }

    const currentApptsStr = localStorage.getItem("phh_appointments");
    if (currentApptsStr !== lastAppointmentsStr) {
      lastAppointmentsStr = currentApptsStr;
      changed = true;
    }

    const currentDiseaseMapStr = localStorage.getItem("phh_disease_map");
    if (currentDiseaseMapStr !== lastDiseaseMapStr) {
      lastDiseaseMapStr = currentDiseaseMapStr;
      changed = true;
    }

    if (changed) {
      performAdminSync();
    }
  }, 1000);

  // ================= CSV BULK IMPORT HANDLERS =================
  const csvDragZone = document.getElementById("csv-drag-zone");
  const csvFileInput = document.getElementById("csv-file-input");

  if (csvDragZone && csvFileInput) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      csvDragZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Highlight drop zone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
      csvDragZone.addEventListener(eventName, () => {
        csvDragZone.style.borderColor = "var(--primary)";
        csvDragZone.style.background = "rgba(0, 102, 255, 0.08)";
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      csvDragZone.addEventListener(eventName, () => {
        csvDragZone.style.borderColor = "rgba(0, 102, 255, 0.25)";
        csvDragZone.style.background = "rgba(0, 102, 255, 0.02)";
      }, false);
    });

    // Handle dropped files
    csvDragZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleCSVFile(files[0]);
      }
    });

    csvFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleCSVFile(e.target.files[0]);
      }
    });
  }

  function handleCSVFile(file) {
    if (!file.name.endsWith('.csv')) {
      alert("Invalid file format. Please upload a .csv file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      processCSVData(text);
    };
    reader.onerror = function() {
      alert("Error reading file.");
    };
    reader.readAsText(file);
  }

  function processCSVData(text) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) {
      alert("CSV file is empty.");
      return;
    }

    let startIndex = 0;
    // Check if first line is a header
    const firstLineFields = parseCSVLine(lines[0]);
    if (firstLineFields.length > 0) {
      const firstField = firstLineFields[0].toLowerCase();
      if (firstField === "name" || firstField === "doctor name" || firstField === "username" || firstField === "id" || firstField === "specialist") {
        startIndex = 1;
      }
    }

    const importedDoctors = [];
    const credsList = [];

    for (let i = startIndex; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      if (fields.length < 2) continue; // Minimum required: name and specialty

      const name = fields[0];
      const specialty = fields[1];
      if (!name || !specialty) continue;

      const exp = fields[2] || '1 Year';
      const days = fields[3] || 'Monday to Friday';
      const time = fields[4] || '9 AM - 5 PM';
      const fee = parseInt(fields[5]) || 500;

      // Generate unique IDs and passwords
      let isUnique = false;
      let generatedId = "";
      while (!isUnique) {
        const randNum = Math.floor(100 + Math.random() * 900);
        generatedId = `PHH-${randNum}`;
        // check if this generatedId already exists in doctors list
        if (!doctors.some(d => d.username === generatedId)) {
          isUnique = true;
        }
      }

      let generatedDocId = "";
      let isDocIdUnique = false;
      while (!isDocIdUnique) {
        const randNum = Math.floor(1000 + Math.random() * 9000);
        generatedDocId = `doc-${randNum}`;
        if (!doctors.some(d => d.id === generatedDocId)) {
          isDocIdUnique = true;
        }
      }

      const generatedPassword = Math.random().toString(36).slice(-6);

      const newDoc = {
        id: generatedDocId,
        name: name,
        specialty: specialty,
        exp: exp,
        days: days,
        time: time,
        fee: fee,
        status: 'Available', // Active immediately
        rating: null,
        username: generatedId,
        password: generatedPassword,
        email: `${generatedId}@hub.com`
      };

      importedDoctors.push(newDoc);
      credsList.push({
        name: name,
        username: generatedId,
        password: generatedPassword
      });
    }

    if (importedDoctors.length === 0) {
      alert("No valid doctor profiles found in CSV file.");
      return;
    }

    // Merge into local doctors list
    doctors = [...doctors, ...importedDoctors];
    localStorage.setItem("phh_doctors", JSON.stringify(doctors));

    // Render bulk credentials modal
    const bulkTbody = document.getElementById("bulk-cred-tbody");
    if (bulkTbody) {
      bulkTbody.innerHTML = "";
      credsList.forEach(cred => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding:10px 15px; font-size:0.85rem;"><strong>${cred.name}</strong></td>
          <td style="padding:10px 15px; font-size:0.85rem; font-family:monospace;">${cred.username}</td>
          <td style="padding:10px 15px; font-size:0.85rem; font-family:monospace;"><code>${cred.password}</code></td>
        `;
        bulkTbody.appendChild(tr);
      });
    }

    // Save to window for copy utility
    window.importedCreds = credsList;

    // Show modal
    const bulkCredModal = document.getElementById("bulk-credential-modal");
    if (bulkCredModal) {
      bulkCredModal.style.display = "flex";
      document.body.classList.add("modal-open");
    }

    syncAdminDashboardData();
    alert(`Successfully imported ${importedDoctors.length} doctors.`);
  }

  function parseCSVLine(text) {
    const result = [];
    let insideQuote = false;
    let currentVal = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        result.push(currentVal.trim());
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    result.push(currentVal.trim());
    return result;
  }

  const credModal = document.getElementById("credential-modal");
  if (credModal) {
    credModal.addEventListener("click", (e) => {
      if (e.target === credModal) {
        window.closeCredentialModal();
      }
    });
  }

  const bulkCredModal = document.getElementById("bulk-credential-modal");
  if (bulkCredModal) {
    bulkCredModal.addEventListener("click", (e) => {
      if (e.target === bulkCredModal) {
        window.closeBulkCredentialModal();
      }
    });
  }
});


// Custom modal helper functions for credentials popup
window.closeCredentialModal = function() {
  const modal = document.getElementById("credential-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
      if (!modal.classList.contains("active")) {
        modal.style.display = "none";
      }
    }, 400);
  }
};

window.copyGeneratedCredentials = function() {
  const user = document.getElementById("cred-username").textContent;
  const pass = document.getElementById("cred-password").textContent;
  navigator.clipboard.writeText(`Doctor ID: ${user}\nPassword: ${pass}`)
    .then(() => {
      alert("Credentials copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy credentials: ", err);
    });
};

window.closeBulkCredentialModal = function() {
  const modal = document.getElementById("bulk-credential-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
};

window.copyBulkCredentials = function() {
  if (!window.importedCreds || window.importedCreds.length === 0) {
    alert("No credentials to copy.");
    return;
  }
  const text = window.importedCreds.map(c => `Doctor: ${c.name}\nID: ${c.username}\nPassword: ${c.password}`).join("\n\n");
  navigator.clipboard.writeText(text)
    .then(() => {
      alert("All imported credentials copied to clipboard!");
    })
    .catch(err => {
      console.error("Failed to copy credentials: ", err);
    });
};
