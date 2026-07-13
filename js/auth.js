/* Superspeciality Doctors Consultation - Authentication Engine */

// Multilingual Dictionaries for Login Portal
const AUTH_TRANSLATIONS = {
  en: {
    "brand-logo": "<span class=\"logo-top\">Superspeciality</span><span class=\"logo-accent logo-bottom\">Doctors Consultation</span>",
    "auth-gate-title": "Secure Gateway Portal",
    "auth-gate-p": "Access the Superspeciality Doctors Consultation workspace or patient portal.",
    "tab-patient": "Patient Portal",
    "tab-staff": "Staff Workspace",
    "auth-patient-title": "Patient Dashboard Login",
    "auth-patient-p": "Enter your registered mobile number or email for secure verification.",
    "patient-login-label": "Email or Mobile Number",
    "btn-get-otp": "Get Verification OTP",
    "otp-sent-hint": "OTP sent! (Use test code: 123456)",
    "patient-otp-placeholder": "Enter 6-digit Code",
    "btn-verify-login": "Verify & Enter Dashboard",
    "auth-staff-title": "Staff Workspace Login",
    "auth-staff-p": "Enter front desk, medical specialist, or system administrator credentials.",
    "staff-username-label": "Username or Email ID",
    "staff-pass-label": "Password",
    "btn-login-staff": "Enter Workspace",
    "return-home": "Return to Homepage",
    "footer-copyright": "&copy; 2026 Superspeciality Doctors Consultation. Smart Hospital Solutions.",
    "auth-patient-register-title": "Patient Registration",
    "auth-patient-register-p": "Create a new patient profile to track history and book slots.",
    "patient-register-name-label": "Full Name",
    "patient-register-email-label": "Email ID",
    "patient-register-phone-label": "Mobile Number",
    "btn-register-otp": "Register & Get OTP",
    "btn-register-confirm": "Verify & Create Account",
    "patient-new-text": "New Patient?",
    "patient-register-link": "Register Profile",
    "patient-exist-text": "Already have an account?",
    "patient-login-link": "Login here"
  },
  gu: {
    "brand-logo": "<span class=\"logo-top\">સુપરસ્પેશિયાલિટી</span><span class=\"logo-accent logo-bottom\">ડોકટર્સ કન્સલ્ટેશન</span>",
    "auth-gate-title": "સુરક્ષિત ગેટવે પોર્ટલ",
    "auth-gate-p": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન વર્કસ્પેસ અથવા પેશન્ટ પોર્ટલ ઍક્સેસ કરો.",
    "tab-patient": "દર્દી પોર્ટલ",
    "tab-staff": "સ્ટાફ વર્કસ્પેસ",
    "auth-patient-title": "દર્દી પોર્ટલ લોગિન",
    "auth-patient-p": "ઓટીપી મેળવવા માટે તમારો નોંધાયેલ મોબાઈલ નંબર અથવા ઇમેઇલ દાખલ કરો.",
    "patient-login-label": "ઇમેઇલ અથવા મોબાઇલ નંબર",
    "btn-get-otp": "વેરિફિકેશન OTP મેળવો",
    "otp-sent-hint": "ઓટીપી મોકલી દીધો છે! (ટેસ્ટ કોડ: ૧૨૩૪૫૬ વાપરો)",
    "patient-otp-placeholder": "૬-આંકડાનો કોડ દાખલ કરો",
    "btn-verify-login": "વેરિફાય કરો અને ડેશબોર્ડમાં પ્રવેશ કરો",
    "auth-staff-title": "સ્ટાફ વર્કસ્પેસ લોગિન",
    "auth-staff-p": "એડમિન, ડૉક્ટર અથવા રીસેપ્શનિસ્ટ વર્કસ્પેસમાં પ્રવેશ કરવા ઓળખપત્ર દાખલ કરો.",
    "staff-username-label": "વપરાશકર્તા નામ અથવા ઇમેઇલ ID",
    "staff-pass-label": "પાસવર્ડ",
    "btn-login-staff": "વર્કસ્પેસમાં પ્રવેશ કરો",
    "return-home": "મુખ્ય પૃષ્ઠ પર પાછા ફરો",
    "footer-copyright": "&copy; ૨૦૨૬ સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન. સ્માર્ટ હોસ્પિટલ સોલ્યુશન્સ.",
    "auth-patient-register-title": "દર્દી નોંધણી",
    "auth-patient-register-p": "ઇતિહાસ ટ્રૅક કરવા અને સ્લોટ બુક કરવા માટે નવી દર્દી પ્રોફાઇલ બનાવો.",
    "patient-register-name-label": "પૂરું નામ",
    "patient-register-email-label": "ઇમેઇલ ID",
    "patient-register-phone-label": "મોબાઇલ નંબર",
    "btn-register-otp": "નોંધણી કરો અને OTP મેળવો",
    "btn-register-confirm": "વેરિફાય કરો અને એકાઉન્ટ બનાવો",
    "patient-new-text": "નવા દર્દી?",
    "patient-register-link": "પ્રોફાઇલ નોંધણી કરો",
    "patient-exist-text": "પહેલાથી એકાઉન્ટ છે?",
    "patient-login-link": "અહીં લોગિન કરો"
  },
  hi: {
    "brand-logo": "<span class=\"logo-top\">सुपरस्पेशलिटी</span><span class=\"logo-accent logo-bottom\">डॉक्टर्स कंसल्टेशन</span>",
    "auth-gate-title": "सुरक्षित गेटवे पोर्टल",
    "auth-gate-p": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन वर्कस्पेस या रोगी पोर्टल तक पहुंचें।",
    "tab-patient": "रोगी पोर्टल",
    "tab-staff": "स्टाफ वर्कस्पेस",
    "auth-patient-title": "मरीज पोर्टल लॉगिन",
    "auth-patient-p": "सुरक्षित सत्यापन के लिए अपना पंजीकृत मोबाइल नंबर या ईमेल दर्ज करें।",
    "patient-login-label": "ईमेल या मोबाइल नंबर",
    "btn-get-otp": "सत्यापन ओटीपी प्राप्त करें",
    "otp-sent-hint": "ओटीपी भेजा गया! (परीक्षण कोड: 123456 का उपयोग करें)",
    "patient-otp-placeholder": "6-अंकों का कोड दर्ज करें",
    "btn-verify-login": "सत्यापित करें और डैशबोर्ड में प्रवेश करें",
    "auth-staff-title": "स्टाफ वर्कस्पेस लॉगिन",
    "auth-staff-p": "एडमिन, डॉक्टर या रिसेप्शनिस्ट वर्कस्पेस तक पहुंचने के लिए क्रेडेंशियल दर्ज करें।",
    "staff-username-label": "यूज़रनेम या ईमेल आईडी",
    "staff-pass-label": "पासवर्ड",
    "btn-login-staff": "वर्कस्पेस में प्रवेश करें",
    "return-home": "मुख्य पृष्ठ पर लौटें",
    "footer-copyright": "&copy; 2026 सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन। स्मार्ट अस्पताल समाधान।",
    "auth-patient-register-title": "रोगी पंजीकरण",
    "auth-patient-register-p": "इतिहास को ट्रैक करने और स्लॉट बुक करने के लिए एक नई रोगी प्रोफ़ाइल बनाएं।",
    "patient-register-name-label": "पूरा नाम",
    "patient-register-email-label": "ईमेल आईडी",
    "patient-register-phone-label": "मोबाइल नंबर",
    "btn-register-otp": "पंजीकरण करें और ओटीपी प्राप्त करें",
    "btn-register-confirm": "सत्यापित करें और खाता बनाएं",
    "patient-new-text": "नए रोगी?",
    "patient-register-link": "प्रोफ़ाइल पंजीकृत करें",
    "patient-exist-text": "पहले से खाता मौजूद है?",
    "patient-login-link": "यहाँ लॉगिन करें"
  }
};

const AUTH_ALERTS = {
  en: {
    emptyPatient: "Please enter a valid mobile number or email address.",
    invalidOtp: "Invalid verification code. Please check the screen hint (Test code: 123456).",
    invalidStaff: "Invalid staff username/email or password.",
    emptyStaff: "Please enter both username and password."
  },
  gu: {
    emptyPatient: "કૃપા કરીને માન્ય મોબાઇલ નંબર અથવા ઇમેઇલ સરનામું દાખલ કરો.",
    invalidOtp: "અમાન્ય વેરિફિકેશન કોડ. કૃપા કરીને સ્ક્રીન પર આપેલ સંકેત તપાસો (ટેસ્ટ કોડ: ૧૨૩૪૬).",
    invalidStaff: "અમાન્ય વપરાશકર્તા નામ અથવા પાસવર્ડ.",
    emptyStaff: "કૃપા કરીને વપરાશકર્તા નામ અને પાસવર્ડ બંને દાખલ કરો."
  },
  hi: {
    emptyPatient: "कृपया एक वैध मोबाइल नंबर या ईमेल पता दर्ज करें।",
    invalidOtp: "अमान्य सत्यापन कोड। कृपया स्क्रीन पर दिए गए संकेत की जांच करें (परीक्षण कोड: 123456)।",
    invalidStaff: "अमान्य यूज़रनेम या पासवर्ड।",
    emptyStaff: "कृपया यूज़रनेम और पासवर्ड दोनों दर्ज करें।"
  }
};

let currentLanguage = localStorage.getItem("phh_lang") || "en";
if (currentLanguage === "mr") {
  currentLanguage = "en";
  localStorage.setItem("phh_lang", "en");
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("phh_lang", lang);
  
  const currentLangSpan = document.getElementById("current-lang");
  if (currentLangSpan) {
    currentLangSpan.textContent = lang.toUpperCase();
  }
  
  // Apply translations to data-translate elements
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(element => {
    const key = element.getAttribute("data-translate");
    if (AUTH_TRANSLATIONS[lang] && AUTH_TRANSLATIONS[lang][key]) {
      element.innerHTML = AUTH_TRANSLATIONS[lang][key];
    }
  });

  // Apply placeholder translations
  const placeholders = document.querySelectorAll("[data-translate-placeholder]");
  placeholders.forEach(element => {
    const key = element.getAttribute("data-translate-placeholder");
    if (AUTH_TRANSLATIONS[lang] && AUTH_TRANSLATIONS[lang][key]) {
      element.placeholder = AUTH_TRANSLATIONS[lang][key];
    }
  });
}

function initAuth() {
  // Check if session already exists - redirect to dashboard if logged in
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem("phh_current_user"));
  } catch (e) {
    console.error("Error parsing user session:", e);
  }
  if (session) {
    if (session.role === "patient") window.location.href = "patient-dashboard.html";
    else if (session.role === "doctor") window.location.href = "doctor-dashboard.html";
    else if (session.role === "admin") window.location.href = "admin-dashboard.html";
    else if (session.role === "receptionist") window.location.href = "receptionist-dashboard.html";
  }

  // ================= LANGUAGE SWITCHER SETUP =================
  const langBtn = document.getElementById("lang-btn");
  const langDropdown = document.getElementById("lang-dropdown");

  if (langBtn && langDropdown) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      langDropdown.classList.remove("show");
    });

    document.querySelectorAll(".lang-option").forEach(option => {
      option.addEventListener("click", (e) => {
        const selectedLang = e.target.getAttribute("data-lang");
        setLanguage(selectedLang);
      });
    });
  }

  // Set the initial language
  setLanguage(currentLanguage);

  // ================= SEGMENTED CONTROL TOGGLE =================
  const toggleGroup = document.getElementById("auth-toggle-group");
  const togglePatient = document.getElementById("toggle-patient");
  const toggleStaff = document.getElementById("toggle-staff");
  const panelPatient = document.getElementById("auth-panel-patient");
  const panelStaff = document.getElementById("auth-panel-staff");

  if (togglePatient && toggleStaff && toggleGroup) {
    togglePatient.addEventListener("click", () => {
      togglePatient.classList.add("active");
      toggleStaff.classList.remove("active");
      toggleGroup.classList.remove("staff-active");

      panelPatient.classList.add("active");
      panelStaff.classList.remove("active");
    });

    toggleStaff.addEventListener("click", () => {
      toggleStaff.classList.add("active");
      togglePatient.classList.remove("active");
      toggleGroup.classList.add("staff-active");

      panelStaff.classList.add("active");
      panelPatient.classList.remove("active");
    });
  }

  // ================= FLOATING LABEL HELPERS =================
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

  // Run periodic auto-update for filled state (in case of autofill)
  setInterval(() => {
    formControls.forEach(updateFilledState);
  }, 500);

  // ================= PATIENT AUTH FLOW =================
  const patientInput = document.getElementById("patient-login-input");
  const patientOtpTrigger = document.getElementById("patient-otp-trigger");
  const patientOtpStage = document.getElementById("patient-otp-stage");
  const patientOtpInput = document.getElementById("patient-otp-input");
  const patientLoginConfirm = document.getElementById("patient-login-confirm");

  // View toggling elements
  const gotoPatientRegister = document.getElementById("goto-patient-register");
  const gotoPatientLogin = document.getElementById("goto-patient-login");
  const patientLoginView = document.getElementById("patient-login-view");
  const patientRegisterView = document.getElementById("patient-register-view");

  if (gotoPatientRegister && gotoPatientLogin && patientLoginView && patientRegisterView) {
    gotoPatientRegister.addEventListener("click", (e) => {
      e.preventDefault();
      patientLoginView.style.display = "none";
      patientRegisterView.style.display = "flex";
    });

    gotoPatientLogin.addEventListener("click", (e) => {
      e.preventDefault();
      patientRegisterView.style.display = "none";
      patientLoginView.style.display = "flex";
    });
  }

  // Login handler
  if (patientOtpTrigger && patientLoginConfirm) {
    patientOtpTrigger.addEventListener("click", () => {
      const value = patientInput.value.trim();
      if (!value) {
        alert(AUTH_ALERTS[currentLanguage].emptyPatient);
        return;
      }
      
      const isEmail = value.includes("@");
      const hintSpan = patientOtpStage.querySelector("[data-translate='otp-sent-hint']");
      
      if (isEmail) {
        if (hintSpan) {
          hintSpan.textContent = currentLanguage === "gu" ? "તમારા ઇમેઇલ પર OTP મોકલવામાં આવ્યો છે." : (currentLanguage === "hi" ? "आपके ईमेल पर ओटीपी भेजा गया है।" : "OTP has been sent to your email address!");
        }
        
        patientOtpTrigger.disabled = true;
        patientOtpTrigger.textContent = currentLanguage === "gu" ? "ઓટીપી મોકલી રહ્યા છીએ..." : (currentLanguage === "hi" ? "ओटीपी भेज रहे हैं..." : "Sending OTP...");
        
        const API_BASE = window.API_BASE || '';
        fetch(`${API_BASE}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: value })
        })
        .then(res => {
          if (!res.ok) {
            return res.json().then(errData => { throw new Error(errData.message || "Failed to send OTP."); });
          }
          return res.json();
        })
        .then(data => {
          patientOtpTrigger.disabled = false;
          patientOtpTrigger.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-get-otp"];
          patientOtpStage.style.display = "flex";
          patientOtpTrigger.style.display = "none";
        })
        .catch(err => {
          patientOtpTrigger.disabled = false;
          patientOtpTrigger.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-get-otp"];
          alert(err.message);
        });
      } else {
        // Mobile number bypass - reset hint message to default showing 123456
        if (hintSpan) {
          hintSpan.innerHTML = AUTH_TRANSLATIONS[currentLanguage]["otp-sent-hint"];
        }
        patientOtpStage.style.display = "flex";
        patientOtpTrigger.style.display = "none";
      }
    });

    patientLoginConfirm.addEventListener("click", () => {
      const code = patientOtpInput.value.trim();
      const loginVal = patientInput.value.trim();
      const isEmail = loginVal.includes("@");
      
      const proceedLogin = () => {
        const API_BASE = window.API_BASE || '';
        patientLoginConfirm.textContent = "Verifying Verification...";
        patientLoginConfirm.disabled = true;

        fetch(`${API_BASE}/api/auth/patient-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ loginVal })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error("Server authentication failed.");
          }
          return res.json();
        })
        .then(data => {
          patientLoginConfirm.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-verify-login"];
          patientLoginConfirm.disabled = false;

          if (data.success && data.user) {
            localStorage.setItem("phh_current_user", JSON.stringify(data.user));
            window.location.href = "patient-dashboard.html";
          } else {
            throw new Error("Unable to log in patient console.");
          }
        })
        .catch(err => {
          patientLoginConfirm.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-verify-login"];
          patientLoginConfirm.disabled = false;
          console.error("Patient login error:", err);
          // Fallback local logic in case API base is completely down
          const currentUser = {
            role: "patient",
            name: "Guest Patient",
            email: isEmail ? loginVal : "",
            phone: !isEmail ? loginVal : ""
          };
          localStorage.setItem("phh_current_user", JSON.stringify(currentUser));
          window.location.href = "patient-dashboard.html";
        });
      };

      if (isEmail) {
        // Verify OTP against backend
        const API_BASE = window.API_BASE || '';
        patientLoginConfirm.textContent = currentLanguage === "gu" ? "ચકાસણી થઈ રહી છે..." : (currentLanguage === "hi" ? "सत्यापन हो रहा है..." : "Verifying OTP...");
        patientLoginConfirm.disabled = true;

        fetch(`${API_BASE}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginVal, otp: code })
        })
        .then(res => {
          if (!res.ok) {
            return res.json().then(errData => { throw new Error(errData.message || "Invalid OTP code."); });
          }
          return res.json();
        })
        .then(data => {
          patientLoginConfirm.disabled = false;
          proceedLogin();
        })
        .catch(err => {
          patientLoginConfirm.disabled = false;
          patientLoginConfirm.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-verify-login"];
          alert(err.message);
        });
      } else {
        // Mobile verification check locally
        if (code !== "123456") {
          alert(AUTH_ALERTS[currentLanguage].invalidOtp);
          return;
        }
        proceedLogin();
      }
    });
  }

  // Registration handler variables
  const patientRegName = document.getElementById("patient-register-name");
  const patientRegEmail = document.getElementById("patient-register-email");
  const patientRegPhone = document.getElementById("patient-register-phone");
  const patientRegOtpTrigger = document.getElementById("patient-register-otp-trigger");
  const patientRegOtpStage = document.getElementById("patient-register-otp-stage");
  const patientRegOtpInput = document.getElementById("patient-register-otp-input");
  const patientRegConfirm = document.getElementById("patient-register-confirm");

  if (patientRegOtpTrigger && patientRegConfirm) {
    patientRegOtpTrigger.addEventListener("click", () => {
      const name = patientRegName.value.trim();
      const email = patientRegEmail.value.trim();
      const phone = patientRegPhone.value.trim();

      if (!name) {
        alert(currentLanguage === "gu" ? "કૃપા કરીને તમારું પૂરું નામ દાખલ કરો." : (currentLanguage === "hi" ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your full name."));
        return;
      }
      if (!email && !phone) {
        alert(AUTH_ALERTS[currentLanguage].emptyPatient);
        return;
      }

      // Simple mobile format validation (if provided)
      if (phone) {
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.length < 10) {
          alert(currentLanguage === "gu" ? "કૃપા કરીને માન્ય ૧૦-આંકડાનો મોબાઇલ નંબર દાખલ કરો." : (currentLanguage === "hi" ? "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number."));
          return;
        }
      }

      // Email formatting check (if provided)
      if (email && !email.includes("@")) {
        alert(currentLanguage === "gu" ? "કૃપા કરીને માન્ય ઇમેઇલ સરનામું દાખલ કરો." : (currentLanguage === "hi" ? "कृपया एक वैध ईमेल पता दर्ज करें।" : "Please enter a valid email address."));
        return;
      }

      const hintSpan = patientRegOtpStage.querySelector("[data-translate='otp-sent-hint']");
      if (email) {
        if (hintSpan) {
          hintSpan.textContent = currentLanguage === "gu" ? "તમારા ઇમેઇલ પર OTP મોકલવામાં આવ્યો છે." : (currentLanguage === "hi" ? "आपके ईमेल पर ओटीपी भेजा गया है।" : "OTP has been sent to your email address!");
        }

        patientRegOtpTrigger.disabled = true;
        patientRegOtpTrigger.textContent = currentLanguage === "gu" ? "ઓટીપી મોકલી રહ્યા છીએ..." : (currentLanguage === "hi" ? "ओटीपी भेज रहे हैं..." : "Sending OTP...");

        const API_BASE = window.API_BASE || '';
        fetch(`${API_BASE}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        })
        .then(res => {
          if (!res.ok) {
            return res.json().then(errData => { throw new Error(errData.message || "Failed to send OTP."); });
          }
          return res.json();
        })
        .then(data => {
          patientRegOtpTrigger.disabled = false;
          patientRegOtpTrigger.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-register-otp"];
          patientRegOtpStage.style.display = "flex";
          patientRegOtpTrigger.style.display = "none";
        })
        .catch(err => {
          patientRegOtpTrigger.disabled = false;
          patientRegOtpTrigger.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-register-otp"];
          alert(err.message);
        });
      } else {
        // Mobile number bypass
        if (hintSpan) {
          hintSpan.innerHTML = AUTH_TRANSLATIONS[currentLanguage]["otp-sent-hint"];
        }
        patientRegOtpStage.style.display = "flex";
        patientRegOtpTrigger.style.display = "none";
      }
    });

    patientRegConfirm.addEventListener("click", () => {
      const code = patientRegOtpInput.value.trim();
      const name = patientRegName.value.trim();
      const email = patientRegEmail.value.trim();
      const phone = patientRegPhone.value.trim();

      const proceedRegister = () => {
        const API_BASE = window.API_BASE || '';
        patientRegConfirm.textContent = currentLanguage === "gu" ? "નોંધણી કરી રહ્યા છીએ..." : (currentLanguage === "hi" ? "पंजीकरण हो रहा है..." : "Registering Account...");
        patientRegConfirm.disabled = true;

        fetch(`${API_BASE}/api/auth/patient-register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, phone })
        })
        .then(res => {
          if (!res.ok) {
            return res.json().then(errData => {
              throw new Error(errData.message || "Registration failed on server.");
            });
          }
          return res.json();
        })
        .then(data => {
          patientRegConfirm.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-register-confirm"];
          patientRegConfirm.disabled = false;

          if (data.success && data.user) {
            localStorage.setItem("phh_current_user", JSON.stringify(data.user));
            window.location.href = "patient-dashboard.html";
          } else {
            throw new Error("Unable to log in after registration.");
          }
        })
        .catch(err => {
          patientRegConfirm.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-register-confirm"];
          patientRegConfirm.disabled = false;
          alert(err.message);
          console.error("Patient register error:", err);
        });
      };

      if (email) {
        // Verify OTP against backend
        const API_BASE = window.API_BASE || '';
        patientRegConfirm.textContent = currentLanguage === "gu" ? "ચકાસણી થઈ રહી છે..." : (currentLanguage === "hi" ? "सत्यापन हो रहा है..." : "Verifying OTP...");
        patientRegConfirm.disabled = true;

        fetch(`${API_BASE}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, otp: code })
        })
        .then(res => {
          if (!res.ok) {
            return res.json().then(errData => { throw new Error(errData.message || "Invalid OTP code."); });
          }
          return res.json();
        })
        .then(data => {
          patientRegConfirm.disabled = false;
          proceedRegister();
        })
        .catch(err => {
          patientRegConfirm.disabled = false;
          patientRegConfirm.textContent = AUTH_TRANSLATIONS[currentLanguage]["btn-register-confirm"];
          alert(err.message);
        });
      } else {
        // Mobile verification check locally
        if (code !== "123456") {
          alert(AUTH_ALERTS[currentLanguage].invalidOtp);
          return;
        }
        proceedRegister();
      }
    });
  }

  // ================= UNIFIED STAFF AUTH FLOW =================
  const staffUser = document.getElementById("staff-login-username");
  const staffPass = document.getElementById("staff-login-pass");
  const staffLoginBtn = document.getElementById("staff-login-btn");

  if (staffLoginBtn) {
    staffLoginBtn.addEventListener("click", async () => {
      const username = staffUser.value.trim();
      const pass = staffPass.value;

      if (!username || !pass) {
        alert(AUTH_ALERTS[currentLanguage].emptyStaff);
        return;
      }

      try {
        const apiBase = window.API_BASE || '';
        const response = await fetch(`${apiBase}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password: pass })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("phh_current_user", JSON.stringify(data.user));
          if (data.token) {
            localStorage.setItem("phh_jwt_token", data.token);
          }
          
          // Route dynamically based on user role
          if (data.user.role === 'admin') {
            window.location.href = "admin-dashboard.html";
          } else if (data.user.role === 'doctor') {
            window.location.href = "doctor-dashboard.html";
          } else if (data.user.role === 'receptionist') {
            window.location.href = "receptionist-dashboard.html";
          } else {
            alert("Role unrecognized by routing console.");
          }
        } else {
          alert(data.message || AUTH_ALERTS[currentLanguage].invalidStaff);
        }
      } catch (err) {
        console.error("Database connection or login request failed:", err);
        alert("Failed to communicate with the authentication server. Please verify your backend server status.");
      }
    });
  }

  // Doctor Registration Modal Trigger & Form Submission
  const regTrigger = document.getElementById("btn-register-doc-modal");
  const regModal = document.getElementById("doctor-reg-modal");
  const regForm = document.getElementById("doctor-reg-form");

  if (regTrigger && regModal) {
    regTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      regModal.style.display = "flex";
      setTimeout(() => {
        regModal.classList.add("active");
      }, 10);
      document.body.classList.add("modal-open");
      
      // Clear values and update labels
      if (regForm) regForm.reset();
      
      // Populate department options dynamically
      const deptSelect = document.getElementById("reg-doc-dept");
      if (deptSelect) {
        const depts = JSON.parse(localStorage.getItem("phh_departments")) || [
          { name: "General Medicine" },
          { name: "Cardiology" },
          { name: "Neurology" },
          { name: "Pulmonology" },
          { name: "Orthopedics" },
          { name: "Gynecology" },
          { name: "Pediatrics" },
          { name: "Dermatology" },
          { name: "ENT" },
          { name: "Psychology" }
        ];
        
        deptSelect.innerHTML = '<option value="" disabled selected></option>';
        depts.forEach(dept => {
          const opt = document.createElement("option");
          opt.value = dept.name;
          opt.textContent = dept.name;
          deptSelect.appendChild(opt);
        });
      }

      const regControls = regModal.querySelectorAll(".form-control");
      regControls.forEach(updateFilledState);
    });

    regModal.addEventListener("click", (e) => {
      if (e.target === regModal) {
        window.closeDocRegModal();
      }
    });
  }

  const regDocOtpTrigger = document.getElementById("reg-doc-otp-trigger");
  const regDocOtpStage = document.getElementById("doc-otp-stage");
  const regDocOtpInput = document.getElementById("reg-doc-otp-input");

  if (regDocOtpTrigger && regForm) {
    regDocOtpTrigger.addEventListener("click", async () => {
      // Manual validation for maximum cross-browser reliability inside modals
      const name = document.getElementById("reg-doc-name").value.trim();
      const specialty = document.getElementById("reg-doc-dept").value;
      const exp = document.getElementById("reg-doc-exp").value.trim();
      const fee = document.getElementById("reg-doc-fee").value.trim();
      const days = document.getElementById("reg-doc-days").value.trim();
      const time = document.getElementById("reg-doc-time").value.trim();
      const username = document.getElementById("reg-doc-user").value.trim();
      const email = document.getElementById("reg-doc-email").value.trim();
      const password = document.getElementById("reg-doc-pass").value;

      if (!name) { alert("Please enter your Full Name."); return; }
      if (!specialty) { alert("Please select a Medical Specialty."); return; }
      if (!exp) { alert("Please enter your Experience Duration."); return; }
      if (!fee) { alert("Please enter your Consultation Fee."); return; }
      if (!days) { alert("Please enter your Visiting Days."); return; }
      if (!time) { alert("Please enter your Visiting Hours."); return; }
      if (!username) { alert("Please enter your Desired Username."); return; }
      if (!email || !email.includes("@")) { alert("Please enter a valid Email ID."); return; }
      if (!password) { alert("Please enter your Desired Password."); return; }

      regDocOtpTrigger.disabled = true;
      regDocOtpTrigger.textContent = "Checking Username...";

      // Verify username availability first
      try {
        const apiBase = window.API_BASE || '';
        const checkRes = await fetch(`${apiBase}/api/auth/check-username`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        });

        const checkData = await checkRes.json();
        if (!checkRes.ok || !checkData.success || !checkData.available) {
          alert(checkData.message || "Username is already taken. Choose another one.");
          regDocOtpTrigger.disabled = false;
          regDocOtpTrigger.textContent = "Send Verification OTP";
          return;
        }
      } catch (err) {
        console.error("Username verification error:", err);
        alert("Failed to check username availability. Please try again.");
        regDocOtpTrigger.disabled = false;
        regDocOtpTrigger.textContent = "Send Verification OTP";
        return;
      }

      regDocOtpTrigger.textContent = "Sending OTP...";

      try {
        const apiBase = window.API_BASE || '';
        const response = await fetch(`${apiBase}/api/auth/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          regDocOtpTrigger.style.display = "none";
          if (regDocOtpStage) regDocOtpStage.style.display = "flex";
        } else {
          regDocOtpTrigger.disabled = false;
          regDocOtpTrigger.textContent = "Send Verification OTP";
          alert(data.message || "Failed to send OTP. Please check your connection.");
        }
      } catch (err) {
        console.error("Doctor OTP sending error:", err);
        regDocOtpTrigger.disabled = false;
        regDocOtpTrigger.textContent = "Send Verification OTP";
        alert("Failed to connect to the authentication server.");
      }
    });

    regForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // If OTP stage is not visible yet, trigger OTP sending first
      if (!regDocOtpStage || regDocOtpStage.style.display !== "flex") {
        if (regDocOtpTrigger) regDocOtpTrigger.click();
        return;
      }

      const name = document.getElementById("reg-doc-name").value.trim();
      const specialty = document.getElementById("reg-doc-dept").value;
      const exp = document.getElementById("reg-doc-exp").value.trim();
      const fee = document.getElementById("reg-doc-fee").value.trim();
      const days = document.getElementById("reg-doc-days").value.trim();
      const time = document.getElementById("reg-doc-time").value.trim();
      const username = document.getElementById("reg-doc-user").value.trim();
      const email = document.getElementById("reg-doc-email").value.trim();
      const password = document.getElementById("reg-doc-pass").value;
      const otp = regDocOtpInput.value.trim();

      if (otp.length !== 6) {
        alert("Please enter the 6-digit verification code.");
        return;
      }

      const proceedRegister = async () => {
        const confirmBtn = document.getElementById("reg-doc-otp-confirm");
        if (confirmBtn) {
          confirmBtn.disabled = true;
          confirmBtn.textContent = "Submitting Profile...";
        }

        try {
          const apiBase = window.API_BASE || '';
          const response = await fetch(`${apiBase}/api/auth/register-doctor`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, specialty, exp, fee, days, time, username, email, password })
          });

          const data = await response.json();

          if (response.ok && data.success) {
            alert(data.message || "Registration submitted successfully! Pending admin approval.");
            regForm.reset();
            window.closeDocRegModal();
          } else {
            alert(data.message || "Failed to register. Please try a different username or email.");
          }
        } catch (err) {
          console.error("Doctor registration submission error:", err);
          alert("Failed to submit registration. Please verify your connection.");
        } finally {
          if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Verify & Submit Profile";
          }
        }
      };

      // Verify OTP
      try {
        const confirmBtn = document.getElementById("reg-doc-otp-confirm");
        if (confirmBtn) {
          confirmBtn.disabled = true;
          confirmBtn.textContent = "Verifying OTP...";
        }

        const apiBase = window.API_BASE || '';
        const verifyRes = await fetch(`${apiBase}/api/auth/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, otp })
        });

        const verifyData = await verifyRes.json();

        if (verifyRes.ok && verifyData.success) {
          await proceedRegister();
        } else {
          alert(verifyData.message || "Invalid OTP code. Please try again.");
          if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = "Verify & Submit Profile";
          }
        }
      } catch (err) {
        console.error("OTP verification error:", err);
        alert("Failed to verify OTP. Please try again.");
        const confirmBtn = document.getElementById("reg-doc-otp-confirm");
        if (confirmBtn) {
          confirmBtn.disabled = false;
          confirmBtn.textContent = "Verify & Submit Profile";
        }
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuth);
} else {
  initAuth();
}

window.closeDocRegModal = function() {
  const modal = document.getElementById("doctor-reg-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    setTimeout(() => {
      if (!modal.classList.contains("active")) {
        modal.style.display = "none";
        // Reset OTP fields
        const otpStage = document.getElementById("doc-otp-stage");
        const otpTrigger = document.getElementById("reg-doc-otp-trigger");
        if (otpStage) otpStage.style.display = "none";
        if (otpTrigger) {
          otpTrigger.style.display = "block";
          otpTrigger.disabled = false;
          otpTrigger.textContent = "Send Verification OTP";
        }
      }
    }, 400); // match transition duration (0.4s)
  }
};
