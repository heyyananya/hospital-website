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
        <button class="btn btn-primary doc-book-btn btn-ripple" onclick="triggerBooking('${doc.id}')">${TRANSLATIONS[currentLanguage]["doc-btn-book"] || "Book Appointment"}</button>
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
  if (typeof AntigravitySmartChatbot !== 'undefined') {
    window.chatbotInstance = new AntigravitySmartChatbot();
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

class AntigravitySmartChatbot {
  constructor() {
    this.container = document.getElementById("chatbot-container");
    this.fab = document.getElementById("chatbot-fab");
    this.closeBtn = document.getElementById("chatbot-close-btn");
    this.messagesContainer = document.getElementById("chat-messages");
    this.suggestionsContainer = document.getElementById("chat-suggestions");
    this.inputForm = document.getElementById("chatbot-input-form");
    this.inputField = document.getElementById("chatbot-input-field");
    
    this.lang = localStorage.getItem("phh_lang") || "en";
    this.state = "idle"; // idle, menu, symptoms, booking, quiz, nav, tips
    
    // Booking flow state
    this.booking = {
      name: "",
      dept: "",
      doctor: null,
      date: "",
      slot: "",
      symptoms: ""
    };
    
    // Quiz state
    this.quiz = {
      currentQuestion: 0,
      score: 0
    };
  }

  init() {
    if (!this.container || !this.fab) return;

    // Toggle chatbot
    this.fab.addEventListener("click", () => this.toggleChat());
    this.closeBtn.addEventListener("click", () => this.toggleChat(false));

    // Submit user message
    this.inputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = this.inputField.value.trim();
      if (!text) return;
      this.handleUserInput(text);
      this.inputField.value = "";
    });

    // Voice assistant placeholder visual tip
    const micBtn = document.getElementById("chatbot-mic-btn");
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        const voiceTip = this.lang === 'gu' ? "અવાજ સહાયક ટૂંક સમયમાં આવી રહ્યો છે!" : (this.lang === 'hi' ? "आवाज सहायक जल्द ही आ रहा है!" : "Voice assistant is coming soon!");
        alert(voiceTip);
      });
    }

    // Load initial language
    this.loadLanguage(this.lang);
  }

  loadLanguage(lang) {
    this.lang = lang;
    
    // Update placeholders
    if (this.inputField) {
      this.inputField.placeholder = CHATBOT_TRANSLATIONS[lang].placeholder;
    }
    const title = document.querySelector(".chatbot-title");
    if (title) {
      title.textContent = CHATBOT_TRANSLATIONS[lang].welcome_title || "Hospital Assistant ChatBot";
    }
    const statusText = document.querySelector(".chatbot-status-text");
    if (statusText) {
      statusText.textContent = CHATBOT_TRANSLATIONS[lang].online;
    }

    // Refresh menu chips if chatbot is open and we are in idle/menu state
    if (this.container && !this.container.classList.contains("hidden-chatbot")) {
      if (this.state === "idle" || this.state === "menu") {
        this.showMenu();
      }
    }
  }

  toggleChat(forceOpen) {
    const shouldOpen = forceOpen !== undefined ? forceOpen : this.container.classList.contains("hidden-chatbot");
    if (shouldOpen) {
      this.container.classList.remove("hidden-chatbot");
      this.fab.classList.remove("chatbot-fab-pulse");
      
      // If messages are empty, show greeting
      if (this.messagesContainer.children.length === 0) {
        this.showGreeting();
      }
    } else {
      this.container.classList.add("hidden-chatbot");
    }
  }

  showTyping() {
    this.hideTyping(); // avoid duplicates
    const row = document.createElement("div");
    row.className = "chatbot-typing-row";
    row.id = "chatbot-typing-indicator";
    
    const avatar = document.createElement("div");
    avatar.className = "chatbot-avatar-container";
    avatar.innerHTML = `<i class="fa-solid fa-user-doctor"></i>`;
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
    if (indicator) indicator.remove();
  }

  renderMessage(text, sender = "assistant", isHtml = false) {
    const row = document.createElement("div");
    row.className = `chatbot-message-row ${sender}`;
    
    if (sender === "assistant") {
      const avatar = document.createElement("div");
      avatar.className = "chatbot-avatar-container";
      avatar.innerHTML = `<i class="fa-solid fa-user-doctor"></i>`;
      row.appendChild(avatar);
    }
    
    const bubble = document.createElement("div");
    bubble.className = `chatbot-bubble ${sender}`;
    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      // Parse simple bold markdown "**"
      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      bubble.innerHTML = formattedText;
    }
    
    row.appendChild(bubble);
    this.messagesContainer.appendChild(row);
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  showGreeting() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].welcome, "assistant");
      this.showMenu();
    }, 600);
  }

  showMenu() {
    this.suggestionsContainer.innerHTML = "";
    this.state = "menu";
    
    const options = [
      { text: CHATBOT_TRANSLATIONS[this.lang].option_find_dept, icon: '<i class="fa-solid fa-stethoscope"></i>', action: () => this.startSymptomChecker() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_find_doc, icon: '<i class="fa-solid fa-user-doctor"></i>', action: () => this.showDoctors() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_book, icon: '<i class="fa-solid fa-calendar-check"></i>', action: () => this.startBooking() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_fees, icon: '<i class="fa-solid fa-wallet"></i>', action: () => this.showDoctorFees() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_opd, icon: '<i class="fa-solid fa-clock"></i>', action: () => this.showOpdTimings() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_emergency, icon: '<i class="fa-solid fa-circle-exclamation text-rose-500"></i>', action: () => this.showEmergencyCard() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_nav, icon: '<i class="fa-solid fa-compass"></i>', action: () => this.showNavigationMenu() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_tips, icon: '<i class="fa-solid fa-lightbulb text-amber-500"></i>', action: () => this.showHealthTips() },
      { text: CHATBOT_TRANSLATIONS[this.lang].option_quiz, icon: '<i class="fa-solid fa-circle-question"></i>', action: () => this.startQuiz() }
    ];

    options.forEach(opt => {
      const chip = document.createElement("button");
      chip.className = "chatbot-chip";
      chip.innerHTML = `${opt.icon} <span>${opt.text}</span>`;
      chip.addEventListener("click", () => {
        this.suggestionsContainer.innerHTML = "";
        opt.action();
      });
      this.suggestionsContainer.appendChild(chip);
    });
  }

  handleUserInput(text) {
    this.renderMessage(text, "user");
    
    // check emergency first
    if (this.detectEmergency(text)) {
      return;
    }

    if (this.state === "booking_name") {
      this.booking.name = text;
      this.bookingFlowStep("dept");
      return;
    }

    if (this.state === "booking_symptoms") {
      this.booking.symptoms = text;
      this.bookingFlowStep("summary");
      return;
    }

    // fallback to symptom mapping or menu actions
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      // try to detect symptom in user query
      const dept = this.detectSymptoms(text);
      if (dept) {
        this.recommendDepartment(dept);
      } else if (text.toLowerCase().includes("opd") || text.toLowerCase().includes("time")) {
        this.showOpdTimings();
      } else if (text.toLowerCase().includes("emerg") || text.toLowerCase().includes("sos")) {
        this.showEmergencyCard();
      } else if (text.toLowerCase().includes("navig") || text.toLowerCase().includes("where is") || text.toLowerCase().includes("direction")) {
        this.showNavigationMenu();
      } else {
        // Not understood, show menu options
        const fallbackMsg = this.lang === 'gu' ? "મને આ પ્રશ્ન સમજાયો નથી. કૃપા કરીને નીચેના વિકલ્પોમાંથી એક પસંદ કરો:" : (this.lang === 'hi' ? "मुझे यह प्रश्न समझ में नहीं आया। कृपया नीचे दिए गए विकल्पों में से एक चुनें:" : "I'm not sure I understood that. Please choose one of the options below:");
        this.renderMessage(fallbackMsg);
        this.showMenu();
      }
    }, 700);
  }

  detectEmergency(text) {
    const cleanText = text.toLowerCase();
    const keywords = EMERGENCY_KEYWORDS[this.lang] || [];
    
    // Check if any keyword matches
    const isEmergency = keywords.some(kw => cleanText.includes(kw));
    
    if (isEmergency) {
      this.showEmergencyCard();
      return true;
    }
    return false;
  }

  showEmergencyCard() {
    this.showTyping();
    this.state = "emergency";
    this.suggestionsContainer.innerHTML = "";
    
    setTimeout(() => {
      this.hideTyping();
      
      const card = document.createElement("div");
      card.className = "chatbot-emergency-card";
      card.innerHTML = `
        <div class="chatbot-emergency-header">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>${CHATBOT_TRANSLATIONS[this.lang].emergency_title}</span>
        </div>
        <div class="chatbot-emergency-body">
          ${CHATBOT_TRANSLATIONS[this.lang].emergency_alert}
        </div>
        <div class="chatbot-emergency-contacts">
          <a href="tel:+919999911111" class="chatbot-emergency-link">
            <i class="fa-solid fa-phone"></i> ${CHATBOT_TRANSLATIONS[this.lang].emergency_call}
          </a>
          <a href="tel:108" class="chatbot-emergency-link">
            <i class="fa-solid fa-truck-medical"></i> ${CHATBOT_TRANSLATIONS[this.lang].emergency_ambulance}
          </a>
          <div class="chatbot-emergency-link" style="color: var(--dark);">
            <i class="fa-solid fa-hospital"></i> ${CHATBOT_TRANSLATIONS[this.lang].emergency_location}
          </div>
        </div>
      `;
      
      this.messagesContainer.appendChild(card);
      this.scrollToBottom();
      
      // show main menu button
      setTimeout(() => this.showMenuButton(), 1000);
    }, 600);
  }

  showMenuButton() {
    this.suggestionsContainer.innerHTML = "";
    const btn = document.createElement("button");
    btn.className = "chatbot-chip";
    btn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> <span>${this.lang === 'gu' ? "મુખ્ય મેનુ" : (this.lang === 'hi' ? "मुख्य मेनू" : "Main Menu")}</span>`;
    btn.addEventListener("click", () => this.showMenu());
    this.suggestionsContainer.appendChild(btn);
  }

  showOpdTimings() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].opd_timings);
      this.showMenuButton();
    }, 400);
  }

  startSymptomChecker() {
    this.showTyping();
    this.state = "symptoms";
    setTimeout(() => {
      this.hideTyping();
      this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].symptom_prompt);
      
      // show common symptoms chips with icons
      const symptoms = {
        en: [
          { text: "Cough", icon: '<i class="fa-solid fa-wind text-sky-400"></i>' },
          { text: "Chest Pain", icon: '<i class="fa-solid fa-heart-pulse text-rose-500"></i>' },
          { text: "Joint Pain", icon: '<i class="fa-solid fa-bone text-amber-500"></i>' },
          { text: "Headache", icon: '<i class="fa-solid fa-head-side-virus"></i>' },
          { text: "Fever", icon: '<i class="fa-solid fa-temperature-high text-orange-500"></i>' }
        ],
        gu: [
          { text: "ઉધરસ", icon: '<i class="fa-solid fa-wind text-sky-400"></i>' },
          { text: "છાતીમાં દુખાવો", icon: '<i class="fa-solid fa-heart-pulse text-rose-500"></i>' },
          { text: "સાંધાનો દુખાવો", icon: '<i class="fa-solid fa-bone text-amber-500"></i>' },
          { text: "માથાનો દુખાવો", icon: '<i class="fa-solid fa-head-side-virus"></i>' },
          { text: "તાવ", icon: '<i class="fa-solid fa-temperature-high text-orange-500"></i>' }
        ],
        hi: [
          { text: "खांसी", icon: '<i class="fa-solid fa-wind text-sky-400"></i>' },
          { text: "छाती में दर्द", icon: '<i class="fa-solid fa-heart-pulse text-rose-500"></i>' },
          { text: "जोड़ों का दर्द", icon: '<i class="fa-solid fa-bone text-amber-500"></i>' },
          { text: "सिरदर्द", icon: '<i class="fa-solid fa-head-side-virus"></i>' },
          { text: "बुखार", icon: '<i class="fa-solid fa-temperature-high text-orange-500"></i>' }
        ]
      };

      this.suggestionsContainer.innerHTML = "";
      symptoms[this.lang].forEach(sym => {
        const chip = document.createElement("button");
        chip.className = "chatbot-chip";
        chip.innerHTML = `${sym.icon} <span>${sym.text}</span>`;
        chip.addEventListener("click", () => {
          this.renderMessage(sym.text, "user");
          const dept = this.detectSymptoms(sym.text);
          this.recommendDepartment(dept);
        });
        this.suggestionsContainer.appendChild(chip);
      });
      
      // add menu back button
      const backBtn = document.createElement("button");
      backBtn.className = "chatbot-chip";
      backBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> <span>${this.lang === 'gu' ? "પાછા" : (this.lang === 'hi' ? "पीछे" : "Back")}</span>`;
      backBtn.addEventListener("click", () => this.showMenu());
      this.suggestionsContainer.appendChild(backBtn);
    }, 500);
  }

  detectSymptoms(text) {
    const cleanText = text.toLowerCase();
    const mapping = CHATBOT_SYMPTOMS_MAP[this.lang] || {};
    
    for (const [symptom, dept] of Object.entries(mapping)) {
      if (cleanText.includes(symptom)) {
        return dept;
      }
    }
    return null;
  }

  recommendDepartment(dept) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      if (dept) {
        const translatedDept = this.getTranslatedDept(dept);
        const msg = CHATBOT_TRANSLATIONS[this.lang].dept_recommended.replace("{dept}", translatedDept);
        this.renderMessage(msg);
        
        // Show view doctors button chip
        this.suggestionsContainer.innerHTML = "";
        const viewBtn = document.createElement("button");
        viewBtn.className = "chatbot-chip";
        viewBtn.innerHTML = `<i class="fa-solid fa-user-doctor"></i> <span>${CHATBOT_TRANSLATIONS[this.lang].view_docs_btn.replace("{dept}", translatedDept)}</span>`;
        viewBtn.addEventListener("click", () => this.showDoctors(dept));
        this.suggestionsContainer.appendChild(viewBtn);
        
        const bookBtn = document.createElement("button");
        bookBtn.className = "chatbot-chip";
        bookBtn.innerHTML = `<i class="fa-solid fa-calendar-plus"></i> <span>${this.lang === 'gu' ? translatedDept + " માં બુક કરો" : (this.lang === 'hi' ? translatedDept + " में बुक करें" : "Book in " + translatedDept)}</span>`;
        bookBtn.addEventListener("click", () => {
          this.booking.dept = dept;
          this.startBooking(dept);
        });
        this.suggestionsContainer.appendChild(bookBtn);
        
        this.showMenuButton();
      } else {
        this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].dept_not_found);
        this.showMenu();
      }
    }, 600);
  }

  getTranslatedDept(deptName) {
    const lang = this.lang;
    if (typeof DYNAMIC_TRANSLATIONS !== 'undefined' && DYNAMIC_TRANSLATIONS[lang] && DYNAMIC_TRANSLATIONS[lang][deptName]) {
      return DYNAMIC_TRANSLATIONS[lang][deptName];
    }
    return deptName;
  }

  showDoctors(filterDept = "") {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      this.suggestionsContainer.innerHTML = "";
      
      const filtered = filterDept ? doctors.filter(d => d.specialty === filterDept) : doctors;
      
      if (filtered.length === 0) {
        const noDocsMsg = this.lang === 'gu' ? "હાલમાં આ વિભાગમાં કોઈ ડોકટરો ઉપલબ્ધ નથી." : (this.lang === 'hi' ? "वर्तमान में इस विभाग में कोई डॉक्टर उपलब्ध नहीं हैं।" : "No doctors are currently available in this department.");
        this.renderMessage(noDocsMsg);
        this.showMenu();
        return;
      }

      this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].doctor_status_title);

      const statusTranslations = {
        en: { Available: "Available", Busy: "Busy", "Running Late": "Running Late", "Left Hospital": "Left Hospital", status: "Status", fee: "Fee", exp: "Experience" },
        gu: { Available: "ઉપલબ્ધ", Busy: "વ્યસ્ત", "Running Late": "મોડું દોડે છે", "Left Hospital": "હોસ્પિટલ છોડી દીધી", status: "સ્થિતિ", fee: "ફી", exp: "અનુભવ" },
        hi: { Available: "उपलब्ध", Busy: "व्यस्त", "Running Late": "देरी से चल रहे हैं", "Left Hospital": "अस्पताल से चले गए", status: "स्थिति", fee: "शुल्क", exp: "अनुभव" }
      };
      const t = statusTranslations[this.lang];

      filtered.forEach(doc => {
        const card = document.createElement("div");
        card.className = "chatbot-card chatbot-doc-card";
        
        // Get reviews rating safely
        const allReviews = JSON.parse(localStorage.getItem("phh_reviews")) || [];
        const docReviews = allReviews.filter(r => r && (String(r.doctorId) === String(doc.id) || String(r.doctor_id) === String(doc.id)));
        let ratingText = "New (5.0)";
        if (docReviews.length > 0) {
          const sum = docReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
          ratingText = `${(sum / docReviews.length).toFixed(1)} ★`;
        }

        // Determine availability
        let statusClass = "text-emerald-600";
        if (doc.status === "Busy") statusClass = "text-rose-600";
        else if (doc.status === "Running Late") statusClass = "text-amber-500";
        else if (doc.status === "Left Hospital") statusClass = "text-slate-400";

        const translatedStatus = t[doc.status] || doc.status;
        const docExperience = doc.exp || (this.lang === 'gu' ? "૧૦+ વર્ષ" : (this.lang === 'hi' ? "10+ वर्ष" : "10+ Yrs"));
        const bookBtnLabel = this.lang === 'gu' ? "📅 મુલાકાત બુક કરો" : (this.lang === 'hi' ? "📅 अपॉइंटमेंट बुक करें" : "📅 Book Appointment");

        card.innerHTML = `
          <div class="chatbot-doc-header">
            <div class="chatbot-doc-avatar">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="rgba(0,102,255,0.08)" stroke="#cbd5e1" stroke-width="2"/>
                <path d="M50,22 C58,22 65,29 65,37 C65,45 58,52 50,52 C42,52 35,45 35,37 C35,29 42,22 50,22 Z" fill="#475569"/>
                <path d="M22,78 C22,64 34,58 50,58 C66,58 78,64 78,78 Z" fill="#64748b"/>
              </svg>
            </div>
            <div class="chatbot-doc-info">
              <span class="chatbot-doc-name">${doc.name}</span>
              <span class="chatbot-doc-dept">${this.getTranslatedDept(doc.specialty)}</span>
            </div>
          </div>
          <div class="chatbot-doc-meta">
            <div><i class="fa-solid fa-graduation-cap"></i> <strong>${t.exp}:</strong> ${docExperience}</div>
            <div><i class="fa-solid fa-star"></i> <strong>Rating:</strong> ${ratingText}</div>
            <div><i class="fa-solid fa-wallet"></i> <strong>${t.fee}:</strong> ₹${doc.fee}</div>
            <div><i class="fa-solid fa-calendar-days"></i> <strong>Days:</strong> ${doc.days || 'Mon-Sat'}</div>
            <div class="${statusClass} font-semibold">
              <i class="fa-solid fa-circle-info"></i> <strong>${t.status}:</strong> ${translatedStatus}
            </div>
          </div>
          <button class="chatbot-doc-btn">${bookBtnLabel}</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
          this.booking.dept = doc.specialty;
          this.booking.doctor = doc;
          this.startBooking(doc.specialty, doc);
        });

        this.messagesContainer.appendChild(card);
      });

      this.scrollToBottom();
      this.showMenuButton();
    }, 700);
  }

  showDoctorFees() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const feeLabel = this.lang === 'gu' ? "ડોક્ટર પરામર્શ ફી:" : (this.lang === 'hi' ? "डॉक्टर परामर्श शुल्क:" : "Doctor Consultation Fees:");
      let text = `<strong><i class="fa-solid fa-wallet text-primary"></i> ${feeLabel}</strong><br><br>`;
      doctors.forEach(doc => {
        text += `• ${doc.name} (${this.getTranslatedDept(doc.specialty)}): <strong>₹${doc.fee}</strong><br>`;
      });
      this.renderMessage(text, "assistant", true);
      this.showMenuButton();
    }, 500);
  }

  showNavigationMenu() {
    this.showTyping();
    this.state = "nav";
    setTimeout(() => {
      this.hideTyping();
      this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].nav_facility_prompt);
      
      const areas = ["ICU", "Emergency", "Cardiology", "Orthopedics", "Pediatrics", "Gynecology"];
      const areaIcons = {
        "ICU": '<i class="fa-solid fa-bed-pulse text-indigo-500"></i>',
        "Emergency": '<i class="fa-solid fa-truck-medical text-rose-500"></i>',
        "Cardiology": '<i class="fa-solid fa-heart-pulse text-rose-500"></i>',
        "Orthopedics": '<i class="fa-solid fa-bone text-amber-600"></i>',
        "Pediatrics": '<i class="fa-solid fa-baby text-sky-500"></i>',
        "Gynecology": '<i class="fa-solid fa-venus text-pink-500"></i>'
      };

      this.suggestionsContainer.innerHTML = "";
      
      areas.forEach(area => {
        const chip = document.createElement("button");
        chip.className = "chatbot-chip";
        chip.innerHTML = `${areaIcons[area] || '<i class="fa-solid fa-hospital"></i>'} <span>${area}</span>`;
        chip.addEventListener("click", () => {
          this.renderMessage(area, "user");
          this.showHospitalDirections(area);
        });
        this.suggestionsContainer.appendChild(chip);
      });
      
      this.showMenuButton();
    }, 500);
  }

  showHospitalDirections(facility) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      const directions = HOSPITAL_DIRECTIONS[this.lang][facility] || HOSPITAL_DIRECTIONS[this.lang]["General Medicine"];
      const msg = CHATBOT_TRANSLATIONS[this.lang].nav_directions
        .replace("{facility}", facility)
        .replace("{directions}", directions);
      
      this.renderMessage(msg, "assistant", true);
      this.showMenuButton();
    }, 600);
  }

  startBooking(preselectedDept = "", preselectedDoc = null) {
    this.booking = {
      name: currentUser ? currentUser.name : "",
      dept: preselectedDept,
      doctor: preselectedDoc,
      date: "",
      slot: "",
      symptoms: ""
    };
    
    this.state = "booking";
    
    if (!this.booking.name) {
      this.bookingFlowStep("name");
    } else if (!this.booking.dept) {
      this.bookingFlowStep("dept");
    } else if (!this.booking.doctor) {
      this.bookingFlowStep("doctor");
    } else {
      this.bookingFlowStep("date");
    }
  }

  bookingFlowStep(step) {
    this.showTyping();
    this.suggestionsContainer.innerHTML = "";

    setTimeout(() => {
      this.hideTyping();

      if (step === "name") {
        this.state = "booking_name";
        this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].booking_step_name);
        
        // Prefill option if user is logged in
        if (currentUser) {
          const chip = document.createElement("button");
          chip.className = "chatbot-chip";
          chip.innerHTML = `<i class="fa-solid fa-user"></i> <span>${currentUser.name}</span>`;
          chip.addEventListener("click", () => {
            this.renderMessage(currentUser.name, "user");
            this.booking.name = currentUser.name;
            this.bookingFlowStep("dept");
          });
          this.suggestionsContainer.appendChild(chip);
        }
      } 
      
      else if (step === "dept") {
        this.state = "booking_dept";
        const msg = CHATBOT_TRANSLATIONS[this.lang].booking_step_dept.replace("{name}", this.booking.name);
        this.renderMessage(msg);
        
        // Fetch departments dynamically
        const depts = JSON.parse(localStorage.getItem("phh_departments")) || [
          { name: "General Medicine" }, { name: "Cardiology" }, { name: "Neurology" },
          { name: "Pulmonology" }, { name: "Orthopedics" }, { name: "Gynecology" },
          { name: "Pediatrics" }, { name: "Dermatology" }, { name: "ENT" }, { name: "Psychology" }
        ];

        depts.forEach(d => {
          const chip = document.createElement("button");
          chip.className = "chatbot-chip";
          chip.innerHTML = `<i class="fa-solid fa-stethoscope text-primary"></i> <span>${this.getTranslatedDept(d.name)}</span>`;
          chip.addEventListener("click", () => {
            this.renderMessage(this.getTranslatedDept(d.name), "user");
            this.booking.dept = d.name;
            this.bookingFlowStep("doctor");
          });
          this.suggestionsContainer.appendChild(chip);
        });
      } 
      
      else if (step === "doctor") {
        this.state = "booking_doc";
        this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].booking_step_doc);
        
        const filteredDocs = doctors.filter(d => d.specialty === this.booking.dept);
        if (filteredDocs.length === 0) {
          const noDocsMsg = this.lang === 'gu' ? "આ વિભાગમાં કોઈ ડોકટરો ઉપલબ્ધ નથી." : (this.lang === 'hi' ? "इस विभाग में कोई डॉक्टर उपलब्ध नहीं हैं।" : "No specialists are available in this department.");
          this.renderMessage(noDocsMsg);
          this.showMenu();
          return;
        }

        filteredDocs.forEach(doc => {
          const chip = document.createElement("button");
          chip.className = "chatbot-chip";
          chip.innerHTML = `<i class="fa-solid fa-user-doctor text-primary"></i> <span>${doc.name}</span>`;
          chip.addEventListener("click", () => {
            this.renderMessage(doc.name, "user");
            this.booking.doctor = doc;
            this.bookingFlowStep("date");
          });
          this.suggestionsContainer.appendChild(chip);
        });
      } 
      
      else if (step === "date") {
        this.state = "booking_date";
        this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].booking_step_date);
        
        // Load available slots dynamically from local sync
        const now = new Date();
        const availableSlots = slots.filter(s => {
          if (s.doctorId !== this.booking.doctor.id || s.status !== "Available") return false;
          const slotTimeObj = parseSlotEndDateTime(s.date, s.time);
          return slotTimeObj > now;
        });

        if (availableSlots.length === 0) {
          this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].no_slots_available);
          this.showMenu();
          return;
        }

        const uniqueDates = [...new Set(availableSlots.map(s => s.date))].sort();
        uniqueDates.forEach(d => {
          const chip = document.createElement("button");
          chip.className = "chatbot-chip";
          chip.innerHTML = `<i class="fa-solid fa-calendar-day"></i> <span>${d}</span>`;
          chip.addEventListener("click", () => {
            this.renderMessage(d, "user");
            this.booking.date = d;
            this.bookingFlowStep("slot");
          });
          this.suggestionsContainer.appendChild(chip);
        });
      } 
      
      else if (step === "slot") {
        this.state = "booking_slot";
        this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].booking_step_slot);

        // Fetch slots for this doctor and chosen date
        const slotRecord = slots.find(s => s.doctorId === this.booking.doctor.id && s.date === this.booking.date && s.status === "Available");
        if (!slotRecord || !slotRecord.time) {
          this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].no_slots_available);
          this.showMenu();
          return;
        }

        // Split multiple times (comma-separated or single)
        const times = slotRecord.time.split(',').map(t => t.trim());
        times.forEach(timeVal => {
          const chip = document.createElement("button");
          chip.className = "chatbot-chip";
          chip.innerHTML = `<i class="fa-solid fa-clock"></i> <span>${timeVal}</span>`;
          chip.addEventListener("click", () => {
            this.renderMessage(timeVal, "user");
            this.booking.slot = timeVal;
            this.bookingFlowStep("symptoms");
          });
          this.suggestionsContainer.appendChild(chip);
        });
      } 
      
      else if (step === "symptoms") {
        this.state = "booking_symptoms";
        this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].booking_step_symptoms);
        
        // common suggestions with icons
        const symOptions = {
          en: [
            { text: "General Checkup", icon: '<i class="fa-solid fa-stethoscope"></i>' },
            { text: "Cough/Fever", icon: '<i class="fa-solid fa-temperature-high text-orange-500"></i>' },
            { text: "Routine Review", icon: '<i class="fa-solid fa-clipboard-check text-emerald-500"></i>' },
            { text: "Pain consultation", icon: '<i class="fa-solid fa-hand-holding-medical text-amber-500"></i>' }
          ],
          gu: [
            { text: "સામાન્ય તપાસ", icon: '<i class="fa-solid fa-stethoscope"></i>' },
            { text: "તાવ/ઉધરસ", icon: '<i class="fa-solid fa-temperature-high text-orange-500"></i>' },
            { text: "નિયમિત ચેકઅપ", icon: '<i class="fa-solid fa-clipboard-check text-emerald-500"></i>' },
            { text: "દુખાવાની સલાહ", icon: '<i class="fa-solid fa-hand-holding-medical text-amber-500"></i>' }
          ],
          hi: [
            { text: "सामान्य जांच", icon: '<i class="fa-solid fa-stethoscope"></i>' },
            { text: "बुखार/खांसी", icon: '<i class="fa-solid fa-temperature-high text-orange-500"></i>' },
            { text: "नियमित जांच", icon: '<i class="fa-solid fa-clipboard-check text-emerald-500"></i>' },
            { text: "दर्द परामर्श", icon: '<i class="fa-solid fa-hand-holding-medical text-amber-500"></i>' }
          ]
        };

        symOptions[this.lang].forEach(so => {
          const chip = document.createElement("button");
          chip.className = "chatbot-chip";
          chip.innerHTML = `${so.icon} <span>${so.text}</span>`;
          chip.addEventListener("click", () => {
            this.renderMessage(so.text, "user");
            this.booking.symptoms = so.text;
            this.bookingFlowStep("summary");
          });
          this.suggestionsContainer.appendChild(chip);
        });
      } 
      
      else if (step === "summary") {
        this.state = "booking_confirm";
        this.suggestionsContainer.innerHTML = "";
        
        const card = document.createElement("div");
        card.className = "chatbot-card chatbot-booking-card";
        
        const detailsText = CHATBOT_TRANSLATIONS[this.lang].booking_summary
          .replace("{name}", this.booking.name)
          .replace("{doc}", this.booking.doctor.name)
          .replace("{dept}", this.getTranslatedDept(this.booking.dept))
          .replace("{date}", this.booking.date)
          .replace("{slot}", this.booking.slot)
          .replace("{fee}", this.booking.doctor.fee);

        card.innerHTML = `
          <div class="chatbot-booking-title">${CHATBOT_TRANSLATIONS[this.lang].booking_summary_title}</div>
          <div class="chatbot-booking-details">${detailsText}</div>
          <button class="chatbot-booking-pay-btn">${CHATBOT_TRANSLATIONS[this.lang].btn_pay_confirm}</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
          this.launchPayment();
        });

        this.messagesContainer.appendChild(card);
        this.scrollToBottom();
      }
    }, 600);
  }

  launchPayment() {
    this.showTyping();
    this.suggestionsContainer.innerHTML = "";

    const apptData = {
      name: this.booking.name,
      phone: currentUser ? currentUser.phone : "9999988888",
      email: currentUser ? currentUser.email : "patient@chatbot.com",
      dept: this.booking.dept,
      docId: this.booking.doctor.id,
      date: this.booking.date,
      slot: this.booking.slot,
      symptoms: this.booking.symptoms || "Booked via assistant chatbot"
    };

    window.launchRazorpayPayment(apptData)
      .then(newAppt => {
        this.hideTyping();
        
        const successMsg = CHATBOT_TRANSLATIONS[this.lang].booking_success.replace("{id}", newAppt.id);
        this.renderMessage(successMsg, "assistant");
        
        this.state = "idle";
        this.showMenuButton();
      })
      .catch(err => {
        this.hideTyping();
        const failMsg = CHATBOT_TRANSLATIONS[this.lang].booking_fail.replace("{error}", err ? (err.message || "Payment cancelled") : "Payment cancelled");
        this.renderMessage(failMsg, "assistant");
        
        this.state = "idle";
        this.showMenuButton();
      });
  }

  showHealthTips() {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      const tipsList = HEALTH_TIPS[this.lang];
      const randomIndex = Math.floor(Math.random() * tipsList.length);
      const randomTip = tipsList[randomIndex];
      
      const card = document.createElement("div");
      card.className = "chatbot-card";
      card.innerHTML = `
        <h4 style="font-weight: 700; color: var(--primary); font-size: 0.88rem; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-heart-pulse text-rose-500"></i> ${CHATBOT_TRANSLATIONS[this.lang].health_tips_title}
        </h4>
        <p style="font-size: 0.84rem; line-height: 1.45; color: var(--text-secondary); margin: 0;">
          ${randomTip}
        </p>
      `;
      
      this.messagesContainer.appendChild(card);
      this.scrollToBottom();
      this.showMenuButton();
    }, 500);
  }

  startQuiz() {
    this.showTyping();
    this.state = "quiz";
    this.quiz.currentQuestion = 0;
    this.quiz.score = 0;

    setTimeout(() => {
      this.hideTyping();
      this.renderMessage(CHATBOT_TRANSLATIONS[this.lang].quiz_welcome);
      
      this.suggestionsContainer.innerHTML = "";
      const startBtn = document.createElement("button");
      startBtn.className = "chatbot-chip";
      startBtn.innerHTML = `<i class="fa-solid fa-play text-emerald-500"></i> <span>${CHATBOT_TRANSLATIONS[this.lang].quiz_ready_btn}</span>`;
      startBtn.addEventListener("click", () => {
        this.renderQuizQuestion();
      });
      this.suggestionsContainer.appendChild(startBtn);
      
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "chatbot-chip";
      cancelBtn.innerHTML = `<i class="fa-solid fa-xmark text-rose-500"></i> <span>${this.lang === 'gu' ? "રદ કરો" : (this.lang === 'hi' ? "रद्द करें" : "Cancel")}</span>`;
      cancelBtn.addEventListener("click", () => this.showMenu());
      this.suggestionsContainer.appendChild(cancelBtn);
    }, 600);
  }

  renderQuizQuestion() {
    this.showTyping();
    this.suggestionsContainer.innerHTML = "";
    
    setTimeout(() => {
      this.hideTyping();
      
      const questionsList = HEALTH_QUIZ[this.lang];
      const qObj = questionsList[this.quiz.currentQuestion];
      
      const card = document.createElement("div");
      card.className = "chatbot-card chatbot-quiz-card";
      
      let optionsHtml = "";
      qObj.o.forEach((opt, idx) => {
        optionsHtml += `<button class="chatbot-quiz-opt-btn" data-index="${idx}">${opt}</button>`;
      });

      const qLabel = this.lang === 'gu' ? "પ્રશ્ન" : (this.lang === 'hi' ? "प्रश्न" : "Question");
      const ofLabel = this.lang === 'gu' ? "માંથી" : (this.lang === 'hi' ? "में से" : "of");

      card.innerHTML = `
        <div class="chatbot-quiz-title">${qLabel} ${this.quiz.currentQuestion + 1} ${ofLabel} 3:</div>
        <p style="font-size:0.86rem; font-weight:600; color:var(--dark); margin:6px 0;">${qObj.q}</p>
        <div class="chatbot-quiz-options">${optionsHtml}</div>
      `;

      card.querySelectorAll(".chatbot-quiz-opt-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const selectedIdx = parseInt(e.target.getAttribute("data-index"));
          this.handleQuizAnswer(selectedIdx, qObj);
        });
      });

      this.messagesContainer.appendChild(card);
      this.scrollToBottom();
    }, 500);
  }

  handleQuizAnswer(selectedIndex, qObj) {
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      
      const isCorrect = selectedIndex === qObj.a;
      if (isCorrect) {
        this.quiz.score++;
      }

      this.renderMessage(qObj.r);

      this.quiz.currentQuestion++;
      const questionsList = HEALTH_QUIZ[this.lang];
      
      if (this.quiz.currentQuestion < questionsList.length) {
        this.renderQuizQuestion();
      } else {
        // Quiz completed
        this.showTyping();
        setTimeout(() => {
          this.hideTyping();
          const scoreMsg = this.lang === 'gu' 
            ? `ક્વિઝ પૂર્ણ! તમારો સ્કોર: **${this.quiz.score}/3**.`
            : (this.lang === 'hi' ? `क्विज़ पूरा हुआ! आपका स्कोर: **${this.quiz.score}/3**।` : `Quiz complete! Your score: **${this.quiz.score}/3**.`);
          this.renderMessage(scoreMsg);
          this.state = "idle";
          this.showMenuButton();
        }, 500);
      }
    }, 600);
  }
}
