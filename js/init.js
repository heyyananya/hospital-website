/* Superspeciality Doctors Consultation - Database Initializer (Clean/Fresh Setup) */

// URL query parameter database reset trigger
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("reset-db") || urlParams.has("reset")) {
  // Clear frontend local storage
  localStorage.removeItem("phh_doctors");
  localStorage.removeItem("phh_appointments");
  localStorage.removeItem("phh_slots");
  localStorage.removeItem("phh_current_user");

  // Call backend reset API to clear PostgreSQL tables
  const apiBase = window.API_BASE || '';
  fetch(`${apiBase}/api/sync/reset`, { method: 'POST' })
    .then(() => {
      // Clean the URL query string and reload
      window.location.href = window.location.pathname;
    })
    .catch(err => {
      console.error('Error resetting database:', err);
      window.location.href = window.location.pathname;
    });
}

// Define empty defaults so files that reference them do not crash on first load
const DEFAULT_DOCTORS = [];
const DEFAULT_APPOINTMENTS = [];
const DEFAULT_DISEASE_MAP = {
  "cough": "Pulmonology",
  "fever": "General Medicine",
  "chest pain": "Cardiology",
  "migraine": "Neurology",
  "headache": "Neurology",
  "skin rash": "Dermatology",
  "ear pain": "ENT",
  "pregnancy": "Gynecology",
  "child fever": "Pediatrics",
  "anxiety": "Psychology",
  "bone fracture": "Orthopedics",
  "asthma": "Pulmonology",
  "heart burn": "Cardiology",
  "cold": "General Medicine",
  "flu": "General Medicine",
  "joint pain": "Orthopedics",
  "throat infection": "ENT",
  "acne": "Dermatology",
  "depression": "Psychology",
  "infant care": "Pediatrics"
};

// Remove default doctors from localStorage to ensure clean sync
try {
  const localDocsStr = localStorage.getItem("phh_doctors");
  if (localDocsStr) {
    const localDocs = JSON.parse(localDocsStr);
    if (localDocs.some(d => d.id === 'doc-1001' || d.id === 'doc-1002')) {
      localStorage.removeItem("phh_doctors");
      localStorage.removeItem("phh_slots");
    }
  }
} catch (e) {
  console.error("Error cleaning default doctors from localStorage:", e);
}

console.log("Superspeciality Doctors Consultation: Client database initializers verified. Starting from clean state.");

// ================= GLOBAL PREMIUM DIALOG SYSTEM =================

// Dynamically load Tailwind CSS play CDN if not already loaded (to style custom modals)
if (!document.querySelector('script[id="tailwind-cdn-script"]')) {
  const tailwindScript = document.createElement('script');
  tailwindScript.src = "https://cdn.tailwindcss.com";
  tailwindScript.id = "tailwind-cdn-script";
  document.head.appendChild(tailwindScript);
}

// Global Success / Error Toast notification function
window.showToast = function(message, type = 'success') {
  console.log('[window.showToast] Toast called:', message, type);
  let container = document.getElementById('global-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.right = '24px';
    container.style.zIndex = '9999999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white font-semibold transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto max-w-sm ${
    type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
  }`;
  
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg"></i>
    <span class="text-xs font-sans tracking-wide">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger entry animation
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  // Exit and remove
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
};

window.showSuccessToast = function(message) {
  window.showToast(message, 'success');
};

window.showErrorToast = function(message) {
  window.showToast(message, 'error');
};

// 1. Global Custom window.alert Override (Glassmorphic design using Tailwind CSS v3)
window.alert = function(message) {
  console.log('[window.alert] Custom Alert called:', message);
  return new Promise((resolve) => {
    let modal = document.getElementById('custom-alert-modal');
    if (!modal) {
      console.log('[window.alert] Modal not found, creating new custom-alert-modal');
      modal = document.createElement('div');
      modal.id = 'custom-alert-modal';
      modal.className = 'fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300';
      
      const card = document.createElement('div');
      card.className = 'relative bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-md w-full text-center transform scale-95 transition-transform duration-300';
      
      card.innerHTML = `
        <button id="custom-alert-close-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-150 text-lg outline-none cursor-pointer border-0 bg-transparent">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-6 text-2xl shadow-inner">
          <i class="fa-solid fa-circle-info"></i>
        </div>
        <h3 class="text-lg font-extrabold text-slate-900 tracking-tight mb-2">Notification</h3>
        <p id="custom-alert-message" class="text-sm font-medium text-slate-500 leading-relaxed mb-6 whitespace-pre-wrap break-words"></p>
        <button id="custom-alert-ok-btn" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md shadow-blue-500/10 cursor-pointer outline-none">
          OK
        </button>
      `;
      
      modal.appendChild(card);
      document.body.appendChild(modal);
    }
    
    const msgEl = modal.querySelector('#custom-alert-message');
    msgEl.textContent = message;
    
    const cardEl = modal.firstElementChild;
    
    const cleanup = () => {
      modal.classList.add('opacity-0', 'pointer-events-none');
      cardEl.classList.add('scale-95');
      cardEl.classList.remove('scale-100');
      document.body.classList.remove('modal-open');
      resolve();
    };
    
    const okBtn = modal.querySelector('#custom-alert-ok-btn');
    const newOkBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);
    newOkBtn.addEventListener('click', cleanup);

    const closeBtn = modal.querySelector('#custom-alert-close-btn');
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    newCloseBtn.addEventListener('click', cleanup);
    
    document.body.classList.add('modal-open');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      cardEl.classList.remove('scale-95');
      cardEl.classList.add('scale-100');
    }, 10);
  });
};

// 2. Global Custom Confirm Dialog (Returns Promise, Glassmorphic design using Tailwind CSS v3)
window.customConfirm = function(message) {
  console.log('[window.customConfirm] Called with message:', message);
  return new Promise((resolve) => {
    let modal = document.getElementById('custom-confirm-modal');
    if (!modal) {
      console.log('[window.customConfirm] Modal not found, creating new custom-confirm-modal');
      modal = document.createElement('div');
      modal.id = 'custom-confirm-modal';
      modal.className = 'fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300';
      
      const card = document.createElement('div');
      card.className = 'relative bg-white rounded-2xl shadow-xl border border-red-50 p-8 max-w-md w-full text-center transform scale-95 transition-transform duration-300';
      
      card.innerHTML = `
        <button id="custom-confirm-close-btn" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-150 text-lg outline-none cursor-pointer border-0 bg-transparent">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 text-red-600 mb-6 text-2xl shadow-inner">
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <h3 class="text-lg font-extrabold text-slate-900 tracking-tight mb-2">Confirmation Required</h3>
        <p id="custom-confirm-message" class="text-sm font-medium text-slate-500 leading-relaxed mb-6 whitespace-pre-wrap break-words"></p>
        <div class="flex gap-4">
          <button id="custom-confirm-cancel-btn" class="flex-1 py-3 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all duration-150 cursor-pointer outline-none">
            Cancel
          </button>
          <button id="custom-confirm-yes-btn" class="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md shadow-red-500/10 cursor-pointer outline-none">
            Confirm
          </button>
        </div>
      `;
      
      modal.appendChild(card);
      document.body.appendChild(modal);
    } else {
      console.log('[window.customConfirm] Reusing existing custom-confirm-modal');
    }
    
    const msgEl = modal.querySelector('#custom-confirm-message');
    msgEl.textContent = message;
    
    const iconContainer = modal.querySelector('.rounded-full');
    const iconEl = iconContainer.querySelector('i');
    const yesBtn = modal.querySelector('#custom-confirm-yes-btn');
    
    const msgLower = message.toLowerCase();
    if (msgLower.includes('delete') || msgLower.includes('remove') || msgLower.includes('reject') || msgLower.includes('cancel')) {
      iconContainer.className = "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 text-rose-600 mb-6 text-2xl shadow-inner";
      iconEl.className = "fa-solid fa-trash-can";
      yesBtn.className = "flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md shadow-rose-500/10 cursor-pointer outline-none";
      yesBtn.textContent = "Confirm Delete";
    } else {
      iconContainer.className = "mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-6 text-2xl shadow-inner";
      iconEl.className = "fa-solid fa-circle-question";
      yesBtn.className = "flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all duration-150 shadow-md shadow-blue-500/10 cursor-pointer outline-none";
      yesBtn.textContent = "Confirm";
    }
    
    const cardEl = modal.firstElementChild;
    
    const cleanup = (val) => {
      console.log('[window.customConfirm] Cleanup triggered with value:', val);
      modal.classList.add('opacity-0', 'pointer-events-none');
      cardEl.classList.add('scale-95');
      cardEl.classList.remove('scale-100');
      document.body.classList.remove('modal-open');
      resolve(val);
    };
    
    const cancelBtn = modal.querySelector('#custom-confirm-cancel-btn');
    const closeBtn = modal.querySelector('#custom-confirm-close-btn');
    
    const newCancelBtn = cancelBtn.cloneNode(true);
    const newYesBtn = yesBtn.cloneNode(true);
    const newCloseBtn = closeBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    newCancelBtn.addEventListener('click', () => {
      console.log('[window.customConfirm] Cancel clicked');
      cleanup(false);
    });
    newYesBtn.addEventListener('click', () => {
      console.log('[window.customConfirm] Yes/Confirm clicked');
      cleanup(true);
    });
    newCloseBtn.addEventListener('click', () => {
      console.log('[window.customConfirm] Close icon clicked');
      cleanup(false);
    });
    
    document.body.classList.add('modal-open');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      cardEl.classList.remove('scale-95');
      cardEl.classList.add('scale-100');
    }, 10);
  });
};

window.confirm = window.customConfirm;

// Premium PDF Receipt Downloader
window.downloadReceiptPDF = function(app) {
  const jspdfLib = window.jspdf || (window.window && window.window.jspdf);
  if (!jspdfLib) {
    alert("PDF library is still loading. Please try again in a moment.");
    return;
  }
  
  const { jsPDF } = jspdfLib;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Color Palette
  const primaryColor = [0, 102, 255]; // #0066ff
  const darkTextColor = [30, 41, 59]; // #1e293b
  const lightTextColor = [100, 116, 139]; // #64748b
  const successColor = [16, 185, 129]; // #10b981
  const lightBgColor = [248, 250, 252]; // #f8fafc

  // Header Banner Background Accent
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 8, "F");

  // Hospital Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text("PALANPUR HEALTH HUB", 20, 25);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...lightTextColor);
  doc.text("Superspeciality Doctors Consultation Network", 20, 31);
  doc.text("Deesa Crossroads, Palanpur, Gujarat - 385001", 20, 36);

  // Receipt Label
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...darkTextColor);
  doc.text("OFFICIAL PAYMENT RECEIPT", 130, 25);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);

  // Grid Details: Left Side (Patient Details)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("PATIENT INFORMATION", 20, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...darkTextColor);
  doc.text(`Name: ${app.patientName || 'Guest Patient'}`, 20, 59);
  doc.text(`Mobile: ${app.patientPhone || 'N/A'}`, 20, 65);
  doc.text(`Email ID: ${app.patientEmail || 'N/A'}`, 20, 71);

  // Grid Details: Right Side (Booking Meta)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("TRANSACTION DETAILS", 120, 52);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...darkTextColor);
  doc.text(`Receipt Number: ${app.id || 'N/A'}`, 120, 59);
  doc.text(`Payment ID: ${app.payId || 'N/A'}`, 120, 65);
  doc.text(`Status:`, 120, 71);
  
  // Green PAID pill
  doc.setFillColor(...successColor);
  doc.rect(133, 67, 14, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("PAID", 136, 71);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, 77, 190, 77);

  // Appointment summary header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("CONSULTATION SUMMARY", 20, 87);

  // Light box for consultation details
  doc.setFillColor(...lightBgColor);
  doc.rect(20, 92, 170, 32, "F");
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);
  doc.text(`Specialist Doctor:`, 25, 99);
  doc.setFont("helvetica", "bold");
  doc.text(`${app.doctorName || 'N/A'}`, 62, 99);

  doc.setFont("helvetica", "normal");
  doc.text(`Specialty / Dept:`, 25, 106);
  doc.setFont("helvetica", "bold");
  doc.text(`${app.dept || 'General Medicine'}`, 62, 106);

  doc.setFont("helvetica", "normal");
  doc.text(`Scheduled Timing:`, 25, 113);
  doc.setFont("helvetica", "bold");
  doc.text(`${app.date} / ${app.slot}`, 62, 113);

  doc.setFont("helvetica", "normal");
  doc.text(`Clinical Symptoms:`, 25, 120);
  doc.setFont("helvetica", "italic");
  doc.text(`${app.symptoms || app.symptom || 'General Consultation'}`, 62, 120);

  // Invoice Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(20, 134, 170, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...darkTextColor);
  doc.text("Service Description", 25, 139.5);
  doc.text("Amount (INR)", 185, 139.5, { align: "right" });

  // Invoice Table Row
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);
  let cleanDocName = app.doctorName || '';
  if (cleanDocName && !cleanDocName.toLowerCase().startsWith('dr.') && !cleanDocName.toLowerCase().startsWith('dr ')) {
    cleanDocName = 'Dr. ' + cleanDocName;
  }
  doc.text(`Superspeciality Consultation Fee (${cleanDocName})`, 25, 150);
  doc.text(`${Number(app.fee || 600).toFixed(2)}`, 185, 150, { align: "right" });

  // Line under table row
  doc.setDrawColor(241, 245, 249);
  doc.line(20, 155, 190, 155);

  // Totals Area
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...lightTextColor);
  doc.text("Subtotal:", 140, 163);
  doc.setTextColor(...darkTextColor);
  doc.text(`${Number(app.fee || 600).toFixed(2)}`, 185, 163, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightTextColor);
  doc.text("Tax / GST (0.00%):", 140, 169);
  doc.setTextColor(...darkTextColor);
  doc.text("0.00", 185, 169, { align: "right" });

  // Final Total Rule
  doc.setDrawColor(226, 232, 240);
  doc.line(130, 173, 190, 173);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text("Net Total Paid:", 140, 180);
  doc.text(`Rs. ${Number(app.fee || 600).toFixed(2)}`, 185, 180, { align: "right" });

  // Footer Box
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 205, 190, 205);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...lightTextColor);
  doc.text("Note: This is a secure digital receipt verifying transaction status via Razorpay Gateway.", 105, 212, { align: "center" });
  doc.text("Please show this receipt on your mobile screen during receptionist desk check-in.", 105, 217, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...lightTextColor);
  doc.text("For feedback or helpline support: +91 98765 43210  |  support@palanpurhealthhub.com", 105, 225, { align: "center" });

  // Save the PDF
  const filename = `Receipt_${app.id || 'booking'}.pdf`;
  doc.save(filename);
};

