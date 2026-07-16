/* Superspeciality Doctors Consultation - Smart Hospital Frontend Engine */

// ================= GLOBAL STATE & INITIAL DATA =================
// DEFAULT_DOCTORS and DEFAULT_DISEASE_MAP loaded globally from js/init.js

// State Managers
let doctors = (JSON.parse(localStorage.getItem("phh_doctors")) || DEFAULT_DOCTORS).filter(doc => doc.status !== 'Pending');
let diseaseMap = JSON.parse(localStorage.getItem("phh_disease_map")) || DEFAULT_DISEASE_MAP;
let appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];

let currentUser = JSON.parse(localStorage.getItem("phh_current_user")) || null;
let slots = JSON.parse(localStorage.getItem("phh_slots")) || [];
let latestBookedAppointment = null;


// Translation Dictionary
const TRANSLATIONS = {
  en: {
    "brand": "Superspeciality Doctors Consultation",
    "brand-logo": "<span class=\"logo-top\">Superspeciality</span><span class=\"logo-accent logo-bottom\">Doctors Consultation</span>",
    "nav-home": "Home",
    "nav-depts": "Departments",
    "nav-docs": "Doctors",
    "nav-features": "Features",
    "nav-faq": "FAQ",
    "nav-contact": "Contact",
    "btn-portal": "Portal",
    "hero-badge": "Smart Healthcare Management Ecosystem",
    "hero-heading": "Superspeciality <br><span>Doctors Consultation</span>",
    "hero-p": "Your Health. Our Priority. Discover top doctors, manage bookings, check live doctor statuses, and track token queue timing instantly in Palanpur.",
    "hero-cta-book": "Book Appointment",
    "hero-cta-find": "Find Doctors",
    "stat-patients": "Happy Patients / Day",
    "stat-docs": "Specialist Doctors",
    "stat-depts": "Departments",
    "btn-search": "Search",
    "search-results": "Matching Department Results:",
    "depts-title": "Specialist Departments",
    "depts-p": "Comprehensive premium medical services mapping all human health layers under one digital roof.",
    "live-status-title": "Live Hospital Tracker",
    "live-status-p": "Check real-time indicators of doctor availability in Superspeciality Doctors Consultation to plan your visit without queuing delays.",
    "status-avail": "Available",
    "status-busy": "Busy",
    "status-late": "Running Late",
    "status-left": "Left Hospital",
    "legend-avail-desc": "Doctor is actively consultation-ready",
    "legend-busy-desc": "Doctor is in emergency or operations",
    "legend-late-desc": "Consultation running ~15-30 mins behind",
    "legend-left-desc": "Doctor has completed visiting shift",
    "docs-title": "Our Expert Specialists",
    "docs-p": "Choose doctors dynamically based on specialized departments and schedule slots instantly.",
    "booking-title": "Book Clinic Slot",
    "booking-p": "Register your medical profile, pick slots, and finalize fees.",
    "form-heading": "Appointment Details",
    "form-name": "Patient Full Name",
    "form-phone": "Mobile Number",
    "form-email": "Email Address (Optional)",
    "doc-exp-label": "Experience",
    "doc-days-label": "Visiting Days",
    "doc-timings-label": "Timings",
    "doc-fee-label": "Consultation Fee",
    "doc-btn-book": "Book Appointment",
    "doc-btn-unavailable": "Currently Unavailable",
    "form-select-doc": "Select doctor...",
    "form-dept": "Select Department",
    "form-doctor": "Select Specialist Doctor",
    "form-date": "Appointment Date",
    "form-slot": "Time Slot",
    "form-fee": "Consultation Fees",
    "form-symptoms": "Symptom details or disease notes",
    "btn-proceed-pay": "Proceed To Payment (Razorpay)",
    "q-title": "Real-time Queue Status",
    "q-current": "Current Running Token",
    "q-yours": "Your Next Issued Token",
    "q-wait": "Est. Wait Time",
    "q-position": "Queue Position",
    "features-title": "Modern Digital Ecosystem Features",
    "features-p": "A full patient experience workflow powered by premium technologies.",
    "feat-booking": "Instant Booking",
    "feat-booking-desc": "Book appointments with top clinic specialists online in seconds.",
    "feat-pay": "Online Payments",
    "feat-pay-desc": "Integrated secure Razorpay gateway checks for seamless pay.",
    "feat-noti": "Real-time alerts",
    "feat-noti-desc": "Automated emails matching consultations dates and delays.",
    "feat-otp": "Mobile/Email OTP",
    "feat-otp-desc": "Dual verification layers securing personal diagnostic reports.",
    "feat-reschedule": "Flexible Rescheduling",
    "feat-reschedule-desc": "Easy scheduling updates and cancellations directly from your dashboard.",
    "feat-lang": "Local Languages",
    "feat-lang-desc": "Smooth platform switching: English, Gujarati, and Hindi.",
    "feat-live": "Live Doctor Status",
    "feat-live-desc": "Simulated availability tracker indicating shift updates.",
    "test-title": "Patient Testimonials",
    "test-p": "Read feedback from our valued citizens about the Smart Hospital Platform.",
    "test-1-text": "\"Palanpur Health Hub saved me hours of clinic waiting. I booked an appointment with Dr. Ananya (Cardiology) from home, paid securely on Razorpay, and monitored my live queue position instantly!\"",
    "test-1-name": "Jayesh Trivedi",
    "test-1-city": "Palanpur, Gujarat",
    "test-2-text": "\"The disease mapping search is very clever. I searched 'cough' and it instantly showed Pulmonologist Dr. Rajesh Shah. The Gujarati translation is fully accurate and made booking very easy!\"",
    "test-2-name": "Kokila Parmar",
    "test-2-city": "Deesa Highway, Palanpur",
    "test-3-text": "\"The live doctor status indicator is a lifesaver! I saw Dr. Rajesh Shah was 'Running Late' by 20 minutes, so I adjusted my travel from Deesa accordingly and didn't have to wait in the hospital queue.\"",
    "test-3-name": "Bhavesh Mehta",
    "test-3-city": "Gathaman Gate, Palanpur",
    "gal-title": "Inside Superspeciality Doctors Consultation",
    "gal-p": "Our state-of-the-art emergency rooms, operating theatres, diagnostic labs and consulting chambers.",
    "gal-1-h": "Critical ICU Desk",
    "gal-1-p": "24/7 ICU tracking panels and modern ventilators.",
    "gal-2-h": "Cath Lab O.T.",
    "gal-2-p": "Advanced hybrid rooms for complex cardiac bypass operations.",
    "gal-3-h": "3-Tesla Digital MRI",
    "gal-3-p": "Fast scan tracking with minimal radiation diagnostic metrics.",
    "gal-4-h": "Glass Reception Lounge",
    "gal-4-p": "Premium waiting space equipped with easy token assistance counters.",
    "faq-title": "Frequently Asked Questions",
    "faq-p": "Get quick responses regarding payments, OTP setup, and booking scheduling structures.",
    "faq-1-q": "How do I book an appointment?",
    "faq-1-a": "Simply choose your preferred doctor, select an available date and time slot, enter your basic patient details, and complete the registration. You will receive an instant confirmation of your booking.",
    "faq-2-q": "Can I reschedule my appointment?",
    "faq-2-a": "Yes, both patients and doctors can reschedule appointments. You can select a new available date and time slot from your dashboard, and the system will automatically release your old slot and book the new one.",
    "faq-3-q": "Are the doctor availability statuses live?",
    "faq-3-a": "Yes. Doctors and the hospital administration access their respective dashboards to update shift changes, operational emergencies, or delays. The badges on the homepage immediately reflect if a doctor is Available, Busy, or Running Late.",
    "faq-4-q": "How do I switch the website language to Gujarati?",
    "faq-4-a": "On the top navigation bar, locate the language switcher button (displaying 'EN'). Click it and select 'ગુજરાતી' or 'हिन्दी' to instantly translate the entire ecosystem, search prompts, and dashboards dynamically.",
    "contact-title": "Contact Hospital Helpdesk",
    "contact-p": "Connect directly with our 24/7 helpline or drop a support inquiry ticket.",
    "contact-h-loc": "Hospital Location",
    "contact-p-loc": "Superspeciality Doctors Consultation, Deesa Highway Crossroads, Palanpur, Gujarat - 385001",
    "contact-h-phone": "24/7 Helpline",
    "contact-h-email": "Support Email",
    "contact-h-connect": "Connect with us",
    "contact-form-title": "Send Message",
    "contact-form-sub": "Subject",
    "contact-form-msg": "Write message here...",
    "btn-send": "Send Message",
    "footer-desc-text": "Integrating modern SaaS appointments, digital queue tracking, and real-time waiting tokens for local medical operations in Banaskantha.",
    "footer-h-links": "Quick Links",
    "footer-h-depts": "Departments",
    "footer-h-news": "Newsletter",
    "footer-news-p": "Stay updated with diagnostic camp alerts and healthcare newsletters.",
    "tab-patient": "Patient",
    "tab-doctor": "Doctor",
    "tab-admin": "Admin",
    "auth-patient-title": "Patient Portal Access",
    "auth-patient-p": "Log in using your registered mobile number or email for OTP verification.",
    "btn-get-otp": "Get Verification OTP",
    "otp-sent-hint": "OTP sent! (Use test code: 123456)",
    "btn-verify-login": "Verify & Enter Dashboard",
    "auth-doc-title": "Doctor Workspace",
    "auth-doc-p": "Authorized hospital doctor profile authentication.",
    "btn-login": "Enter Portal",
    "auth-admin-title": "System Admin Control",
    "auth-admin-p": "Configure mapping and doctor details database.",
    "receipt-success": "Payment Confirmed!",
    "receipt-sub": "Your appointment has been registered in the smart queue. You can track your token live on your dashboard.",
    "receipt-qr-title": "Appointment Reference",
    "receipt-qr-note": "Your appointment has been confirmed. Head over to the dashboard to monitor status.",
    "receipt-btn-dashboard": "Go To Patient Dashboard",
    "fdc-1-name": "Dr. Rajesh Shah",
    "fdc-1-spec": "Pulmonologist",
    "fdc-2-name": "Dr. M. K. Patel",
    "fdc-2-spec": "Cardiologist",
    "dept-cardio": "Cardiology",
    "dept-cardio-desc": "Heart treatments, angiography, valve repair, and cardiology emergency.",
    "dept-neuro": "Neurology",
    "dept-neuro-desc": "Brain stroke, nerve disorder, spinal treatments, and migraine analysis.",
    "dept-pulmo": "Pulmonology",
    "dept-pulmo-desc": "Chronic asthma, tuberculosis, chest allergy, and severe cough checkups.",
    "dept-psych": "Psychology",
    "dept-psych-desc": "Anxiety, severe stress counselling, depression sessions, and therapy.",
    "dept-ortho": "Orthopedics",
    "dept-ortho-desc": "Joint replacements, fracture correction, bone scan, and pain rehab.",
    "dept-derm": "Dermatology",
    "dept-derm-desc": "Skin allergies, laser treatment, acne cures, and cosmetic checkups.",
    "dept-ent": "ENT",
    "dept-ent-desc": "Ear operations, throat infections, sinus tracking, and hearing checks.",
    "dept-ped": "Pediatrics",
    "dept-ped-desc": "Newborn care, infant vaccination, growth tracking, and child fever.",
    "dept-gyn": "Gynecology",
    "dept-gyn-desc": "Pregnancy support, women's wellness, ultrasound checkups, and delivery.",
    "dept-general": "General Medicine",
    "dept-general-desc": "Blood pressure, standard viral infections, primary health reports.",
    "sugg-cough": "Cough",
    "sugg-chest": "Chest Pain",
    "sugg-migraine": "Migraine",
    "sugg-anxiety": "Anxiety",
    "sugg-skin": "Skin Rash",
    "sugg-select-disease": "Select Disease / Symptom",
    "sugg-asthma": "Asthma",
    "sugg-fracture": "Fracture",
    "sugg-ear": "Ear Pain",
    "sugg-fever": "Fever",
    "sugg-pregnancy": "Pregnancy",
    "badge-cardio": "Cardio",
    "badge-neuro": "Neuro",
    "badge-respiratory": "Respiratory",
    "badge-mental": "Mental Health",
    "badge-bones": "Bones",
    "badge-skin": "Skin",
    "badge-ent": "ENT",
    "badge-child": "Child",
    "badge-women": "Women",
    "badge-general": "General",
    "floating-lang": "Language / ભાષા"
  },
  gu: {
    "brand": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન",
    "brand-logo": "<span class=\"logo-top\">સુપરસ્પેશિયાલિટી</span><span class=\"logo-accent logo-bottom\">ડોકટર્સ કન્સલ્ટેશન</span>",
    "nav-home": "મુખ્ય પૃષ્ઠ",
    "nav-depts": "વિભાગો",
    "nav-docs": "ડોકટરો",
    "nav-features": "સુવિધાઓ",
    "nav-faq": "પ્રશ્નોત્તરી",
    "nav-contact": "સંપર્ક",
    "btn-portal": "પોર્ટલ",
    "hero-badge": "સ્માર્ટ હેલ્થકેર મેનેજમેન્ટ ઇકોસિસ્ટમ",
    "hero-heading": "સુપરસ્પેશિયાલિટી <br><span>ડોકટર્સ કન્સલ્ટેશન</span>",
    "hero-p": "તમારું સ્વાસ્થ્ય. અમારી પ્રાથમિકતા. પાલનપુરમાં શ્રેષ્ઠ ડોકટરો શોધો, બુકિંગ મેનેજ કરો, લાઈવ ડોક્ટર સ્ટેટસ ચેક કરો અને ટોકન કતાર સમયનો લાઈવ હિસાબ મેળવો.",
    "hero-cta-book": "એપોઇન્ટમેન્ટ બુક કરો",
    "hero-cta-find": "ડોકટરો શોધો",
    "stat-patients": "ખુશ દર્દીઓ / દિવસ",
    "stat-docs": "નિષ્ણાત ડોકટરો",
    "stat-depts": "વિભાગો",
    "btn-search": "શોધો",
    "search-results": "સુસંગત વિભાગના પરિણામો:",
    "depts-title": "નિષ્ણાત વિભાગો",
    "depts-p": "એક જ ડિજિટલ છત હેઠળ માનવ સ્વાસ્થ્યના તમામ સ્તરોને આવરી લેતી વ્યાપક પ્રીમિયમ તબીબી સેવાઓ.",
    "live-status-title": "લાઇવ હોસ્પિટલ ટ્રેકર",
    "live-status-p": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશનમાં ડોક્ટરની ઉપલબ્ધતાના રીઅલ-ટાઇમ સંકેતો તપાસો જેથી કતારના વિલંબ વિના મુલાકાત ગોઠવી શકાય.",
    "status-avail": "ઉપલબ્ધ",
    "status-busy": "વ્યસ્ત",
    "status-late": "મોડું ચાલે છે",
    "status-left": "હોસ્પિટલ છોડી દીધી",
    "legend-avail-desc": "ડૉક્ટર એક્ટિવ રીતે તપાસ માટે ઉપલબ્ધ છે",
    "legend-busy-desc": "ડૉક્ટર સર્જરી અથવા ઇમરજન્સી ડ્યુટી પર છે",
    "legend-late-desc": "તપાસ અંદાજે ૧૫-૩૦ મિનિટ મોડી ચાલે છે",
    "legend-left-desc": "ડૉક્ટર તેમની મુલાકાતનો સમય પૂરો કરી ચૂક્યા છે",
    "docs-title": "અમારા નિષ્ણાત ડોકટરો",
    "docs-p": "તબીબી જરૂરિયાતો અનુસાર ડોકટરો પસંદ કરો અને તાત્કાલિક સ્લોટ મેળવો.",
    "booking-title": "ક્લિનિક સ્લોટ બુક કરો",
    "booking-p": "તમારી તબીબી પ્રોફાઇલ ભરો, સમય પસંદ કરો અને સ્માર્ટ ટોકન મેળવો.",
    "form-heading": "એપોઇન્ટમેન્ટ વિગતો",
    "form-name": "દર્દીનું પૂરું નામ",
    "form-phone": "મોબાઇલ નંબર",
    "form-email": "ઇમેઇલ સરનામું (વૈકલ્પિક)",
    "doc-exp-label": "અનુભવ",
    "doc-days-label": "મુલાકાતના દિવસો",
    "doc-timings-label": "સમય",
    "doc-fee-label": "તપાસ ફી",
    "doc-btn-book": "બુકિંગ કરો",
    "doc-btn-unavailable": "હાલમાં અનુપલબ્ધ",
    "form-select-doc": "ડોક્ટર પસંદ કરો...",
    "form-dept": "વિભાગ પસંદ કરો",
    "form-doctor": "નિષ્ણાત ડોક્ટર પસંદ કરો",
    "form-date": "મુલાકાત તારીખ",
    "form-slot": "સમય સ્લોટ",
    "form-fee": "તપાસ ફી",
    "form-symptoms": "લક્ષણો અથવા તબીબી નોંધો",
    "btn-proceed-pay": "ચુકવણી કરવા આગળ વધો (Razorpay)",
    "q-title": "લાઇવ કતાર સ્થિતિ",
    "q-current": "ચાલુ ટોકન નંબર",
    "q-yours": "તમારો ટોકન નંબર",
    "q-wait": "અંદાજિત રાહ જોવાનો સમય",
    "q-position": "કતારમાં સ્થાન",
    "features-title": "આધુનિક ડિજિટલ ઇકોસિસ્ટમ સુવિધાઓ",
    "features-p": "પ્રીમિયમ તકનીકો દ્વારા સંચાલિત સંપૂર્ણ ઓનલાઇન આરોગ્ય સેવા.",
    "feat-booking": "ઝડપી બુકિંગ",
    "feat-booking-desc": "સેકન્ડોમાં ઓનલાઇન ક્લિનિક નિષ્ણાતો સાથે મુલાકાત બુક કરો.",
    "feat-pay": "ઓનલાઇન ચુકવણી",
    "feat-pay-desc": "સરળ વ્યવહારો માટે સુરક્ષિત Razorpay ગેટવે એકીકરણ.",
    "feat-noti": "લાઇવ ચેતવણીઓ",
    "feat-noti-desc": "એપોઇન્ટમેન્ટ તારીખો અને વિલંબ સંબંધિત સ્વયંસંચાલિત ઇમેઇલ્સ.",
    "feat-otp": "મોબાઇલ/ઇમેઇલ OTP",
    "feat-otp-desc": "વૈયક્તિકૃત અહેવાલો મેળવવા માટે સુરક્ષિત ઓટીપી લૉગિન.",
    "feat-reschedule": "સરળ પુનઃસુનિશ્ચિતતા",
    "feat-reschedule-desc": "તમારા ડેશબોર્ડ પરથી સરળતાથી એપોઇન્ટમેન્ટ બદલો અથવા રદ કરો.",
    "feat-lang": "સ્થાનિક ભાષાઓ",
    "feat-lang-desc": "સરળ પ્લેટફોર્મ ભાષા બદલાવ: અંગ્રેજી, ગુજરાતી અને હિન્દી.",
    "feat-live": "લાઇવ ડૉક્ટર સ્થિતિ",
    "feat-live-desc": "શિફ્ટ અપડેટ્સ દર્શાવતું સિમ્યુલેટેડ ઉપલબ્ધતા ટ્રેકર.",
    "test-title": "દર્દીઓના પ્રતિભાવો",
    "test-p": "સ્માર્ટ હોસ્પિટલ પ્લેટફોર્મ વિશે અમારા મૂલ્યવાન નાગરિકોનો પ્રતિભાવ વાંચો.",
    "test-1-text": "\"પાલનપુર હેલ્થ હબથી મારો કલાકોનો સમય બચ્યો છે. મેં ઘરેથી જ કાર્ડિયોલોજી વિભાગના ડૉ. અનન્યા માટે એપોઇન્ટમેન્ટ બુક કરી, Razorpay પર સુરક્ષિત ફી ચૂકવી અને મારું લાઇવ કતાર સ્ટેટસ ઓનલાઇન મેળવ્યું!\"",
    "test-1-name": "જયેશ ત્રિવેદી",
    "test-1-city": "પાલનપુર, ગુજરાત",
    "test-2-text": "\"રોગ મેપિંગ શોધ ખૂબ જ સ્માર્ટ છે. મેં 'ઉધરસ' સર્ચ કર્યું અને તેણે તરત જ પલ્મોનોલોજિસ્ટ ડૉ. રાજેશ શાહ બતાવ્યા. આ પ્લેટફોર્મ પર ગુજરાતી અનુવાદ ૧૦૦% સચોટ છે, જેનાથી બુકિંગ ખૂબ સરળ બન્યું!\"",
    "test-2-name": "કોકિલા પરમાર",
    "test-2-city": "ડીસા હાઇવે, પાલનપુર",
    "test-3-text": "\"લાઇવ ડૉક્ટર સ્ટેટસ ઇન્ડિકેટર ખૂબ જ ઉપયોગી છે! મેં જોયું કે ડૉ. રાજેશ શાહ ૨૦ મિનિટ 'મોડું ચાલે છે' સ્ટેટસ પર હતા, તેથી મેં ડીસાથી નીકળવાનો સમય તે મુજબ ગોઠવ્યો અને હોસ્પિટલમાં રાહ જોવી ન પડી.\"",
    "test-3-name": "ભાવેશ મહેતા",
    "test-3-city": "ગઠામણ ગેટ, પાલનપુર",
    "gal-title": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશનની ઝાંખી",
    "gal-p": "અમારા અત્યાધુનિક ઇમરજન્સી રૂમ, ઓપરેશન થિયેટર અને તપાસ કેન્દ્રો.",
    "gal-1-h": "ક્રિટિકલ આઈ.સી.યુ.",
    "gal-1-p": "૨૪/૭ આઈસીયુ મોનિટરિંગ અને આધુનિક વેન્ટિલેટર સુવિધા.",
    "gal-2-h": "કેથ લેબ ઓ.ટી.",
    "gal-2-p": "જટિલ હૃદય બાયપાસ ઓપરેશન માટે હાઇબ્રિડ રૂમ.",
    "gal-3-h": "૩-ટેસ્લા ડિજિટલ MRI",
    "gal-3-p": "ઓછા રેડિયેશન સાથે ઝડપી એમઆરઆઈ સ્કેન પરીક્ષણ.",
    "gal-4-h": "રિસેપ્શન લોન્જ",
    "gal-4-p": "સરળ ટોકન કાઉન્ટર સહાયથી સજ્જ પ્રીમિયમ રાહ જોવાની જગ્યા.",
    "faq-title": "વારંવાર પૂછાતા પ્રશ્નો",
    "faq-p": "એપોઇન્ટમેન્ટ, ચુકવણી, ઓટીપી અને એપોઇન્ટમેન્ટ ફરીથી સુનિશ્ચિત કરવા વિશે વિગતવાર માહિતી.",
    "faq-1-q": "હું એપોઇન્ટમેન્ટ કેવી રીતે બુક કરી શકું?",
    "faq-1-a": "ફક્ત તમારા મનપસંદ ડૉક્ટરને પસંદ કરો, ઉપલબ્ધ તારીખ અને સમયનો સ્લોટ પસંદ કરો, તમારી મૂળભૂત દર્દીની વિગતો દાખલ કરો અને નોંધણી પૂર્ણ કરો. તમને તમારા બુકિંગની તાત્કાલિક પુષ્ટિ પ્રાપ્ત થશે.",
    "faq-2-q": "શું હું મારી એપોઇન્ટમેન્ટ ફરીથી શેડ્યૂલ કરી શકું?",
    "faq-2-a": "હા, દર્દીઓ અને ડૉક્ટરો બંને એપોઇન્ટમેન્ટ ફરીથી શેડ્યૂલ કરી શકે છે. તમે તમારા ડેશબોર્ડ પરથી નવો ઉપલબ્ધ તારીખ અને સમયનો સ્લોટ પસંદ કરી શકો છો, અને સિસ્ટમ આપમેળે તમારો જૂનો સ્લોટ છોડી દેશે અને નવો બુક કરશે.",
    "faq-3-q": "શું ડોક્ટરોનું સ્ટેટસ ખરેખર લાઇવ છે?",
    "faq-3-a": "હા, હોસ્પિટલ પ્રશાસન અને ડોકટરો પોતે તેમની ડેશબોર્ડથી હાજરી બદલી શકે છે, જે અહીં તરત જ દેખાય છે.",
    "faq-4-q": "વેબસાઇટની ભાષા ગુજરાતીમાં કેવી રીતે બદલવી?",
    "faq-4-a": "અહીં ઉપરના મેનુમાં ગ્લોબ આઇકોન પર ક્લિક કરીને 'ગુજરાતી' પસંદ કરો જેથી આખું પ્લેટફોર્મ ગુજરાતીમાં રૂપાંતરિત થાય.",
    "contact-title": "હેલ્પડેસ્ક સંપર્ક",
    "contact-p": "અમારી ૨૪/૭ હેલ્પલાઇન સાથે જોડાઓ અથવા ઓનલાઇન પૂછપરછ મોકલો.",
    "contact-h-loc": "હોસ્પિટલનું સરનામું",
    "contact-p-loc": "સુપરસ્પેશિયાલિટી ડોકટર્સ કન્સલ્ટેશન, ડીસા હાઇવે ચાર રસ્તા, પાલનપુર, ગુજરાત - ૩૮૫૦૦૧",
    "contact-h-phone": "૨૪/૭ હેલ્પલાઇન",
    "contact-h-email": "સપોર્ટ ઇમેઇલ",
    "contact-h-connect": "અમારી સાથે જોડાઓ",
    "contact-form-title": "સંદેશ મોકલો",
    "contact-form-sub": "વિષય",
    "contact-form-msg": "અહીં સંદેશ લખો...",
    "btn-send": "સંદેશ મોકલો",
    "footer-desc-text": "બનાસકાંઠામાં સ્થાનિક તબીબી કામગીરી માટે આધુનિક SaaS એપોઇન્ટમેન્ટ, ડિજિટલ કતાર ટ્રેકિંગ અને રીઅલ-ટાઇમ પ્રતીક્ષા ટોકનનું એકીકરણ.",
    "footer-h-links": "ઝડપી લિંક્સ",
    "footer-h-depts": "વિભાગો",
    "footer-h-news": "સમાચાર પત્રિકા",
    "footer-news-p": "નિદાન કેમ્પ ચેતવણીઓ અને આરોગ્ય સમાચાર પત્રો સાથે અપડેટ રહો.",
    "tab-patient": "દર્દી",
    "tab-doctor": "ડોક્ટર",
    "tab-admin": "એડમિન",
    "auth-patient-title": "દર્દી પોર્ટલ ઍક્સેસ",
    "auth-patient-p": "OTP વેરિફિકેશન માટે તમારા રજીસ્ટર્ડ મોબાઈલ નંબર અથવા ઈમેલનો ઉપયોગ કરીને લોગિન કરો.",
    "btn-get-otp": "વેરિફિકેશન OTP મેળવો",
    "otp-sent-hint": "OTP મોકલવામાં આવ્યો છે! (ટેસ્ટ કોડ: 123456 નો ઉપયોગ કરો)",
    "btn-verify-login": "વેરિફાય કરો અને ડેશબોર્ડમાં પ્રવેશ કરો",
    "auth-doc-title": "ડૉક્ટર લૉગિન",
    "auth-doc-p": "હોસ્પિટલના અધિકૃત ડૉક્ટરો માટે ડેશબોર્ડ લૉગિન.",
    "btn-login": "પોર્ટલમાં પ્રવેશ કરો",
    "auth-admin-title": "સિસ્ટમ એડમિન કંટ્રોલ",
    "auth-admin-p": "ડૉક્ટરોની વિગતો અને રોગ નિર્દેશિકા બદલવા માટે.",
    "receipt-success": "પેમેન્ટ સફળ રહ્યું!",
    "receipt-sub": "તમારી મુલાકાત કતારમાં સફળતાપૂર્વક નોંધાઈ ગઈ છે. તમે તમારા ડેશબોર્ડ પર લાઇવ ટોકન ટ્રેક કરી શકો છો.",
    "receipt-qr-title": "એપોઇન્ટમેન્ટ ટોકન સંદર્ભ",
    "receipt-qr-note": "તમારો ટોકન નંબર જારી કરવામાં આવ્યો છે. પ્રગતિ જોવા માટે દર્દી ડેશબોર્ડ ખોલો.",
    "receipt-btn-dashboard": "દર્દી ડેશબોર્ડ પર જાઓ",
    "fdc-1-name": "ડો. રાજેશ શાહ",
    "fdc-1-spec": "પલ્મોનોલોજિસ્ટ",
    "fdc-2-name": "ડો. એમ. કે. પટેલ",
    "fdc-2-spec": "કાર્ડિયોલોજિસ્ટ",
    "dept-cardio": "કાર્ડિયોલોજી (હૃદય રોગ)",
    "dept-cardio-desc": "હૃદયની સારવાર, એન્જિયોગ્રાફી, વાલ્વ રિપેર અને કાર્ડિયોલોજી ઇમરજન્સી.",
    "dept-neuro": "ન્યુરોલોજી (મગજ રોગ)",
    "dept-neuro-desc": "બ્રેઇન સ્ટ્રોક, ચેતાતંત્રની ખામી, કરોડરજ્જુની સારવાર અને આધાશીશીનું વિશ્લેષણ.",
    "dept-pulmo": "પલ્મોનોલોજી (ફેફસાં રોગ)",
    "dept-pulmo-desc": "લાંબા ગાળાની અસ્થમા, ક્ષય (ટીબી), છાતીની એલર્જી અને ગંભીર ઉધરસની તપાસ.",
    "dept-psych": "સાયકોલોજી (માનસિક રોગ)",
    "dept-psych-desc": "ચિંતા, તણાવ પરામર્શ, હતાશા (ડિપ્રેશન) સત્રો અને થેરાપી.",
    "dept-ortho": "ઓર્થોપેડિક્સ (હાડકાં રોગ)",
    "dept-ortho-desc": "સાંધા બદલવા, ફ્રેક્ચર સુધારણા, હાડકાનું સ્કેન અને દુખાવો નિવારણ.",
    "dept-derm": "ડર્મેટોલોજી (ત્વચા રોગ)",
    "dept-derm-desc": "ત્વચાની એલર્જી, લેસર સારવાર, ખીલની સારવાર અને કોસ્મેટિક તપાસ.",
    "dept-ent": "ઈ.એન.ટી. (કાન, નાક, ગળું)",
    "dept-ent-desc": "કાનનું ઓપરેશન, ગળામાં ચેપ, સાઇનસ ટ્રેકિંગ અને સાંભળવાની તપાસ.",
    "dept-ped": "પીડિયાટ્રિક્સ (બાળ રોગ)",
    "dept-ped-desc": "નવજાત શિશુની સંભાળ, રસીકરણ, બાળ વિકાસ ટ્રેકિંગ અને બાળ તાવ.",
    "dept-gyn": "ગાયનેકોલોજી (સ્ત્રી રોગ)",
    "dept-gyn-desc": "ગર્ભાવસ્થા સહાય, સ્ત્રી આરોગ્ય, અલ્ટ્રાસાઉન્ડ તપાસ અને ડિલિવરી.",
    "dept-general": "જનરલ મેડિસિન (સામાન્ય રોગ)",
    "dept-general-desc": "બ્લડ પ્રેશર, સામાન્ય વાયરલ ચેપ, પ્રાથમિક આરોગ્ય અહેવાલો.",
    "sugg-cough": "ઉધરસ",
    "sugg-chest": "છાતીમાં દુખાવો",
    "sugg-migraine": "આધાશીશી (માઇગ્રેન)",
    "sugg-anxiety": "ચિંતા (ગભરામણ)",
    "sugg-skin": "ત્વચા પર ફોલ્લીઓ",
    "sugg-select-disease": "રોગ / લક્ષણ પસંદ કરો",
    "sugg-asthma": "અસ્થમા (દમા)",
    "sugg-fracture": "ફ્રેક્ચર (હાડકું તૂટવું)",
    "sugg-ear": "કાનનો દુખાવો",
    "sugg-fever": "તાવ",
    "sugg-pregnancy": "ગર્ભાવસ્થા",
    "badge-cardio": "હૃદય",
    "badge-neuro": "મગજ",
    "badge-respiratory": "ફેફસાં",
    "badge-mental": "માનસિક સ્વાસ્થ્ય",
    "badge-bones": "હાડકાં",
    "badge-skin": "ત્વચા",
    "badge-ent": "કાન-નાક-ગળું",
    "badge-child": "બાળકો",
    "badge-women": "મહિલાઓ",
    "badge-general": "સામાન્ય",
    "floating-lang": "ભાષા પસંદ કરો (Language)"
  },
  hi: {
    "brand": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन",
    "brand-logo": "<span class=\"logo-top\">सुपरस्पेशलिटी</span><span class=\"logo-accent logo-bottom\">डॉक्टर्स कंसल्टेशन</span>",
    "nav-home": "मुख्य पृष्ठ",
    "nav-depts": "विभाग",
    "nav-docs": "डॉक्टर",
    "nav-features": "सुविधाएं",
    "nav-faq": "सामान्य प्रश्न",
    "nav-contact": "संपर्क",
    "btn-portal": "पोर्टल",
    "hero-badge": "स्मार्ट हेल्थकेयर मैनेजमेंट इकोसिस्टम",
    "hero-heading": "सुपरस्पेशलिटी <br><span>डॉक्टर्स कंसल्टेशन</span>",
    "hero-p": "आपका स्वास्थ्य। हमारी प्राथमिकता। पालनपुर में शीर्ष डॉक्टरों की खोज करें, बुकिंग प्रबंधित करें, लाइव डॉक्टरों की स्थिति देखें और वास्तविक समय में टोकन कतार के समय को ट्रैक करें।",
    "hero-cta-book": "अपॉइंटमेंट बुक करें",
    "hero-cta-find": "डॉक्टर खोजें",
    "stat-patients": "प्रतिदिन खुश मरीज",
    "stat-docs": "विशेषज्ञ डॉक्टर",
    "stat-depts": "विशेषज्ञ विभाग",
    "btn-search": "खोजें",
    "search-results": "अनुरूप विभाग के परिणाम:",
    "depts-title": "विशेषज्ञ विभाग",
    "depts-p": "एक ही डिजिटल छत के नीचे मानव स्वास्थ्य के सभी स्तरों को कवर करने वाली व्यापक प्रीमियम चिकित्सा सेवाएं।",
    "live-status-title": "लाइव अस्पताल ट्रैकर",
    "live-status-p": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन में डॉक्टरों की उपलब्धता की वास्तविक समय की जानकारी देखें ताकि बिना कतार के देरी के अपनी यात्रा की योजना बनाई जा सके।",
    "status-avail": "उपलब्ध",
    "status-busy": "व्यस्त",
    "status-late": "देरी से चल रहे हैं",
    "status-left": "अस्पताल से चले गए",
    "legend-avail-desc": "डॉक्टर सक्रिय रूप से परामर्श के लिए उपलब्ध हैं",
    "legend-busy-desc": "डॉक्टर आपातकालीन स्थिति या ऑपरेशन में हैं",
    "legend-late-desc": "परामर्श लगभग 15-30 मिनट देरी से चल रहा है",
    "legend-left-desc": "डॉक्टर अपनी विजिटिंग शिफ्ट पूरी कर चुके हैं",
    "docs-title": "हमारे विशेषज्ञ चिकित्सक",
    "docs-p": "विशेष विभागों के आधार पर डॉक्टरों को चुनें और तुरंत स्लॉट बुक करें।",
    "booking-title": "क्लीनिक स्लॉट बुक करें",
    "booking-p": "अपनी मेडिकल प्रोफाइल दर्ज करें, स्लॉट चुनें, परामर्श शुल्क देखें और स्मार्ट टोकन जनरेट करें।",
    "form-heading": "अपॉइंटमेंट विवरण",
    "form-name": "मरीज का पूरा नाम",
    "form-phone": "मोबाइल नंबर",
    "form-email": "ईमेल पता (वैकल्पिक)",
    "doc-exp-label": "अनुभव",
    "doc-days-label": "परामर्श के दिन",
    "doc-timings-label": "समय",
    "doc-fee-label": "परामर्श शुल्क",
    "doc-btn-book": "अपॉइंटमेंट बुक करें",
    "doc-btn-unavailable": "अभी उपलब्ध नहीं",
    "form-select-doc": "डॉक्टर चुनें...",
    "form-dept": "विभाग चुनें",
    "form-doctor": "विशेषज्ञ डॉक्टर चुनें",
    "form-date": "अपॉइंटमेंट की तारीख",
    "form-slot": "समय स्लॉट",
    "form-fee": "परामर्श शुल्क",
    "form-symptoms": "लक्षण या बीमारी का विवरण लिखें",
    "btn-proceed-pay": "भुगतान के लिए आगे बढ़ें (Razorpay)",
    "q-title": "वास्तविक समय कतार स्थिति",
    "q-current": "वर्तमान रनिंग टोकन",
    "q-yours": "आपका जारी टोकन",
    "q-wait": "अनुमानित प्रतीक्षा समय",
    "q-position": "कतार स्थिति",
    "features-title": "आधुनिक डिजिटल इकोसिस्टम की विशेषताएं",
    "features-p": "प्रीमियम तकनीकों द्वारा संचालित एक संपूर्ण मरीज अनुभव वर्कफ़्लो।",
    "feat-booking": "त्वरित बुकिंग",
    "feat-booking-desc": "सेकंड में ऑनलाइन क्लिनिक विशेषज्ञों के साथ अपॉइंटमेंट बुक करें।",
    "feat-pay": "ऑनलाइन भुगतान",
    "feat-pay-desc": "निर्बाध भुगतान के लिए एकीकृत सुरक्षित Razorpay गेटवे।",
    "feat-noti": "वास्तविक समय अलर्ट",
    "feat-noti-desc": "परामर्श की तारीखों और देरी के संबंध में स्वचालित ईमेल।",
    "feat-otp": "मोबाइल/ईमेल ओटीपी",
    "feat-otp-desc": "व्यक्तिगत नैदानिक रिपोर्टों को सुरक्षित करने वाले दोहरे सत्यापन स्तर।",
    "feat-reschedule": "लचीला पुनर्निर्धारण",
    "feat-reschedule-desc": "अपने डैशबोर्ड से आसानी से अपॉइंटमेंट बदलें या रद्द करें।",
    "feat-lang": "स्थानीय भाषाएं",
    "feat-lang-desc": "सुचारू मंच भाषा बदलाव: अंग्रेजी, गुजराती और हिंदी।",
    "feat-live": "लाइव डॉक्टर स्थिति",
    "feat-live-desc": "शिफ्ट अपडेट और डॉक्टरों की उपलब्धता दर्शाने वाला ट्रैकर।",
    "test-title": "मरीजों के प्रशंसापत्र",
    "test-p": "स्मार्ट अस्पताल प्लेटफॉर्म के बारे में हमारे सम्मानित नागरिकों की प्रतिक्रिया पढ़ें।",
    "test-1-text": "\"पालनपुर हेल्थ हब ने क्लिनिक में घंटों प्रतीक्षा करने से मेरा समय बचा लिया। मैंने घर से ही कार्डियोलॉजी विभाग की डॉ. अनन्या के साथ अपॉइंटमेंट बुक किया, रेज़रपे पर भुगतान किया और तुरंत लाइव कतार की स्थिति देखी!\"",
    "test-1-name": "जयेश त्रिवेदी",
    "test-1-city": "पालनपुर, गुजरात",
    "test-2-text": "\"रोग मैपिंग सर्च बहुत ही स्मार्ट है। मैंने 'खांसी' सर्च किया और इसने तुरंत पल्मोनोलॉजिस्ट डॉ. राजेश शाह को दिखाया। गुजराती और हिंदी अनुवाद पूरी तरह से सटीक है और बुकिंग बहुत आसान है!\"",
    "test-2-name": "कोकिला परमार",
    "test-2-city": "डीसा हाईवे, पालनपुर",
    "test-3-text": "\"लाइव डॉक्टर स्टेटस इंडिकेटर बहुत उपयोगी है! मैंने देखा कि डॉ. राजेश शाह का स्टेटस 20 मिनट 'देरी से' था, इसलिए मैंने डीसा से अपने निकलने का समय उसी अनुसार तय किया और मुझे क्लिनिक पर इंतजार नहीं करना पड़ा।\"",
    "test-3-name": "भावेश मेहता",
    "test-3-city": "गठामण गेट, पालनपुर",
    "gal-title": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन के अंदर",
    "gal-p": "हमारे अत्याधुनिक आपातकालीन कक्ष, ऑपरेटिंग थिएटर, नैदानिक प्रयोगशालाएं और परामर्श कक्ष।",
    "gal-1-h": "गंभीर आईसीयू डेस्क",
    "gal-1-p": "24/7 आईसीयू ट्रैकिंग पैनल और आधुनिक वेंटलेटर सुविधा।",
    "gal-2-h": "कैथ लैब ओ.टी.",
    "gal-2-p": "जटिल कार्डिएक बाईपास ऑपरेशन के लिए उन्नत हाइब्रिड कक्ष।",
    "gal-3-h": "3-टेस्ला डिजिटल एमआरआई",
    "gal-3-p": "न्यूनतम विकिरण नैदानिक मेट्रिक्स के साथ तेजी से स्कैन परीक्षण।",
    "gal-4-h": "ग्लास रिसेप्शन लाउंज",
    "gal-4-p": "आसान टोकन सहायता काउंटरों से सुसज्ज प्रीमियम प्रतीक्षा स्थान।",
    "faq-title": "अक्सर पूछे जाने वाले प्रश्न",
    "faq-p": "भुगतान, ओटीपी सेटअप, और अपॉइंटमेंट समय निर्धारण संरचनाओं के बारे में त्वरित उत्तर प्राप्त करें।",
    "faq-1-q": "मैं अपॉइंटमेंट कैसे बुक करूँ?",
    "faq-1-a": "बस अपने पसंदीदा डॉक्टर को चुनें, उपलब्ध तिथि और समय स्लॉट चुनें, सामान्य रोगी विवरण दर्ज करें, और पंजीकरण पूरा करें। आपको अपनी बुकिंग की तत्काल पुष्टि प्राप्त होगी।",
    "faq-2-q": "क्या मैं अपना अपॉइंटमेंट पुनर्निर्धारित कर सकता हूँ?",
    "faq-2-a": "हाँ, रोगी और डॉक्टर दोनों ही अपॉइंटमेंट पुनर्निर्धारित कर सकते हैं। आप अपने डैशबोर्ड से एक नया उपलब्ध तिथि और समय स्लॉट चुन सकते हैं, और सिस्टम स्वचालित रूप से आपके पुराने स्लॉट को जारी करके नया स्लॉट बुक कर देगा।",
    "faq-3-q": "क्या डॉक्टरों की उपलब्धता की स्थिति लाइव है?",
    "faq-3-a": "हाँ। डॉक्टर और अस्पताल प्रशासन अपनी शिफ्ट में बदलाव, परिचालन आपात स्थितियों या देरी को अपडेट करने के लिए अपने संबंधित डैशबोर्ड तक पहुंच सकते हैं। होमपेज पर बैज तुरंत दिखाई देते हैं।",
    "faq-4-q": "वेबसाइट की भाषा को हिंदी या गुजराती में कैसे बदलें?",
    "faq-4-a": "शीर्ष नेविगेशन बार पर, भाषा परिवर्तक बटन (जो 'EN' प्रदर्शित करता है) खोजें। इस पर क्लिक करें और पूरे सिस्टम का अनुवाद करने के लिए 'हिन्दी' या 'ગુજરાતી' चुनें।",
    "contact-title": "अस्पताल हेल्पडेस्क से संपर्क करें",
    "contact-p": "हमारी 24/7 हेल्पलाइन से सीधे जुड़ें या सहायता के लिए संदेश भेजें।",
    "contact-h-loc": "अस्पताल का पता",
    "contact-p-loc": "सुपरस्पेशलिटी डॉक्टर्स कंसल्टेशन, डीसा हाईवे चौराहा, पालनपुर, गुजरात - 385001",
    "contact-h-phone": "24/7 हेल्पलाइन",
    "contact-h-email": "सहायता ईमेल",
    "contact-h-connect": "हमारे साथ जुड़ें",
    "contact-form-title": "संदेश भेजें",
    "contact-form-sub": "विषय",
    "contact-form-msg": "अपना संदेश यहाँ लिखें...",
    "btn-send": "संदेश भेजें",
    "footer-desc-text": "बनासकांठा में स्थानीय चिकित्सा संचालन के लिए आधुनिक सास अपॉइंटमेंट, डिजिटल कतार ट्रैकिंग और वास्तविक समय प्रतीक्षा टोकन का एकीकरण।",
    "footer-h-links": "त्वरित संपर्क सूत्र",
    "footer-h-depts": "विशेषज्ञ विभाग",
    "footer-h-news": "समाचार पत्रिका",
    "footer-news-p": "नैदानिक शिविर अलर्ट और स्वास्थ्य समाचार पत्रों के साथ अपडेट रहें।",
    "tab-patient": "मरीज",
    "tab-doctor": "डॉक्टर",
    "tab-admin": "प्रशासक",
    "auth-patient-title": "मरीज पोर्टल लॉगिन",
    "auth-patient-p": "ओटीपी सत्यापन के लिए अपने पंजीकृत मोबाइल नंबर या ईमेल का उपयोग करके लॉगिन करें।",
    "btn-get-otp": "सत्यापन ओटीपी प्राप्त करें",
    "otp-sent-hint": "ओटीपी भेजा गया! (परीक्षण कोड: 123456 का उपयोग करें)",
    "btn-verify-login": "सत्यापित करें और डैशबोर्ड में प्रवेश करें",
    "auth-doc-title": "डॉक्टर कार्यक्षेत्र",
    "auth-doc-p": "अधिकृत अस्पताल चिकित्सक प्रोफाइल प्रमाणीकरण।",
    "btn-login": "पोर्टल में प्रवेश करें",
    "auth-admin-title": "सिस्टम एडमिन कंट्रोल",
    "auth-admin-p": "मैपिंग और डॉक्टर विवरण डेटाबेस कॉन्फ़िगर करें।",
    "receipt-success": "भुगतान की पुष्टि हो गई है!",
    "receipt-sub": "आपका अपॉइंटमेंट स्मार्ट कतार में दर्ज हो गया है। आप अपने डैशबोर्ड पर लाइव टोकन देख सकते हैं।",
    "receipt-qr-title": "अपॉइंटमेंट टोकन संदर्भ",
    "receipt-qr-note": "आपका टोकन नंबर जारी कर दिया गया है। प्रगति देखने के लिए डैशबोर्ड खोलें।",
    "receipt-btn-dashboard": "मरीज डैशबोर्ड पर जाएं",
    "fdc-1-name": "डॉ. राजेश शाह",
    "fdc-1-spec": "पल्मोनोलॉजिस्ट",
    "fdc-2-name": "डॉ. एम. के. पटेल",
    "fdc-2-spec": "कार्डियोलॉजिस्ट",
    "dept-cardio": "हृदय रोग विभाग (Cardiology)",
    "dept-cardio-desc": "हृदय का उपचार, एंजियोग्राफी, वाल्व की मरम्मत और आपातकालीन हृदय रोग सेवाएं।",
    "dept-neuro": "न्यूरोलॉजी (मस्तिष्क रोग)",
    "dept-neuro-desc": "ब्रेन स्ट्रोक, तंत्रिका विकार, रीढ़ की हड्डी के उपचार और माइग्रेन का विश्लेषण।",
    "dept-pulmo": "पल्मोनोलोजी (फेफड़े के रोग)",
    "dept-pulmo-desc": "अस्थमा, तपेदिक (टीबी), छाती की एलर्जी और गंभीर खांसी की जांच।",
    "dept-psych": "मनोविज्ञान (Psychology)",
    "dept-psych-desc": "चिंता, तनाव परामर्श, अवसाद (डिप्रेसशन) सत्र और थेरेपी।",
    "dept-ortho": "अस्थि रोग विभाग (Orthopedics)",
    "dept-ortho-desc": "जोड़ों का प्रत्यारोपण, फ्रैक्चर सुधार, हड्डी स्कैन और दर्द निवारण।",
    "dept-derm": "त्वचा रोग विभाग (Dermatology)",
    "dept-derm-desc": "त्वचा की एलर्जी, लेजर उपचार, मुंहासे और कॉस्मेटिक जांच।",
    "dept-ent": "ईएनटी (कान, नाक, गला)",
    "dept-ent-desc": "कान के ऑपरेशन, गले में संक्रमण, साइनस ट्रैकिंग और सुनने की जांच।",
    "dept-ped": "बाल रोग विभाग (Pediatrics)",
    "dept-ped-desc": "नवजात शिशु की देखभाल, टीकाकरण, विकास ट्रैकिंग और बच्चों का बुखार।",
    "dept-gyn": "स्त्री रोग विभाग (Gynecology)",
    "dept-gyn-desc": "गर्भावस्था सहायता, महिला कल्याण, अल्ट्रासाउंड जांच और प्रसव (डिलीवरी)।",
    "dept-general": "सामान्य चिकित्सा (General Medicine)",
    "dept-general-desc": "रक्तचाप (बीपी), सामान्य वायरल संक्रमण, प्राथमिक स्वास्थ्य रिपोर्ट।",
    "sugg-cough": "खांसी",
    "sugg-chest": "छाती में दर्द",
    "sugg-migraine": "माइग्रेन (आधासिर दर्द)",
    "sugg-anxiety": "चिंता (Anxiety)",
    "sugg-skin": "त्वचा पर चकत्ते",
    "sugg-select-disease": "बीमारी / लक्षण चुनें",
    "sugg-asthma": "अस्थमा (दमा)",
    "sugg-fracture": "हड्डी टूटना (फ्रैक्चर)",
    "sugg-ear": "कान का दर्द",
    "sugg-fever": "बुखार",
    "sugg-pregnancy": "गर्भावस्था",
    "badge-cardio": "हृदय",
    "badge-neuro": "मस्तिष्क",
    "badge-respiratory": "श्वसन",
    "badge-mental": "मानसिक स्वास्थ्य",
    "badge-bones": "हड्डियों",
    "badge-skin": "त्वचा",
    "badge-ent": "ईएनटी",
    "badge-child": "बाल",
    "badge-women": "महिला",
    "badge-general": "सामान्य",
    "floating-lang": "भाषा चुनिए (Language)"
  }
};const DYNAMIC_TRANSLATIONS = {
  en: {
    // Specialties
    "Cardiology": "Cardiology",
    "Neurology": "Neurology",
    "Pulmonology": "Pulmonology",
    "Psychology": "Psychology",
    "Orthopedics": "Orthopedics",
    "Dermatology": "Dermatology",
    "ENT": "ENT",
    "Pediatrics": "Pediatrics",
    "Gynecology": "Gynecology",
    "General Medicine": "General Medicine",
    // Experience
    "7 Years": "7 Years",
    "8 Years": "8 Years",
    "9 Years": "9 Years",
    "10 Years": "10 Years",
    "11 Years": "11 Years",
    "12 Years": "12 Years",
    "14 Years": "14 Years",
    "15 Years": "15 Years",
    "20 Years": "20 Years",
    // Days
    "Daily": "Daily",
    "Monday & Wednesday": "Monday & Wednesday",
    "Tuesday & Friday": "Tuesday & Friday",
    "Monday & Thursday": "Monday & Thursday",
    "Wednesday & Friday": "Wednesday & Friday",
    "Tuesday & Thursday": "Tuesday & Thursday",
    "Monday & Saturday": "Monday & Saturday",
    "Thursday & Saturday": "Thursday & Saturday",
    // Timings
    "4 PM - 8 PM": "4 PM - 8 PM",
    "10 AM - 1 PM": "10 AM - 1 PM",
    "2 PM - 5 PM": "2 PM - 5 PM",
    "5 PM - 8 PM": "5 PM - 8 PM",
    "12 PM - 4 PM": "12 PM - 4 PM",
    "9 AM - 12 PM": "9 AM - 12 PM",
    "11 AM - 3 PM": "11 AM - 3 PM",
    "8 AM - 12 PM & 4 PM - 7 PM": "8 AM - 12 PM & 4 PM - 7 PM",
    "2 PM - 6 PM": "2 PM - 6 PM"
  },
  gu: {
    "Cardiology": "કાર્ડિયોલોજી (હૃદય રોગ)",
    "Neurology": "ન્યુરોલોજી (મગજ રોગ)",
    "Pulmonology": "પલ્મોનોલોજી (ફેફસાં રોગ)",
    "Psychology": "સાયકોલોજી (માનસિક રોગ)",
    "Orthopedics": "ઓર્થોપેડિક્સ (હાડકાં રોગ)",
    "Dermatology": "ડર્મેટોલોજી (ત્વચા રોગ)",
    "ENT": "ઈ.એન.ટી. (કાન, નાક, ગળું)",
    "Pediatrics": "પીડિયાટ્રિક્સ (બાળ રોગ)",
    "Gynecology": "ગાયનેકોલોજી (સ્ત્રી રોગ)",
    "General Medicine": "જનરલ મેડિસિન (સામાન્ય રોગ)",
    "7 Years": "૭ વર્ષ",
    "8 Years": "૮ વર્ષ",
    "9 Years": "૯ વર્ષ",
    "10 Years": "૧૦ વર્ષ",
    "11 Years": "૧૧ વર્ષ",
    "12 Years": "૧૨ વર્ષ",
    "14 Years": "૧૪ વર્ષ",
    "15 Years": "૧૫ વર્ષ",
    "20 Years": "૨૦ વર્ષ",
    "Daily": "દરરોજ",
    "Monday & Wednesday": "સોમવાર અને બુધવાર",
    "Tuesday & Friday": "મંગળવાર અને શુક્રવાર",
    "Monday & Thursday": "સોમવાર અને ગુરુવાર",
    "Wednesday & Friday": "બુધવાર અને શુક્રવાર",
    "Tuesday & Thursday": "મંગળવાર અને ગુરુવાર",
    "Monday & Saturday": "સોમવાર અને શનિવાર",
    "Thursday & Saturday": "ગુરુવાર અને શનિવાર",
    "4 PM - 8 PM": "સાંજે ૪ થી રાત્રે ૮",
    "10 AM - 1 PM": "સવારે ૧૦ થી બપોરે ૧",
    "2 PM - 5 PM": "બપોરે ૨ થી સાંજે ૫",
    "5 PM - 8 PM": "સાંજે ૫ થી રાત્રે ૮",
    "12 PM - 4 PM": "બપોરે ૧૨ થી સાંજે ૪",
    "9 AM - 12 PM": "સવારે ૯ થી બપોરે ૧૨",
    "11 AM - 3 PM": "સવારે ૧૧ થી બપોરે ૩",
    "8 AM - 12 PM & 4 PM - 7 PM": "સવારે ૮ થી ૧૨ અને સાંજે ૪ થી ૭",
    "2 PM - 6 PM": "બપોરે ૨ થી સાંજે ૬"
  },
  hi: {
    "Cardiology": "हृदय रोग विज्ञान (Cardiology)",
    "Neurology": "तंत्रिका विज्ञान (Neurology)",
    "Pulmonology": "पल्मोनोलॉजी (Pulmonology)",
    "Psychology": "मनोविज्ञान (Psychology)",
    "Orthopedics": "अस्थि रोग (Orthopedics)",
    "Dermatology": "त्वचा विज्ञान (Dermatology)",
    "ENT": "ईएनटी (ENT)",
    "Pediatrics": "बाल रोग (Pediatrics)",
    "Gynecology": "स्त्री रोग (Gynecology)",
    "General Medicine": "सामान्य चिकित्सा (General Medicine)",
    "7 Years": "7 वर्ष",
    "8 Years": "8 वर्ष",
    "9 Years": "9 वर्ष",
    "10 Years": "10 वर्ष",
    "11 Years": "11 वर्ष",
    "12 Years": "12 वर्ष",
    "14 Years": "14 वर्ष",
    "15 Years": "15 वर्ष",
    "20 Years": "20 वर्ष",
    "Daily": "प्रतिदिन",
    "Monday & Wednesday": "सोमवार और बुधवार",
    "Tuesday & Friday": "मंगलवार और शुक्रवार",
    "Monday & Thursday": "सोमवार और गुरुवार",
    "Wednesday & Friday": "बुधवार और शुक्रवार",
    "Tuesday & Thursday": "मंगलवार और गुरुवार",
    "Monday & Saturday": "सोमवार और शनिवार",
    "Thursday & Saturday": "गुरुवार और शनिवार",
    "4 PM - 8 PM": "शाम 4 से रात 8",
    "10 AM - 1 PM": "सुबह 10 से दोपहर 1",
    "2 PM - 5 PM": "दोपहर 2 से शाम 5",
    "5 PM - 8 PM": "शाम 5 से रात 8",
    "12 PM - 4 PM": "दोपहर 12 से शाम 4",
    "9 AM - 12 PM": "सुबह 9 से दोपहर 12",
    "11 AM - 3 PM": "सुबह 11 से दोपहर 3",
    "8 AM - 12 PM & 4 PM - 7 PM": "सुबह 8 से 12 और शाम 4 से 7",
    "2 PM - 6 PM": "दोपहर 2 से शाम 6"
  }
};

function getTranslation(text) {
  const lang = currentLanguage;
  if (lang === 'en') return text;
  if (DYNAMIC_TRANSLATIONS[lang] && DYNAMIC_TRANSLATIONS[lang][text]) {
    return DYNAMIC_TRANSLATIONS[lang][text];
  }
  return text;
}

let currentLanguage = localStorage.getItem("phh_lang") || "en";
if (currentLanguage === "mr") {
  currentLanguage = "en";
  localStorage.setItem("phh_lang", "en");
}

// ================= DOM ELEMENT REFERENCES =================
const loader = document.getElementById("loader");
const navbar = document.getElementById("navbar");
const mobileToggle = document.getElementById("mobile-toggle");
const navLinksList = document.getElementById("nav-links");
const langSelector = document.getElementById("lang-selector");
const langBtn = document.getElementById("lang-btn");
const currentLangSpan = document.getElementById("current-lang");
const langDropdown = document.getElementById("lang-dropdown");
const portalTrigger = document.getElementById("portal-trigger");

// Auth Modal
// Removed obsolete portal variable: const authModal = document.getElementById("auth-modal");
// Removed obsolete portal variable: const authModalClose = document.getElementById("auth-modal-close");
// Removed obsolete portal variable: const authTabBtns = document.querySelectorAll(".auth-tab-btn");
// Removed obsolete portal variable: const authPanels = document.querySelectorAll(".auth-form-panel");

// Razorpay Overlay
const razorpayOverlay = document.getElementById("razorpay-overlay");
const rpPayBtn = document.getElementById("rp-pay-btn");
const rpAmountDisplay = document.getElementById("rp-amount-display");
const rpDescDisplay = document.getElementById("rp-desc-display");

// Success Receipt Modal
const successModal = document.getElementById("success-modal");
const successModalClose = document.getElementById("success-modal-close");
const receiptDetailsBox = document.getElementById("receipt-details-box");
// successQrBox removed as QR code checkin is replaced by phone checkin.
const receiptDashboardTrigger = document.getElementById("receipt-dashboard-trigger");

// Dashboards
// Removed obsolete portal variable: const dbPatient = document.getElementById("dashboard-patient");
// Removed obsolete portal variable: const dbDoctor = document.getElementById("dashboard-doctor");
// Removed obsolete portal variable: const dbAdmin = document.getElementById("dashboard-admin");

// Search & Filtering
const diseaseSearch = document.getElementById("disease-search");
const searchBtn = document.getElementById("search-btn");
const suggestions = document.querySelectorAll(".suggestion-tag");
const searchResultsContainer = document.getElementById("search-results-container");
const searchResultsGrid = document.getElementById("search-results-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
const doctorsGrid = document.getElementById("doctors-grid");

// Appointment Form
const appointmentForm = document.getElementById("appointment-form");
const bookDept = document.getElementById("book-dept");
const bookDoctor = document.getElementById("book-doctor");
const bookDate = document.getElementById("book-date");
const bookTime = document.getElementById("book-time");
const bookFee = document.getElementById("book-fee");

// Queue Widget Elements


const qWaitTime = document.getElementById("q-wait-time");
const qPercentLabel = document.getElementById("q-percent-label");
const qProgressBar = document.getElementById("q-progress-bar");

// Testimonials
let testimonialSlides = document.querySelectorAll(".testimonial-slide");
const testPrevBtn = document.getElementById("test-prev");
const testNextBtn = document.getElementById("test-next");
let activeTestimonialIndex = 0;


// ================= CORE ENGINE FUNCTIONS =================

// 1. Loader dismissal
function dismissLoader() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true
    });
  }
  
  // Fake animation timer
  setTimeout(() => {
    if (loader) {
      loader.classList.add("fade-out");
    }
    fetchLiveStats();
  }, 1000);
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  dismissLoader();
} else {
  window.addEventListener("load", dismissLoader);
}

// Safety timeout to ensure loader is always dismissed even if DOM events or scripts load weirdly
setTimeout(() => {
  if (loader && !loader.classList.contains("fade-out")) {
    loader.classList.add("fade-out");
    if (typeof fetchLiveStats === 'function') {
      fetchLiveStats();
    }
  }
}, 1500);

// Sticky Navigation Scroll Monitor
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  highlightActiveNavOnScroll();
});

// Active Navigation Highlighting on Scroll
function highlightActiveNavOnScroll() {
  const sections = document.querySelectorAll("header, section");
  const navItems = document.querySelectorAll(".nav-item");
  
  let currentSectionId = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSectionId = section.getAttribute("id");
    }
  });

  navItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("href") === `#${currentSectionId}` || (currentSectionId === "home" && item.getAttribute("href") === "#")) {
      item.classList.add("active");
    }
  });
}

// Mobile Toggle Open/Close
mobileToggle.addEventListener("click", () => {
  mobileToggle.classList.toggle("active");
  navLinksList.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    mobileToggle.classList.remove("active");
    navLinksList.classList.remove("active");
  });
});

// 2. Language localization System
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

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("phh_lang", lang);
  currentLangSpan.textContent = lang.toUpperCase();
  
  // Apply translation mappings to DOM
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(element => {
    const key = element.getAttribute("data-translate");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      element.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // Also translate placeholder inputs
  const searchInput = document.getElementById("disease-search");
  if (searchInput) {
    if (lang === "gu") {
      searchInput.placeholder = "રોગ, લક્ષણો, ડોક્ટર અથવા વિભાગ શોધો (દા.ત. ઉધરસ, આધાશીશી)...";
    } else if (lang === "hi") {
      searchInput.placeholder = "बीमारी, लक्षण, डॉक्टर या विभाग खोजें (जैसे खांसी, माइग्रेन)...";
    } else {
      searchInput.placeholder = "Search disease, symptom, doctor, or department (e.g. cough, migraine)...";
    }
  }

  // Translate static options of book-dept
  const deptSelect = document.getElementById("book-dept");
  if (deptSelect) {
    Array.from(deptSelect.options).forEach(opt => {
      const val = opt.value;
      if (val && typeof DYNAMIC_TRANSLATIONS !== 'undefined' && DYNAMIC_TRANSLATIONS[lang] && DYNAMIC_TRANSLATIONS[lang][val]) {
        opt.textContent = DYNAMIC_TRANSLATIONS[lang][val];
      } else if (val && lang === 'en') {
        opt.textContent = val;
      }
    });
  }

  // Update dynamic elements
  renderDoctorsList();
  renderDepartmentsList();
  renderTestimonials();
  
  if (window.chatbotInstance && typeof window.chatbotInstance.loadLanguage === 'function') {
    window.chatbotInstance.loadLanguage(lang);
  }
}

// 3. Stats counter animation
function animateCounters() {
  const statNumbers = document.querySelectorAll(".stat-num");
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute("data-val"));
    let count = 0;
    const speed = Math.ceil(target / 40) || 1;
    
    const counterInterval = setInterval(() => {
      count += speed;
      if (count >= target) {
        stat.textContent = target + "+";
        clearInterval(counterInterval);
      } else {
        stat.textContent = count;
      }
    }, 30);
  });
}

async function fetchLiveStats() {
  try {
    const response = await fetch(`${window.API_BASE}/api/stats`);
    const data = await response.json();
    if (data.success) {
      const patientsStat = document.querySelector('.stat-item:nth-child(1) .stat-num');
      const docsStat = document.querySelector('.stat-item:nth-child(2) .stat-num');
      const deptsStat = document.querySelector('.stat-item:nth-child(3) .stat-num');

      if (patientsStat) patientsStat.setAttribute('data-val', data.happyPatients);
      if (docsStat) docsStat.setAttribute('data-val', data.doctorsCount);
      if (deptsStat) deptsStat.setAttribute('data-val', data.departmentsCount);
    }
  } catch (err) {
    console.error('Error fetching live stats from API:', err);
  } finally {
    animateCounters();
  }
}


// A doctor accepts new bookings only while their live status is "Available"
function isDoctorBookable(doc) {
  return !doc || !doc.status || doc.status === "Available";
}

function getDoctorUnavailableMessage(doc) {
  const statusName = doc && doc.status ? doc.status : "Unavailable";
  if (currentLanguage === "gu") return `ડૉ. ${doc.name} હાલમાં "${statusName}" સ્થિતિમાં છે અને નવી બુકિંગ સ્વીકારી રહ્યા નથી. ડૉક્ટર ઉપલબ્ધ થાય ત્યારે ફરી પ્રયાસ કરો.`;
  if (currentLanguage === "hi") return `डॉ. ${doc.name} अभी "${statusName}" स्थिति में हैं और नई बुकिंग स्वीकार नहीं कर रहे हैं। डॉक्टर के उपलब्ध होने पर पुनः प्रयास करें।`;
  return `Dr. ${doc.name} is currently "${statusName}" and is not accepting new bookings. Please try again once the doctor is Available.`;
}

// 4. Render lists
function renderDoctorsList(filter = "all") {
  doctorsGrid.innerHTML = "";
  
  // Filter doctors list
  const filteredDocs = filter === "all" ? doctors : doctors.filter(doc => doc.specialty === filter);
  
  if (filteredDocs.length === 0) {
    doctorsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; font-weight: 500;">No doctors found for this specialty.</p>`;
    return;
  }

  filteredDocs.forEach(doc => {
    // Determine status badge class
    let statusClass = "available";
    let transKey = "status-avail";
    if (doc.status === "Busy") { statusClass = "busy"; transKey = "status-busy"; }
    else if (doc.status === "Running Late") { statusClass = "late"; transKey = "status-late"; }
    else if (doc.status === "Left Hospital") { statusClass = "left"; transKey = "status-left"; }

    const transStatus = TRANSLATIONS[currentLanguage][transKey] || doc.status;

    // Fetch reviews for this doctor safely using type-agnostic string matching
    const allReviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
    const docReviews = allReviews.filter(r => r && (String(r.doctorId) === String(doc.id) || String(r.doctor_id) === String(doc.id)));
    
    // Recalculate average rating dynamically from reviews
    let activeRating = null;
    if (docReviews.length > 0) {
      const sum = docReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
      activeRating = Math.round((sum / docReviews.length) * 10) / 10;
    }

    // Build stars HTML or fallback to "No reviews"
    let ratingHtml = "";
    if (activeRating !== null && activeRating !== undefined) {
      let starsHtml = "";
      const fullStars = Math.floor(activeRating);
      const frac = activeRating % 1;
      for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
          starsHtml += '<i class="fa-solid fa-star"></i>';
        } else if (i === fullStars) {
          if (frac >= 0.75) {
            starsHtml += '<i class="fa-solid fa-star"></i>';
          } else if (frac >= 0.25) {
            starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
          } else {
            starsHtml += '<i class="fa-regular fa-star" style="color: #cbd5e1;"></i>';
          }
        } else {
          starsHtml += '<i class="fa-regular fa-star" style="color: #cbd5e1;"></i>';
        }
      }
      ratingHtml = `
        ${starsHtml}
        <span>(${activeRating.toFixed(1)})</span>
      `;
    } else {
      ratingHtml = `
        <i class="fa-regular fa-star" style="color: #cbd5e1;"></i>
        <i class="fa-regular fa-star" style="color: #cbd5e1;"></i>
        <i class="fa-regular fa-star" style="color: #cbd5e1;"></i>
        <i class="fa-regular fa-star" style="color: #cbd5e1;"></i>
        <i class="fa-regular fa-star" style="color: #cbd5e1;"></i>
        <span style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; margin-left: 4px;">(No reviews)</span>
      `;
    }

    // Create doctor card element
    const docCard = document.createElement("div");
    docCard.className = "glass-card doctor-card";
    docCard.setAttribute("data-aos", "fade-up");
    docCard.innerHTML = `
      <div class="doc-image-box">
        <div class="doc-status-badge ${statusClass}">
          <span></span> ${transStatus}
        </div>
        <!-- Doctor Avatar Drawing SVG -->
        <svg viewBox="0 0 100 100" width="100%" height="100%" style="background:#f1f5f9; padding: 20px;">
          <defs>
            <linearGradient id="docgrad-${doc.id}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#0066FF;stop-opacity:0.2" />
              <stop offset="100%" style="stop-color:#00F0FF;stop-opacity:0.1" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#docgrad-${doc.id})" stroke="#e2e8f0" stroke-width="2"/>
          <!-- Human portrait silhouette -->
          <path d="M50,22 C58,22 65,29 65,37 C65,45 58,52 50,52 C42,52 35,45 35,37 C35,29 42,22 50,22 Z" fill="#475569"/>
          <!-- Shoulders with stethoscope -->
          <path d="M22,78 C22,64 34,58 50,58 C66,58 78,64 78,78 Z" fill="#64748b"/>
          <path d="M40,58 C40,65 44,70 50,70 C56,70 60,65 60,58" fill="none" stroke="#0066FF" stroke-width="3"/>
          <circle cx="50" cy="70" r="4" fill="#00F0FF"/>
        </svg>
      </div>
      <div class="doc-details">
        <span class="doc-dept">${getTranslation(doc.specialty)}</span>
        <h3 class="doc-name">${doc.name}</h3>
        <div class="doc-rating">
          ${ratingHtml}
        </div>
        <div class="doc-meta">
          <div class="doc-meta-item">
            <span class="doc-meta-label"><i class="fa-solid fa-graduation-cap"></i> ${TRANSLATIONS[currentLanguage]["doc-exp-label"] || "Experience"}</span>
            <span class="doc-meta-val">${getTranslation(doc.exp)}</span>
          </div>
          <div class="doc-meta-item">
            <span class="doc-meta-label"><i class="fa-solid fa-calendar-check"></i> ${TRANSLATIONS[currentLanguage]["doc-days-label"] || "Visiting Days"}</span>
            <span class="doc-meta-val">${getTranslation(doc.days)}</span>
          </div>
          <div class="doc-meta-item">
            <span class="doc-meta-label"><i class="fa-solid fa-clock"></i> ${TRANSLATIONS[currentLanguage]["doc-timings-label"] || "Timings"}</span>
            <span class="doc-meta-val">${getTranslation(doc.time)}</span>
          </div>
          <div class="doc-meta-item">
            <span class="doc-meta-label"><i class="fa-solid fa-wallet"></i> ${TRANSLATIONS[currentLanguage]["doc-fee-label"] || "Consultation Fee"}</span>
            <span class="doc-meta-val" style="color: var(--primary);">₹${doc.fee}</span>
          </div>
        </div>
        ${isDoctorBookable(doc)
          ? `<button class="btn btn-primary doc-book-btn btn-ripple" onclick="triggerBooking('${doc.id}')">${TRANSLATIONS[currentLanguage]["doc-btn-book"] || "Book Appointment"}</button>`
          : `<button class="btn doc-book-btn" disabled style="background: #e2e8f0; color: #94a3b8; cursor: not-allowed; box-shadow: none; border: 1px solid #cbd5e1;"><i class="fa-solid fa-ban" style="margin-right: 6px;"></i>${TRANSLATIONS[currentLanguage]["doc-btn-unavailable"] || "Currently Unavailable"}</button>`}
      </div>
    `;
    doctorsGrid.appendChild(docCard);
  });

  // Reset slider position to start
  currentDocIndex = 0;
  slideDoctors();
}

// ================= DOCTORS SLIDING CAROUSEL SYSTEM =================
let currentDocIndex = 0;

window.slideDoctorsPrev = function() {
  if (currentDocIndex > 0) {
    currentDocIndex--;
    slideDoctors();
  }
};

window.slideDoctorsNext = function() {
  const maxIndex = getMaxDocIndex();
  if (currentDocIndex < maxIndex) {
    currentDocIndex++;
    slideDoctors();
  }
};

function slideDoctors() {
  const grid = document.getElementById("doctors-grid");
  if (!grid) return;
  
  const card = grid.querySelector(".doctor-card");
  if (!card) {
    grid.style.transform = "translateX(0px)";
    const nav = document.querySelector(".carousel-nav");
    if (nav) nav.style.display = "none";
    return;
  }

  const cardWidth = card.clientWidth;
  const gap = 30; // Matches gap: 30px in CSS
  const transformX = -currentDocIndex * (cardWidth + gap);
  grid.style.transform = `translateX(${transformX}px)`;

  const prevBtn = document.getElementById("doctors-slide-prev");
  const nextBtn = document.getElementById("doctors-slide-next");
  const nav = document.querySelector(".carousel-nav");
  const maxIndex = getMaxDocIndex();

  if (nav) {
    if (maxIndex === 0) {
      nav.style.display = "none";
    } else {
      nav.style.display = "flex";
    }
  }

  if (prevBtn) {
    prevBtn.disabled = (currentDocIndex === 0);
  }
  if (nextBtn) {
    nextBtn.disabled = (currentDocIndex >= maxIndex);
  }
}

function getMaxDocIndex() {
  const grid = document.getElementById("doctors-grid");
  if (!grid) return 0;
  const cards = grid.querySelectorAll(".doctor-card");
  const visibleCards = getVisibleCardsCount();
  return Math.max(0, cards.length - visibleCards);
}

function getVisibleCardsCount() {
  const width = window.innerWidth;
  if (width > 1200) return 4;
  if (width > 768) return 3;
  if (width > 480) return 2;
  return 1;
}

// Adjust carousel slide position on window resizing
window.addEventListener("resize", () => {
  const maxIndex = getMaxDocIndex();
  if (currentDocIndex > maxIndex) {
    currentDocIndex = maxIndex;
  }
  slideDoctors();
});

function renderDepartmentsList() {
  // Managed dynamically via standard layout
}


// 5. Intelligent Disease / Symptom Search Engine
if (diseaseSearch) {
  diseaseSearch.addEventListener("input", performSearch);
}
if (searchBtn) {
  searchBtn.addEventListener("click", performSearch);
}

function performSearch() {
  if (!diseaseSearch) return;
  const query = diseaseSearch.value.trim().toLowerCase();
  
  if (!query) {
    searchResultsContainer.classList.remove("active");
    return;
  }

  // Clear previous search grid
  searchResultsGrid.innerHTML = "";
  let matchedDepts = new Set();

  // Search by disease mapping dictionary
  for (const [key, dept] of Object.entries(diseaseMap)) {
    if (query.includes(key) || key.includes(query)) {
      matchedDepts.add(dept);
    }
  }

  // Also check doctor specialties and doctor names
  doctors.forEach(doc => {
    if (doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query)) {
      matchedDepts.add(doc.specialty);
    }
  });

  if (matchedDepts.size > 0) {
    searchResultsContainer.classList.add("active");
    matchedDepts.forEach(deptName => {
      // Find a department description or icon
      const matchingDeptCard = document.querySelector(`.dept-card[data-dept="${deptName}"]`);
      let iconClass = "fa-solid fa-circle-h";
      let descText = "Specialist care checkups.";
      
      if (matchingDeptCard) {
        iconClass = matchingDeptCard.querySelector(".dept-icon i").className;
        descText = matchingDeptCard.querySelector("p").textContent;
      }

      const card = document.createElement("div");
      card.className = "glass-card dept-card";
      card.innerHTML = `
        <div class="dept-icon" style="background:var(--primary); color:#fff;"><i class="${iconClass}"></i></div>
        <h3>${deptName}</h3>
        <p>${descText}</p>
        <button class="btn btn-secondary" style="margin-top:15px; font-size:0.8rem; padding:8px 15px;" onclick="selectDepartmentFilter('${deptName}')">View Doctors</button>
      `;
      searchResultsGrid.appendChild(card);
    });
  } else {
    searchResultsContainer.classList.add("active");
    searchResultsGrid.innerHTML = `
      <p style="grid-column: 1/-1; text-align:center; padding: 20px;">
        No specific department mapped for "<strong>${query}</strong>". Please search by standard symptoms (e.g. cough, chest pain, migraine, skin rash).
      </p>
    `;
  }
}

// Symptom click suggestions trigger
suggestions.forEach(tag => {
  tag.addEventListener("click", () => {
    if (diseaseSearch) {
      diseaseSearch.value = tag.getAttribute("data-query");
      performSearch();
    }
  });
});

// Disease dropdown selector trigger
const diseaseDropdown = document.getElementById("disease-dropdown");
if (diseaseDropdown) {
  diseaseDropdown.addEventListener("change", (e) => {
    const selectedVal = e.target.value;
    if (selectedVal) {
      const deptName = diseaseMap[selectedVal];
      if (deptName) {
        selectDepartmentFilter(deptName);
      }
    }
  });
}

function selectDepartmentFilter(deptName) {
  // Scroll to doctors
  const doctorsEl = document.getElementById("doctors");
  if (doctorsEl) {
    doctorsEl.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Set filter button active in React or fallback to vanilla
  if (typeof window.setActiveSpecialty === 'function') {
    window.setActiveSpecialty(deptName);
  } else {
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-filter") === deptName) {
        btn.classList.add("active");
      }
    });
  }

  // Filter grid
  renderDoctorsList(deptName);
}


// 6. Doctor filter buttons controller (vanilla fallback)
const btns = document.querySelectorAll(".filter-btn");
btns.forEach(btn => {
  btn.addEventListener("click", () => {
    const activeBtns = document.querySelectorAll(".filter-btn");
    activeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderDoctorsList(btn.getAttribute("data-filter"));
  });
});


// 7. Interactive Appointment Booking details Populating
bookDept.addEventListener("change", populateDoctorsDropdown);

function populateDoctorsDropdown() {
  const selectedDept = bookDept.value;
  const currentDocVal = bookDoctor.value;
  const placeholder = TRANSLATIONS[currentLanguage]["form-select-doc"] || "Select doctor...";
  bookDoctor.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
  
  const filtered = doctors.filter(doc => doc.specialty === selectedDept);
  filtered.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.id;
    
    // Determine localized status
    let transKey = "status-avail";
    if (doc.status === "Busy") { transKey = "status-busy"; }
    else if (doc.status === "Running Late") { transKey = "status-late"; }
    else if (doc.status === "Left Hospital") { transKey = "status-left"; }
    const transStatus = TRANSLATIONS[currentLanguage][transKey] || doc.status;

    opt.textContent = `${doc.name} (Fee: ₹${doc.fee} | ${transStatus})`;
    // Doctors who are not Available cannot be selected for new bookings
    if (!isDoctorBookable(doc)) {
      opt.disabled = true;
    }
    bookDoctor.appendChild(opt);
  });
  
  if (currentDocVal && filtered.some(doc => doc.id === currentDocVal)) {
    bookDoctor.value = currentDocVal;
    bookDoctor.parentElement.classList.add("filled");
  } else {
    bookDoctor.value = "";
    bookDoctor.parentElement.classList.remove("filled");
  }
  
  bookDoctor.dispatchEvent(new Event("change"));
}

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
    slots = allSlots;
  }
}

bookDoctor.addEventListener("change", () => {
  const selectedDocId = bookDoctor.value;
  const doc = doctors.find(d => d.id === selectedDocId);
  if (doc) {
    bookFee.value = `₹${doc.fee}`;
    bookFee.parentElement.classList.add("filled");
  } else {
    bookFee.value = "";
    bookFee.parentElement.classList.remove("filled");
  }

  // Preserve previous date if any
  const previousDateVal = bookDate.value;

  // Clear previous dates
  const placeholder = currentLanguage === 'gu' ? 'તારીખ પસંદ કરો' : (currentLanguage === 'hi' ? 'तारीख चुनें' : 'Select Appointment Date');
  bookDate.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
  bookDate.parentElement.classList.remove("filled");
  
  const slotsWrapper = document.getElementById("slots-grid-wrapper");
  if (slotsWrapper) slotsWrapper.style.display = "none";
  bookTime.value = "";

  if (!selectedDocId) return;

  // Filter future available slots (visiting dates) for this doctor
  const now = new Date();
  const availableSlots = slots.filter(s => {
    if (s.doctorId !== selectedDocId || s.status !== "Available") return false;
    const slotTimeObj = parseSlotEndDateTime(s.date, s.time);
    return slotTimeObj > now;
  });

  if (availableSlots.length === 0) {
    const noSlotsPlaceholder = currentLanguage === 'gu' ? 'કોઈ તારીખ ઉપલબ્ધ નથી' : (currentLanguage === 'hi' ? 'कोई तिथि उपलब्ध नहीं है' : 'No available dates');
    bookDate.innerHTML = `<option value="" disabled selected>${noSlotsPlaceholder}</option>`;
    return;
  }

  // Populate dates dropdown
  const uniqueDates = [...new Set(availableSlots.map(s => s.date))].sort();
  uniqueDates.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    bookDate.appendChild(opt);
  });

  // Restore previous date selection if still available
  if (previousDateVal && uniqueDates.includes(previousDateVal)) {
    bookDate.value = previousDateVal;
    bookDate.parentElement.classList.add("filled");
    bookDate.dispatchEvent(new Event("change"));
  }
});

bookDate.addEventListener("change", () => {
  const selectedDocId = bookDoctor.value;
  const selectedDate = bookDate.value;
  const slotsWrapper = document.getElementById("slots-grid-wrapper");
  const lateWarning = document.getElementById("doctor-running-late-warning");
  const hoursDisplay = document.getElementById("book-consultation-hours-display");

  bookTime.value = "";

  if (!selectedDocId || !selectedDate) {
    if (slotsWrapper) slotsWrapper.style.display = "none";
    return;
  }

  // Find the visiting date slot record
  const slotRecord = slots.find(s => s.doctorId === selectedDocId && s.date === selectedDate && s.status === "Available");

  // Toggle Doctor Running Late Warning
  const doc = doctors.find(d => d.id === selectedDocId);
  if (lateWarning) {
    if (doc && doc.status === "Running Late") {
      lateWarning.style.display = "block";
    } else {
      lateWarning.style.display = "none";
    }
  }

  if (!slotRecord) {
    if (slotsWrapper) slotsWrapper.style.display = "none";
    alert(currentLanguage === 'gu' ? 'આ તારીખે કોઈ સમય ઉપલબ્ધ નથી' : (currentLanguage === 'hi' ? 'इस तिथि पर कोई समय उपलब्ध नहीं है' : 'Selected date is no longer available.'));
  } else {
    // Set the bookTime value to the doctor's fixed timing range
    bookTime.value = slotRecord.time;
    if (hoursDisplay) {
      hoursDisplay.textContent = slotRecord.time;
    }
    if (slotsWrapper) slotsWrapper.style.display = "block";
  }
});

// Trigger booking directly from doctor cards
window.triggerBooking = function(docId) {
  const doc = doctors.find(d => d.id === docId);
  if (doc && !isDoctorBookable(doc)) {
    alert(getDoctorUnavailableMessage(doc));
    return;
  }
  if (doc) {
    document.getElementById("appointment").scrollIntoView();
    bookDept.value = doc.specialty;
    bookDept.parentElement.classList.add("filled");
    
    populateDoctorsDropdown();
    
    bookDoctor.value = doc.id;
    bookDoctor.parentElement.classList.add("filled");
    
    bookFee.value = `₹${doc.fee}`;
    bookFee.parentElement.classList.add("filled");
    
    // Automatically trigger dates population
    bookDoctor.dispatchEvent(new Event("change"));
  }
};

// Form inputs floating labels handlers
const formInputs = document.querySelectorAll(".form-control");
formInputs.forEach(input => {
  if (input.value !== "") {
    input.parentElement.classList.add("filled");
  }
  
  input.addEventListener("focus", () => {
    input.parentElement.classList.add("focused");
  });
  
  input.addEventListener("blur", () => {
    input.parentElement.classList.remove("focused");
    if (input.value !== "") {
      input.parentElement.classList.add("filled");
    } else {
      input.parentElement.classList.remove("filled");
    }
  });

  input.addEventListener("change", () => {
    if (input.value !== "") {
      input.parentElement.classList.add("filled");
    } else {
      input.parentElement.classList.remove("filled");
    }
  });

  input.addEventListener("input", () => {
    if (input.value !== "") {
      input.parentElement.classList.add("filled");
    } else {
      input.parentElement.classList.remove("filled");
    }
  });
});


// 8. Queue Management Visuals
function updateQueueDisplay() {
  // disabled under simplified Clinic Appointment Booking System
}


// 9. Interactive Booking Submission & payment gateway Razorpay Integration
window.launchRazorpayPayment = function(apptData) {
  return new Promise((resolve, reject) => {
    const { name, phone, email, dept, docId, date, slot, symptoms } = apptData;
    const targetDoc = doctors.find(d => d.id === docId);
    if (!targetDoc) {
      reject(new Error("Doctor profile mismatch. Please select another specialist."));
      return;
    }

    // Final safety check: never start a payment for a doctor who is not Available
    if (!isDoctorBookable(targetDoc)) {
      reject(new Error(getDoctorUnavailableMessage(targetDoc)));
      return;
    }

    const API_BASE = window.API_BASE || '';

    // 1. Create Razorpay order ID on the backend
    fetch(`${API_BASE}/api/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: targetDoc.fee })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => { throw new Error(data.message || "Failed to create Razorpay order."); });
      }
      return res.json();
    })
    .then(data => {
      if (data.success && data.order_id) {
        // 2. Configure checkout popup options
        const options = {
          "key": data.key,
          "amount": data.amount,
          "currency": "INR",
          "name": "Superspeciality Clinic",
          "description": `Consultation with Dr. ${targetDoc.name}`,
          "order_id": data.order_id,
          "handler": function (response) {
            // 3. Verify signature on the backend
            fetch(`${API_BASE}/api/payments/verify-signature`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })
            .then(verifyRes => {
              if (!verifyRes.ok) {
                return verifyRes.json().then(d => { throw new Error(d.message || "Signature validation failed."); });
              }
              return verifyRes.json();
            })
            .then(verifyData => {
              if (verifyData.success) {
                // 4. Save booking once signature checks pass
                const bookingPayload = {
                  patient_name: name,
                  patient_phone: phone,
                  patient_email: email || 'N/A',
                  doctor_id: targetDoc.id,
                  doctor_name: targetDoc.name,
                  symptom: symptoms,
                  appointment_date: date,
                  appointment_time: slot,
                  payment_status: "Paid",
                  appointment_status: "Upcoming"
                };

                fetch(`${API_BASE}/api/book-appointment`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(bookingPayload)
                })
                .then(res => {
                  if (!res.ok) {
                    return res.json().then(data => { throw new Error(data.message || "Failed to book appointment."); });
                  }
                  return res.json();
                })
                .then(bookingData => {
                  if (bookingData.success && bookingData.appointment) {
                    const newAppointment = bookingData.appointment;
                    newAppointment.payId = response.razorpay_payment_id; // Set actual Razorpay ID
                    latestBookedAppointment = newAppointment;

                    appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
                    appointments.push(newAppointment);
                    localStorage.setItem("phh_appointments", JSON.stringify(appointments));

                    window.dispatchEvent(new Event("storage_local"));
                    resolve(newAppointment);
                  } else {
                    reject(new Error("Failed to store appointment log."));
                  }
                })
                .catch(err => reject(err));
              } else {
                reject(new Error("Invalid signature verified."));
              }
            })
            .catch(err => reject(err));
          },
          "prefill": {
            "name": name,
            "email": email || "",
            "contact": phone
          },
          "theme": {
            "color": "#0066FF"
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      }
    })
    .catch(err => {
      // FALLBACK TO SIMULATOR IF KEY CONFIG IS NOT IN .ENV YET
      console.warn("Razorpay keys missing or error occurred, falling back to simulator:", err.message);

      rpAmountDisplay.textContent = `₹${targetDoc.fee}.00`;
      rpDescDisplay.textContent = `Booking Payment for ${targetDoc.name}`;
      razorpayOverlay.style.display = "flex";
      setTimeout(() => razorpayOverlay.classList.add("active"), 10);
      
      window.pendingBooking = { name, phone, email: email || "N/A", dept, docId, date, slot, symptoms, fee: targetDoc.fee };
      window.resolvePendingBooking = resolve;
      window.rejectPendingBooking = reject;
    });
  });
};

appointmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const name = document.getElementById("book-name").value.trim();
  const phone = document.getElementById("book-phone").value.trim();
  const email = document.getElementById("book-email").value.trim();
  const dept = bookDept.value;
  const docId = bookDoctor.value;
  const date = document.getElementById("book-date").value;
  const slot = document.getElementById("book-time").value;
  const symptoms = document.getElementById("book-symptoms").value.trim();
  
  if (!name || !phone || !dept || !docId || !date || !slot || !symptoms) {
    alert("Please fill in all required medical booking fields.");
    return;
  }

  // Block booking if the selected doctor's live status is not Available
  const bookingDoc = doctors.find(d => d.id === docId);
  if (bookingDoc && !isDoctorBookable(bookingDoc)) {
    alert(getDoctorUnavailableMessage(bookingDoc));
    return;
  }

  const submitBtn = appointmentForm.querySelector("button[type='submit']");
  const originalBtnText = submitBtn.textContent;
  
  submitBtn.textContent = "Initiating Secure Payment...";
  submitBtn.disabled = true;

  window.launchRazorpayPayment({ name, phone, email, dept, docId, date, slot, symptoms })
  .then(newAppointment => {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;

    receiptDetailsBox.innerHTML = `
      <p><strong>Patient:</strong> ${newAppointment.patientName}</p>
      <p><strong>Doctor:</strong> ${newAppointment.doctorName}</p>
      <p><strong>Appointment Time:</strong> ${newAppointment.date} / ${newAppointment.slot}</p>
      <p><strong>Booking Reference:</strong> ${newAppointment.id}</p>
      <p><strong>Razorpay Payment ID:</strong> ${newAppointment.payId || newAppointment.pay_id || 'N/A'}</p>
      <p><strong>Hospital Address:</strong> Deesa Crossroads, Palanpur</p>
    `;

    successModal.classList.add("active");
    document.body.classList.add("modal-open");
    
    appointmentForm.reset();
    document.querySelectorAll(".form-group").forEach(el => el.classList.remove("filled"));
    document.querySelectorAll(".form-control").forEach(input => {
      if (input.value !== "") {
        input.parentElement.classList.add("filled");
      }
    });
    
    updateQueueDisplay();
    
    currentUser = {
      role: "patient",
      name: newAppointment.patientName,
      email: newAppointment.patientEmail,
      phone: newAppointment.patientPhone,
    };
    localStorage.setItem("phh_current_user", JSON.stringify(currentUser));
  })
  .catch(err => {
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    if (err) {
      alert(err.message || "Failed to complete appointment booking.");
    }
  });
});

rpPayBtn.addEventListener("click", () => {
  if (!window.pendingBooking) return;
  
  rpPayBtn.textContent = "Processing payment...";
  rpPayBtn.disabled = true;

  const doc = doctors.find(d => d.id === window.pendingBooking.docId);
  if (!doc) {
    alert("Doctor profile mismatch. Please select another specialist.");
    rpPayBtn.textContent = "Pay Now via Razorpay";
    rpPayBtn.disabled = false;
    return;
  }

  const bookingPayload = {
    patient_name: window.pendingBooking.name,
    patient_phone: window.pendingBooking.phone,
    patient_email: window.pendingBooking.email,
    doctor_id: doc.id,
    doctor_name: doc.name,
    symptom: window.pendingBooking.symptoms,
    appointment_date: window.pendingBooking.date,
    appointment_time: window.pendingBooking.slot,
    payment_status: "Paid",
    appointment_status: "Upcoming"
  };

  const API_BASE = window.API_BASE || '';

  fetch(`${API_BASE}/api/book-appointment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingPayload)
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(data => { throw new Error(data.message || "Server Error"); });
    }
    return res.json();
  })
  .then(data => {
    if (data.success && data.appointment) {
      const newAppointment = data.appointment;
      latestBookedAppointment = newAppointment;
      
      appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      appointments.push(newAppointment);
      localStorage.setItem("phh_appointments", JSON.stringify(appointments));

      window.dispatchEvent(new Event("storage_local"));

      razorpayOverlay.classList.remove("active");
      setTimeout(() => {
        razorpayOverlay.style.display = "none";
      }, 300);
      rpPayBtn.textContent = "Pay Now via Razorpay";
      rpPayBtn.disabled = false;

      receiptDetailsBox.innerHTML = `
        <p><strong>Patient:</strong> ${newAppointment.patientName}</p>
        <p><strong>Doctor:</strong> ${newAppointment.doctorName}</p>
        <p><strong>Appointment Time:</strong> ${newAppointment.date} / ${newAppointment.slot}</p>
        <p><strong>Booking Reference:</strong> ${newAppointment.id}</p>
        <p><strong>Razorpay Payment ID:</strong> ${newAppointment.payId}</p>
        <p><strong>Hospital Address:</strong> Deesa Crossroads, Palanpur</p>
      `;

      successModal.classList.add("active");
      document.body.classList.add("modal-open");
      
      appointmentForm.reset();
      document.querySelectorAll(".form-group").forEach(el => el.classList.remove("filled"));
      document.querySelectorAll(".form-control").forEach(input => {
        if (input.value !== "") {
          input.parentElement.classList.add("filled");
        }
      });
      
      updateQueueDisplay();
      
      currentUser = {
        role: "patient",
        name: newAppointment.patientName,
        email: newAppointment.patientEmail,
        phone: newAppointment.patientPhone,
      };
      localStorage.setItem("phh_current_user", JSON.stringify(currentUser));

      window.pendingBooking = null;
    } else {
      throw new Error(data.message || "Failed to book appointment.");
    }
  })
  .catch(err => {
    console.error("Booking error:", err);
    alert(err.message || "Server communication failed. Please verify your connection.");
    rpPayBtn.textContent = "Pay Now via Razorpay";
    rpPayBtn.disabled = false;
  });
});

successModalClose.addEventListener("click", () => {
  successModal.classList.remove("active");
  document.body.classList.remove("modal-open");
});

receiptDashboardTrigger.addEventListener("click", () => {
  successModal.classList.remove("active");
  document.body.classList.remove("modal-open");
  window.location.href = "patient-dashboard.html";
});

// Download Receipt click listener
const downloadSuccessReceiptBtn = document.getElementById("download-success-receipt-btn");
if (downloadSuccessReceiptBtn) {
  downloadSuccessReceiptBtn.addEventListener("click", () => {
    if (latestBookedAppointment) {
      window.downloadReceiptPDF(latestBookedAppointment);
    } else {
      alert("No active booking receipt found.");
    }
  });
}

// Contact Form Submission Handler
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const subject = document.getElementById("contact-subject").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !subject || !message) {
      alert("Please fill in all required fields.");
      return;
    }

    const payload = { name, email, subject, message };
    const API_BASE = window.API_BASE || '';

    fetch(`${API_BASE}/api/contact-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => { throw new Error(data.message || "Server Error"); });
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        alert("Your message has been sent successfully!");
        contactForm.reset();
        
        // Remove filled class from form groups
        contactForm.querySelectorAll(".form-group").forEach(el => el.classList.remove("filled"));
      } else {
        throw new Error(data.message || "Failed to send message.");
      }
    })
    .catch(err => {
      console.error("Contact form error:", err);
      alert(err.message || "Failed to submit message. Please try again.");
    });
  });
}

// renderQrCode function removed as QR checking is replaced by phone check-in.


// ================= TESTIMONIAL CAROUSEL =================
function showTestimonial(index) {
  if (testimonialSlides.length === 0) return;
  testimonialSlides.forEach(slide => slide.classList.remove("active"));
  if (testimonialSlides[index]) {
    testimonialSlides[index].classList.add("active");
  }
}

testNextBtn.addEventListener("click", () => {
  if (testimonialSlides.length === 0) return;
  activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(activeTestimonialIndex);
});

testPrevBtn.addEventListener("click", () => {
  if (testimonialSlides.length === 0) return;
  activeTestimonialIndex = (activeTestimonialIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
  showTestimonial(activeTestimonialIndex);
});

// Auto rotation
setInterval(() => {
  if (testimonialSlides.length === 0) return;
  activeTestimonialIndex = (activeTestimonialIndex + 1) % testimonialSlides.length;
  showTestimonial(activeTestimonialIndex);
}, 10000);

function renderTestimonials() {
  const track = document.querySelector(".testimonial-track");
  if (!track) return;

  const reviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
  
  if (reviews.length > 0) {
    track.innerHTML = reviews.map((rev, idx) => {
      const doc = doctors.find(d => d.id === rev.doctorId || d.id === rev.doctor_id);
      const docLabel = doc ? `Consultation with Dr. ${doc.name}` : "General Consultation";
      
      let starsHtml = "";
      const ratingVal = parseInt(rev.rating, 10) || 5;
      for (let i = 0; i < 5; i++) {
        if (i < ratingVal) {
          starsHtml += `<i class="fa-solid fa-star"></i>`;
        } else {
          starsHtml += `<i class="fa-regular fa-star" style="color: #cbd5e1;"></i>`;
        }
      }

      const activeClass = idx === 0 ? "active" : "";

      return `
        <div class="glass-card testimonial-slide ${activeClass}">
          <div class="testimonial-body">
            <i class="fa-solid fa-quote-left quote-icon"></i>
            <p class="test-text">"${rev.review}"</p>
            <div class="test-patient">
              <span class="test-name">${rev.patientName || rev.patient_name || 'Patient'}</span>
              <span class="test-city">${docLabel}</span>
              <div class="test-rating">
                ${starsHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } else {
    // Default fallback testimonials when no reviews exist
    track.innerHTML = `
      <div class="glass-card testimonial-slide active">
        <div class="testimonial-body">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="test-text" data-translate="test-1-text">"Palanpur Health Hub saved me hours of clinic waiting. I booked an appointment with Dr. Ananya (Cardiology) from home, paid securely on Razorpay, and monitored my live queue position instantly!"</p>
          <div class="test-patient">
            <span class="test-name" data-translate="test-1-name">Jayesh Trivedi</span>
            <span class="test-city" data-translate="test-1-city">Palanpur, Gujarat</span>
            <div class="test-rating">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div class="glass-card testimonial-slide">
        <div class="testimonial-body">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="test-text" data-translate="test-2-text">"The disease mapping search is very clever. I searched 'cough' and it instantly showed Pulmonologist Dr. Rajesh Shah. The Gujarati translation is fully accurate and made booking very easy!"</p>
          <div class="test-patient">
            <span class="test-name" data-translate="test-2-name">Kokila Parmar</span>
            <span class="test-city" data-translate="test-2-city">Deesa Highway, Palanpur</span>
            <div class="test-rating">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star-half-stroke"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-card testimonial-slide">
        <div class="testimonial-body">
          <i class="fa-solid fa-quote-left quote-icon"></i>
          <p class="test-text" data-translate="test-3-text">"The live doctor status indicator is a lifesaver! I saw Dr. Rajesh Shah was 'Running Late' by 20 minutes, so I adjusted my travel from Deesa accordingly and didn't have to wait in the hospital queue."</p>
          <div class="test-patient">
            <span class="test-name" data-translate="test-3-name">Bhavesh Mehta</span>
            <span class="test-city" data-translate="test-3-city">Gathaman Gate, Palanpur</span>
            <div class="test-rating">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Update slide list reference and reset index
  testimonialSlides = document.querySelectorAll(".testimonial-slide");
  activeTestimonialIndex = 0;
  
  // Re-apply translations for default slides if any are rendered and active language is not english
  const elements = track.querySelectorAll("[data-translate]");
  elements.forEach(element => {
    const key = element.getAttribute("data-translate");
    if (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) {
      element.innerHTML = TRANSLATIONS[currentLanguage][key];
    }
  });
}


// ================= FAQ ACCORDION MANAGER =================
document.querySelectorAll(".faq-question").forEach(q => {
  q.addEventListener("click", () => {
    const parent = q.parentElement;
    const isAct = parent.classList.contains("active");
    
    document.querySelectorAll(".faq-item").forEach(item => {
      item.classList.remove("active");
      item.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!isAct) {
      parent.classList.add("active");
      const ans = parent.querySelector(".faq-answer");
      ans.style.maxHeight = ans.scrollHeight + "px";
    }
  });
});

// Bind click events on department cards to scroll and filter doctors
document.querySelectorAll(".dept-card").forEach(card => {
  card.style.cursor = "pointer";
  card.addEventListener("click", () => {
    const deptName = card.getAttribute("data-dept");
    if (deptName) {
      selectDepartmentFilter(deptName);
    }
  });
});

// Close button on Razorpay Checkout
const rpCloseBtn = document.getElementById("rp-close-btn");
if (rpCloseBtn) {
  rpCloseBtn.addEventListener("click", () => {
    razorpayOverlay.classList.remove("active");
    setTimeout(() => {
      razorpayOverlay.style.display = "none";
    }, 300);
  });
}


// ================= INITIAL LANGUAGE SELECTOR =================
// ================= 2-STEP WELCOME SELECTION WIZARD =================

window.selectInitialLanguageStep1 = function(lang) {
  // Save active language
  currentLanguage = lang;
  localStorage.setItem("phh_lang", lang);
  setLanguage(lang);
  window.closeWelcomeModal();
};

window.closeWelcomeModal = function() {
  localStorage.setItem("phh_lang_chosen", "true");
  const modal = document.getElementById("initial-lang-modal");
  if (modal) {
    modal.style.opacity = "0";
    modal.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      modal.style.display = "none";
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }, 400);
  }
};

function initHomepage() {
  autoExpireSlots();
  setLanguage(currentLanguage);
  
  const langChosen = localStorage.getItem("phh_lang_chosen");
  const modal = document.getElementById("initial-lang-modal");
  if (!langChosen && modal) {
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  } else if (modal) {
    modal.style.display = "none";
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  // Initialize chatbot assistant
  if (typeof CareMateAI !== 'undefined') {
    window.chatbotInstance = new CareMateAI();
    window.chatbotInstance.init();
  }
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  initHomepage();
} else {
  document.addEventListener("DOMContentLoaded", initHomepage);
}

window.openWelcomeModal = function() {
  const modal = document.getElementById("initial-lang-modal");
  if (modal) {
    const step2 = document.getElementById("lang-step-2");
    if (step2) step2.style.display = "none";
    const step1 = document.getElementById("lang-step-1");
    if (step1) step1.style.display = "block";
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.classList.add("active");
    document.body.classList.add("modal-open");
  }
};

// Populate departments select element dynamically
function populateDepartmentsDropdown() {
  const deptSelect = document.getElementById("book-dept");
  if (!deptSelect) return;
  
  const currentSel = deptSelect.value;
  
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
  
  if (currentSel) {
    deptSelect.value = currentSel;
  }
  
  // Translate options
  const lang = localStorage.getItem("phh_lang") || "en";
  Array.from(deptSelect.options).forEach(opt => {
    const val = opt.value;
    if (val && typeof DYNAMIC_TRANSLATIONS !== 'undefined' && DYNAMIC_TRANSLATIONS[lang] && DYNAMIC_TRANSLATIONS[lang][val]) {
      opt.textContent = DYNAMIC_TRANSLATIONS[lang][val];
    }
  });
}

// Robust database state sync for landing page
function performLandingPageSync() {
  autoExpireSlots();
  doctors = (JSON.parse(localStorage.getItem("phh_doctors")) || DEFAULT_DOCTORS).filter(doc => doc.status !== 'Pending');
  diseaseMap = JSON.parse(localStorage.getItem("phh_disease_map")) || DEFAULT_DISEASE_MAP;
  appointments = JSON.parse(localStorage.getItem("phh_appointments")) || [];
  slots = JSON.parse(localStorage.getItem("phh_slots")) || [];
  
  renderDoctorsList();
  renderDepartmentsList();
  populateDepartmentsDropdown();
  if (typeof populateDoctorsDropdown === 'function') {
    populateDoctorsDropdown();
  }
  renderTestimonials();

  // Trigger change event if a doctor is selected to refresh dates and slots from the synced slots
  if (bookDoctor && bookDoctor.value) {
    bookDoctor.dispatchEvent(new Event("change"));
  }
}

// Watch for storage changes on other pages
window.addEventListener("storage", (e) => {
  if (e.key === "phh_doctors" || e.key === "phh_appointments" || e.key === "phh_disease_map" ||  e.key === "phh_slots" || e.key === "phh_departments" || e.key === "phh_reviews") {
    performLandingPageSync();
  }
});

// Local sync trigger
window.addEventListener("storage_local", () => {
  performLandingPageSync();
});

// Populate on initial run
populateDepartmentsDropdown();


// ================= CUSTOM VALIDATION TOOLTIP SYSTEM =================

let isValidationCycleActive = false;

document.addEventListener("invalid", (e) => {
  // Prevent standard HTML5 browser validation bubble popup
  e.preventDefault();
  
  const input = e.target;
  showCustomValidationTooltip(input);
}, true); // Use capture phase to catch the non-bubbling 'invalid' event globally

function showCustomValidationTooltip(input) {
  // Remove any existing tooltips for this input first
  removeCustomValidationTooltip(input);

  // Set default message
  let message = input.validationMessage;
  if (input.validity.valueMissing) {
    const lang = localStorage.getItem("phh_lang") || "en";
    if (lang === 'gu') {
      message = "કૃપા કરીને આ ફીલ્ડ ભરો.";
    } else if (lang === 'hi') {
      message = "कृपया इस फ़ील्ड को भरें।";
    } else {
      message = "Please fill out this field.";
    }
  }

  // Create custom tooltip div
  const tooltip = document.createElement("div");
  tooltip.className = "custom-validation-tooltip";
  tooltip.innerHTML = `
    <div class="tooltip-arrow"></div>
    <div class="tooltip-content">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(tooltip);

  // Position tooltip relative to viewport + scroll offset
  const rect = input.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  tooltip.style.position = "absolute";
  tooltip.style.zIndex = "100000";
  tooltip.style.left = `${rect.left + scrollLeft}px`;
  tooltip.style.top = `${rect.bottom + scrollTop + 8}px`; // 8px spacing

  // Store reference to close it later
  input._customTooltip = tooltip;

  // Set focus on input element ONLY for the first invalid element in a validation cycle
  if (!isValidationCycleActive) {
    isValidationCycleActive = true;
    input.focus();
    setTimeout(() => {
      isValidationCycleActive = false;
    }, 50);
  }

  let autoDismissTimer = null;

  // Event handlers to dismiss tooltip immediately
  const dismissHandler = () => {
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer);
      autoDismissTimer = null;
    }
    removeCustomValidationTooltip(input);
    input.removeEventListener("input", dismissHandler);
    input.removeEventListener("change", dismissHandler);
    input.removeEventListener("blur", dismissHandler);
  };

  input.addEventListener("input", dismissHandler);
  input.addEventListener("change", dismissHandler);
  input.addEventListener("blur", dismissHandler);

  // Trigger smooth enter animation
  setTimeout(() => {
    tooltip.classList.add("show");
  }, 10);

  // Auto disappear after 1 second (1000ms)
  autoDismissTimer = setTimeout(() => {
    dismissHandler();
  }, 1000);
}

function removeCustomValidationTooltip(input) {
  if (input._customTooltip) {
    const t = input._customTooltip;
    t.classList.remove("show");
    setTimeout(() => {
      t.remove();
    }, 200);
    input._customTooltip = null;
  }
}

// Clear all active tooltips and references
function clearAllValidationTooltips() {
  document.querySelectorAll(".custom-validation-tooltip").forEach(el => el.remove());
  document.querySelectorAll("input, select, textarea").forEach(input => {
    input._customTooltip = null;
  });
}

// Clear all active tooltips during scroll/resize to keep UI aligned
window.addEventListener("scroll", clearAllValidationTooltips, { passive: true });
window.addEventListener("resize", clearAllValidationTooltips);

// =====================================================================
// ================= HOSPITAL ASSISTANT CHATBOT ENGINES =================
// =====================================================================

const CHATBOT_TRANSLATIONS = {
  en: {
    welcome: "Hello! I am your **Hospital Assistant ChatBot**. How can I help you today?",
    welcome_title: "Hospital Assistant ChatBot",
    online: "Online",
    placeholder: "Ask something...",
    option_find_dept: "🔍 Find Department",
    option_find_doc: "🩺 Find Doctor",
    option_book: "📅 Book Appointment",
    option_fees: "💰 Doctor Fees",
    option_opd: "🕒 OPD Timings",
    option_emergency: "🚨 Emergency Help",
    option_nav: "📍 Hospital Navigation",
    option_tips: "💡 Health Tips",
    option_quiz: "🎯 Health Quiz",
    emergency_title: "🚨 MEDICAL EMERGENCY DETECTED",
    emergency_alert: "If you or someone else is experiencing severe chest pain, extreme breathing difficulty, or heavy bleeding, please call emergency services immediately or visit the Emergency department.",
    emergency_call: "Emergency Contact: +91 99999 11111",
    emergency_ambulance: "Ambulance Hotline: 108",
    emergency_location: "Emergency Department: Building A, Ground Floor",
    opd_timings: "General OPD hours: Mon-Sat, 9:00 AM - 6:00 PM. Emergency services are open 24/7.",
    symptom_prompt: "Please select a symptom below or type your symptom (e.g. cough, joint pain):",
    dept_recommended: "Based on your symptom, we recommend consulting our **{dept}** department.",
    dept_not_found: "I couldn't match that symptom. Please consult **General Medicine** or describe it differently.",
    view_docs_btn: "View {dept} Doctors",
    booking_step_name: "Sure! Let's book an appointment. First, what is the patient's full name?",
    booking_step_dept: "Hello {name}. Please select the department you need:",
    booking_step_doc: "Great. Please select a specialist doctor:",
    booking_step_date: "Select an available appointment date:",
    booking_step_slot: "Select a time slot:",
    booking_step_symptoms: "Briefly describe your symptoms/reason for visit:",
    booking_summary_title: "Appointment Summary",
    booking_summary: "<strong>Patient:</strong> {name}<br><strong>Doctor:</strong> {doc}<br><strong>Department:</strong> {dept}<br><strong>Time:</strong> {date} at {slot}<br><strong>Fee:</strong> ₹{fee}",
    btn_pay_confirm: "Pay & Confirm",
    booking_success: "Appointment booked successfully! Your reference ID is {id}. You can view details in your dashboard.",
    booking_fail: "Payment or booking failed: {error}",
    doctor_status_title: "Our Medical Specialists:",
    doctor_status_btn: "Check availability & status",
    health_tips_title: "💡 Health Tip of the Day",
    quiz_welcome: "Let's play a quick 3-question Health Quiz! Are you ready?",
    quiz_ready_btn: "Start Quiz",
    nav_prompt: "Which department or area are you trying to find?",
    nav_facility_prompt: "Select a department or facility to get directions:",
    nav_directions: "<strong>{facility} Location:</strong><br>{directions}",
    no_slots_available: "No slots are currently available for this doctor. Please try another.",
    ask_for_name_first: "Please enter the patient's name to continue."
  },
  gu: {
    welcome: "નમસ્તે! હું તમારો **હોસ્પિટલ આસિસ્ટન્ટ ચેટબોટ** છું. હું આજે તમને કેવી રીતે મદદ કરી શકું?",
    welcome_title: "Hospital Assistant ChatBot",
    online: "ઓનલાઇન",
    placeholder: "કંઈક પૂછો...",
    option_find_dept: "🔍 વિભાગ શોધો",
    option_find_doc: "🩺 ડૉક્ટર શોધો",
    option_book: "📅 એપોઇન્ટમેન્ટ બુક કરો",
    option_fees: "💰 ડૉક્ટરની ફી",
    option_opd: "🕒 OPD સમય",
    option_emergency: "🚨 ઇમરજન્સી મદદ",
    option_nav: "📍 હોસ્પિટલ નેવિગેશન",
    option_tips: "💡 આરોગ્ય ટિપ્સ",
    option_quiz: "🎯 હેલ્થ ક્વિઝ",
    emergency_title: "🚨 તબીબી ઇમરજન્સી મળી",
    emergency_alert: "જો તમે અથવા અન્ય કોઈ ગંભીર છાતીમાં દુખાવો, શ્વાસ લેવામાં તકલીફ, અથવા ભારે રક્તસ્રાવ અનુભવી રહ્યા છો, તો કૃપા કરીને તાત્કાલિક ઇમરજન્ે કૉલ કરો અથવા ઇમરજન્સી વિભાગની મુલાકાત લો.",
    emergency_call: "ઇમરજન્સી સંપર્ક: +91 99999 11111",
    emergency_ambulance: "એમ્બ્યુલન્સ હોટલાઇન: 108",
    emergency_location: "ઇમરજન્સી વિભાગ: બિલ્ડિંગ A, ગ્રાઉન્ડ ફ્લોર",
    opd_timings: "સામાન્ય OPD કલાકો: સોમ-શનિ, સવારે 9:00 થી સાંજના 6:00. ઇમરજન્સી સેવાઓ 24/7 ખુલ્લી છે.",
    symptom_prompt: "કૃપા કરીને નીચેથી કોઈ લક્ષણ પસંદ કરો અથવા તમારું લક્ષણ લખો (દા.ત. ઉધરસ, સાંધાનો દુખાવો):",
    dept_recommended: "તમારા લક્ષણના આધારે, અમે અમારા **{dept}** વિભાગનો સંપર્ક કરવાની ભલામણ કરીએ છીએ.",
    dept_not_found: "હું તે લક્ષણ શોધી શક્યો નથી. કૃપા કરીને જનરલ મેડિસિનનો સંપર્ક કરો અથવા અલગ રીતે વર્ણન કરો.",
    view_docs_btn: "{dept} ના ડૉક્ટરો જુઓ",
    booking_step_name: "ચોક્કસ! ચાલો એપોઇન્ટમેન્ટ બુક કરીએ. પ્રથમ, દર્દીનું પૂરું નામ શું છે?",
    booking_step_dept: "હેલો {name}. કૃપા કરીને તમને જરૂરી વિભાગ પસંદ કરો:",
    booking_step_doc: "સરસ. કૃપા કરીને નિષ્ણાત ડૉક્ટર પસંદ કરો:",
    booking_step_date: "ઉપલબ્ધ એપોઇન્ટમેન્ટ તારીખ પસંદ કરો:",
    booking_step_slot: "સમય સ્લોટ પસંદ કરો:",
    booking_step_symptoms: "તમારા લક્ષણો/મુલાકાતનું કારણ ટૂંકમાં વર્ણવો:",
    booking_summary_title: "એપોઇન્ટમેન્ટ સારાંશ",
    booking_summary: "<strong>દર્દી:</strong> {name}<br><strong>ડૉક્ટર:</strong> {doc}<br><strong>વિભાગ:</strong> {dept}<br><strong>સમય:</strong> {date} ના {slot}<br><strong>ફી:</strong> ₹{fee}",
    btn_pay_confirm: "ચુકવણી અને પુષ્ટિ",
    booking_success: "એપોઇન્ટમેન્ટ સફળતાપૂર્વક બુક થઈ ગઈ છે! તમારો રેફરન્સ આઈડી {id} છે. તમે ડેશબોર્ડમાં વિગતો જોઈ શકો છો.",
    booking_fail: "ચુકવણી અથવા બુકિંગ નિષ્ફળ ગયું: {error}",
    doctor_status_title: "અમારા તબીબી નિષ્ણાતો:",
    doctor_status_btn: "ઉપલબ્ધતા અને સ્થિતિ તપાસો",
    health_tips_title: "💡 આજની આરોગ્ય ટિપ",
    quiz_welcome: "ચાલો એક ઝડપી 3-પ્રશ્નોની હેલ્થ ક્વિઝ રમીએ! શું તમે તૈયાર છો?",
    quiz_ready_btn: "ક્વિઝ શરૂ કરો",
    nav_prompt: "તમે કયો વિભાગ અથવા વિસ્તાર શોધવા માંગો છો?",
    nav_facility_prompt: "દિશા-નિર્દેશો મેળવવા માટે વિભાગ અથવા સુવિધા પસંદ કરો:",
    nav_directions: "<strong>{facility} સ્થાન:</strong><br>{directions}",
    no_slots_available: "આ ડૉક્ટર માટે કોઈ સ્લોટ હાલમાં ઉપલબ્ધ નથી. કૃપા કરીને બીજો પ્રયાસ કરો.",
    ask_for_name_first: "કૃપા કરીને આગળ વધવા માટે દર્દીનું નામ દાખલ કરો."
  },
  hi: {
    welcome: "नमस्ते! मैं आपका **अस्पताल सहायक चैटबॉट** हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
    welcome_title: "Hospital Assistant ChatBot",
    online: "ऑनलाइन",
    placeholder: "कुछ पूछें...",
    option_find_dept: "🔍 विभाग खोजें",
    option_find_doc: "🩺 डॉक्टर खोजें",
    option_book: "📅 अपॉइंटमेंट बुक करें",
    option_fees: "💰 डॉक्टर की फीस",
    option_opd: "🕒 OPD समय",
    option_emergency: "🚨 आपातकालीन मदद",
    option_nav: "📍 अस्पताल नेविगेशन",
    option_tips: "💡 स्वास्थ्य टिप्स",
    option_quiz: "🎯 स्वास्थ्य प्रश्नोत्तरी",
    emergency_title: "🚨 चिकित्सा आपातकाल का पता चला",
    emergency_alert: "यदि आप या कोई अन्य छाती में गंभीर दर्द, सांस लेने में अत्यधिक कठिनाई, या भारी रक्तस्राव का अनुभव कर रहे हैं, तो कृपया तुरंत आपातकालीन सेवाओं को कॉल करें या आपातकालीन विभाग में जाएँ।",
    emergency_call: "आपातकालीन संपर्क: +91 99999 11111",
    emergency_ambulance: "एम्बुलेंस हॉटलाइन: 108",
    emergency_location: "आपातकालीन विभाग: बिल्डिंग A, ग्राउंड फ्लोर",
    opd_timings: "सामान्य OPD घंटे: सोम-शनि, सुबह 9:00 से शाम 6:00 बजे। आपातकालीन सेवाएं 24/7 खुली हैं।",
    symptom_prompt: "कृपया नीचे से कोई लक्षण चुनें या अपना लक्षण टाइप करें (जैसे खांसी, जोड़ों का दर्द):",
    dept_recommended: "आपके लक्षण के आधार पर, हम हमारे **{dept}** विभाग से परामर्श करने की सलाह देते हैं।",
    dept_not_found: "मैं उस लक्षण का मिलान नहीं कर सका। कृपया सामान्य चिकित्सा से परामर्श लें या इसे अलग तरीके से समझाएं.",
    view_docs_btn: "{dept} के डॉक्टर देखें",
    booking_step_name: "ज़रूर! आइए अपॉइंटमेंट बुक करें। सबसे पहले, रोगी का पूरा नाम क्या है?",
    booking_step_dept: "नमस्ते {name}। कृपया अपनी आवश्यकता का विभाग चुनें:",
    booking_step_doc: "बहुत बढ़िया। कृपया एक विशेषज्ञ डॉक्टर चुनें:",
    booking_step_date: "उपलब्ध अपॉइंटमेंट तिथि चुनें:",
    booking_step_slot: "समय स्लॉट चुनें:",
    booking_step_symptoms: "संक्षेप में अपने लक्षणों/यात्रा के कारण का वर्णन करें:",
    booking_summary_title: "अपॉइंटमेंट सारांश",
    booking_summary: "<strong>रोगी:</strong> {name}<br><strong>डॉक्टर:</strong> {doc}<br><strong>विभाग:</strong> {dept}<br><strong>समय:</strong> {date} को {slot}<br><strong>फीस:</strong> ₹{fee}",
    btn_pay_confirm: "भुगतान और पुष्टि",
    booking_success: "अपॉइंटमेंट सफलतापूर्वक बुक हो गया है! आपकी संदर्भ आईडी {id} है। आप डैशबोर्ड में विवरण देख सकते हैं।",
    booking_fail: "भुगतान या बुकिंग विफल: {error}",
    doctor_status_title: "हमारे चिकित्सा विशेषज्ञ:",
    doctor_status_btn: "उपलब्धता और स्थिति की जांच करें",
    health_tips_title: "💡 आज की स्वास्थ्य टिप",
    quiz_welcome: "आइए एक त्वरित 3-प्रश्नों की स्वास्थ्य प्रश्नोत्तरी खेलें! क्या आप तैयार हैं?",
    quiz_ready_btn: "क्विज़ शुरू करें",
    nav_prompt: "आप कौन सा विभाग या क्षेत्र खोजना चाहते हैं?",
    nav_facility_prompt: "दिशानिर्देश प्राप्त करने के लिए विभाग या सुविधा का चयन करें:",
    nav_directions: "<strong>{facility} स्थान:</strong><br>{directions}",
    no_slots_available: "इस डॉक्टर के लिए कोई स्लॉट वर्तमान में उपलब्ध नहीं है। कृपया दूसरा प्रयास करें.",
    ask_for_name_first: "कृपया आगे बढ़ने के लिए रोगी का नाम दर्ज करें।"
  }
};

const CHATBOT_SYMPTOMS_MAP = {
  en: {
    "cough": "Pulmonology",
    "coughing": "Pulmonology",
    "fever": "General Medicine",
    "temperature": "General Medicine",
    "chest pain": "Cardiology",
    "heart pain": "Cardiology",
    "migraine": "Neurology",
    "headache": "Neurology",
    "skin rash": "Dermatology",
    "rash": "Dermatology",
    "ear pain": "ENT",
    "hearing": "ENT",
    "pregnancy": "Gynecology",
    "pregnant": "Gynecology",
    "child fever": "Pediatrics",
    "kids": "Pediatrics",
    "baby": "Pediatrics",
    "anxiety": "Psychology",
    "stress": "Psychology",
    "bone fracture": "Orthopedics",
    "fracture": "Orthopedics",
    "broken leg": "Orthopedics",
    "broken arm": "Orthopedics",
    "joint pain": "Orthopedics",
    "knee pain": "Orthopedics",
    "asthma": "Pulmonology",
    "breathing difficulty": "Pulmonology",
    "shortness of breath": "Pulmonology",
    "heart burn": "Cardiology",
    "cold": "General Medicine",
    "flu": "General Medicine",
    "throat infection": "ENT",
    "sore throat": "ENT",
    "acne": "Dermatology",
    "pimple": "Dermatology",
    "depression": "Psychology",
    "sadness": "Psychology",
    "stomach pain": "General Medicine"
  },
  gu: {
    "ઉધરસ": "Pulmonology",
    "ખાંસી": "Pulmonology",
    "તાવ": "General Medicine",
    "ગરમી": "General Medicine",
    "છાતીમાં દુખાવો": "Cardiology",
    "હૃદય": "Cardiology",
    "આધાશીશી": "Neurology",
    "માથું દુખવું": "Neurology",
    "માથાનો દુખાવો": "Neurology",
    "ચામડી પર લાલ ચિહ્નો": "Dermatology",
    "કાનનો દુખાવો": "ENT",
    "ગર્ભાવસ્થા": "Gynecology",
    "બાળક તાવ": "Pediatrics",
    "બાળકો": "Pediatrics",
    "ચિંતા": "Psychology",
    "ડિપ્રેશન": "Psychology",
    "હાડકું તૂટવું": "Orthopedics",
    "સાંધાનો દુખાવો": "Orthopedics",
    "ઘૂંટણનો દુખાવો": "Orthopedics",
    "શ્વાસ લેવામાં તકલીફ": "Pulmonology",
    "શરદી": "General Medicine",
    "ગળામાં ચેપ": "ENT",
    "ખિલ": "Dermatology",
    "પેટનો દુખાવો": "General Medicine"
  },
  hi: {
    "खांसी": "Pulmonology",
    "बुखार": "General Medicine",
    "तापमान": "General Medicine",
    "छाती में दर्द": "Cardiology",
    "दिल में दर्द": "Cardiology",
    "माइग्रेन": "Neurology",
    "सिरदर्द": "Neurology",
    "त्वचा पर चकत्ते": "Dermatology",
    "खुजली": "Dermatology",
    "कान में दर्द": "ENT",
    "गर्भावस्था": "Gynecology",
    "बच्चों का बुखार": "Pediatrics",
    "चिंता": "Psychology",
    "तनाव": "Psychology",
    "हड्डी टूटना": "Orthopedics",
    "जोड़ों का दर्द": "Orthopedics",
    "घुटने का दर्द": "Orthopedics",
    "सांस लेने में कठिनाई": "Pulmonology",
    "दमा": "Pulmonology",
    "जुकाम": "General Medicine",
    "गले में संक्रमण": "ENT",
    "मुँहासे": "Dermatology",
    "पेट दर्द": "General Medicine"
  }
};

const EMERGENCY_KEYWORDS = {
  en: ["chest pain", "breathing difficulty", "cannot breathe", "heart attack", "unconscious", "unconsciousness", "heavy bleeding", "bleeding heavily", "stroke"],
  gu: ["છાતીમાં ગંભીર દુખાવો", "શ્વાસ બંધ થવો", "બેભાન", "ભારે રક્તસ્રાવ", "હાર્ટ એટેક"],
  hi: ["छाती में तेज दर्द", "सांस न आना", "बेहोश", "भारी रक्तस्राव", "दिल का दौरा", "हार्ट अटैक"]
};

const HOSPITAL_DIRECTIONS = {
  en: {
    "General Medicine": "Building A, 1st Floor, Room 102 (Turn right after the main reception lobby).",
    "Cardiology": "Building B, 2nd Floor, Room 204 (Take the central elevator to the 2nd floor, turn left).",
    "Neurology": "Building B, 3rd Floor, Room 301 (Opposite the Neuropathy Lab).",
    "Pulmonology": "Building A, Ground Floor, Room 105 (Next to the X-Ray clinic).",
    "Orthopedics": "Building C, 1st Floor, Room 112 (Near the Physiotherapy Center).",
    "Gynecology": "Building A, 2nd Floor, Room 208 (Maternity Wing).",
    "Pediatrics": "Building A, 2nd Floor, Room 210 (Next to the children's playroom).",
    "Dermatology": "Building A, 1st Floor, Room 104 (Adjacent to Pharmacy B).",
    "ENT": "Building C, Ground Floor, Room 108 (Turn left at the entrance corridor).",
    "Psychology": "Building B, 4th Floor, Room 402 (Quiet Zone).",
    "ICU": "Building B, 1st Floor (Restricted Area, opposite CCU).",
    "Emergency": "Building A, Ground Floor (Direct entry via ambulance driveway outside)."
  },
  gu: {
    "General Medicine": "બિલ્ડિંગ A, પ્રથમ માળ, રૂમ ૧૦૨ (મુખ્ય રીસેપ્શન લોબી પછી જમણી બાજુ વળો).",
    "Cardiology": "બિલ્ડિંગ B, બીજા માળ, રૂમ ૨૦૪ (સેન્ટ્રલ લિફ્ટ દ્વારા બીજા માળે જાઓ, ડાબી બાજુ વળો).",
    "Neurology": "બિલ્ડિંગ B, ત્રીજો માળ, રૂમ ૩૦૧ (ન્યુરોપેથી લેબની સામે).",
    "Pulmonology": "બિલ્ડિંગ A, ગ્રાઉન્ડ ફ્લોર, રૂમ ૧૦૫ (એક્સ-રે ક્લિનિકની બાજુમાં).",
    "Orthopedics": "બિલ્ડિંગ C, પ્રથમ માળ, રૂમ ૧૧૨ (ફિઝીયોથેરાપી સેન્ટરની નજીક).",
    "Gynecology": "બિલ્ડિંગ A, બીજા માળ, રૂમ ૨૦૮ (મેટર્નિટી વિંગ).",
    "Pediatrics": "બિલ્ડિંગ A, બીજા માળ, રૂમ ૨૧૦ (બાળકોના પ્લેરૂમની બાજુમાં).",
    "Dermatology": "બિલ્ડિંગ A, પ્રથમ માળ, રૂમ ૧૦૪ (ફાર્મસી B ની નજીક).",
    "ENT": "બિલ્ડિંગ C, ગ્રાઉન્ડ ફ્લોર, રૂમ ૧૦૮ (પ્રવેશ કોરિડોર પર ડાબી બાજુ વળો).",
    "Psychology": "બિલ્ડિંગ B, ચોથો માળ, રૂમ ૪૦૨ (શાંત વિસ્તાર).",
    "ICU": "બિલ્ડિંગ B, પ્રથમ માળ (પ્રતિબંધિત વિસ્તાર, CCU ની સામે).",
    "Emergency": "બિલ્ડિંગ A, ગ્રાઉન્ડ ફ્લોર (બહાર એમ્બ્યુલન્સ ડ્રાઇવ વેથી સીધો પ્રવેશ)."
  },
  hi: {
    "General Medicine": "बिल्डिंग A, पहली मंजिल, कमरा 102 (मुख्य स्वागत कक्ष के बाद दाईं ओर मुड़ें)।",
    "Cardiology": "बिल्डिंग B, दूसरी मंजिल, कमरा 204 (केंद्रीय लिफ्ट से दूसरी मंजिल पर जाएं, बाईं ओर मुड़ें)।",
    "Neurology": "बिल्डिंग B, तीसरी मंजिल, कमरा 301 (न्यूरोपैथी लैब के सामने)।",
    "Pulmonology": "बिल्डिंग A, ग्राउंड फ्लोर, कमरा 105 (एक्स-रे क्लिनिक के बगल में)।",
    "Orthopedics": "बिल्डिंग C, पहली मंजिल, कमरा 112 (फिजियोथेरेपी केंद्र के पास)।",
    "Gynecology": "बिल्डिंग A, दूसरी मंजिल, कमरा 208 (मातृत्व विंग)।",
    "Pediatrics": "बिल्डिंग A, दूसरी मंजिल, कमरा 210 (बच्चों के प्लेरूम के बगल में)।",
    "Dermatology": "बिल्डिंग A, पहली मंजिल, कमरा 104 (फार्मेसी B के पास)।",
    "ENT": "बिल्डिंग C, ग्राउंड फ्लोर, कमरा 108 (प्रवेश गलियारे पर बाईं ओर मुड़ें)।",
    "Psychology": "बिल्डिंग B, चौथी मंजिल, कमरा 402 (शांत क्षेत्र)।",
    "ICU": "बिल्डिंग B, पहली मंजिल (प्रतिबंधित क्षेत्र, CCU के सामने)।",
    "Emergency": "बिल्डिंग A, ग्राउंड फ्लोर (बाहर एम्बुलेंस ड्राइववे से सीधे प्रवेश)।"
  }
};

const HEALTH_QUIZ = {
  en: [
    {
      q: "How many glasses of water should you ideally drink daily for good hydration?",
      o: ["2-3 glasses", "8-10 glasses", "15-20 glasses"],
      a: 1,
      r: "Correct! Drinking 8-10 glasses (about 2-3 liters) of water daily is crucial for kidney and cellular health."
    },
    {
      q: "Which organ is primarily affected by long-term high blood pressure?",
      o: ["Lungs", "Heart", "Stomach"],
      a: 1,
      r: "Correct! High blood pressure strains your heart and blood vessels, increasing risk of stroke/heart attacks."
    },
    {
      q: "What is the recommended duration of moderate exercise per week for adults?",
      o: ["30 minutes", "150 minutes", "500 minutes"],
      a: 1,
      r: "Correct! The WHO recommends at least 150 minutes of moderate-intensity aerobic exercise per week."
    }
  ],
  gu: [
    {
      q: "સારા હાઇડ્રેશન માટે દરરોજ કેટલા ગ્લાસ પાણી પીવું જોઈએ?",
      o: ["૨-૩ ગ્લાસ", "૮-૧૦ ગ્લાસ", "૧૫-૨૦ ગ્લાસ"],
      a: 1,
      r: "સાચું! કિડની અને સેલ્યુલર સ્વાસ્થ્ય માટે દરરોજ ૮-૧૦ ગ્લાસ (આશરે ૨-૩ લીટર) પાણી પીવું જોઈએ."
    },
    {
      q: "લાંબા સમય સુધી હાઈ બ્લડ પ્રેશરથી કયો અંગ મુખ્યત્વે પ્રભાવિત થાય છે?",
      o: ["ફેફસાં", "હૃદય", "પેટ"],
      a: 1,
      r: "સાચું! ઉચ્ચ બ્લડ પ્રેશર તમારા હૃદય અને રક્તવાહિનીઓ પર દબાણ વધારે છે."
    },
    {
      q: "પુખ્ત વયના લોકો માટે દર અઠવાડિયે કસરતનો આગ્રહણીય સમયગાળો કેટલો છે?",
      o: ["૩૦ મિનિટ", "૧૫૦ મિનિટ", "૫૦૦ મિનિટ"],
      a: 1,
      r: "સાચું! WHO દર અઠવાડિયે ઓછામાં ઓછી ૧૫૦ મિનિટ મધ્યમ-તીવ્રતાની કસરતની ભલામણ કરે છે."
    }
  ],
  hi: [
    {
      q: "अच्छे हाइड्रेशन के लिए आपको प्रति दिन कितने गिलास पानी पीना चाहिए?",
      o: ["2-3 गिलास", "8-10 गिलास", "15-20 गिलास"],
      a: 1,
      r: "सही! गुर्दे और सेलुलर स्वास्थ्य के लिए प्रतिदिन 8-10 गिलास (लगभग 2-3 लीटर) पानी आवश्यक है।"
    },
    {
      q: "लंबे समय तक उच्च रक्तचाप से कौन सा अंग मुख्य रूप से प्रभावित होता है?",
      o: ["फेफड़े", "हृदय", "पेट"],
      a: 1,
      r: "सही! उच्च रक्तचाप आपके हृदय और रक्त वाहिकाओं पर दबाव डालता है।"
    },
    {
      q: "वयस्कों के लिए प्रति सप्ताह मध्यम व्यायाम की अनुशंसित अवधि क्या है?",
      o: ["30 मिनट", "150 मिनट", "500 मिनट"],
      a: 1,
      r: "सही! डब्ल्यूएचओ प्रति सप्ताह कम से कम 150 मिनट मध्यम व्यायाम की सिफारिश करता है।"
    }
  ]
};

const HEALTH_TIPS = {
  en: [
    "💧 **Hydration Alert:** Drink a glass of water first thing in the morning to kickstart your metabolism.",
    "🧘 **Stress Relief:** Take 5 deep breaths during a busy day to reduce anxiety and blood pressure.",
    "🍎 **Nutrition Tip:** Include colorful vegetables in your diet for a robust range of antioxidants.",
    "😴 **Rest Well:** Aim for 7-8 hours of sound sleep to allow your body to heal and repair tissues.",
    "🚶 **Stay Active:** Walk for at least 30 minutes daily to keep your cardiovascular health in check."
  ],
  gu: [
    "💧 **હાઇડ્રેશન ટિપ:** ચયાપચયને ઝડપી બનાવવા માટે સવારે સૌથી પહેલાં એક ગ્લાસ પાણી પીવો.",
    "🧘 **તણાવ રાહત:** ચિંતા અને બ્લડ પ્રેશર ઘટાડવા માટે દિવસમાં ૫ ઊંડા શ્વાસ લો.",
    "🍎 **પોષણ ટિપ:** રોગપ્રતિકારક શક્તિ વધારવા રંગબેરંગી શાકભાજી આહારમાં ઉમેરો.",
    "😴 **આરામ કરો:** શરીરને સાજા થવા અને પેશીઓના સમારકામ માટે ૭-૮ કલાકની ઊંઘ લો.",
    "🚶 **સક્રિય રહો:** કાર્ડિયોવેસ્ક્યુલર સ્વાસ્થ્ય માટે દરરોજ ઓછામાં ઓછી ૩૦ મિનિટ ચાલો."
  ],
  hi: [
    "💧 **हाइड्रेशन टिप:** चयापचय को सक्रिय करने के लिए सुबह सबसे पहले एक गिलास पानी पिएं।",
    "🧘 **तनाव से राहत:** चिंता और रक्तचाप को कम करने के लिए दिन में 5 बार गहरी सांसें लें।",
    "🍎 **पोषण टिप:** एंटीऑक्सीडेंट की कमी पूरा करने के लिए अपने आहार में रंगीन सब्जियां शामिल करें।",
    "😴 **अच्छी नींद लें:** शरीर की मरम्मत के लिए रात में 7-8 घंटे की गहरी नींद लें।",
    "🚶 **सक्रिय रहें:** हृदय स्वास्थ्य को बनाए रखने के लिए रोजाना कम से कम 30 मिनट टहलें।"
  ]
};

class CareMateAI {
  constructor() {
    this.container = document.getElementById("chatbot-container");
    this.fab = document.getElementById("chatbot-fab");
    this.closeBtn = document.getElementById("chatbot-close-btn");
    this.messagesContainer = document.getElementById("chat-messages");
    this.suggestionsContainer = document.getElementById("chat-suggestions");
    this.inputForm = document.getElementById("chatbot-input-form");
    this.inputField = document.getElementById("chatbot-input-field");
    this.micBtn = document.getElementById("chatbot-mic-btn");

    this.lang = localStorage.getItem("phh_lang") || "en";
    this.state = "idle"; // idle, triage, booking, reschedule, cancel, review, calc, faq, compare, emergency
    
    this.flowData = {};
    this.history = [];
    
    this.recognition = null;
    this.isRecording = false;

    // Define codepoints translations to bypass backend regex escape bugs
    const gu_trans = {};
    const hi_trans = {};

    gu_trans.welcome = String.fromCodePoint(...[128075,32,42,42,67,97,114,101,77,97,116,101,32,65,73,42,42,32,2734,2750,2690,32,2694,2730,2728,2753,2690,32,2744,2765,2741,2750,2711,2724,32,2715,2759,10,42,2724,2734,2750,2736,2750,32,2732,2753,2726,2765,2727,2751,2742,2750,2739,2752,32,2745,2759,2738,2765,2725,2709,2759,2736,32,2744,2750,2725,2752,42,10,10,2745,2753,2690,32,2724,2734,2728,2759,32,2738,2709,2765,2743,2723,2763,2728,2753,2690,32,2741,2751,2742,2765,2738,2759,2743,2723,32,2709,2736,2741,2750,2734,2750,2690,44,32,2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2742,2759,2721,2765,2735,2754,2738,32,2709,2736,2741,2750,2734,2750,2690,44,32,2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2742,2763,2727,2741,2750,2734,2750,2690,32,2693,2728,2759,32,2694,2736,2763,2711,2765,2735,2728,2750,32,2694,2690,2709,2721,2750,32,2711,2723,2741,2750,2734,2750,2690,32,2711,2723,2741,2750,2734,2750,2690,32,2715,2759,63]);
    gu_trans.placeholder = String.fromCodePoint(...[2738,2709,2765,2743,2723,2763,44,32,2730,2765,2736,2742,2765,2728,32,2693,2725,2741,2750,32,2709,2750,2736,2765,2735,32,2738,2710,2763,46,46,46]);
    gu_trans.btn_triage = String.fromCodePoint(...[128269,32,2738,2709,2765,2743,2723,32,2741,2751,2742,2765,2738,2759,2743,2723]);
    gu_trans.btn_find = String.fromCodePoint(...[128104,8205,9877,65039,32,2721,2761,2709,2765,2719,2736,32,2742,2763,2727,2763]);
    gu_trans.btn_book = String.fromCodePoint(...[128197,32,2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2732,2753,2709,2751,2690,2711]);
    gu_trans.btn_appt = String.fromCodePoint(...[128203,32,2734,2750,2736,2752,32,2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719]);
    gu_trans.btn_emergency = String.fromCodePoint(...[128680,32,2695,2734,2736,2716,2728,2765,2744,2752,32,2734,2726,2726]);
    gu_trans.btn_directions = String.fromCodePoint(...[128205,32,2726,2751,2742,2750,45,2728,2751,2736,2765,2726,2759,2742,2763]);
    gu_trans.btn_compare = String.fromCodePoint(...[9878,65039,32,2721,2761,2709,2765,2719,2736,2763,2728,2752,32,2724,2753,2738,2728,2750]);
    gu_trans.btn_tools = String.fromCodePoint(...[128161,32,2745,2759,2738,2765,2725,32,2719,2753,2738,2765,2744]);
    gu_trans.btn_faq = String.fromCodePoint(...[10067,32,2730,2765,2736,2742,2765,2728,2763,32,2730,2754,2715,2763]);
    gu_trans.emergency_title = String.fromCodePoint(...[128680,32,2709,2719,2763,2709,2719,2752,32,2714,2759,2724,2741,2723,2752,32,2744,2709,2765,2736,2751,2735,32,2725,2696]);
    gu_trans.emergency_guideline = String.fromCodePoint(...[2711,2690,2733,2752,2736,32,2738,2709,2765,2743,2723,2763,32,2716,2763,2741,2750,32,2734,2739,2765,2735,2750,32,2715,2759,46,32,2709,2755,2730,2750,32,2709,2736,2752,2728,2759,32,2724,2750,2724,2765,2709,2750,2738,2751,2709,32,2724,2732,2752,2732,2752,32,2744,2750,2736,2741,2750,2736,32,2734,2759,2739,2741,2763,46]);
    gu_trans.emergency_btn = String.fromCodePoint(...[2695,2734,2736,2716,2728,2765,2744,2752,32,2709,2761,2738,32,40,49,48,56,41]);
    gu_trans.emergency_appt = String.fromCodePoint(...[2724,2765,2741,2736,2751,2724,32,2732,2753,2709,2751,2690,2711]);
    gu_trans.confirm_appt = String.fromCodePoint(...[2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2742,2759,2721,2765,2735,2754,2738,32,2709,2728,2765,2731,2736,2765,2734,32,2709,2736,2763]);
    gu_trans.reschedule = String.fromCodePoint(...[2736,2752,2742,2759,2721,2765,2735,2754,2738]);
    gu_trans.cancel = String.fromCodePoint(...[2736,2726,32,2709,2736,2763]);
    gu_trans.view_details = String.fromCodePoint(...[2741,2751,2711,2724,2763,32,2716,2753,2707]);
    gu_trans.ask_feedback = String.fromCodePoint(...[2721,2761,46,32,123,100,111,99,116,111,114,125,32,2744,2750,2725,2759,2728,2750,32,2724,2734,2750,2736,2750,32,2724,2750,2716,2759,2724,2736,2728,2750,32,2693,2728,2753,2733,2741,32,2709,2759,2741,2763,32,2736,2745,2765,2735,2763,63,32,2709,2755,2730,2750,32,2709,2736,2752,2728,2759,32,2736,2759,2719,2751,2690,2711,32,2694,2730,2763,58]);
    gu_trans.submit_feedback = String.fromCodePoint(...[2730,2765,2736,2724,2751,2744,2750,2726,32,2744,2732,2734,2751,2719,32,2709,2736,2763]);
    gu_trans.feedback_placeholder = String.fromCodePoint(...[2724,2734,2750,2736,2752,32,2744,2734,2752,2709,2765,2743,2750,32,2693,2745,2752,2690,32,2738,2710,2763,46,46,46]);
    gu_trans.feedback_success = String.fromCodePoint(...[2694,2733,2750,2736,33,32,2724,2734,2750,2736,2752,32,2744,2734,2752,2709,2765,2743,2750,32,2744,2690,2711,2765,2736,2745,2751,2724,32,2693,2728,2759,32,2744,2751,2690,2709,2765,2736,2728,2750,2695,2717,32,2725,2696,32,2711,2696,32,2715,2759,46]);
    gu_trans.reschedule_success = String.fromCodePoint(...[2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2744,2731,2739,2724,2750,2730,2754,2736,2765,2741,2709,32,123,100,97,116,101,125,32,2728,2750,32,2736,2763,2716,32,123,116,105,109,101,125,32,2741,2750,2711,2765,2735,2759,32,2736,2752,2742,2759,2721,2765,2735,2754,2738,32,2709,2736,2741,2750,2734,2750,2690,32,2694,2741,2752,32,2715,2759,46]);
    gu_trans.cancel_success = String.fromCodePoint(...[2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2736,2726,32,2709,2736,2741,2750,2734,2750,2690,32,2694,2741,2752,32,2715,2759,32,2693,2728,2759,32,2744,2734,2735,32,2744,2765,2738,2763,2719,32,2745,2741,2759,32,2697,2730,2738,2732,2765,2727,32,2715,2759,46]);
    gu_trans.no_appointments = String.fromCodePoint(...[2724,2734,2750,2736,2750,32,2728,2763,2690,2727,2750,2735,2759,2738,2750,32,2744,2690,2730,2736,2765,2709,32,2734,2750,2719,2759,32,2709,2763,2696,32,2694,2711,2750,2734,2752,32,2703,2730,2763,2695,2728,2765,2719,2734,2759,2728,2765,2719,32,2734,2739,2752,32,2728,2725,2752,46]);

    hi_trans.welcome = String.fromCodePoint(...[128075,32,42,42,67,97,114,101,77,97,116,101,32,65,73,42,42,32,2350,2375,2306,32,2310,2346,2325,2366,32,2360,2381,2357,2366,2327,2340,32,2361,2376,10,42,2310,2346,2325,2366,32,2348,2369,2342,2381,2343,2367,2350,2366,2344,32,2360,2381,2357,2366,2360,2381,2341,2381,2351,32,2360,2375,2357,2366,32,2360,2366,2341,2368,42,10,10,2350,2376,2306,32,2354,2325,2381,2359,2339,2379,2306,32,2325,2366,32,2357,2367,2358,2381,2354,2375,2359,2339,32,2325,2352,2344,2375,44,32,2309,2346,2377,2311,2306,2335,2350,2375,2306,2335,32,2348,2369,2325,32,2325,2352,2344,2375,44,32,2337,2377,2325,2381,2335,2352,2379,2306,32,2325,2379,32,2326,2379,2332,2344,2375,32,2324,2352,32,2360,2381,2357,2366,2360,2381,2341,2381,2351,32,2360,2306,2348,2306,2343,2368,32,2327,2339,2344,2366,2323,2306,32,2350,2375,2306,32,2310,2346,2325,2368,32,2350,2342,2342,32,2325,2352,32,2360,2325,2340,2366,32,2361,2370,2305,2404,32,2310,2332,32,2350,2376,2306,32,2310,2346,2325,2368,32,2325,2381,2351,2366,32,2350,2342,2342,32,2325,2352,2370,2305,63]);
    hi_trans.placeholder = String.fromCodePoint(...[2354,2325,2381,2359,2339,44,32,2346,2381,2352,2358,2381,2344,32,2351,2366,32,2325,2366,2352,2381,2351,32,2354,2367,2326,2375,2306,46,46,46]);
    hi_trans.btn_triage = String.fromCodePoint(...[128269,32,2354,2325,2381,2359,2339,32,2357,2367,2358,2381,2354,2375,2359,2339]);
    hi_trans.btn_find = String.fromCodePoint(...[128104,8205,9877,65039,32,2337,2377,2325,2381,2335,2352,32,2326,2379,2332,2375,2306]);
    hi_trans.btn_book = String.fromCodePoint(...[128197,32,2309,2346,2377,2311,2306,2335,2350,2375,2306,2335,32,2348,2369,2325,32,2325,2352,2375,2306]);
    hi_trans.btn_appt = String.fromCodePoint(...[128203,32,2350,2375,2352,2368,32,2309,2346,2377,2311,2306,2335,2350,2375,2306,2335]);
    hi_trans.btn_emergency = String.fromCodePoint(...[128680,32,2310,2346,2366,2340,2325,2366,2354,2368,2344,32,2350,2342,2342]);
    hi_trans.btn_directions = String.fromCodePoint(...[128205,32,2309,2360,2381,2346,2340,2366,2354,32,2344,2375,2357,2367,2327,2375,2358,2344]);
    hi_trans.btn_compare = String.fromCodePoint(...[9878,65039,32,2337,2377,2325,2381,2335,2352,2379,2306,32,2325,2368,32,2340,2369,2354,2344,2366]);
    hi_trans.btn_tools = String.fromCodePoint(...[128161,32,2360,2381,2357,2366,2360,2381,2341,2381,2351,32,2313,2346,2325,2352,2339]);
    hi_trans.btn_faq = String.fromCodePoint(...[10067,32,2325,2375,2351,2352,2350,2375,2335,32,2360,2375,32,2346,2370,2331,2375,2306]);
    hi_trans.emergency_title = String.fromCodePoint(...[128680,32,2310,2346,2366,2340,2325,2366,2354,2368,2344,32,2330,2375,2340,2366,2357,2344,2368,32,2360,2325,2381,2352,2367,2351]);
    hi_trans.emergency_guideline = String.fromCodePoint(...[2327,2306,2349,2368,2352,32,2354,2325,2381,2359,2339,32,2346,2366,2319,32,2327,2319,32,2361,2376,2306,2404,32,2325,2371,2346,2351,2366,32,2340,2369,2352,2306,2340,32,2330,2367,2325,2367,2340,2381,2360,2366,32,2360,2361,2366,2351,2340,2366,32,2346,2381,2352,2366,2346,2381,2340,32,2325,2352,2375,2306,2404]);
    hi_trans.emergency_btn = String.fromCodePoint(...[2310,2346,2366,2340,2325,2366,2354,2368,2344,32,2344,2306,2348,2352,32,40,49,48,56,41]);
    hi_trans.emergency_appt = String.fromCodePoint(...[2340,2381,2357,2352,2367,2340,32,2348,2369,2325,2367,2306,2327]);
    hi_trans.confirm_appt = String.fromCodePoint(...[2346,2369,2359,2381,2335,2367,32,2325,2352,2375,2306]);
    hi_trans.reschedule = String.fromCodePoint(...[2346,2369,2344,2352,2381,2344,2367,2352,2381,2343,2366,2352,2367,2340,32,2325,2352,2375,2306]);
    hi_trans.cancel = String.fromCodePoint(...[2352,2342,2381,2342,32,2325,2352,2375,2306]);
    hi_trans.view_details = String.fromCodePoint(...[2357,2367,2357,2352,2339,32,2342,2375,2326,2375,2306]);
    hi_trans.ask_feedback = String.fromCodePoint(...[2337,2377,46,32,123,100,111,99,116,111,114,125,32,2325,2375,32,2360,2366,2341,32,2310,2346,2325,2366,32,2309,2344,2369,2349,2357,32,2325,2376,2360,2366,32,2352,2361,2366,63,32,2325,2371,2346,2351,2366,32,2352,2375,2335,32,2325,2352,2375,2306,58]);
    hi_trans.submit_feedback = String.fromCodePoint(...[2347,2368,2337,2348,2376,2325,32,2349,2375,2332,2375,2306]);
    hi_trans.feedback_placeholder = String.fromCodePoint(...[2309,2346,2344,2368,32,2360,2350,2368,2325,2381,2359,2366,32,2351,2361,2366,2305,32,2354,2367,2326,2375,2306,46,46,46]);
    hi_trans.feedback_success = String.fromCodePoint(...[2343,2344,2381,2351,2357,2366,2342,33,32,2310,2346,2325,2368,32,2360,2350,2368,2325,2381,2359,2366,32,2360,2369,2352,2325,2381,2359,2367,2340,32,2324,2352,32,2360,2367,2306,2325,2381,2352,2344,2366,2311,2332,2364,32,2361,2379,32,2327,2312,32,2361,2376,46]);
    hi_trans.reschedule_success = String.fromCodePoint(...[2309,2346,2377,2311,2306,2335,2350,2375,2306,2335,32,2360,2347,2354,2340,2366,2346,2370,2352,2381,2357,2325,32,123,100,97,116,101,125,32,2325,2379,32,123,116,105,109,101,125,32,2348,2332,2375,32,2346,2369,2344,2352,2381,2344,2367,2352,2381,2343,2366,2352,2367,2340,32,2325,2352,32,2342,2367,2351,2366,32,2327,2351,2366,32,2361,2376,2404]);
    hi_trans.cancel_success = String.fromCodePoint(...[2309,2346,2377,2311,2306,2335,2350,2375,2306,2335,32,2352,2342,2381,2342,32,2325,2352,32,2342,2367,2351,2366,32,2327,2351,2366,32,2361,2376,32,2324,2352,32,2360,2381,2354,2377,2335,32,2326,2366,2354,2368,32,2361,2376,2404]);
    hi_trans.no_appointments = String.fromCodePoint(...[2310,2346,2325,2375,32,2346,2306,2332,2368,2325,2371,2340,32,2357,2367,2357,2352,2339,32,2325,2375,32,2354,2367,2319,32,2325,2379,2312,32,2310,2327,2366,2350,2368,32,2309,2346,2377,2311,2306,2335,2350,2375,2306,2335,32,2344,2361,2368,2306,32,2350,2367,2354,2366,2404]);

    this.translations = {
      en: {
        welcome: "👋 Welcome to **CareMate AI**\n*Your Intelligent Healthcare Companion*\n\nI can help you analyze symptoms, schedule appointments, search specialists, and calculate health stats. How can I help you today?",
        placeholder: "Type a symptom, question, or task...",
        btn_triage: "🔍 Analyze Symptoms",
        btn_find: "👨‍⚕️ Find Doctors",
        btn_book: "📅 Book Appointment",
        btn_appt: "📋 My Appointments",
        btn_emergency: "🚨 Emergency Help",
        btn_directions: "📍 Directions",
        btn_compare: "⚖️ Compare Doctors",
        btn_tools: "💡 Health Tools",
        btn_faq: "❓ Ask CareMate",
        emergency_title: "🚨 EMERGENCY ALERT TRIGGERED",
        emergency_guideline: "Critical symptoms detected. Please seek immediate attention.",
        emergency_btn: "Dial Emergency (108)",
        emergency_appt: "Instant Booking",
        confirm_appt: "Confirm Appointment",
        reschedule: "Reschedule",
        cancel: "Cancel",
        view_details: "View Details",
        ask_feedback: "How was your recent appointment with Dr. {doctor}? Please rate your experience:",
        submit_feedback: "Submit Feedback",
        feedback_placeholder: "Write your review here (optional)...",
        feedback_success: "Thank you! Your review has been saved and synchronized.",
        reschedule_success: "Appointment rescheduled successfully to {date} at {time}.",
        cancel_success: "Appointment has been cancelled and the slot is now open.",
        no_appointments: "No upcoming appointments found for your registered contact details."
      },
      gu: gu_trans,
      hi: hi_trans
    };
  }

  init() {
    if (!this.container || !this.fab) return;

    this.fab.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.toggleChat(false));

    this.inputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = this.inputField.value.trim();
      if (!text) return;
      this.handleUserInput(text);
      this.inputField.value = "";
    });

    this.setupSpeechRecognition();

    window.addEventListener("storage_local", () => {
      if (this.container && !this.container.classList.contains("hidden-chatbot")) {
        this.checkUpcomingAppointments(true); // silent refresh
      }
    });

    this.loadLanguage(this.lang);
    this.setupGuestConversionMonitor();
  }

  loadLanguage(lang) {
    this.lang = lang;
    if (this.inputField) {
      this.inputField.placeholder = this.translations[lang].placeholder;
    }
    const statusText = document.querySelector(".chatbot-status-text");
    if (statusText) {
      statusText.textContent = this.lang === 'gu' ? String.fromCodePoint(...[2741,2751,2736,2750,2707,2736]) : (this.lang === 'hi' ? String.fromCodePoint(...[2311,2344,2354,2366,2311,2344]) : "Online");
    }
    if (this.container && !this.container.classList.contains("hidden-chatbot")) {
      if (this.state === "idle") {
        this.showMenu();
      }
    }
  }

  toggleChat(forceOpen) {
    const shouldOpen = forceOpen !== undefined ? forceOpen : this.container.classList.contains("hidden-chatbot");
    if (shouldOpen) {
      this.container.classList.remove("hidden-chatbot");
      this.fab.classList.remove("chatbot-fab-pulse");
      
      // Lock background scrolling on mobile robustly
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
      document.body.classList.add("chatbot-open");
      
      const langTrigger = document.getElementById("floating-lang-trigger");
      if (langTrigger) langTrigger.style.display = "none";
      if (this.fab) this.fab.style.display = "none";

      // Always empty the chatbot and ask for language on open
      this.messagesContainer.innerHTML = "";
      this.suggestionsContainer.innerHTML = "";
      this.history = [];
      this.flowData = {};
      this.askForLanguageSelection();
    } else {
      this.container.classList.add("hidden-chatbot");
      
      // Restore background scroll position and release lock
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('position');
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('width');
      document.body.classList.remove("chatbot-open");
      if (this.scrollPosition !== undefined) {
        window.scrollTo(0, this.scrollPosition);
      }
      
      const langTrigger = document.getElementById("floating-lang-trigger");
      if (langTrigger) langTrigger.style.display = "flex";
      if (this.fab) this.fab.style.display = "flex";
    }
  }

  askForLanguageSelection() {
    this.state = "language_selection";
    
    // Render the language prompt
    const promptMessage = "Please select your preferred language:\n\nકૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો:\n\nकृपया अपनी पसंदीदा भाषा चुनें:";
    this.renderMessage(promptMessage, "assistant");
    
    // Display language chips as suggestions
    this.suggestionsContainer.innerHTML = "";
    
    const languages = [
      { html: '<i class="fa-solid fa-language"></i> English', label: "English", code: "en" },
      { html: '<i class="fa-solid fa-language"></i> ગુજરાતી (Gujarati)', label: "ગુજરાતી (Gujarati)", code: "gu" },
      { html: '<i class="fa-solid fa-language"></i> हिंदी (Hindi)', label: "हिंदी (Hindi)", code: "hi" }
    ];
    
    languages.forEach(langOption => {
      const btn = document.createElement("button");
      btn.className = "chatbot-chip";
      btn.innerHTML = langOption.html;
      btn.addEventListener("click", () => {
        this.renderMessage(langOption.label, "user");
        this.setChatLanguage(langOption.code);
      });
      this.suggestionsContainer.appendChild(btn);
    });
  }

  setChatLanguage(langCode) {
    this.state = "idle";
    
    // Load and save the selected language
    this.lang = langCode;
    localStorage.setItem("phh_lang", langCode);
    if (typeof setLanguage === "function") {
      setLanguage(langCode);
    }
    this.loadLanguage(langCode);
    
    // Trigger a custom local storage sync event if needed
    window.dispatchEvent(new Event("storage_local"));
    
    // Show welcome greeting and suggestions menu
    this.suggestionsContainer.innerHTML = "";
    this.showGreeting();

    // Check for appointments and reviews in the selected language
    this.checkUpcomingAppointments();
    this.checkForPendingReviews();
  }

  showGreeting() {
    this.renderMessage(this.translations[this.lang].welcome, "assistant");
    this.showMenu();
  }

  showMenu() {
    this.suggestionsContainer.innerHTML = "";
    const items = [
      { text: this.translations[this.lang].btn_triage, action: () => this.startSymptomTriage() },
      { text: this.translations[this.lang].btn_find, action: () => this.startDoctorDiscovery() },
      { text: this.translations[this.lang].btn_book, action: () => this.startBookingFlow() },
      { text: this.translations[this.lang].btn_appt, action: () => this.showAppointments() },
      { text: this.translations[this.lang].btn_directions, action: () => this.startDirectionsQuery() },
      { text: this.translations[this.lang].btn_compare, action: () => this.startComparisonFlow() },
      { text: this.translations[this.lang].btn_tools, action: () => this.startHealthToolsMenu() },
      { text: this.translations[this.lang].btn_faq, action: () => this.startFaqSearch() },
      { text: this.translations[this.lang].btn_emergency, action: () => this.triggerEmergencyMode() }
    ];

    items.forEach(item => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.innerHTML = item.text;
      chip.addEventListener("click", () => {
        this.renderMessage(item.text, "user");
        item.action();
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  showTyping() {
    this.hideTyping();
    const row = document.createElement("div");
    row.className = "chatbot-typing-row";
    row.id = "chatbot-typing-indicator";
    
    const avatar = document.createElement("div");
    avatar.className = "chatbot-avatar-container";
    avatar.innerHTML = `<i class="fa-solid fa-heart-pulse"></i>`;
    row.appendChild(avatar);

    const indicator = document.createElement("div");
    indicator.className = "chatbot-typing";
    indicator.innerHTML = "<span></span><span></span><span></span>";
    
    row.appendChild(indicator);
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  hideTyping() {
    const indicator = document.getElementById("chatbot-typing-indicator");
    if (indicator) {
      indicator.remove();
    }
  }

  renderMessage(content, sender = "assistant", type = "text") {
    const row = document.createElement("div");
    row.className = `chatbot-message-row ${sender}`;
    
    if (sender === "assistant") {
      const avatar = document.createElement("div");
      avatar.className = "chatbot-avatar-container";
      avatar.innerHTML = `<i class="fa-solid fa-heart-pulse"></i>`;
      row.appendChild(avatar);
    }
    
    const bubble = document.createElement("div");
    bubble.className = `chatbot-bubble ${sender}`;
    
    if (type === "text") {
      let parsed = content
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\\n/g, "<br>")
        .replace(/\n/g, "<br>");
      bubble.innerHTML = parsed;
    } else {
      bubble.appendChild(content);
    }
    
    row.appendChild(bubble);
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
    const textContent = type === "text" ? content : (content.innerHTML || content.textContent || "");
    this.history.push({ sender, content: textContent });
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  detectEmergency(text) {
    const raw = text.toLowerCase();
    const keywords = [
      "chest pain", "heart attack", "difficulty breathing", "cannot breathe", "stroke", 
      "heavy bleeding", "bleeding heavily", "seizure", "unconscious", "choking",
      String.fromCodePoint(...[2742,2759,2721,2765,2735,2754]), String.fromCodePoint(...[2715,2724,2753,2726,2765,2727,2751]), String.fromCodePoint(...[2738,2726,2726]),
      String.fromCodePoint(...[2330,2375,2340,2366]), String.fromCodePoint(...[2360,2366,2306,2360])
    ];
    return keywords.some(kw => raw.includes(kw));
  }

  triggerEmergencyMode() {
    this.state = "emergency";
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      const card = document.createElement("div");
      card.className = "caremate-reminder-box caremate-emergency-mode-card";
      card.innerHTML = `
        <div class="caremate-emergency-header">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>${this.translations[this.lang].emergency_title}</span>
        </div>
        <div class="caremate-reminder-content">
          <strong>${this.translations[this.lang].emergency_guideline}</strong><br><br>
          • Ambulance Hotline: <strong>108</strong><br>
          • Emergency Room: Building A, Ground Floor<br>
          • Medical Hotline: +91 99999 11111<br><br>
          <em>First-Aid: Sit upright, loosen clothing, remain calm and breathe slowly.</em>
        </div>
        <div class="caremate-reminder-actions">
          <a href="tel:108" class="caremate-reminder-btn primary text-center" style="text-decoration:none; display:inline-block; flex: 1;">
            <i class="fa-solid fa-phone"></i> Call 108
          </a>
          <button class="caremate-reminder-btn secondary" id="emergency-instant-book">
            ${this.translations[this.lang].emergency_appt}
          </button>
          <button class="caremate-reminder-btn danger" id="emergency-exit">
            Exit Alert
          </button>
        </div>
      `;

      card.querySelector("#emergency-instant-book").addEventListener("click", () => {
        this.renderMessage("Instant Booking (Emergency)", "user");
        this.flowData.emergencyTriage = true;
        this.startBookingFlow();
      });

      card.querySelector("#emergency-exit").addEventListener("click", () => {
        this.renderMessage("Exit Emergency Mode", "user");
        this.state = "idle";
        this.showMenu();
      });

      this.renderMessage(card, "assistant", "widget");
      this.suggestionsContainer.innerHTML = "";
    }, 500);
  }

  setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.micBtn.addEventListener("click", () => {
        alert(this.lang === 'gu' ? String.fromCodePoint(...[2734,2750,2742,2750,2739,32,2744,2750,2741,2750,2735,2750,2709,32,2703,2730,2750,2738,32,2716,2759]) : (this.lang === 'hi' ? String.fromCodePoint(...[2310,2357,2366,2332,32,2360,2361,2366,2351,2325,32,2344,2361,2368,2306]) : "Voice input is not supported in this browser!"));
      });
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.micBtn.classList.add("caremate-speech-active");
      this.inputField.placeholder = this.lang === 'gu' ? String.fromCodePoint(...[2744,2750,2733,2755,2736,2752,32,2736,2759,2719,2751,2709]) : (this.lang === 'hi' ? String.fromCodePoint(...[2360,2369,2344,32,2352,2361,2375,32,2361,2376,2305]) : "Listening...");
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.micBtn.classList.remove("caremate-speech-active");
      this.inputField.placeholder = this.translations[this.lang].placeholder;
    };

    this.recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        this.inputField.value = resultText;
        this.handleUserInput(resultText);
        this.inputField.value = "";
      }
    };

    this.recognition.onerror = (err) => {
      console.error("Speech Recognition Error:", err);
      this.micBtn.classList.remove("caremate-speech-active");
    };

    this.micBtn.addEventListener("click", () => {
      if (this.isRecording) {
        this.recognition.stop();
      } else {
        if (this.state === "language_selection") {
          const navLang = (navigator.language || navigator.userLanguage || "en").toLowerCase();
          if (navLang.startsWith("gu")) {
            this.recognition.lang = "gu-IN";
          } else if (navLang.startsWith("hi")) {
            this.recognition.lang = "hi-IN";
          } else {
            this.recognition.lang = "en-US";
          }
        } else {
          if (this.lang === "gu") this.recognition.lang = "gu-IN";
          else if (this.lang === "hi") this.recognition.lang = "hi-IN";
          else this.recognition.lang = "en-US";
        }
        
        this.recognition.start();
      }
    });
  }

  
  detectLanguage(text) {
    let guCount = 0;
    let hiCount = 0;
    let enCount = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code >= 2688 && code <= 2815) guCount++;
      else if (code >= 2304 && code <= 2431) hiCount++;
      else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) enCount++;
    }

    const lower = text.toLowerCase();
    const hiPhonetic = ["bukhar", "sir dard", "saans", "khansi", "pet dard", "dil", "haddi", "vomit", "vomiting", "vomitting", "ultee", "ulti", "chakkar", "seizure", "unconscious", "khoon", "bleeding", "kamardard", "petdard", "khasi"];
    const guPhonetic = ["tav", "shvas", "khas", "mathu", "dokh", "daktar", "lohi", "bhan", "bhula", "chakar", "kamardukhvi", "khaso"];

    if (guCount > 0 && guCount >= hiCount) return "gu";
    if (hiCount > 0 && hiCount > guCount) return "hi";

    if (guPhonetic.some(w => lower.includes(w))) return "gu";
    if (hiPhonetic.some(w => lower.includes(w))) return "hi";

    return "en";
  }

  getDoctorAverageRating(docId) {
    const reviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
    const docReviews = reviews.filter(r => r && (String(r.doctorId) === String(docId) || String(r.doctor_id) === String(docId)));
    if (docReviews.length === 0) return null;
    const sum = docReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return Math.round((sum / docReviews.length) * 10) / 10;
  }

  matchDoctorByName(text) {
    const raw = text.toLowerCase().replace(/dr\./g, "").replace(/dr /g, "").trim();
    if (raw.length < 3) return null;
    const docs = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    for (const doc of docs) {
      if (doc.status === 'Pending') continue;
      const docRawName = doc.name.toLowerCase().replace(/dr\./g, "").replace(/dr /g, "").trim();
      if (docRawName.includes(raw) || raw.includes(docRawName)) {
        return doc;
      }
    }
    return null;
  }

  matchDirectDepartment(text) {
    const raw = text.toLowerCase();
    const depts = {
      "Cardiology": ["cardiology", "cardiologist", "heart doctor", "cardio", "હૃદય રોગ", "હૃદયરોગ", "કાર્ડિયોલોજી", "हृदय रोग", "कार्डियोलॉजिस्ट", "हृदय रोग विशेषज्ञ", "heart specialist"],
      "Pulmonology": ["pulmonology", "pulmonologist", "lung doctor", "lung specialist", "respiratory", "પલ્મોનોલોજી", "ફેફસાના ડૉક્ટર", "પલ્મોનોલોજિસ્ટ", "पल्मोनोलॉजी", "फेफड़ों के डॉक्टर", "पल्मोनोलॉजिस्ट"],
      "Neurology": ["neurology", "neurologist", "brain doctor", "brain specialist", "nerve doctor", "ન્યુરોલોજી", "મગજના ડૉક્ટર", "ન્યુરોલોજિસ્ટ", "न्यूरोलॉजी", "दिमाग के डॉक्टर", "न्यूरोलॉजिस्ट"],
      "Orthopedics": ["orthopedics", "orthopaedic", "orthopedist", "bone doctor", "bone specialist", "ઓર્થોપેડિક્સ", "હાડકાના ડૉક્ટર", "ઓર્થોપેડિસ્ટ", "ऑर्थोपेडिक्स", "हड्डी के डॉक्टर", "ऑर्थोपेडिस्ट"],
      "Gynecology": ["gynecology", "gynecologist", "gynac", "maternity", "prenatal", "pregnancy doctor", "ગાયનેકોલોજી", "સ્ત્રી રોગ", "ગાયનેકોલોજિસ્ટ", "गायनोकोलॉजी", "स्त्री रोग विशेषज्ञ", "गायनेकोलॉजिस्ट"],
      "Pediatrics": ["pediatrics", "pediatrician", "child doctor", "kids doctor", "baby doctor", "પીડિયાટ્રિક્સ", "બાળરોગ", "પીડિયાટ્રિશિયન", "पीडियाट्रिक्स", "बच्चों के डॉक्टर", "पीडियाट्रिशियन"],
      "Dermatology": ["dermatology", "dermatologist", "skin doctor", "skin specialist", "ડર્મેટોલોજી", "ચામડીના ડૉક્ટર", "ડર્મેટોલોજિસ્ટ", "डर्मेटोलॉजी", "त्वचा के डॉक्टर", "त्वचा रोग विशेषज्ञ", "डर्मेटोलॉजिस्ट"],
      "Psychology": ["psychology", "psychologist", "psychiatrist", "mental health", "therapist", "સાયકોલોજી", "માનસિક રોગ", "સાયકોલોજિસ્ટ", "साइकोलॉजी", "मानसिक रोग विशेषज्ञ", "मनोवैज्ञानिक", "साइकोलॉजिस्ट"],
      "General Medicine": ["general medicine", "general physician", "family doctor", "physician", "gp", "સામાન્ય રોગ", "જનરલ મેડિસિન", "ફિઝિશિયન", "जनरल मेडिसिन", "फिजिशियन", "फैमिली डॉक्टर"]
    };

    for (const [dept, keywords] of Object.entries(depts)) {
      if (keywords.some(kw => raw.includes(kw))) {
        return dept;
      }
    }
    return null;
  }

  getSymptomScores(text) {
    const raw = text.toLowerCase();
    const scores = {
      Cardiology: 0,
      Pulmonology: 0,
      Neurology: 0,
      Orthopedics: 0,
      Gynecology: 0,
      Pediatrics: 0,
      Dermatology: 0,
      Psychology: 0,
      "General Medicine": 0
    };

    const matches = (keywords) => keywords.filter(kw => raw.includes(kw)).length;

    // Cardiology
    scores.Cardiology += matches(["chest pain", "heart pain", "palpitations", "chest pressure", "chest tightness", "dil me dard", "chhati me dard", "chhati dukhvi", "છાતીમાં દુખાવો", "હૃદયમાં દુખાવો", "छाती में दर्द", "दिल में दर्द"]) * 3;
    scores.Cardiology += matches(["shortness of breath", "breathing difficulty", "cannot breathe", "saans", "shvas", "શ્વાસ", "सांस"]) * 1;

    // Pulmonology
    scores.Pulmonology += matches(["cough", "coughing", "asthma", "wheezing", "coughing blood", "khansi", "khas", "khasi", "ઉધરસ", "ખાંસી", "खांसी", "दमा"]) * 3;
    scores.Pulmonology += matches(["shortness of breath", "breathing difficulty", "cannot breathe", "saans", "shvas", "શ્વાસ", "सांस"]) * 2;
    scores.Pulmonology += matches(["fever", "mild fever", "temperature", "bukhar", "tav", "તાવ", "बुखार"]) * 1;

    // Neurology
    scores.Neurology += matches(["headache", "migraine", "dizziness", "vertigo", "numbness", "seizure", "seizures", "paralysis", "sir dard", "mathu dukhvu", "mathu", "chakkar", "માથાનો દુખાવો", "ચક્કર", "सिरदर्द", "चक्कर"]) * 3;

    // Orthopedics
    scores.Orthopedics += matches(["fracture", "broken leg", "broken arm", "joint pain", "knee pain", "back pain", "sprain", "fall", "fell", "bone", "haddi", "ghutan", "kamar", "હાડકું", "ઘૂંટણ", "કમર", "ફ્રેક્ચર", "હड્ડી", "घुटना", "कमर", "फ्रैक्चर"]) * 3;

    // Gynecology
    scores.Gynecology += matches(["pregnancy", "pregnant", "period pain", "menstrual", "periods", "due date", "ovarian", "ગર્ભાવસ્થા", "પિરિયડ્સ", "गर्भावस्था", "पीरियड्स"]) * 3;

    // Pediatrics
    scores.Pediatrics += matches(["child fever", "kids fever", "baby fever", "toddler", "pediatric", "baccha", "balak", "બાળક", "बच्चा", "बच्चों"]) * 3;

    // Dermatology
    scores.Dermatology += matches(["rash", "skin", "acne", "pimple", "pimples", "eczema", "itching", "khujli", "chamdi", "ચામડી", "ખંજવાળ", "त्वचा", "खुजली"]) * 3;

    // Psychology
    scores.Psychology += matches(["anxiety", "stress", "depression", "panic attack", "sleep issues", "sadness", "tension", "ચિંતા", "તણાવ", "चिंता", "तनाव"]) * 3;

    // General Medicine
    scores["General Medicine"] += matches(["fever", "temperature", "bukhar", "tav", "તાવ", "बुखार"]) * 2;
    scores["General Medicine"] += matches(["cold", "flu", "sore throat", "throat infection", "stomach ache", "vomiting", "vomit", "nausea", "ultee", "ulti", "શરદી", "ઉલટી", "પેટનો દુખાવો", "जुकाम", "उल्टी", "पेट दर्द"]) * 2;

    return scores;
  }

  evaluateTriage(text) {
    this.flowData.symptomHistory = this.flowData.symptomHistory || [];
    this.flowData.symptomHistory.push(text);

    const concatenatedText = this.flowData.symptomHistory.join(" ");
    const scores = this.getSymptomScores(concatenatedText);

    const sorted = Object.entries(scores)
      .filter(([dept, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      this.handleLowConfidence();
      return;
    }

    const topDept = sorted[0][0];
    const topScore = sorted[0][1];
    
    const secondDept = sorted[1] ? sorted[1][0] : null;
    const secondScore = sorted[1] ? sorted[1][1] : 0;

    let confidence = 0;
    if (topScore >= 5) {
      confidence = 95;
    } else if (topScore >= 3 && secondScore <= 1) {
      confidence = 90;
    } else if (topScore >= 3 && secondScore >= 2) {
      confidence = 75;
    } else if (topScore === 2 && secondScore === 0) {
      confidence = 70;
    } else if (topScore === 2 && secondScore === 1) {
      confidence = 65;
    } else {
      confidence = 50;
    }

    if (confidence > 85) {
      this.recommendDepartment(topDept);
    } else if (confidence >= 60) {
      this.promptClarifyingQuestion(topDept, secondDept);
    } else {
      this.handleMultiplePossibilities(sorted);
    }
  }

  recommendDepartment(dept) {
    let urgency = "low";
    let advice = "Rest, stay hydrated, and consult a physician if symptoms persist.";
    
    if (dept === "Cardiology") {
      urgency = "emergency";
      advice = "Consult a cardiologist immediately. Go to the nearest Emergency room if pain radiates.";
    } else if (dept === "Pulmonology") {
      urgency = "high";
      advice = "Consult our Pulmonologist. Seek immediate care if experiencing breathing struggles.";
    } else if (dept === "Orthopedics") {
      urgency = "medium";
      advice = "Avoid putting weight on the affected limb. Consult an orthopedic specialist.";
    } else if (dept === "Pediatrics") {
      urgency = "high";
      advice = "Monitor child temperature. Consult our specialist pediatrician within 12 hours.";
    } else if (dept === "Neurology") {
      urgency = "medium";
      advice = "Keep in a dark, quiet room. Consult a neurologist if headaches are recurring.";
    } else if (dept === "Gynecology") {
      urgency = "medium";
      advice = "Consult a gynecologist to discuss maternal/pregnancy care steps.";
    } else if (dept === "Dermatology") {
      urgency = "low";
      advice = "Avoid scratching or applying unverified creams. Consult a dermatologist.";
    } else if (dept === "Psychology") {
      urgency = "low";
      advice = "Practice slow deep breathing. Consider booking a session with our clinical psychologist.";
    }

    if (this.lang === "gu") {
      if (dept === "Cardiology") advice = "તાત્કાલિક કાર્ડિયોલોજિસ્ટનો સંપર્ક કરો. જો દુખાવો ફેલાય તો નજીકના ઇમરજન્સી રૂમમાં જાઓ.";
      else if (dept === "Pulmonology") advice = "અમારા પલ્મોનોલોજિસ્ટની સલાહ લો. જો શ્વાસ લેવામાં તકલીફ થાય તો તાત્કાલિક સારવાર લો.";
      else if (dept === "Orthopedics") advice = "અસરગ્રસ્ત અંગ પર વજન મૂકવાનું ટાળો. ઓર્થોપેડિક નિષ્ણાતની સલાહ લો.";
      else if (dept === "General Medicine") advice = "આરામ કરો, હાઇડ્રેટેડ રહો અને જો લક્ષણો યથાવત રહે તો ચિકિત્સકની સલાહ લો.";
    } else if (this.lang === "hi") {
      if (dept === "Cardiology") advice = "तुरंत हृदय रोग विशेषज्ञ से संपर्क करें। यदि दर्द बढ़े तो नजदीकी आपातकालीन कक्ष में जाएं।";
      else if (dept === "Pulmonology") advice = "हमारे पल्मोनोलॉजिस्ट से परामर्श लें। सांस लेने में कठिनाई होने पर तुरंत देखभाल करें।";
      else if (dept === "Orthopedics") advice = "प्रभावित अंग पर वजन डालने से बचें। ऑर्थोपेडिक विशेषज्ञ से सलाह लें।";
      else if (dept === "General Medicine") advice = "आराम करें, हाइड्रेटेड रहें और लक्षण बने रहने पर चिकित्सक से परामर्श लें।";
    }

    const badgeHtml = `<span class="caremate-urgency-badge ${urgency}">${urgency} urgency</span>`;
    
    let explanationMsg = "";
    if (this.lang === "gu") {
      explanationMsg = `તમે વર્ણવેલ લક્ષણોના આધારે, અમારા **${dept}** વિભાગ સાથે પરામર્શ કરવો એ સૌથી યોગ્ય આગલું પગલું હશે. તેઓ તમારી ચિંતાઓ સંબંધિત પરિસ્થિતિઓની સારવારમાં નિષ્ણાત છે.`;
    } else if (this.lang === "hi") {
      explanationMsg = `आपके बताए गए लक्षणों के आधार पर, हमारे **${dept}** विभाग के साथ परामर्श करना सबसे उपयुक्त अगला कदम होगा। वे आपकी चिंताओं से संबंधित स्थितियों के इलाज में विशेषज्ञ हैं।`;
    } else {
      explanationMsg = `Based on the symptoms you've described, a consultation with our **${dept}** department would be the most appropriate next step. They specialize in treating conditions related to your concerns.`;
    }

    const summaryMsg = `
      ${explanationMsg}<br><br>
      • Triage Level: ${badgeHtml}<br>
      • Recommended Steps: <em>${advice}</em>
    `;
    this.renderMessage(summaryMsg);
    this.rankDoctors(dept);

    this.flowData.symptomHistory = [];
  }

  promptClarifyingQuestion(topDept, secondDept) {
    this.state = "clarifying";
    
    let questionText = "";
    const concatenatedText = this.flowData.symptomHistory.join(" ");
    const raw = concatenatedText.toLowerCase();
    const hasCardioPulmoKeywords = ["chest", "heart", "breath", "saans", "saas", "shvas", "cough", "khansi", "khas", "chhati", "છાતી", "હૃદય", "શ્વાસ", "ઉધરસ", "ખાંસી", "खांसी", "सांस", "छाती", "दिल"].some(kw => raw.includes(kw));

    if ((topDept === "Cardiology" || secondDept === "Cardiology" || topDept === "Pulmonology" || secondDept === "Pulmonology") && hasCardioPulmoKeywords) {
      this.flowData.clarifyingType = "cardio_pulmo";
      if (this.lang === "gu") {
        questionText = "હું સમજી શકું છું. શ્વાસ લેવામાં તકલીફની સાથે, શું તમને છાતીમાં કોઈ દુખાવો અથવા ધબકારા પણ અનુભવાય છે?";
      } else if (this.lang === "hi") {
        questionText = "मैं समझ सकता हूँ। सांस लेने में तकलीफ के साथ, क्या आपको छाती में कोई दर्द या घबराहट भी महसूस हो रही है?";
      } else {
        questionText = "I see. Along with your breathing difficulty, do you also experience any chest pain or palpitations?";
      }
    } else if (topDept === "Neurology" || secondDept === "Neurology") {
      this.flowData.clarifyingType = "neuro_general";
      if (this.lang === "gu") {
        questionText = "શું તમને માથાના દુખાવાની સાથે ચક્કર આવવા, ઉલટી અથવા હાથ-પગમાં સુન્નતા અનુભવાય છે?";
      } else if (this.lang === "hi") {
        questionText = "क्या आपको सिरदर्द के साथ चक्कर आना, उल्टी या हाथ-पैर सुन्न होना महसूस हो रहा है?";
      } else {
        questionText = "Are you experiencing any dizziness, vomiting, or numbness along with the headache?";
      }
    } else if (topDept === "Orthopedics" || secondDept === "Orthopedics") {
      this.flowData.clarifyingType = "ortho_general";
      if (this.lang === "gu") {
        questionText = "શું તમને તાજેતરમાં કોઈ ઈજા થઈ છે, પછડાટ લાગી છે અથવા સાંધામાં સોજો આવી ગયો છે?";
      } else if (this.lang === "hi") {
        questionText = "क्या आपको हाल ही में कोई चोट लगी है, गिरावट आई है या जोड़ों में सूजन है?";
      } else {
        questionText = "Did you recently experience a fall, injury, or joint swelling?";
      }
    } else {
      this.flowData.clarifyingType = "generic";
      if (this.lang === "gu") {
        questionText = "શું તમે સ્પષ્ટ કરી શકો કે શું તમને તાવ, ઉધરસ અથવા શરીરના કોઈ ચોક્કસ ભાગમાં દુખાવો જેવા લક્ષણો પણ છે?";
      } else if (this.lang === "hi") {
        questionText = "क्या आप बता सकते हैं कि क्या आपको बुखार, खांसी, या शरीर के किसी हिस्से में दर्द जैसे लक्षण भी हैं?";
      } else {
        questionText = "Could you please specify if you also have symptoms like fever, cough, or pain in any specific part of your body?";
      }
    }

    this.renderMessage(questionText);
    
    this.suggestionsContainer.innerHTML = "";
    const yesText = this.lang === "gu" ? "હા" : (this.lang === "hi" ? "हाँ" : "Yes");
    const noText = this.lang === "gu" ? "ના" : (this.lang === "hi" ? "नहीं" : "No");

    const yesChip = document.createElement("button");
    yesChip.className = "chatbot-chip";
    yesChip.textContent = yesText;
    yesChip.addEventListener("click", () => {
      this.handleUserInput(yesText);
    });

    const noChip = document.createElement("button");
    noChip.className = "chatbot-chip";
    noChip.textContent = noText;
    noChip.addEventListener("click", () => {
      this.handleUserInput(noText);
    });

    this.suggestionsContainer.appendChild(yesChip);
    this.suggestionsContainer.appendChild(noChip);
  }

  handleClarifyingResponse(text) {
    const raw = text.toLowerCase();
    const isAffirmative = ["yes", "ha", "haan", "y", "sure", "haji", "ji", "haji", "ha ", "thodu", "sanam", "agree", "correct", "true", "severe", "mild"].some(w => raw.includes(w));
    
    this.state = "idle";
    
    const type = this.flowData.clarifyingType;
    if (type === "cardio_pulmo") {
      if (isAffirmative) {
        this.flowData.symptomHistory.push("chest pain");
      }
    } else if (type === "neuro_general") {
      if (isAffirmative) {
        this.flowData.symptomHistory.push("dizziness");
      }
    } else if (type === "ortho_general") {
      if (isAffirmative) {
        this.flowData.symptomHistory.push("injury");
      }
    } else {
      this.flowData.symptomHistory.push(text);
    }

    const concatenatedText = this.flowData.symptomHistory.join(" ");
    const scores = this.getSymptomScores(concatenatedText);

    const sorted = Object.entries(scores)
      .filter(([dept, score]) => score > 0)
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length > 0) {
      const topDept = sorted[0][0];
      this.recommendDepartment(topDept);
    } else {
      this.recommendDepartment("General Medicine");
    }
  }

  handleMultiplePossibilities(sorted) {
    const possibilities = sorted.slice(0, 3).map(x => x[0]);
    
    let msg = "";
    if (this.lang === "gu") {
      msg = `હું તમારા લક્ષણો વિશે સંપૂર્ણ ખાતરીપૂર્વક નથી કહી શકતો. તે નીચેનામાંથી કોઈ એક વિભાગ સાથે સંબંધિત હોઈ શકે છે. કૃપા કરીને વધુ વિગત આપો અથવા નીચેનામાંથી એક પસંદ કરો:`;
    } else if (this.lang === "hi") {
      msg = `मैं आपके लक्षणों के बारे में पूरी तरह आश्वस्त नहीं हूँ। यह निम्न विभागों में से किसी एक से संबंधित हो सकता है। कृपया अधिक विवरण दें या नीचे से चुनें:`;
    } else {
      msg = `I'm not completely sure which department matches your symptoms best. Based on what you've described, it could relate to one of these:`;
    }

    this.renderMessage(msg);
    this.suggestionsContainer.innerHTML = "";
    possibilities.forEach(dept => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = dept;
      chip.addEventListener("click", () => {
        this.renderMessage(dept, "user");
        this.recommendDepartment(dept);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleLowConfidence() {
    let msg = "";
    if (this.lang === "gu") {
      msg = `હું તમારા વર્ણવેલ લક્ષણો સમજી શક્યો નથી. કૃપા કરીને થોડી વધુ વિગતો આપો, અથવા નીચેનામાંથી કોઈ એક વિભાગ પસંદ કરો:`;
    } else if (this.lang === "hi") {
      msg = `मैं आपके बताए गए लक्षणों को ठीक से समझ नहीं पाया। कृपया थोड़ा और विवरण दें, या नीचे दिए गए विभागों में से एक चुनें:`;
    } else {
      msg = `I couldn't clarify your symptoms. Could you please describe what you are feeling in more detail, or would you like to consult one of our departments?`;
    }

    this.renderMessage(msg);
    this.suggestionsContainer.innerHTML = "";
    
    const departments = [
      { id: "General Medicine", en: "General Medicine", hi: "सामान्य चिकित्सा (General Medicine)", gu: "જનરલ મેડિસિન" },
      { id: "Cardiology", en: "Cardiology", hi: "हृदय रोग (Cardiology)", gu: "કાર્ડિયોલોજી" },
      { id: "Pulmonology", en: "Pulmonology", hi: "फेफड़े का रोग (Pulmonology)", gu: "પલ્મોનોલોજી" },
      { id: "Orthopedics", en: "Orthopedics", hi: "अस्थि रोग (Orthopedics)", gu: "ઓર્થોપેડિક્સ" },
      { id: "Pediatrics", en: "Pediatrics", hi: "बाल रोग (Pediatrics)", gu: "બાળરોગ વિભાગ" },
      { id: "Neurology", en: "Neurology", hi: "तंत्रिका विज्ञान (Neurology)", gu: "ન્યુરોલોજી" },
      { id: "Gynecology", en: "Gynecology", hi: "स्त्री रोग (Gynecology)", gu: "સ્ત્રીરોગવિજ્ઞાન" },
      { id: "Dermatology", en: "Dermatology", hi: "त्वचा रोग (Dermatology)", gu: "ત્વચારોગવિજ્ઞાન" },
      { id: "Psychology", en: "Psychology", hi: "मनोविज्ञान (Psychology)", gu: "મનોવિજ્ઞાન" }
    ];

    departments.forEach(dept => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = this.lang === "gu" ? dept.gu : (this.lang === "hi" ? dept.hi : dept.en);
      chip.addEventListener("click", () => {
        this.renderMessage(chip.textContent, "user");
        this.recommendDepartment(dept.id);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  getDoctorExplanation(doc, dept) {
    const avgRating = this.getDoctorAverageRating(doc.id) || 5;
    const isHighestRating = avgRating >= 4.8;
    const isExperienced = parseInt(doc.exp) >= 15;
    
    if (this.lang === "gu") {
      if (isHighestRating) return `ડૉ. ${doc.name} ની ભલામણ કરવામાં આવે છે કારણ કે તેઓ ${dept} માં અમારા સૌથી વધુ રેટિંગ ધરાવતા નિષ્ણાત છે.`;
      if (isExperienced) return `ડૉ. ${doc.name} ની ભલામણ કરવામાં આવે છે કારણ કે તેઓ આ ક્ષેત્રમાં ${doc.exp} નો વ્યાપક ક્લિનિકલ અનુભવ ધરાવે છે.`;
      return `ડૉ. ${doc.name} આ ક્ષેત્રમાં સેવા આપવા માટે ઉપલબ્ધ છે.`;
    } else if (this.lang === "hi") {
      if (isHighestRating) return `डॉ. ${doc.name} की सिफारिश की जाती है क्योंकि वे ${dept} में हमारे सबसे अधिक रेटिंग वाले विशेषज्ञ हैं.`;
      if (isExperienced) return `डॉ. ${doc.name} की सिफारिश की जाती है क्योंकि उनके पास इस क्षेत्र में ${doc.exp} का व्यापक नैदानिक अनुभव है.`;
      return `डॉ. ${doc.name} इस विभाग में सेवा के लिए उपलब्ध हैं.`;
    } else {
      if (isHighestRating) return `Dr. ${doc.name} is recommended as they are our highest-rated specialist in ${dept}.`;
      if (isExperienced) return `Dr. ${doc.name} is recommended because they have ${doc.exp} of extensive clinical experience in this field.`;
      return `Dr. ${doc.name} is available for consultation in this department.`;
    }
  }

  showSingleDoctorCard(doc) {
    const cardContainer = document.createElement("div");
    cardContainer.style.display = "flex";
    cardContainer.style.flexDirection = "column";
    cardContainer.style.gap = "10px";
    cardContainer.style.marginTop = "8px";

    const card = document.createElement("div");
    card.className = "glass-card doctor-card";
    card.style.margin = "0";
    card.style.padding = "10px";
    
    const avgRating = this.getDoctorAverageRating(doc.id);
    const starRating = avgRating 
      ? `<i class="fa-solid fa-star" style="color: #fbbf24;"></i> <strong>${avgRating.toFixed(1)}</strong>`
      : `<i class="fa-regular fa-star" style="color: #cbd5e1;"></i> <span style="font-size:0.7rem;">(No reviews)</span>`;
    
    const explanation = this.getDoctorExplanation(doc, doc.specialty);

    card.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center;">
        <div style="width: 45px; height: 45px; border-radius: 50%; overflow: hidden; background: #e2e8f0; flex-shrink: 0;">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="45" fill="#e0f2fe"/>
            <path d="M50,22 C58,22 65,29 65,37 C65,45 58,52 50,52 C42,52 35,45 35,37 C35,29 42,22 50,22 Z" fill="#0284c7"/>
            <path d="M22,78 C22,64 34,58 50,58 C66,58 78,64 78,78 Z" fill="#0369a1"/>
          </svg>
        </div>
        <div style="flex-grow: 1;">
          <h4 style="font-size: 0.85rem; margin: 0; color: #0f172a;">${doc.name}</h4>
          <div style="font-size: 0.72rem; color: #64748b;">${doc.specialty} • ${doc.exp} Exp</div>
          <div style="font-size: 0.72rem; margin-top: 2px;">
            ${starRating} • Fee: <strong style="color: var(--primary);">₹${doc.fee}</strong>
          </div>
          <div style="font-size: 0.65rem; color: var(--primary); font-style: italic; margin-top: 4px; border-top: 1px dashed rgba(0, 102, 255, 0.1); padding-top: 4px;">
            <i class="fa-solid fa-sparkles"></i> ${explanation}
          </div>
        </div>
      </div>
      <div style="margin-top: 8px; display: flex; gap: 6px;">
        <button class="caremate-reminder-btn primary" style="padding: 4px 8px; font-size: 0.7rem;" id="book-single-btn-${doc.id}">
          Book Appointment
        </button>
        <button class="caremate-reminder-btn secondary" style="padding: 4px 8px; font-size: 0.7rem;" id="comp-single-btn-${doc.id}">
          Compare
        </button>
      </div>
    `;

    card.querySelector(`#book-single-btn-${doc.id}`).addEventListener("click", () => {
      this.renderMessage(`Book appointment with ${doc.name}`, "user");
      this.flowData.doctorId = doc.id;
      this.flowData.dept = doc.specialty;
      this.flowData.doctor = doc;
      this.promptBookingDetails();
    });

    card.querySelector(`#comp-single-btn-${doc.id}`).addEventListener("click", () => {
      this.renderMessage(`Compare ${doc.name}`, "user");
      this.compareSingleDoctor(doc);
    });

    cardContainer.appendChild(card);
    this.renderMessage(cardContainer, "assistant", "widget");
    this.suggestionsContainer.innerHTML = "";
    this.showMenu();
  }

  handleUserInput(text) {
    if (this.inputField) {
      this.inputField.value = "";
    }
    this.renderMessage(text, "user");

    if (this.detectEmergency(text)) {
      this.triggerEmergencyMode();
      return;
    }

    if (this.state === "language_selection") {
      const lower = text.toLowerCase().trim();
      if (lower.includes("english") || lower.includes("eng")) {
        this.setChatLanguage("en");
      } else if (lower.includes("gujarati") || lower.includes("guj") || lower.includes("ગુજરાતી")) {
        this.setChatLanguage("gu");
      } else if (lower.includes("hindi") || lower.includes("hin") || lower.includes("हिंदी") || lower.includes("हाँ") || lower.includes("हैंडी")) {
        this.setChatLanguage("hi");
      } else {
        this.showTyping();
        setTimeout(() => {
          this.hideTyping();
          this.renderMessage("Please select a language from the choices below:\nEnglish, Gujarati, or Hindi.\n\nકૃપા કરીને નીચે આપેલા વિકલ્પોમાંથી ભાષા પસંદ કરો:\nEnglish, Gujarati, અથવા Hindi.\n\nकृपया नीचे दिए गए विकल्पों में से भाषा चुनें:\nEnglish, Gujarati, या Hindi.", "assistant");
        }, 300);
      }
      return;
    }

    if (this.state === "calc_bmi_weight") {
      this.handleBmiWeight(text);
    } else if (this.state === "calc_bmi_height") {
      this.handleBmiHeight(text);
    } else if (this.state === "calc_water_weight") {
      this.handleWaterWeight(text);
    } else if (this.state === "calc_water_activity") {
      this.handleWaterActivity(text);
    } else if (this.state === "calc_heart_age") {
      this.handleHeartAge(text);
    } else if (this.state === "calc_heart_bp") {
      this.handleHeartBp(text);
    } else if (this.state === "calc_heart_smoking") {
      this.handleHeartSmoking(text);
    } else if (this.state === "calc_heart_family") {
      this.handleHeartFamily(text);
    } else if (this.state === "calc_diabetes_age") {
      this.handleDiabetesAge(text);
    } else if (this.state === "calc_diabetes_family") {
      this.handleDiabetesFamily(text);
    } else if (this.state === "calc_diabetes_active") {
      this.handleDiabetesActive(text);
    } else if (this.state === "calc_diabetes_symptoms") {
      this.handleDiabetesSymptoms(text);
    } else if (this.state === "calc_pregnancy_lmp") {
      this.handlePregnancyLmp(text);
    } else if (this.state === "faq_search") {
      this.handleFaqSearchQuery(text);
    } else if (this.state === "booking_patient_name") {
      this.handleBookingName(text);
    } else if (this.state === "booking_patient_phone") {
      this.handleBookingPhone(text);
    } else if (this.state === "booking_patient_email") {
      this.handleBookingEmail(text);
    } else if (this.state === "booking_symptoms") {
      this.handleBookingSymptoms(text);
    } else if (this.state === "triage_input") {
      this.handleTriageInput(text);
    } else if (this.state === "clarifying") {
      this.handleClarifyingResponse(text);
    } else {
      this.showTyping();
      setTimeout(() => {
        this.hideTyping();

        const matchedDoc = this.matchDoctorByName(text);
        if (matchedDoc) {
          const specialty = matchedDoc.specialty;
          const docRecMsg = this.lang === 'gu'
            ? `મને ડૉ. **${matchedDoc.name}** મળ્યા જે **${specialty}** ના નિષ્ણાત છે. અહીં તેમની વિગતો અને ઉપલબ્ધ એપોઇન્ટમેન્ટ સ્લોટ્સ છે:`
            : (this.lang === 'hi' ? `मुझे डॉ. **${matchedDoc.name}** मिले जो **${specialty}** के विशेषज्ञ हैं। यहाँ उनका विवरण और उपलब्ध स्लॉट हैं:` : `I found Dr. **${matchedDoc.name}** who is a specialist in **${specialty}**. Here is their information and slot details:`);
          
          this.renderMessage(docRecMsg);
          this.showSingleDoctorCard(matchedDoc);
          return;
        }

        const directDept = this.matchDirectDepartment(text);
        if (directDept) {
          const directRecMsg = this.lang === 'gu'
            ? `તમારી વિનંતી મુજબ, હું તમને અમારા **${directDept}** વિભાગ પર લઈ જઈ રહ્યો છું. અહીં અમારા ઉપલબ્ધ ડૉક્ટરો છે:`
            : (this.lang === 'hi' ? `आपके अनुरोध के अनुसार, मैं आपको हमारे **${directDept}** विभाग में ले जा रहा हूँ। यहाँ हमारे उपलब्ध डॉक्टर हैं:` : `As requested, displaying specialists in our **${directDept}** department:`);
          this.renderMessage(directRecMsg);
          this.rankDoctors(directDept);
          return;
        }

        const matchedFaq = this.matchFaqText(text);
        if (matchedFaq) {
          this.renderMessage(matchedFaq);
          this.showMenu();
        } else {
          this.evaluateTriage(text);
        }
      }, 500);
    }
  }

  startSymptomTriage() {
    this.state = "triage_input";
    const promptMsg = this.lang === 'gu' ? String.fromCodePoint(...[2709,2755,2730,2750,2709,2736,2752,32,2744,2750,2736,2752,2724,2750,32,2738,2709,2765,2743,2723,2763,2736,2750,2719,2750,2735,32,2741,2751,2742,2765,2738,2759,2743,2723,2750,2738,2750,32,2709,2736,2752,2728,2759,32,2741,2751,2742,2750,2736,2750,2736,2751,2725,2709,2750,58]) : (this.lang === 'hi' ? String.fromCodePoint(...[2325,2381,2352,2369,2346,2351,2366,32,2309,2346,2344,2375,32,2354,2325,2381,2359,2339,2379,2306,32,2325,2366,32,2357,2367,2358,2381,2354,2375,2359,2339,32,2325,2352,2375,2306,58]) : "Please describe your symptoms in detail (e.g., 'I have fever and dry cough'):");
    this.renderMessage(promptMsg);
    this.suggestionsContainer.innerHTML = "";
  }

  handleTriageInput(text) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      this.state = "idle";
      this.evaluateTriage(text);
    }, 600);
  }

  executeTriageOnText(text) {
    const raw = text.toLowerCase();
    let dept = "General Medicine";
    let urgency = "low";
    let advice = "Rest, stay hydrated, and consult a physician if symptoms persist.";

    const pulmonologyKeywords = ["cough", "coughing", "asthma", "breathing difficulty", "shortness of breath", "wheezing", String.fromCodePoint(...[2709,2750,2736,2752]), String.fromCodePoint(...[2741,2751,2742,2750,2736,2750]), String.fromCodePoint(...[2326,2366,2306,2360,2368])];
    const cardiologyKeywords = ["chest pain", "heart burn", "heart pain", "palpitations", String.fromCodePoint(...[2718,2750,2724,2750]), String.fromCodePoint(...[2330,2366,2340,2366])];
    const neurologyKeywords = ["migraine", "headache", "dizziness", "numbness", String.fromCodePoint(...[2738,2750,2725,2750]), String.fromCodePoint(...[2358,2367,2352,2342,2352,2381,2342])];
    const dermatologyKeywords = ["skin rash", "rash", "acne", "pimple", "itching", String.fromCodePoint(...[2716,2750,2738,2721,2751]), String.fromCodePoint(...[2340,2381,2357,2330,2366])];
    const entKeywords = ["ear pain", "hearing", "throat infection", "sore throat", String.fromCodePoint(...[2709,2750,2736,2751]), String.fromCodePoint(...[2327,2354,2366])];
    const gynecologyKeywords = ["pregnancy", "pregnant", "period pain", String.fromCodePoint(...[2711,2752,2728,2750]), String.fromCodePoint(...[2327,2352,2381,2349,2357,2340,2368])];
    const pediatricsKeywords = ["child fever", "kids", "baby", "infant", String.fromCodePoint(...[2716,2750,2733,2750]), String.fromCodePoint(...[2348,2361,2330,2366])];
    const psychologyKeywords = ["anxiety", "stress", "depression", "sadness", String.fromCodePoint(...[2724,2753,2733,2750]), String.fromCodePoint(...[2340,2344,2366,2357])];
    const orthopedicsKeywords = ["bone fracture", "fracture", "broken leg", "broken arm", "joint pain", "knee pain", "back pain", String.fromCodePoint(...[2745,2750,2721,2751]), String.fromCodePoint(...[2361,2337,2381,2337,2368])];

    if (cardiologyKeywords.some(kw => raw.includes(kw))) {
      dept = "Cardiology";
      urgency = "emergency";
      advice = "Consult a cardiologist immediately. Go to the nearest Emergency room if pain radiates.";
    } else if (pulmonologyKeywords.some(kw => raw.includes(kw))) {
      dept = "Pulmonology";
      urgency = "high";
      advice = "Consult our Pulmonologist. Seek immediate care if experiencing breathing struggles.";
    } else if (orthopedicsKeywords.some(kw => raw.includes(kw))) {
      dept = "Orthopedics";
      urgency = raw.includes("fracture") || raw.includes("broken") ? "high" : "medium";
      advice = "Avoid putting weight on the affected limb. Consult an orthopedic specialist.";
    } else if (pediatricsKeywords.some(kw => raw.includes(kw))) {
      dept = "Pediatrics";
      urgency = "high";
      advice = "Monitor child temperature. Consult our specialist pediatrician within 12 hours.";
    } else if (neurologyKeywords.some(kw => raw.includes(kw))) {
      dept = "Neurology";
      urgency = "medium";
      advice = "Keep in a dark, quiet room. Consult a neurologist if headaches are recurring.";
    } else if (gynecologyKeywords.some(kw => raw.includes(kw))) {
      dept = "Gynecology";
      urgency = "medium";
      advice = "Consult a gynecologist to discuss maternal/pregnancy care steps.";
    } else if (entKeywords.some(kw => raw.includes(kw))) {
      dept = "ENT";
      urgency = "low";
      advice = "Gargle with warm salt water. Book an outpatient specialist review.";
    } else if (dermatologyKeywords.some(kw => raw.includes(kw))) {
      dept = "Dermatology";
      urgency = "low";
      advice = "Avoid scratching or applying unverified creams. Consult a dermatologist.";
    } else if (psychologyKeywords.some(kw => raw.includes(kw))) {
      dept = "Psychology";
      urgency = "low";
      advice = "Practice slow deep breathing. Consider booking a session with our clinical psychologist.";
    }

    const badgeHtml = `<span class="caremate-urgency-badge ${urgency}">${urgency} urgency</span>`;
    const summaryMsg = `
      <strong>Triage Assessment Result</strong><br><br>
      • Recommended Department: <strong>${dept}</strong><br>
      • Triage Level: ${badgeHtml}<br>
      • Recommended Steps: <em>${advice}</em>
    `;
    this.renderMessage(summaryMsg);
    this.rankDoctors(dept);
  }

  rankDoctors(deptName, sortBy = "rating") {
    const allDoctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    const activeDocs = allDoctors.filter(d => d.specialty === deptName && d.status !== 'Pending');

    if (activeDocs.length === 0) {
      this.renderMessage("No active specialist doctors are available for booking in this department currently.");
      this.state = "idle";
      this.showMenu();
      return;
    }

    const appts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
    const bookingCounts = {};
    appts.forEach(a => {
      bookingCounts[a.doctorId] = (bookingCounts[a.doctorId] || 0) + 1;
    });

    activeDocs.sort((a, b) => {
      if (sortBy === "rating") {
        const ratingA = this.getDoctorAverageRating(a.id) || 0;
        const ratingB = this.getDoctorAverageRating(b.id) || 0;
        return ratingB - ratingA;
      } else if (sortBy === "fee") {
        return (Number(a.fee) || 0) - (Number(b.fee) || 0);
      } else if (sortBy === "exp") {
        const expA = parseInt(a.exp) || 0;
        const expB = parseInt(b.exp) || 0;
        return expB - expA;
      } else if (sortBy === "booked") {
        return (bookingCounts[b.id] || 0) - (bookingCounts[a.id] || 0);
      }
      return 0;
    });

    const docCarousel = document.createElement("div");
    docCarousel.style.display = "flex";
    docCarousel.style.flexDirection = "column";
    docCarousel.style.gap = "10px";
    docCarousel.style.marginTop = "8px";

    const topDocs = activeDocs.slice(0, 3);
    topDocs.forEach(doc => {
      const card = document.createElement("div");
      card.className = "glass-card doctor-card";
      card.style.margin = "0";
      card.style.padding = "10px";
      
      const avgRating = this.getDoctorAverageRating(doc.id);
      const starRating = avgRating 
        ? `<i class="fa-solid fa-star" style="color: #fbbf24;"></i> <strong>${avgRating.toFixed(1)}</strong>`
        : `<i class="fa-regular fa-star" style="color: #cbd5e1;"></i> <span style="font-size:0.7rem;">(No reviews)</span>`;
      
      card.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="width: 45px; height: 45px; border-radius: 50%; overflow: hidden; background: #e2e8f0; flex-shrink: 0;">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="45" fill="#e0f2fe"/>
              <path d="M50,22 C58,22 65,29 65,37 C65,45 58,52 50,52 C42,52 35,45 35,37 C35,29 42,22 50,22 Z" fill="#0284c7"/>
              <path d="M22,78 C22,64 34,58 50,58 C66,58 78,64 78,78 Z" fill="#0369a1"/>
            </svg>
          </div>
          <div style="flex-grow: 1;">
            <h4 style="font-size: 0.85rem; margin: 0; color: #0f172a;">${doc.name}</h4>
            <div style="font-size: 0.72rem; color: #64748b;">${doc.specialty} • ${doc.exp} Exp</div>
            <div style="font-size: 0.72rem; margin-top: 2px;">
              ${starRating} • Fee: <strong style="color: var(--primary);">\u20b9${doc.fee}</strong>
            </div>
          </div>
        </div>
        <div style="margin-top: 8px; display: flex; gap: 6px;">
          <button class="caremate-reminder-btn primary" style="padding: 4px 8px; font-size: 0.7rem;" id="book-btn-${doc.id}">
            Book Appointment
          </button>
          <button class="caremate-reminder-btn secondary" style="padding: 4px 8px; font-size: 0.7rem;" id="comp-btn-${doc.id}">
            Compare
          </button>
        </div>
      `;

      card.querySelector(`#book-btn-${doc.id}`).addEventListener("click", () => {
        this.renderMessage(`Book appointment with ${doc.name}`, "user");
        this.flowData.doctorId = doc.id;
        this.flowData.dept = doc.specialty;
        this.flowData.doctor = doc;
        this.promptBookingDetails();
      });

      card.querySelector(`#comp-btn-${doc.id}`).addEventListener("click", () => {
        this.renderMessage(`Compare ${doc.name}`, "user");
        this.compareSingleDoctor(doc);
      });

      docCarousel.appendChild(card);
    });

    this.renderMessage(docCarousel, "assistant", "widget");

    this.suggestionsContainer.innerHTML = "";
    const sortOptions = [
      { label: "Sort: Highest Rated", value: "rating" },
      { label: "Sort: Lowest Fee", value: "fee" },
      { label: "Sort: Most Experienced", value: "exp" },
      { label: "Sort: Most Popular", value: "booked" }
    ];
    sortOptions.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt.label;
      chip.addEventListener("click", () => {
        this.renderMessage(opt.label, "user");
        this.rankDoctors(deptName, opt.value);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  startDoctorDiscovery() {
    const depts = JSON.parse(localStorage.getItem("phh_departments")) || [];
    this.renderMessage("Please select a department clinical specialty:");
    this.suggestionsContainer.innerHTML = "";
    depts.forEach(d => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = d.name;
      chip.addEventListener("click", () => {
        this.renderMessage(d.name, "user");
        this.rankDoctors(d.name);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  startComparisonFlow() {
    this.state = "compare";
    const allDoctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    const activeDocs = allDoctors.filter(d => d.status !== 'Pending');

    this.renderMessage("Select the first doctor you wish to compare:");
    this.suggestionsContainer.innerHTML = "";
    activeDocs.forEach(d => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = d.name;
      chip.addEventListener("click", () => {
        this.renderMessage(d.name, "user");
        this.flowData.compareDoc1 = d;
        this.promptSecondDocForComparison(activeDocs.filter(doc => doc.id !== d.id));
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  compareSingleDoctor(doc) {
    this.flowData.compareDoc1 = doc;
    const allDoctors = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    const candidates = allDoctors.filter(d => d.specialty === doc.specialty && d.id !== doc.id && d.status !== 'Pending');
    this.promptSecondDocForComparison(candidates);
  }

  promptSecondDocForComparison(candidates) {
    if (candidates.length === 0) {
      this.renderMessage("No other active doctors in this clinical specialty to compare against.");
      this.state = "idle";
      this.showMenu();
      return;
    }
    this.renderMessage("Select a doctor to compare with:");
    this.suggestionsContainer.innerHTML = "";
    candidates.forEach(d => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = d.name;
      chip.addEventListener("click", () => {
        this.renderMessage(d.name, "user");
        this.executeComparison(this.flowData.compareDoc1, d);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  executeComparison(doc1, doc2) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const appts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      const countBookings = (id) => appts.filter(a => a.doctorId === id).length;

      const widget = document.createElement("div");
      widget.className = "caremate-compare-widget";
      widget.innerHTML = `
        <div style="font-size:0.85rem; font-weight:700; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-scale-balanced" style="color:var(--primary);"></i>
          <span>Doctor Comparison Profile</span>
        </div>
        <div class="caremate-compare-grid">
          <div class="caremate-compare-column ${doc1.rating >= (doc2.rating || 0) ? 'recommended' : ''}">
            ${doc1.rating >= (doc2.rating || 0) ? '<div class="caremate-compare-recommend-tag">Highly Rated</div>' : ''}
            <div class="caremate-compare-heading">${doc1.name}</div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Specialty</span>
              <span class="caremate-compare-value">${doc1.specialty}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Rating</span>
              <span class="caremate-compare-value">⭐ ${doc1.rating || "N/A"}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Experience</span>
              <span class="caremate-compare-value">${doc1.exp}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Fee</span>
              <span class="caremate-compare-value">\u20b9${doc1.fee}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Visiting Days</span>
              <span class="caremate-compare-value" style="font-size:0.6rem;">${doc1.days}</span>
            </div>
            <button class="caremate-feedback-submit" style="padding:4px; font-size:0.65rem; margin-top:8px;" id="book-compare-1">Book</button>
          </div>

          <div class="caremate-compare-column ${doc2.rating > (doc1.rating || 0) ? 'recommended' : ''}">
            ${doc2.rating > (doc1.rating || 0) ? '<div class="caremate-compare-recommend-tag">Highly Rated</div>' : ''}
            <div class="caremate-compare-heading">${doc2.name}</div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Specialty</span>
              <span class="caremate-compare-value">${doc2.specialty}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Rating</span>
              <span class="caremate-compare-value">⭐ ${doc2.rating || "N/A"}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Experience</span>
              <span class="caremate-compare-value">${doc2.exp}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Fee</span>
              <span class="caremate-compare-value">\u20b9${doc2.fee}</span>
            </div>
            <div class="caremate-compare-row">
              <span class="caremate-compare-label">Visiting Days</span>
              <span class="caremate-compare-value" style="font-size:0.6rem;">${doc2.days}</span>
            </div>
            <button class="caremate-feedback-submit" style="padding:4px; font-size:0.65rem; margin-top:8px;" id="book-compare-2">Book</button>
          </div>
        </div>
      `;

      widget.querySelector("#book-compare-1").addEventListener("click", () => {
        this.renderMessage(`Book appointment with ${doc1.name}`, "user");
        this.flowData.doctorId = doc1.id;
        this.flowData.dept = doc1.specialty;
        this.flowData.doctor = doc1;
        this.promptBookingDetails();
      });

      widget.querySelector("#book-compare-2").addEventListener("click", () => {
        this.renderMessage(`Book appointment with ${doc2.name}`, "user");
        this.flowData.doctorId = doc2.id;
        this.flowData.dept = doc2.specialty;
        this.flowData.doctor = doc2;
        this.promptBookingDetails();
      });

      this.renderMessage(widget, "assistant", "widget");
      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  startBookingFlow() {
    this.flowData = {};
    const currUser = JSON.parse(localStorage.getItem("phh_current_user"));

    if (currUser) {
      this.flowData.name = currUser.name || "Guest Patient";
      this.flowData.phone = currUser.phone || "";
      this.flowData.email = currUser.email || "";
      this.startBookingDepartmentSelect();
    } else {
      this.state = "booking_patient_name";
      this.renderMessage("To initiate an appointment scheduling, please enter the patient's full name:");
      this.suggestionsContainer.innerHTML = "";
    }
  }

  handleBookingName(name) {
    this.flowData.name = name;
    this.state = "booking_patient_phone";
    this.renderMessage(`Thank you, ${name}. Please enter your 10-digit mobile contact number:`);
  }

  handleBookingPhone(phone) {
    const formatted = phone.replace(/\D/g, "");
    if (formatted.length < 10) {
      this.renderMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    this.flowData.phone = phone;
    this.state = "booking_patient_email";
    this.renderMessage("Please enter your email address (optional, type 'skip' if you don't wish to provide one):");
  }

  handleBookingEmail(email) {
    if (email.toLowerCase() !== "skip" && !email.includes("@")) {
      this.renderMessage("Please enter a valid email address, or type 'skip'.");
      return;
    }
    this.flowData.email = email.toLowerCase() === "skip" ? "" : email;
    this.authenticatePatientSession();
  }

  async authenticatePatientSession() {
    this.showTyping();
    const API_BASE = window.API_BASE || '';
    try {
      const loginVal = this.flowData.email || this.flowData.phone;
      const res = await fetch(`${API_BASE}/api/auth/patient-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginVal })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        localStorage.setItem("phh_current_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("storage_local"));
      }
    } catch (err) {
      console.warn("Patient background authentication failed, continuing as guest session:", err);
    }
    
    this.hideTyping();
    this.startBookingDepartmentSelect();
  }

  startBookingDepartmentSelect() {
    const depts = JSON.parse(localStorage.getItem("phh_departments")) || [];
    this.renderMessage("Please select the clinical department specialist you require:");
    this.suggestionsContainer.innerHTML = "";
    depts.forEach(d => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = d.name;
      chip.addEventListener("click", () => {
        this.renderMessage(d.name, "user");
        this.flowData.dept = d.name;
        this.promptDoctorSelect();
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  promptDoctorSelect() {
    const docs = JSON.parse(localStorage.getItem("phh_doctors")) || [];
    const matchingDocs = docs.filter(d => d.specialty === this.flowData.dept && d.status !== 'Pending');

    if (matchingDocs.length === 0) {
      this.renderMessage("No active specialist doctors available in this department. Please choose another clinical area.");
      this.startBookingDepartmentSelect();
      return;
    }

    this.renderMessage("Select a doctor for your consultation:");
    this.suggestionsContainer.innerHTML = "";
    matchingDocs.forEach(doc => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = doc.name;
      chip.addEventListener("click", () => {
        this.renderMessage(doc.name, "user");
        this.flowData.doctorId = doc.id;
        this.flowData.doctor = doc;
        this.promptBookingDetails();
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  promptBookingDetails() {
    const allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
    const now = new Date();
    const docSlots = allSlots.filter(s => {
      if (s.doctorId !== this.flowData.doctorId || s.status !== "Available") return false;
      const dateParts = s.date.split("-");
      const slotTimeObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return slotTimeObj > now;
    });

    if (docSlots.length === 0) {
      this.renderMessage(`No upcoming available time slots found for Dr. ${this.flowData.doctor.name}. Please select another doctor.`);
      this.promptDoctorSelect();
      return;
    }

    const uniqueDates = [...new Set(docSlots.map(s => s.date))].sort();

    this.renderMessage("Choose an available appointment date:");
    this.suggestionsContainer.innerHTML = "";
    uniqueDates.forEach(d => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = d;
      chip.addEventListener("click", () => {
        this.renderMessage(d, "user");
        this.flowData.date = d;
        this.promptSlotSelect(docSlots.filter(s => s.date === d));
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  promptSlotSelect(slotsForDate) {
    this.renderMessage("Select an appointment time slot:");
    this.suggestionsContainer.innerHTML = "";
    slotsForDate.forEach(s => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = s.time;
      chip.addEventListener("click", () => {
        this.renderMessage(s.time, "user");
        this.flowData.slot = s.time;
        this.flowData.slotId = s.id;
        
        this.state = "booking_symptoms";
        this.renderMessage("Briefly describe the symptoms or reason for this clinical consultation visit:");
        this.suggestionsContainer.innerHTML = "";
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleBookingSymptoms(symptomText) {
    this.flowData.symptoms = symptomText;
    this.renderBookingSummaryReceipt();
  }

  renderBookingSummaryReceipt() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      const receiptCard = document.createElement("div");
      receiptCard.className = "caremate-reminder-box";
      receiptCard.innerHTML = `
        <div style="font-size:0.85rem; font-weight:700; color:var(--primary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-receipt"></i>
          <span>Consultation Booking Summary</span>
        </div>
        <div class="caremate-reminder-content">
          <strong>Patient:</strong> ${this.flowData.name}<br>
          <strong>Doctor:</strong> ${this.flowData.doctor.name}<br>
          <strong>Specialty:</strong> ${this.flowData.dept}<br>
          <strong>Schedule:</strong> ${this.flowData.date} at ${this.flowData.slot}<br>
          <strong>Consultation Fee:</strong> \u20b9${this.flowData.doctor.fee}.00
        </div>
        <div class="caremate-reminder-actions">
          <button class="caremate-reminder-btn primary" id="pay-confirm-btn" style="flex:1;">
            Pay & Confirm Booking
          </button>
          <button class="caremate-reminder-btn danger" id="cancel-summary-btn">
            Cancel
          </button>
        </div>
      `;

      receiptCard.querySelector("#pay-confirm-btn").addEventListener("click", () => {
        this.launchPaymentGateway();
      });

      receiptCard.querySelector("#cancel-summary-btn").addEventListener("click", () => {
        this.renderMessage("Booking cancelled.", "assistant");
        this.state = "idle";
        this.showMenu();
      });

      this.renderMessage(receiptCard, "assistant", "widget");
      this.suggestionsContainer.innerHTML = "";
    }, 500);
  }

  async launchPaymentGateway() {
    this.showTyping();
    const apptPayload = {
      name: this.flowData.name,
      phone: this.flowData.phone,
      email: this.flowData.email || "N/A",
      dept: this.flowData.dept,
      docId: this.flowData.doctorId,
      date: this.flowData.date,
      slot: this.flowData.slot,
      symptoms: this.flowData.symptoms
    };

    try {
      this.hideTyping();
      const newAppt = await window.launchRazorpayPayment(apptPayload);
      
      this.showTyping();
      setTimeout(() => {
        this.hideTyping();
        const successMsg = `
          \ud83c\udf89 **Appointment Booked Successfully!**<br><br>
          • Reference ID: <strong>${newAppt.id}</strong><br>
          • Doctor: Dr. ${newAppt.doctorName}<br>
          • Date/Time: ${newAppt.date} at ${newAppt.slot}<br>
          • Paid Status: **Success** (Razorpay ID: ${newAppt.payId || newAppt.pay_id || 'N/A'})
        `;
        this.renderMessage(successMsg);
        
        if (typeof window.syncDatabaseToLocal === "function") {
          window.syncDatabaseToLocal();
        }

        this.state = "idle";
        this.showMenu();
      }, 500);

    } catch (err) {
      this.showTyping();
      setTimeout(() => {
        this.hideTyping();
        this.renderMessage(`Booking transaction failed: ${err.message || 'Payment Cancelled'}`);
        this.state = "idle";
        this.showMenu();
      }, 500);
    }
  }

  showAppointments() {
    const user = JSON.parse(localStorage.getItem("phh_current_user"));
    if (!user) {
      this.renderMessage("You are not currently logged in. To see your appointment history, please enter your registered mobile contact or email below to log in:");
      this.state = "booking_patient_phone";
      return;
    }

    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
      const userAppts = allAppts.filter(a => {
        const emailMatch = a.patientEmail && user.email && a.patientEmail.toLowerCase() === user.email.toLowerCase();
        const phoneMatch = a.patientPhone && user.phone && a.patientPhone.replace(/\D/g, "").slice(-10) === user.phone.replace(/\D/g, "").slice(-10);
        return emailMatch || phoneMatch;
      });

      if (userAppts.length === 0) {
        this.renderMessage(this.translations[this.lang].no_appointments);
        this.state = "idle";
        this.showMenu();
        return;
      }

      this.renderMessage(`Found ${userAppts.length} appointments under your contact detail:`);
      
      userAppts.forEach(appt => {
        const apptCard = document.createElement("div");
        apptCard.className = "caremate-reminder-box";
        apptCard.style.margin = "8px 0";
        
        const isPast = new Date(appt.date.split("-").join("/")) < new Date().setHours(0,0,0,0);
        const statusBadge = appt.status === "Cancelled" 
          ? `<span style="color:#ef4444; font-weight:bold;">Cancelled</span>` 
          : (isPast ? `<span style="color:#64748b;">Completed</span>` : `<span style="color:#22c55e; font-weight:bold;">${appt.status}</span>`);

        apptCard.innerHTML = `
          <div style="font-size:0.75rem; color:#64748b; margin-bottom:4px;">Ref ID: ${appt.id}</div>
          <div class="caremate-reminder-content" style="margin-bottom:6px;">
            <strong>Doctor:</strong> ${appt.doctorName}<br>
            <strong>Date/Time:</strong> ${appt.date} at ${appt.slot || appt.time}<br>
            <strong>Status:</strong> ${statusBadge}
          </div>
          ${(appt.status !== "Cancelled" && !isPast) ? `
            <div class="caremate-reminder-actions">
              <button class="caremate-reminder-btn primary" id="resch-btn-${appt.id}">Reschedule</button>
              <button class="caremate-reminder-btn danger" id="canc-btn-${appt.id}">Cancel</button>
            </div>
          ` : ""}
        `;

        if (appt.status !== "Cancelled" && !isPast) {
          apptCard.querySelector(`#resch-btn-${appt.id}`).addEventListener("click", () => {
            this.renderMessage(`Reschedule Ref: ${appt.id}`, "user");
            this.flowData.rescheduleAppt = appt;
            this.promptRescheduleSlots(appt);
          });

          apptCard.querySelector(`#canc-btn-${appt.id}`).addEventListener("click", () => {
            this.renderMessage(`Cancel Ref: ${appt.id}`, "user");
            this.executeCancellation(appt);
          });
        }

        this.renderMessage(apptCard, "assistant", "widget");
      });

      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  promptRescheduleSlots(appt) {
    const allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
    const now = new Date();
    const availableSlots = allSlots.filter(s => {
      if (s.doctorId !== appt.doctorId || s.status !== "Available") return false;
      const dateParts = s.date.split("-");
      const slotTimeObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return slotTimeObj > now;
    });

    if (availableSlots.length === 0) {
      this.renderMessage(`No other available slots currently found for Dr. ${appt.doctorName} to reschedule. Please contact reception.`);
      this.showMenu();
      return;
    }

    const uniqueDates = [...new Set(availableSlots.map(s => s.date))].sort();

    this.renderMessage("Choose a new appointment date:");
    this.suggestionsContainer.innerHTML = "";
    uniqueDates.forEach(d => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = d;
      chip.addEventListener("click", () => {
        this.renderMessage(d, "user");
        this.promptRescheduleTime(appt, availableSlots.filter(s => s.date === d));
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  promptRescheduleTime(appt, slotsForDate) {
    this.renderMessage("Select a new time slot:");
    this.suggestionsContainer.innerHTML = "";
    slotsForDate.forEach(slot => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = slot.time;
      chip.addEventListener("click", () => {
        this.renderMessage(slot.time, "user");
        this.executeReschedule(appt, slot);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  executeReschedule(appt, newSlot) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
      const allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];

      const oldSlotIndex = allSlots.findIndex(s => s.bookingId === appt.id || (s.doctorId === appt.doctorId && s.date === appt.date && s.time === (appt.slot || appt.time) && s.status === "Booked"));
      if (oldSlotIndex !== -1) {
        allSlots[oldSlotIndex].status = "Available";
        allSlots[oldSlotIndex].bookingId = null;
      }

      const newSlotIndex = allSlots.findIndex(s => s.id === newSlot.id);
      if (newSlotIndex !== -1) {
        allSlots[newSlotIndex].status = "Booked";
        allSlots[newSlotIndex].bookingId = appt.id;
      }

      const apptIndex = allAppts.findIndex(a => a.id === appt.id);
      if (apptIndex !== -1) {
        allAppts[apptIndex].date = newSlot.date;
        allAppts[apptIndex].time = newSlot.time;
        allAppts[apptIndex].slot = newSlot.time;
        allAppts[apptIndex].status = "Upcoming";
        allAppts[apptIndex].rescheduledBy = "patient";
        allAppts[apptIndex].rescheduledAt = new Date().toISOString();
      }

      localStorage.setItem("phh_slots", JSON.stringify(allSlots));
      localStorage.setItem("phh_appointments", JSON.stringify(allAppts));
      window.dispatchEvent(new Event("storage_local"));

      this.renderMessage(this.translations[this.lang].reschedule_success.replace("{date}", newSlot.date).replace("{time}", newSlot.time));
      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  executeCancellation(appt) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const allSlots = JSON.parse(localStorage.getItem("phh_slots")) || [];
      const allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];

      const slotIndex = allSlots.findIndex(s => s.bookingId === appt.id || (s.doctorId === appt.doctorId && s.date === appt.date && s.time === (appt.slot || appt.time) && s.status === "Booked"));
      if (slotIndex !== -1) {
        allSlots[slotIndex].status = "Available";
        allSlots[slotIndex].bookingId = null;
      }

      const apptIndex = allAppts.findIndex(a => a.id === appt.id);
      if (apptIndex !== -1) {
        allAppts[apptIndex].status = "Cancelled";
      }

      localStorage.setItem("phh_slots", JSON.stringify(allSlots));
      localStorage.setItem("phh_appointments", JSON.stringify(allAppts));
      window.dispatchEvent(new Event("storage_local"));

      this.renderMessage(this.translations[this.lang].cancel_success);
      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  checkUpcomingAppointments(silent = false) {
    const user = JSON.parse(localStorage.getItem("phh_current_user"));
    if (!user) return;

    const allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
    const now = new Date();
    
    const reminderAppt = allAppts.find(a => {
      if (a.status === "Cancelled") return false;
      const emailMatch = a.patientEmail && user.email && a.patientEmail.toLowerCase() === user.email.toLowerCase();
      const phoneMatch = a.patientPhone && user.phone && a.patientPhone.replace(/\D/g, "").slice(-10) === user.phone.replace(/\D/g, "").slice(-10);
      
      if (emailMatch || phoneMatch) {
        const dateParts = a.date.split("-");
        const apptDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        const timeDiff = apptDate - now.setHours(0,0,0,0);
        const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 1;
      }
      return false;
    });

    if (reminderAppt && !silent) {
      this.showReminderCard(reminderAppt);
    }
  }

  showReminderCard(appt) {
    const existingReminder = document.getElementById(`reminder-box-${appt.id}`);
    if (existingReminder) return;

    let headerText = "Upcoming Appointment Alert";
    let contentText = `You have an upcoming consultation booked with <strong>Dr. ${appt.doctorName}</strong> scheduled for <strong>${appt.date}</strong> at <strong>${appt.slot || appt.time}</strong>.`;
    let btnOkText = "Confirm/View";
    let btnReschText = "Reschedule";
    let btnCancText = "Cancel Slot";

    if (this.lang === "gu") {
      headerText = "આગામી એપોઇન્ટમેન્ટ સૂચના";
      contentText = `તમારી <strong>ડૉ. ${appt.doctorName}</strong> સાથેની આગામી એપોઇન્ટમેન્ટ <strong>${appt.date}</strong> ના રોજ <strong>${appt.slot || appt.time}</strong> વાગ્યે શેડ્યૂલ કરેલી છે.`;
      btnOkText = "પુષ્ટિ કરો/જુઓ";
      btnReschText = "ફરીથી શેડ્યૂલ કરો";
      btnCancText = "સ્લોટ રદ કરો";
    } else if (this.lang === "hi") {
      headerText = "आगामी अपॉइंटमेंट अलर्ट";
      contentText = `आपकी <strong>डॉ. ${appt.doctorName}</strong> के साथ आगामी अपॉइंटमेंट <strong>${appt.date}</strong> को <strong>${appt.slot || appt.time}</strong> बजे निर्धारित है।`;
      btnOkText = "पुष्टि करें / देखें";
      btnReschText = "पुनर्निर्धारित करें";
      btnCancText = "अपॉइंटमेंट रद्द करें";
    }

    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const reminderCard = document.createElement("div");
      reminderCard.className = "caremate-reminder-box";
      reminderCard.id = `reminder-box-${appt.id}`;
      reminderCard.innerHTML = `
        <div class="caremate-reminder-header">
          <i class="fa-solid fa-bell-ring fa-bounce"></i>
          <span>${headerText}</span>
        </div>
        <div class="caremate-reminder-content">
          ${contentText}
        </div>
        <div class="caremate-reminder-actions">
          <button class="caremate-reminder-btn primary" id="rem-ok-${appt.id}">
            ${btnOkText}
          </button>
          <button class="caremate-reminder-btn secondary" id="rem-resch-${appt.id}">
            ${btnReschText}
          </button>
          <button class="caremate-reminder-btn danger" id="rem-canc-${appt.id}">
            ${btnCancText}
          </button>
        </div>
      `;

      reminderCard.querySelector(`#rem-ok-${appt.id}`).addEventListener("click", () => {
        const confirmUser = this.lang === "gu" ? "એપોઇન્ટમેન્ટ પુષ્ટિ કરો" : (this.lang === "hi" ? "अपॉइंटमेंट की पुष्टि करें" : "Confirm Appointment");
        const confirmAssistant = this.lang === "gu" 
          ? `${appt.date} ના રોજ તમારી એપોઇન્ટમેન્ટ પુષ્ટિ થયેલ છે. અમે તમને મળવાની રાહ જોઈ રહ્યા છીએ.`
          : (this.lang === "hi" 
            ? `${appt.date} को आपकी अपॉइंटमेंट की पुष्टि हो गई है। हम आपसे मिलने के लिए उत्सुक हैं।`
            : `Your appointment for ${appt.date} is confirmed. We look forward to seeing you.`);

        this.renderMessage(confirmUser, "user");
        this.renderMessage(confirmAssistant, "assistant");
        this.showMenu();
      });

      reminderCard.querySelector(`#rem-resch-${appt.id}`).addEventListener("click", () => {
        const reschMsg = this.lang === "gu" ? "એપોઇન્ટમેન્ટ ફરીથી શેડ્યૂલ કરો" : (this.lang === "hi" ? "अपॉइंटमेंट पुनर्निर्धारित करें" : "Reschedule Appointment Reminder");
        this.renderMessage(reschMsg, "user");
        this.promptRescheduleSlots(appt);
      });

      reminderCard.querySelector(`#rem-canc-${appt.id}`).addEventListener("click", () => {
        const cancelMsg = this.lang === "gu" ? "એપોઇન્ટમેન્ટ રદ કરો" : (this.lang === "hi" ? "अपॉइंटमेंट रद्द करें" : "Cancel Appointment Reminder");
        this.renderMessage(cancelMsg, "user");
        this.executeCancellation(appt);
      });

      this.renderMessage(reminderCard, "assistant", "widget");
    }, 600);
  }

  startDirectionsQuery() {
    const promptMsg = this.lang === "gu" 
      ? "તમે પાલનપુર હેલ્થ હબમાં કયા વિભાગ અથવા વિસ્તારને શોધવાનો પ્રયાસ કરી રહ્યાં છો?"
      : (this.lang === "hi" 
        ? "आप पालनपुर हेल्थ हब में किस विभाग या क्षेत्र का पता लगाने का प्रयास कर रहे हैं?" 
        : "Which department or area in Palanpur Health Hub are you trying to locate?");
    this.renderMessage(promptMsg);
    this.suggestionsContainer.innerHTML = "";
    const facilities = ["General Medicine", "Cardiology", "Neurology", "Pulmonology", "Orthopedics", "ICU", "Emergency", "Pharmacy"];
    facilities.forEach(fac => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = fac;
      chip.addEventListener("click", () => {
        this.renderMessage(fac, "user");
        this.showHospitalDirections(fac);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  showHospitalDirections(facility) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const directions = HOSPITAL_DIRECTIONS[this.lang] || HOSPITAL_DIRECTIONS["en"];
      const matchedText = directions[facility] || directions["General Medicine"];
      
      const responseText = `
        📍 **Location Directions: ${facility}**<br><br>
        ${matchedText}
      `;
      this.renderMessage(responseText);
      this.showMenu();
    }, 450);
  }

  checkForPendingReviews() {
    const user = JSON.parse(localStorage.getItem("phh_current_user"));
    if (!user) return;

    const allAppts = JSON.parse(localStorage.getItem("phh_appointments")) || [];
    const allReviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];

    const nowStr = new Date().toISOString().split("T")[0];
    const unreviewedAppt = allAppts.find(a => {
      if (a.status === "Cancelled") return false;
      const emailMatch = a.patientEmail && user.email && a.patientEmail.toLowerCase() === user.email.toLowerCase();
      const phoneMatch = a.patientPhone && user.phone && a.patientPhone.replace(/\D/g, "").slice(-10) === user.phone.replace(/\D/g, "").slice(-10);
      
      if (emailMatch || phoneMatch) {
        const isPast = a.date < nowStr;
        if (!isPast) return false;

        const reviewed = allReviews.some(r => r.appointmentId === a.id || r.appointment_id === a.id);
        return !reviewed;
      }
      return false;
    });

    if (unreviewedAppt) {
      this.promptAppointmentFeedback(unreviewedAppt);
    }
  }

  promptAppointmentFeedback(appt) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const card = document.createElement("div");
      card.className = "caremate-feedback-card";
      
      let ratingSelected = 5;

      card.innerHTML = `
        <div style="font-size:0.82rem; font-weight:700; margin-bottom:6px;">
          ${this.translations[this.lang].ask_feedback.replace("{doctor}", appt.doctorName)}
        </div>
        <div class="caremate-stars-wrapper">
          <button class="caremate-star-btn active" data-rating="1">\u2605</button>
          <button class="caremate-star-btn active" data-rating="2">\u2605</button>
          <button class="caremate-star-btn active" data-rating="3">\u2605</button>
          <button class="caremate-star-btn active" data-rating="4">\u2605</button>
          <button class="caremate-star-btn active" data-rating="5">\u2605</button>
        </div>
        <textarea class="caremate-feedback-textarea" placeholder="${this.translations[this.lang].feedback_placeholder}"></textarea>
        <button class="caremate-feedback-submit" id="feedback-submit-btn">
          ${this.translations[this.lang].submit_feedback}
        </button>
      `;

      const stars = card.querySelectorAll(".caremate-star-btn");
      stars.forEach(btn => {
        btn.addEventListener("click", (e) => {
          ratingSelected = parseInt(btn.getAttribute("data-rating"));
          stars.forEach(s => {
            const r = parseInt(s.getAttribute("data-rating"));
            if (r <= ratingSelected) {
              s.classList.add("active");
            } else {
              s.classList.remove("active");
            }
          });
        });
      });

      card.querySelector("#feedback-submit-btn").addEventListener("click", () => {
        const reviewText = card.querySelector(".caremate-feedback-textarea").value.trim();
        this.submitReview(appt, ratingSelected, reviewText);
      });

      this.renderMessage(card, "assistant", "widget");
    }, 600);
  }

  submitReview(appt, rating, reviewText) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();

      const allReviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
      const newReview = {
        appointmentId: appt.id,
        doctorId: appt.doctorId,
        patientName: appt.patientName || "Guest Patient",
        rating: rating,
        review: reviewText || "No written review comments provided.",
        created_at: new Date().toISOString()
      };

      allReviews.push(newReview);
      localStorage.setItem("phh_reviews", JSON.stringify(allReviews));
      
      window.dispatchEvent(new Event("storage_local"));

      this.renderMessage(this.translations[this.lang].feedback_success);
      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  startFaqSearch() {
    this.state = "faq_search";
    const faqPrompt = this.lang === 'gu' ? String.fromCodePoint(...[2730,2750,2738,2750,2734,2752,32,2744,2750,2736,2752,2724,2750,32,2738,2709,2765,2743,2723,2763,32,2730,2754,2715,2763,58]) : (this.lang === 'hi' ? String.fromCodePoint(...[2360,2366,2350,2366,2344,2381,2351,32,2360,2357,2366,2354,2367,2325,32,2346,2381,2352,2368,2350,2375,2306,32,2346,2381,2352,2369,2332,2375,2306,58]) : "Ask us a general hospital query (e.g. 'What are the visiting hours?'):");
    this.renderMessage(faqPrompt);
    this.suggestionsContainer.innerHTML = "";
  }

  handleFaqSearchQuery(text) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const answer = this.matchFaqText(text);
      if (answer) {
        this.renderMessage(answer);
      } else {
        const notFound = this.lang === 'gu' 
          ? String.fromCodePoint(...[2745,2753,2690,32,2724,2734,2752,32,2716,2759,32,2741,2751,2742,2750,2736,2750,32,2709,2750,2736,2751,2709,32,2734,2725,2752,32,2730,2754,2715,2763,32,2736,2725,2752,46])
          : (this.lang === 'hi' ? String.fromCodePoint(...[2350,2369,2332,2375,32,2311,2360,2325,2375,32,2348,2366,2352,2375,32,2350,2375,2306,32,2325,2379,2311,32,2332,2366,2344,2325,2366,2352,2368,32,2344,2361,2368,2306,32,2350,2367,2354,2368,2404]) : "I couldn't find an exact answer for that query in our database. Please try another administrative question.");
        this.renderMessage(notFound);
      }
      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  matchFaqText(text) {
    const raw = text.toLowerCase();
    
    const faqData = {
      en: [
        { q: ["opd", "timings", "hours"], a: "General OPD clinics are open **Monday to Saturday, 9:00 AM to 6:00 PM**. Emergency operations are open 24/7." },
        { q: ["visit", "visiting", "hours", "patient"], a: "Visiting hours for patient wards are daily from **4:00 PM to 7:00 PM**. Only one visitor card is allowed per patient." },
        { q: ["parking", "vehicle", "car"], a: "Yes, free secure 2-wheeler and 4-wheeler parking is available inside the hospital premises 24/7." },
        { q: ["insurance", "claims", "cashless", "tpa"], a: "We support cashless treatment options with all major TPAs and insurance providers including Star Health, HDFC Ergo, ICICI Lombard, and Niva Bupa." },
        { q: ["pharmacy", "medicine"], a: "Our in-house Pharmacy is located on the **Ground Floor, Building A** next to reception and operates 24 hours daily." }
      ],
      gu: [
        { q: ["opd", "સમય", "કલાકો"], a: String.fromCodePoint(...[2716,2759,2728,2751,2709,32,2734,2750,2736,2752,32,2744,2750,2736,2750,2736,2751,2725,2709,2750,32,2716,2759,2728,2751,2709,32,2709,2750,2736,2750,2736,2751,2725,2709,2750,32,2726,2751,2742,2750,2728,2750,2709,32,2693,2728,2759,32,2744,2751,2709,2750,2725,2709,2750,32,2734,2739,2752,32,2715,2759,46]) },
        { q: ["મુલાકાત", "સમય", "દર્દી"], a: String.fromCodePoint(...[2726,2751,2742,2750,2728,2750,2709,32,2734,2739,2752,32,2738,2750,2736,2750,2736,2751,2725,2709,2750,32,2744,2750,2736,2741,2750,2736,32,2715,2752,46]) },
        { q: ["પાર્કિંગ", "વાહન"], a: String.fromCodePoint(...[2745,2753,2690,44,32,2744,2750,2725,2752,32,2736,2752,2724,2759,32,2734,2726,2726,32,2738,2715,2741,2750,2736,32,2738,2710,2763,32,2732,2753,2709,2751,2690,2711,32,2715,2759,46]) }
      ],
      hi: [
        { q: ["opd", "समय", "घंटे"], a: "सामान्य OPD क्लीनिक **सोमवार से शनिवार, सुबह 9:00 बजे से शाम 6:00 बजे** तक कार्यरत रहते हैं।" },
        { q: ["मुलाकात", "समय", "मरीज"], a: "वार्डों में मरीजों से मिलने का समय **शाम 4:00 से 7:00 बजे** तक है।" }
      ]
    };

    const currentFaqList = faqData[this.lang] || faqData["en"];
    const matched = currentFaqList.find(item => item.q.some(keyword => raw.includes(keyword)));
    return matched ? matched.a : null;
  }

  startHealthToolsMenu() {
    this.renderMessage("Which health calculator or screening tool would you like to run today?");
    this.suggestionsContainer.innerHTML = "";
    
    const tools = [
      { name: "🧮 BMI Calculator", action: () => this.startBmiCalc() },
      { name: "💧 Water Intake Calculator", action: () => this.startWaterCalc() },
      { name: "❤️ Heart Risk Assessment", action: () => this.startHeartRisk() },
      { name: "🧬 Diabetes Risk Assessment", action: () => this.startDiabetesRisk() },
      { name: "🤰 Pregnancy Due Date", action: () => this.startPregnancyCalc() }
    ];

    tools.forEach(t => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = t.name;
      chip.addEventListener("click", () => {
        this.renderMessage(t.name, "user");
        t.action();
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  startBmiCalc() {
    this.state = "calc_bmi_weight";
    this.flowData = {};
    this.renderMessage("Let's calculate your BMI. First, what is your weight in kilograms (kg)?");
    this.suggestionsContainer.innerHTML = "";
  }

  handleBmiWeight(w) {
    const num = parseFloat(w);
    if (isNaN(num) || num <= 10 || num > 300) {
      this.renderMessage("Please enter a valid weight in kilograms (e.g. 70):");
      return;
    }
    this.flowData.weight = num;
    this.state = "calc_bmi_height";
    this.renderMessage("Great. Next, what is your height in centimeters (cm)?");
  }

  handleBmiHeight(h) {
    const num = parseFloat(h);
    if (isNaN(num) || num <= 50 || num > 250) {
      this.renderMessage("Please enter a valid height in centimeters (e.g. 175):");
      return;
    }
    this.flowData.height = num;
    this.calculateBmiResult();
  }

  calculateBmiResult() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const weight = this.flowData.weight;
      const heightM = this.flowData.height / 100;
      const bmi = (weight / (heightM * heightM)).toFixed(1);
      
      let category = "Normal weight";
      let interpretation = "Your BMI falls in the healthy weight range. Keep maintaining your lifestyle!";
      let suggestSpecialist = false;

      if (bmi < 18.5) {
        category = "Underweight";
        interpretation = "You are in the underweight range. We recommend speaking with a clinical nutritionist to guide a weight-gain diet plan.";
        suggestSpecialist = true;
      } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        interpretation = "You are in the overweight range. Consider balanced nutrition intake and regular physical activity.";
      } else if (bmi >= 30) {
        category = "Obesity";
        interpretation = "Your BMI indicates obesity. We recommend consulting a dietitian or endocrinologist for a healthy weight loss roadmap.";
        suggestSpecialist = true;
      }

      const responseText = `
        🧮 **CareMate AI - BMI Report**<br><br>
        • Weight: **${weight} kg**<br>
        • Height: **${this.flowData.height} cm**<br>
        • Calculated BMI: **${bmi}**<br>
        • Category: **${category}**<br><br>
        *Interpretation:* ${interpretation}
      `;
      this.renderMessage(responseText);
      
      if (suggestSpecialist) {
        this.renderMessage("Would you like me to recommend clinical specialists for personalized advice?");
        this.suggestionsContainer.innerHTML = "";
        const yesChip = document.createElement("button");
        yesChip.className = "chatbot-chip";
        yesChip.textContent = "Yes, recommend doctors";
        yesChip.addEventListener("click", () => {
          this.renderMessage("Yes, recommend doctors", "user");
          this.rankDoctors("General Medicine");
        });
        const noChip = document.createElement("button");
        noChip.className = "chatbot-chip";
        noChip.textContent = "No thanks";
        noChip.addEventListener("click", () => {
          this.renderMessage("No thanks", "user");
          this.state = "idle";
          this.showMenu();
        });
        this.suggestionsContainer.appendChild(yesChip);
        this.suggestionsContainer.appendChild(noChip);
      } else {
        this.state = "idle";
        this.showMenu();
      }
    }, 500);
  }

  startWaterCalc() {
    this.state = "calc_water_weight";
    this.flowData = {};
    this.renderMessage("Let's calculate your daily hydration target. First, enter your weight in kg:");
    this.suggestionsContainer.innerHTML = "";
  }

  handleWaterWeight(w) {
    const num = parseFloat(w);
    if (isNaN(num) || num <= 10 || num > 300) {
      this.renderMessage("Please enter a valid weight in kg:");
      return;
    }
    this.flowData.weight = num;
    this.state = "calc_water_activity";
    this.renderMessage("Select your daily physical activity level:");
    this.suggestionsContainer.innerHTML = "";
    
    const levels = ["Sedentary", "Moderate", "Highly Active"];
    levels.forEach(lvl => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = lvl;
      chip.addEventListener("click", () => {
        this.renderMessage(lvl, "user");
        this.handleWaterActivity(lvl);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleWaterActivity(lvl) {
    this.flowData.activity = lvl;
    this.calculateWaterResult();
  }

  calculateWaterResult() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const weight = this.flowData.weight;
      let baseMl = weight * 35;
      
      if (this.flowData.activity === "Moderate") {
        baseMl += 500;
      } else if (this.flowData.activity === "Highly Active") {
        baseMl += 1000;
      }

      const liters = (baseMl / 1000).toFixed(1);
      const glasses = Math.ceil(baseMl / 250);

      const responseText = `
        💧 **Daily Water Intake Recommendation**<br><br>
        • Daily Fluid Target: **${liters} Liters** (approx. **${glasses} glasses**)<br>
        • Weight factor: ${weight} kg<br>
        • Activity: ${this.flowData.activity}<br><br>
        *Tip: Try drinking a glass of water first thing in the morning to start your hydration goals!*
      `;
      this.renderMessage(responseText);
      this.state = "idle";
      this.showMenu();
    }, 500);
  }

  startHeartRisk() {
    this.state = "calc_heart_age";
    this.flowData = { points: 0 };
    this.renderMessage("Let's start your Heart Risk Assessment. What is your age?");
    this.suggestionsContainer.innerHTML = "";
  }

  handleHeartAge(age) {
    const num = parseInt(age);
    if (isNaN(num) || num <= 0 || num > 120) {
      this.renderMessage("Please enter a valid age:");
      return;
    }
    this.flowData.age = num;
    if (num > 55) this.flowData.points += 2;
    else if (num > 40) this.flowData.points += 1;

    this.state = "calc_heart_bp";
    this.renderMessage("Do you have diagnosed High Blood Pressure (Hypertension)?");
    this.suggestionsContainer.innerHTML = "";
    
    const options = ["Yes", "No"];
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt;
      chip.addEventListener("click", () => {
        this.renderMessage(opt, "user");
        this.handleHeartBp(opt);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleHeartBp(opt) {
    if (opt === "Yes") this.flowData.points += 2;
    this.state = "calc_heart_smoking";
    this.renderMessage("Do you smoke tobacco regularly?");
    this.suggestionsContainer.innerHTML = "";

    const options = ["Yes", "No"];
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt;
      chip.addEventListener("click", () => {
        this.renderMessage(opt, "user");
        this.handleHeartSmoking(opt);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleHeartSmoking(opt) {
    if (opt === "Yes") this.flowData.points += 2;
    this.state = "calc_heart_family";
    this.renderMessage("Do you have a direct family history of early heart disease?");
    this.suggestionsContainer.innerHTML = "";

    const options = ["Yes", "No"];
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt;
      chip.addEventListener("click", () => {
        this.renderMessage(opt, "user");
        this.handleHeartFamily(opt);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleHeartFamily(opt) {
    if (opt === "Yes") this.flowData.points += 1;
    this.calculateHeartResult();
  }

  calculateHeartResult() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const pts = this.flowData.points;
      let risk = "Low Risk";
      let interpretation = "Your answers indicate a low risk profile for heart diseases. Maintain a balanced diet, exercise weekly, and avoid smoking.";
      let recommendCardio = false;

      if (pts >= 5) {
        risk = "High Risk";
        interpretation = "Your answers indicate a high risk profile. We strongly advise booking a cardiac screening consultation with our Cardiology department.";
        recommendCardio = true;
      } else if (pts >= 3) {
        risk = "Moderate Risk";
        interpretation = "You have a moderate risk profile. Consider monitoring your blood pressure monthly and modifying nutritional intake.";
        recommendCardio = true;
      }

      const responseText = `
        ❤️ **Heart Risk Screening Report**<br><br>
        • Risk Level: **${risk}** (Score: ${pts})<br><br>
        *Guideline:* ${interpretation}
      `;
      this.renderMessage(responseText);

      if (recommendCardio) {
        this.renderMessage("Would you like to review Cardiologist doctors schedules to consult?");
        this.suggestionsContainer.innerHTML = "";
        const yesChip = document.createElement("button");
        yesChip.className = "chatbot-chip";
        yesChip.textContent = "Yes, show Cardiologists";
        yesChip.addEventListener("click", () => {
          this.renderMessage("Yes, show Cardiologists", "user");
          this.rankDoctors("Cardiology");
        });
        const noChip = document.createElement("button");
        noChip.className = "chatbot-chip";
        noChip.textContent = "No thanks";
        noChip.addEventListener("click", () => {
          this.renderMessage("No thanks", "user");
          this.state = "idle";
          this.showMenu();
        });
        this.suggestionsContainer.appendChild(yesChip);
        this.suggestionsContainer.appendChild(noChip);
      } else {
        this.state = "idle";
        this.showMenu();
      }
    }, 500);
  }

  startDiabetesRisk() {
    this.state = "calc_diabetes_age";
    this.flowData = { points: 0 };
    this.renderMessage("Let's assess your Diabetes Risk. What is your age?");
    this.suggestionsContainer.innerHTML = "";
  }

  handleDiabetesAge(age) {
    const num = parseInt(age);
    if (isNaN(num) || num <= 0 || num > 120) {
      this.renderMessage("Please enter a valid age:");
      return;
    }
    this.flowData.age = num;
    if (num > 45) this.flowData.points += 2;

    this.state = "calc_diabetes_family";
    this.renderMessage("Does anyone in your family (parents/siblings) have diabetes?");
    this.suggestionsContainer.innerHTML = "";
    
    const options = ["Yes", "No"];
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt;
      chip.addEventListener("click", () => {
        this.renderMessage(opt, "user");
        this.handleDiabetesFamily(opt);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleDiabetesFamily(opt) {
    if (opt === "Yes") this.flowData.points += 2;
    this.state = "calc_diabetes_active";
    this.renderMessage("Do you have a sedentary lifestyle with little or no weekly physical exercise?");
    this.suggestionsContainer.innerHTML = "";

    const options = ["Yes", "No"];
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt;
      chip.addEventListener("click", () => {
        this.renderMessage(opt, "user");
        this.handleDiabetesActive(opt);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleDiabetesActive(opt) {
    if (opt === "Yes") this.flowData.points += 1;
    this.state = "calc_diabetes_symptoms";
    this.renderMessage("Are you experiencing symptoms like excessive thirst, frequent urination, or unexplained weight loss?");
    this.suggestionsContainer.innerHTML = "";

    const options = ["Yes", "No"];
    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.textContent = opt;
      chip.addEventListener("click", () => {
        this.renderMessage(opt, "user");
        this.handleDiabetesSymptoms(opt);
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleDiabetesSymptoms(opt) {
    if (opt === "Yes") this.flowData.points += 3;
    this.calculateDiabetesResult();
  }

  calculateDiabetesResult() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const pts = this.flowData.points;
      let risk = "Low Risk";
      let interpretation = "Your risk for diabetes is low. Continue following healthy nutrition practices.";
      let recommendDr = false;

      if (pts >= 5) {
        risk = "High Risk";
        interpretation = "Your risk level is high. We strongly recommend booking a blood sugar test and consulting our General Medicine specialists.";
        recommendDr = true;
      } else if (pts >= 3) {
        risk = "Moderate Risk";
        interpretation = "You have a moderate risk level. Try to incorporate 30 minutes of walking daily and reduce processed sugar consumption.";
        recommendDr = true;
      }

      const responseText = `
        🧬 **Diabetes Risk Screening Report**<br><br>
        • Risk Level: **${risk}** (Score: ${pts}/8)<br><br>
        *Guideline:* ${interpretation}
      `;
      this.renderMessage(responseText);

      if (recommendDr) {
        this.renderMessage("Would you like to book a clinical consultation with our General Medicine team?");
        this.suggestionsContainer.innerHTML = "";
        const yesChip = document.createElement("button");
        yesChip.className = "chatbot-chip";
        yesChip.textContent = "Yes, recommend doctors";
        yesChip.addEventListener("click", () => {
          this.renderMessage("Yes, recommend doctors", "user");
          this.rankDoctors("General Medicine");
        });
        const noChip = document.createElement("button");
        noChip.className = "chatbot-chip";
        noChip.textContent = "No thanks";
        noChip.addEventListener("click", () => {
          this.renderMessage("No thanks", "user");
          this.state = "idle";
          this.showMenu();
        });
        this.suggestionsContainer.appendChild(yesChip);
        this.suggestionsContainer.appendChild(noChip);
      } else {
        this.state = "idle";
        this.showMenu();
      }
    }, 500);
  }

  startPregnancyCalc() {
    this.state = "calc_pregnancy_lmp";
    this.flowData = {};
    this.renderMessage("Let's calculate your estimated delivery date. Please enter the first day of your last menstrual period (LMP) in **YYYY-MM-DD** format:");
    this.suggestionsContainer.innerHTML = "";
  }

  handlePregnancyLmp(dateStr) {
    const lmpDate = new Date(dateStr);
    if (isNaN(lmpDate.getTime()) || lmpDate > new Date()) {
      this.renderMessage("Please enter a valid past date in YYYY-MM-DD format:");
      return;
    }
    
    const dueDate = new Date(lmpDate.getTime() + (280 * 24 * 60 * 60 * 1000));
    
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDue = dueDate.toLocaleDateString(undefined, options);
      
      const responseText = `
        🤰 **Estimated Pregnancy Due Date**<br><br>
        • Expected Due Date: **${formattedDue}**<br>
        • LMP Reference: ${dateStr}<br><br>
        *Maternity Tip: Consult a certified gynecologist regularly to support your prenatal health schedule.*
      `;
      this.renderMessage(responseText);

      this.renderMessage("Would you like to view our Gynecology doctor specialists?");
      this.suggestionsContainer.innerHTML = "";
      const yesChip = document.createElement("button");
      yesChip.className = "chatbot-chip";
      yesChip.textContent = "Yes, view Gynecologists";
      yesChip.addEventListener("click", () => {
        this.renderMessage("Yes, view Gynecologists", "user");
        this.rankDoctors("Gynecology");
      });
      const noChip = document.createElement("button");
      noChip.className = "chatbot-chip";
      noChip.textContent = "No thanks";
      noChip.addEventListener("click", () => {
        this.renderMessage("No thanks", "user");
        this.state = "idle";
        this.showMenu();
      });
      this.suggestionsContainer.appendChild(yesChip);
      this.suggestionsContainer.appendChild(noChip);
    }, 500);
  }

  setupGuestConversionMonitor() {
    let hasPrompted = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasPrompted) {
          setTimeout(() => {
            const isClosed = this.container.classList.contains("hidden-chatbot");
            if (isClosed && !hasPrompted) {
              hasPrompted = true;
              this.toggleChat(true);
              this.showTyping();
              setTimeout(() => {
                this.hideTyping();
                this.renderMessage("👋 Hello! Need assistance in finding the right medical specialist or checking appointment availability? I'm here to help!");
                this.showMenu();
              }, 600);
            }
          }, 15000);
        }
      });
    }, { threshold: 0.1 });

    const targetGrid = document.getElementById("doctors-grid") || document.getElementById("doctors");
    if (targetGrid) {
      observer.observe(targetGrid);
    }
  }
}
