import React, { useState, useEffect } from 'react';

const getApiBase = () => {
  if (typeof window !== 'undefined' && window.API_BASE !== undefined) {
    return window.API_BASE;
  }
  const h = window.location.hostname;
  const p = window.location.port;
  const local = h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.') || h.startsWith('172.') || h.endsWith('.local');
  return (local && p !== '5000') ? `http://${h}:5000` : '';
};

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    specialty: '',
    exp: '',
    days: '',
    time: '',
    fee: '',
    status: 'Available'
  });
  const [focusedField, setFocusedField] = useState('');
  
  // Custom Form Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Credentials modal state
  const [credModal, setCredModal] = useState({ isOpen: false, username: '', password: '' });
  const [bulkCredModal, setBulkCredModal] = useState({ isOpen: false, list: [] });

  const [departments, setDepartments] = useState([]);

  const loadDoctors = () => {
    try {
      const docs = JSON.parse(localStorage.getItem("phh_doctors")) || [];
      setDoctors(docs);
    } catch (e) {
      console.error("Error loading doctors:", e);
    }
  };

  const loadDepartments = () => {
    try {
      const depts = JSON.parse(localStorage.getItem("phh_departments")) || [];
      setDepartments(depts);
    } catch (e) {
      console.error("Error loading departments in manage docs:", e);
    }
  };

  useEffect(() => {
    loadDoctors();
    loadDepartments();

    const syncAll = () => {
      loadDoctors();
      loadDepartments();
    };

    window.addEventListener("storage", syncAll);
    window.addEventListener("storage_local", syncAll);
    const interval = setInterval(syncAll, 1000);

    return () => {
      window.removeEventListener("storage", syncAll);
      window.removeEventListener("storage_local", syncAll);
      clearInterval(interval);
    };
  }, []);

  // Prevent background scrolling when form modal is open
  useEffect(() => {
    if (isFormModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isFormModalOpen]);

  const saveDoctorsAndSync = async (updatedDocs) => {
    localStorage.setItem("phh_doctors", JSON.stringify(updatedDocs));
    setDoctors(updatedDocs);

    // Direct database sync POST call to ensure instant synchronization
    const apiBase = getApiBase();
    try {
      const response = await fetch(`${apiBase}/api/sync/save-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'phh_doctors',
          data: updatedDocs
        })
      });
      const data = await response.json();
      if (!data.success) {
        console.error('Failed to sync to database:', data.error);
      }
    } catch (err) {
      console.error('Database write sync error:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    let updatedDocs = [...doctors];
    if (formData.id) {
      // Edit mode
      const idx = updatedDocs.findIndex(d => d.id === formData.id);
      if (idx !== -1) {
        updatedDocs[idx] = {
          ...updatedDocs[idx],
          name: formData.name.trim(),
          specialty: formData.specialty,
          exp: formData.exp.trim(),
          days: formData.days.trim(),
          time: formData.time.trim(),
          fee: parseInt(formData.fee) || 0,
          status: formData.status
        };
        if (window.showSuccessToast) window.showSuccessToast("Specialist details updated.");
        else alert("Specialist details updated.");
      }
    } else {
      // Add mode
      const generatedId = "PHH-" + Math.floor(100 + Math.random() * 900);
      const generatedPassword = Math.random().toString(36).slice(-6);

      const newDoc = {
        id: "doc-" + Math.floor(1000 + Math.random() * 9000),
        name: formData.name.trim(),
        specialty: formData.specialty,
        exp: formData.exp.trim(),
        days: formData.days.trim(),
        time: formData.time.trim(),
        fee: parseInt(formData.fee) || 0,
        status: formData.status,
        rating: null,
        username: generatedId,
        password: generatedPassword,
        email: `${generatedId}@hub.com`
      };
      
      updatedDocs.push(newDoc);
      
      // Open credentials modal
      setCredModal({
        isOpen: true,
        username: generatedId,
        password: generatedPassword
      });
    }

    saveDoctorsAndSync(updatedDocs);
    resetForm();
    setIsFormModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      specialty: '',
      exp: '',
      days: '',
      time: '',
      fee: '',
      status: 'Available'
    });
  };

  const openEnrollModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleEditClick = (doc) => {
    setFormData({
      id: doc.id,
      name: doc.name,
      specialty: doc.specialty,
      exp: doc.exp,
      days: doc.days,
      time: doc.time,
      fee: doc.fee,
      status: doc.status
    });
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = async (docId) => {
    console.log('[ManageDoctors] handleDeleteClick called for docId:', docId);
    console.log('[ManageDoctors] Current doctors in state:', doctors);
    const confirmed = await window.customConfirm("Are you sure you want to remove this doctor from records?");
    console.log('[ManageDoctors] customConfirm resolved with confirmed =', confirmed);
    if (confirmed) {
      const updatedDocs = doctors.filter(d => d.id !== docId);
      console.log('[ManageDoctors] Updated doctors list after filtering:', updatedDocs);
      await saveDoctorsAndSync(updatedDocs);
      console.log('[ManageDoctors] LocalStorage set and state updated.');
      if (window.showSuccessToast) window.showSuccessToast("Doctor deleted successfully");
    }
  };

  // CSV Drag and Drop Upload logic
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCSVFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCSVFile(e.target.files[0]);
    }
  };

  const handleCSVFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      if (window.showErrorToast) window.showErrorToast("Invalid file format. Please upload a .csv file.");
      else alert("Invalid file format. Please upload a .csv file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      processCSVData(text);
    };
    reader.onerror = function() {
      if (window.showErrorToast) window.showErrorToast("Error reading file.");
      else alert("Error reading file.");
    };
    reader.readAsText(file);
  };

  const processCSVData = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) {
      if (window.showErrorToast) window.showErrorToast("CSV file is empty.");
      else alert("CSV file is empty.");
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
        status: 'Available',
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
      if (window.showErrorToast) window.showErrorToast("No valid doctor profiles found in CSV file.");
      else alert("No valid doctor profiles found in CSV file.");
      return;
    }

    const mergedDocs = [...doctors, ...importedDoctors];
    saveDoctorsAndSync(mergedDocs);

    setBulkCredModal({
      isOpen: true,
      list: credsList
    });

    if (window.showSuccessToast) window.showSuccessToast(`Successfully imported ${importedDoctors.length} doctors.`);
    else alert(`Successfully imported ${importedDoctors.length} doctors.`);
  };

  const parseCSVLine = (text) => {
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
  };

  const handleCopyCredentials = () => {
    const text = `Doctor ID: ${credModal.username}\nPassword: ${credModal.password}`;
    navigator.clipboard.writeText(text)
      .then(() => {
        if (window.showSuccessToast) window.showSuccessToast("Credentials copied to clipboard!");
        else alert("Credentials copied to clipboard!");
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  const handleCopyBulkCredentials = () => {
    const text = bulkCredModal.list.map(c => `Doctor: ${c.name}\nID: ${c.username}\nPassword: ${c.password}`).join("\n\n");
    navigator.clipboard.writeText(text)
      .then(() => {
        if (window.showSuccessToast) window.showSuccessToast("All imported credentials copied to clipboard!");
        else alert("All imported credentials copied to clipboard!");
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Trigger Card & CSV Importer */}
        <div className="lg:col-span-4 space-y-6 w-full">
          
          {/* Action Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-user-doctor text-blue-600"></i>
              <span>Specialist Management</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enroll new medical practitioners or update credentials and shift details.
            </p>
            <button 
              type="button" 
              onClick={openEnrollModal}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              Enroll Specialist Doctor
            </button>
          </div>

          {/* Bulk CSV Importer */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-file-csv text-blue-600"></i>
              <span>Bulk Import Specialist Doctors</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a CSV file containing doctor profiles to generate active accounts instantly.
            </p>
            
            <div 
              id="csv-drag-zone" 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
                dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
              }`}
              onClick={() => document.getElementById('csv-file-input').click()}
            >
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-600 mb-3 block"></i>
              <p className="text-sm font-bold text-slate-800 mb-1">Drag & Drop CSV file here</p>
              <p className="text-xs text-slate-400 mb-4">or click to select file</p>
              <input 
                type="file" 
                id="csv-file-input" 
                accept=".csv" 
                className="hidden"
                onChange={handleFileChange}
              />
              <button type="button" className="py-1.5 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all duration-150">
                Select File
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 font-mono">
              <i className="fa-solid fa-circle-info text-blue-500"></i> 
              <span>Headers: name, specialty, exp, days, time, fee</span>
            </div>
          </div>

        </div>

        {/* Right Column: Table View */}
        <div className="lg:col-span-8 space-y-6 w-full min-w-0">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">Enrolled Medical Practitioners</h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Specialist</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Department</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Shifts</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[130px]">Availability</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs">Credentials</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase tracking-wider text-xs text-center w-[150px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                        No doctors enrolled yet. Use the registration panel to add specialists.
                      </td>
                    </tr>
                  ) : (
                    doctors.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        {/* Specialist */}
                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-900 leading-none mb-1">{doc.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{doc.exp} Experience</p>
                          </div>
                        </td>
                        
                        {/* Department */}
                        <td className="py-4 px-6 align-middle font-medium text-slate-700">
                          {doc.specialty}
                        </td>
                        
                        {/* Shifts */}
                        <td className="py-4 px-6 align-middle">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-950">{doc.days}</p>
                            <p className="text-xs text-slate-500 font-medium">{doc.time}</p>
                          </div>
                        </td>
                        
                        {/* Availability */}
                        <td className="py-4 px-6 align-middle text-center">
                          <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                            doc.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80' : 
                            doc.status === 'Busy' ? 'bg-rose-50 text-rose-700 border border-rose-200/80' : 
                            doc.status === 'Running Late' ? 'bg-amber-50 text-amber-700 border border-amber-200/80' : 
                            'bg-slate-50 text-slate-700 border border-slate-200/80'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        
                        {/* Credentials */}
                        <td className="py-4 px-6 align-middle">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-slate-500">ID:</span>
                            <code className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                              {doc.username || 'N/A'}
                            </code>
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="py-4 px-6 align-middle text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all duration-150 shadow-sm"
                              onClick={() => handleEditClick(doc)}
                            >
                              Edit
                            </button>
                            <button 
                              className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-all duration-150 shadow-sm"
                              onClick={() => handleDeleteClick(doc.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* DOCTOR ENROLLMENT / EDIT FORM MODAL OVERLAY */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 max-w-lg w-full transform transition-all duration-300 max-h-[90vh] overflow-y-auto relative">
            
            {/* Close Button */}
            <button 
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-150 text-lg cursor-pointer outline-none border-0 bg-transparent"
              onClick={() => setIsFormModalOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <i className="fa-solid fa-user-doctor text-blue-600"></i>
              <span>{formData.id ? `Edit Details: ${formData.name}` : 'Enroll New Specialist Doctor'}</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="space-y-4">
                <div className={`form-group ${formData.name ? 'filled' : ''} ${focusedField === 'name' ? 'focused' : ''}`}>
                  <input 
                    type="text" 
                    id="admin-doc-name" 
                    className="form-control" 
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField('')}
                    required 
                  />
                  <label htmlFor="admin-doc-name" className="floating-label">Doctor Full Name</label>
                </div>

                <div className={`form-group ${formData.specialty ? 'filled' : ''} ${focusedField === 'specialty' ? 'focused' : ''}`}>
                  <select 
                    id="admin-doc-dept" 
                    className="form-control" 
                    value={formData.specialty}
                    onChange={e => handleInputChange('specialty', e.target.value)}
                    onFocus={() => setFocusedField('specialty')}
                    onBlur={() => setFocusedField('')}
                    required
                  >
                    <option value="" disabled></option>
                    {(departments.length > 0 ? departments.map(d => d.name) : [
                      "General Medicine", "Cardiology", "Neurology", "Pulmonology", "Orthopedics",
                      "Gynecology", "Pediatrics", "Dermatology", "ENT", "Psychology"
                    ]).map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <label htmlFor="admin-doc-dept" className="floating-label">Medical Specialty</label>
                </div>

                <div className={`form-group filled ${focusedField === 'exp' ? 'focused' : ''}`}>
                  <input 
                    type="text" 
                    id="admin-doc-exp" 
                    className="form-control" 
                    placeholder="e.g. 10 Years"
                    value={formData.exp}
                    onChange={e => handleInputChange('exp', e.target.value)}
                    onFocus={() => setFocusedField('exp')}
                    onBlur={() => setFocusedField('')}
                    required 
                  />
                  <label htmlFor="admin-doc-exp" className="floating-label" style={{ top: '-10px', fontSize: '0.75rem' }}>Experience Duration</label>
                </div>

                <div className={`form-group ${formData.fee ? 'filled' : ''} ${focusedField === 'fee' ? 'focused' : ''}`}>
                  <input 
                    type="number" 
                    id="admin-doc-fee" 
                    className="form-control" 
                    value={formData.fee}
                    onChange={e => handleInputChange('fee', e.target.value)}
                    onFocus={() => setFocusedField('fee')}
                    onBlur={() => setFocusedField('')}
                    required 
                  />
                  <label htmlFor="admin-doc-fee" className="floating-label">Consultation Fee (₹)</label>
                </div>

                <div className={`form-group filled ${focusedField === 'days' ? 'focused' : ''}`}>
                  <input 
                    type="text" 
                    id="admin-doc-days" 
                    className="form-control" 
                    placeholder="e.g. Monday & Wednesday"
                    value={formData.days}
                    onChange={e => handleInputChange('days', e.target.value)}
                    onFocus={() => setFocusedField('days')}
                    onBlur={() => setFocusedField('')}
                    required 
                  />
                  <label htmlFor="admin-doc-days" className="floating-label" style={{ top: '-10px', fontSize: '0.75rem' }}>Visiting Days</label>
                </div>

                <div className={`form-group filled ${focusedField === 'time' ? 'focused' : ''}`}>
                  <input 
                    type="text" 
                    id="admin-doc-time" 
                    className="form-control" 
                    placeholder="e.g. 10 AM - 1 PM"
                    value={formData.time}
                    onChange={e => handleInputChange('time', e.target.value)}
                    onFocus={() => setFocusedField('time')}
                    onBlur={() => setFocusedField('')}
                    required 
                  />
                  <label htmlFor="admin-doc-time" className="floating-label" style={{ top: '-10px', fontSize: '0.75rem' }}>Shift Hours</label>
                </div>
              </div>

              <div className={`form-group ${formData.status ? 'filled' : ''} ${focusedField === 'status' ? 'focused' : ''}`}>
                <select 
                  id="admin-doc-status" 
                  className="form-control" 
                  value={formData.status}
                  onChange={e => handleInputChange('status', e.target.value)}
                  onFocus={() => setFocusedField('status')}
                  onBlur={() => setFocusedField('')}
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="Running Late">Running Late</option>
                  <option value="Left Hospital">Left Hospital</option>
                </select>
                <label htmlFor="admin-doc-status" className="floating-label">Initial Shift Status</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  className="flex-1 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-all duration-150 shadow-sm" 
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-150 shadow-md shadow-blue-500/10"
                >
                  {formData.id ? 'Save Updates' : 'Enroll Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE CREDENTIALS MODAL */}
      {credModal.isOpen && (
        <div id="credential-modal" className="modal-overlay active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center', padding: '35px', width: '90%', position: 'relative' }}>
            <div style={{ background: 'rgba(0,102,255,0.08)', color: '#0066FF', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem' }}>
              <i className="fa-solid fa-key"></i>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>Credentials Generated</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Use these credentials for doctor workspace login.</p>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '25px', textAlign: 'left', fontFamily: 'monospace', fontSize: '0.95rem' }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Doctor ID:</span>
                <strong style={{ color: '#0f172a' }}>{credModal.username}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Password:</span>
                <strong style={{ color: '#0f172a' }}>{credModal.password}</strong>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={handleCopyCredentials} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <i className="fa-solid fa-copy"></i> Copy
              </button>
              <button className="btn btn-primary" onClick={() => setCredModal({ isOpen: false, username: '', password: '' })} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK CREDENTIALS MODAL */}
      {bulkCredModal.isOpen && (
        <div id="bulk-credential-modal" className="modal-overlay active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '600px', padding: '35px', width: '90%', position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem', flexShrink: 0 }}>
              <i className="fa-solid fa-users-gear"></i>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px', textAlign: 'center' }}>Bulk Import Credentials</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>Accounts successfully provisioned. Please copy or download these credentials.</p>
            
            <div style={{ overflowY: 'auto', flexGrow: 1, marginBottom: '25px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table className="db-table" style={{ margin: 0, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px 15px', fontSize: '0.8rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Doctor Name</th>
                    <th style={{ padding: '10px 15px', fontSize: '0.8rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Username / ID</th>
                    <th style={{ padding: '10px 15px', fontSize: '0.8rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>Generated Password</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkCredModal.list.map((cred, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px 15px', fontSize: '0.85rem' }}><strong>{cred.name}</strong></td>
                      <td style={{ padding: '10px 15px', fontSize: '0.85rem', fontFamily: 'monospace' }}>{cred.username}</td>
                      <td style={{ padding: '10px 15px', fontSize: '0.85rem', fontFamily: 'monospace' }}><code>{cred.password}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
              <button className="btn btn-secondary" onClick={handleCopyBulkCredentials} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                <i className="fa-solid fa-copy"></i> Copy All
              </button>
              <button className="btn btn-primary" onClick={() => setBulkCredModal({ isOpen: false, list: [] })} style={{ flex: 1, padding: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ManageDoctors;
