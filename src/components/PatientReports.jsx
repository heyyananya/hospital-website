import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function PatientReports() {
  const navigate = useNavigate();
  
  // Date selection state (default to current date in YYYY-MM-DD format)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Track last selected calendar date to fall back to when toggling off "All Dates"
  const [lastSelectedDate, setLastSelectedDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [appointments, setAppointments] = useState([]);
  const [statistics, setStatistics] = useState({ total: 0, confirmed: 0, cancelled: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('oldest');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Load departments and doctors list for filter dropdowns
  const [doctorsList, setDoctorsList] = useState([]);
  const [deptsList, setDeptsList] = useState([]);

  // Helper to format date cleanly as "DayName, DD MonthName YYYY"
  const formatDateExtended = (dateStr) => {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts.map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const weekday = weekdays[dateObj.getDay()];
    const monthName = months[dateObj.getMonth()];
    
    return `${weekday}, ${day} ${monthName} ${year}`;
  };

  const sortAppointments = (appts, order) => {
    return [...appts].sort((a, b) => {
      // Compare Dates
      if (a.date !== b.date) {
        return order === 'newest'
          ? b.date.localeCompare(a.date)
          : a.date.localeCompare(b.date);
      }
      // Compare Time Slots (start hour)
      const parseTime = (slotStr) => {
        if (!slotStr) return 0;
        const startPart = slotStr.split('-')[0].trim();
        const match = startPart.match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const minutes = match[2] ? parseInt(match[2], 10) : 0;
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      const timeA = parseTime(a.slot);
      const timeB = parseTime(b.slot);
      return order === 'newest' ? timeB - timeA : timeA - timeB;
    });
  };

  // Fetch report data
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('phh_jwt_token');
    
    if (!token) {
      alert('Unauthorized session. Redirecting to login.').then(() => {
        window.location.href = 'portal-login.html';
      });
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 1. Fetch appointments for selected date
      const apptRes = await fetch(`/api/reports/date/${selectedDate}`, { headers });
      const apptData = await apptRes.json();

      if (apptRes.status === 401 || apptRes.status === 403) {
        alert('Your session has expired. Please log in again.').then(() => {
          localStorage.removeItem('phh_current_user');
          localStorage.removeItem('phh_jwt_token');
          window.location.href = 'portal-login.html';
        });
        return;
      }

      // 2. Fetch statistics for selected date
      const statsRes = await fetch(`/api/reports/statistics/${selectedDate}`, { headers });
      const statsData = await statsRes.json();

      if (apptData.success) {
        setAppointments(apptData.appointments);
      }
      if (statsData.success) {
        setStatistics(statsData.statistics);
      }

      // 3. Load doctors & depts for filters if not already loaded
      if (doctorsList.length === 0) {
        const docRes = await fetch('/api/doctors');
        const docData = await docRes.json();
        if (docData.success) setDoctorsList(docData.doctors);

        const deptRes = await fetch('/api/departments');
        const deptData = await deptRes.json();
        if (deptData.success) setDeptsList(deptData.departments);
      }

    } catch (err) {
      console.error('Error fetching reports data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1); // reset to page 1 on date change
  }, [selectedDate]);

  // Local filtering logic
  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch = 
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.patientPhone.includes(searchQuery) ||
      (app.patientEmail && app.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDoctor = doctorFilter === '' || app.doctorName === doctorFilter;
    const matchesDept = deptFilter === '' || app.dept === deptFilter;
    const matchesStatus = 
      statusFilter === '' || 
      (statusFilter === 'Pending' && (app.status === 'Pending' || !app.status)) ||
      app.status === statusFilter;

    const isPaid = !!app.payId;
    const matchesPayment = 
      paymentFilter === '' ||
      (paymentFilter === 'Paid' && isPaid) ||
      (paymentFilter === 'Unpaid' && !isPaid);

    return matchesSearch && matchesDoctor && matchesDept && matchesStatus && matchesPayment;
  });

  const sortedFilteredAppointments = sortAppointments(filteredAppointments, sortOrder);

  // Pagination slicing
  const totalPages = Math.ceil(sortedFilteredAppointments.length / pageSize);
  const paginatedAppointments = sortedFilteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV Export handler
  const handleExportCSV = () => {
    if (sortedFilteredAppointments.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = [
      'Sr No',
      'Patient Name',
      'Mobile Number',
      'Department',
      'Doctor Name',
      'Appointment Date',
      'Appointment Time',
      'Booking Status',
      'Payment Status'
    ];

    const rows = sortedFilteredAppointments.map((app, index) => [
      index + 1,
      app.patientName,
      app.patientPhone,
      app.dept,
      app.doctorName,
      formatDateExtended(app.date),
      app.slot,
      app.status || 'Pending',
      app.payId ? 'Paid' : 'Unpaid'
    ]);

    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      [headers.join(',')].concat(rows.map(e => e.map(val => `"${val ? val.toString().replace(/"/g, '""') : ''}"`).join(','))).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daily_Patient_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Browser Print handler
  const handlePrint = () => {
    window.print();
  };

  // jsPDF autoTable PDF Generator
  const handleDownloadPDF = async () => {
    if (appointments.length === 0) {
      alert('No patient records found for the selected date to generate PDF.');
      return;
    }

    setExportLoading(true);
    const token = localStorage.getItem('phh_jwt_token');

    try {
      const response = await fetch(`/api/reports/export/${selectedDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || 'Failed to download report data.');
        return;
      }

      const { hospital, generatedBy, statistics: pdfStats, appointments: pdfAppts } = data;

      // Filter PDF appointments using same local filters as on-screen
      const filteredPdfAppts = pdfAppts.filter((app) => {
        const matchesSearch = 
          app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.patientPhone.includes(searchQuery) ||
          (app.patientEmail && app.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesDoctor = doctorFilter === '' || app.doctorName === doctorFilter;
        const matchesDept = deptFilter === '' || app.dept === deptFilter;
        const matchesStatus = 
          statusFilter === '' || 
          (statusFilter === 'Pending' && (app.status === 'Pending' || !app.status)) ||
          app.status === statusFilter;

        const isPaid = !!app.payId;
        const matchesPayment = 
          paymentFilter === '' ||
          (paymentFilter === 'Paid' && isPaid) ||
          (paymentFilter === 'Unpaid' && !isPaid);

        return matchesSearch && matchesDoctor && matchesDept && matchesStatus && matchesPayment;
      });

      // Compute statistics based on filtered appointments
      const totalFiltered = filteredPdfAppts.length;
      const confirmedFiltered = filteredPdfAppts.filter(a => a.status === 'Confirmed').length;
      const cancelledFiltered = filteredPdfAppts.filter(a => a.status === 'Cancelled').length;
      const pendingFiltered = filteredPdfAppts.filter(a => !a.status || a.status === 'Pending').length;

      // 1. Setup jsPDF A4 layout
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const formattedReportDate = selectedDate === 'all'
        ? 'All Scheduled Dates'
        : formatDateExtended(selectedDate);

      const formattedGenTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      // 2. Hospital vector logo drawing (Primary Blue circle with white cross emblem)
      doc.setFillColor(0, 102, 255);
      doc.circle(20, 22, 9, 'F');
      doc.setFillColor(255, 255, 255);
      doc.rect(18.5, 16.5, 3, 11, 'F');
      doc.rect(14.5, 20.5, 11, 3, 'F');

      // 3. Hospital Address details (Enterprise header)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(hospital.name, 33, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(hospital.address, 33, 23);
      doc.text(`Contact: ${hospital.contact}  |  Email: ${hospital.email}`, 33, 27);
      doc.text(`Website: ${hospital.website}`, 33, 31);

      // Header Divider Line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.line(10, 36, 200, 36);

      // 4. Report details title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(0, 102, 255); // primary blue
      const statusSuffix = statusFilter ? ` - ${statusFilter.toUpperCase()}` : '';
      doc.text(`DAILY PATIENT REPORT${statusSuffix}`, 10, 45);

      // 5. Metadata box (clean gray card container)
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.rect(10, 49, 190, 24, 'FD'); // 190 width, 24 height

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text('Report For Date:', 15, 55);
      doc.text('Generated On:', 15, 61);
      doc.text('Generated By:', 15, 67);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(formattedReportDate, 47, 55);
      doc.text(formattedGenTime, 47, 61);
      doc.text(generatedBy, 47, 67);

      // Metrics Summary section inside metadata container
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(71, 85, 105);
      doc.text('Summary Metrics:', 130, 55);

      doc.setFont('helvetica', 'normal');
      doc.text(`Total Patients:  ${totalFiltered}`, 135, 60);
      doc.text(`Confirmed:      ${confirmedFiltered}`, 135, 64);
      doc.text(`Cancelled:      ${cancelledFiltered}`, 135, 68);
      doc.text(`Pending:        ${pendingFiltered}`, 135, 72);

      // 6. Sort PDF appointments matching on-screen sorting order
      const sortedPdfAppts = sortAppointments(filteredPdfAppts, sortOrder);

      // 7. Map rows for jsPDF autoTable
      const tableRows = sortedPdfAppts.map((app, index) => [
        index + 1,
        app.patientName,
        app.patientPhone,
        app.dept,
        app.doctorName,
        formatDateExtended(app.date),
        app.slot,
        app.status || 'Pending',
        app.payId ? 'Paid' : 'Unpaid'
      ]);

      // 8. AutoTable execution
      autoTable(doc, {
        startY: 79,
        head: [
          ['Sr No', 'Patient Name', 'Mobile Number', 'Department', 'Doctor Name', 'Appointment Date', 'Appointment Time', 'Booking Status', 'Payment Status']
        ],
        body: tableRows,
        theme: 'striped',
        headStyles: {
          fillColor: [0, 102, 255],
          textColor: [255, 255, 255],
          fontSize: 7.5,
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle'
        },
        bodyStyles: {
          fontSize: 7,
          textColor: [15, 23, 42],
          valign: 'middle'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },    // Sr No
          5: { halign: 'center', cellWidth: 32 },   // Appointment Date
          7: { halign: 'center', cellWidth: 20 },   // Booking Status
          8: { halign: 'center', cellWidth: 18 }    // Payment Status
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { top: 38, bottom: 20, left: 10, right: 10 },
        
        // Watermark, header and footer renderer on pages
        didDrawPage: (data) => {
          // A. Draw large background watermark centered on A4 (105mm x 148.5mm)
          doc.setFillColor(248, 250, 255); // very faint blue
          doc.circle(105, 148.5, 35, 'F');
          doc.setFillColor(255, 255, 255); // white
          doc.rect(101, 123.5, 8, 50, 'F');
          doc.rect(80, 144.5, 50, 8, 'F');

          // B. Page Headers for page 2+
          if (data.pageNumber > 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(10, 10, 190, 15, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(0, 102, 255);
            doc.text('Superspeciality Doctors Consultation - Daily Patient Report', 15, 19.5);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text(`Date: ${formattedReportDate}`, 165, 19.5);
            
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(10, 28, 200, 28);
          }

          // C. Page Footer on all pages
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(148, 163, 184); // slate-400
          doc.text('Generated by Hospital Management ERP  |  Confidential Medical Report', 10, 285);
          
          const pageNum = `Page ${data.pageNumber}`;
          doc.text(pageNum, 200 - doc.getTextWidth(pageNum), 285);
        },

        // Color coding status texts inside cells
        willDrawCell: (data) => {
          if (data.row.type === 'body') {
            if (data.column.index === 7) { // Booking Status
              const status = data.cell.raw;
              if (status === 'Confirmed') {
                data.cell.styles.textColor = [16, 185, 129]; // Emerald Green
                data.cell.styles.fontStyle = 'bold';
              } else if (status === 'Cancelled') {
                data.cell.styles.textColor = [239, 68, 68]; // Rose Red
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.textColor = [245, 158, 11]; // Amber Yellow
                data.cell.styles.fontStyle = 'bold';
              }
            } else if (data.column.index === 8) { // Payment Status
              const pay = data.cell.raw;
              if (pay === 'Paid') {
                data.cell.styles.textColor = [0, 102, 255]; // Royal Blue
                data.cell.styles.fontStyle = 'bold';
              } else {
                data.cell.styles.textColor = [239, 68, 68]; // Unpaid Red
                data.cell.styles.fontStyle = 'bold';
              }
            }
          }
        }
      });

      // 9. Chief Admin Signature Option
      let finalY = 80;
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY;
      } else if (doc.previousAutoTable && doc.previousAutoTable.finalY) {
        finalY = doc.previousAutoTable.finalY;
      }
      
      if (finalY + 35 > 280) {
        doc.addPage();
        finalY = 30;
      }
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.5);
      doc.line(150, finalY + 20, 200, finalY + 20);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Chief Admin', 175, finalY + 25, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Authorized Signature', 175, finalY + 29, { align: 'center' });

      // 10. Download output
      doc.save(`Daily_Patient_Report_${selectedDate}.pdf`);

    } catch (err) {
      console.error('Failed to export PDF:', err);
      alert('Error occurred during PDF generation.');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Print-only CSS insertion */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
            background: transparent !important;
          }
          main, aside, header, #sidebar, .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            display: block !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #e2e8f0 !important;
            padding: 8px !important;
            font-size: 10px !important;
            text-align: center !important;
            color: #000 !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
        }
      `}} />

      {/* Main Workspace for Screen Display */}
      <div className="no-print flex flex-col gap-6">
        
        {/* Upper Date selector & Actions card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-lg shadow-inner">
              <i className="fa-solid fa-calendar-day"></i>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Select Report Date</h3>
              <p className="text-xs text-slate-500">Query and compile patient bookings logs</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto animate-fadeIn">
            <div className="flex gap-2 w-full md:w-auto">
              <input 
                type="date" 
                value={selectedDate === 'all' ? '' : selectedDate}
                onChange={(e) => {
                  const val = e.target.value || 'all';
                  setSelectedDate(val);
                  if (val !== 'all') {
                    setLastSelectedDate(val);
                  }
                }}
                className="py-2.5 px-4 rounded-xl border border-slate-200 outline-none text-sm font-semibold bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 w-full md:w-48"
              />
              <button
                onClick={() => setSelectedDate(prev => prev === 'all' ? lastSelectedDate : 'all')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all shadow-sm ${selectedDate === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'}`}
              >
                All Dates
              </button>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={handlePrint}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
              >
                <i className="fa-solid fa-print"></i>
                <span>Print</span>
              </button>
              
              <button 
                onClick={handleExportCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
              >
                <i className="fa-solid fa-file-csv text-emerald-600"></i>
                <span>Export CSV</span>
              </button>
              
              <button 
                onClick={handleDownloadPDF}
                disabled={exportLoading}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exportLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Patients Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl text-xl">
              <i className="fa-solid fa-hospital-user"></i>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Patients</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : statistics.total}</h4>
            </div>
          </div>

          {/* Confirmed Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xl">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confirmed</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : statistics.confirmed}</h4>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl text-xl">
              <i className="fa-solid fa-circle-pause"></i>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : statistics.pending}</h4>
            </div>
          </div>

          {/* Cancelled Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 duration-200">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl text-xl">
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cancelled</p>
              <h4 className="text-2xl font-black text-slate-900 mt-1">{loading ? '...' : statistics.cancelled}</h4>
            </div>
          </div>

        </div>

        {/* Filters Panel card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <i className="fa-solid fa-filter text-slate-400 text-sm"></i>
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Search & Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search patient name, email..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50 focus:bg-white focus:border-blue-600 transition-all text-slate-700"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400 text-[10px]"></i>
            </div>

            {/* Doctor filter dropdown */}
            <select
              value={doctorFilter}
              onChange={(e) => { setDoctorFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50 focus:bg-white focus:border-blue-600 transition-all text-slate-700"
            >
              <option value="">All Doctors</option>
              {doctorsList.map((doc) => (
                <option key={doc.id} value={doc.name}>{doc.name}</option>
              ))}
            </select>

            {/* Department filter dropdown */}
            <select
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50 focus:bg-white focus:border-blue-600 transition-all text-slate-700"
            >
              <option value="">All Specialties</option>
              {deptsList.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>

            {/* Booking status filter dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50 focus:bg-white focus:border-blue-600 transition-all text-slate-700"
            >
              <option value="">All Booking Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Payment status filter dropdown */}
            <select
              value={paymentFilter}
              onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50 focus:bg-white focus:border-blue-600 transition-all text-slate-700"
            >
              <option value="">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>

            {/* Sorting Order Filter */}
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs bg-slate-50 focus:bg-white focus:border-blue-600 transition-all text-slate-700"
            >
              <option value="oldest">Date: Oldest First</option>
              <option value="newest">Date: Newest First</option>
            </select>
          </div>
        </div>

        {/* Tabular Reports Layout */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider w-16">Sr No</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">Mobile Number</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-500 uppercase tracking-wider">Doctor Name</th>
                  <th className="py-4 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider">Appointment Date</th>
                  <th className="py-4 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider">Appointment Time</th>
                  <th className="py-4 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider">Booking Status</th>
                  <th className="py-4 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  // Skeleton loader rows
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg mx-auto w-6"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg w-28"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg w-24"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg w-20"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg w-24"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg w-24"></div></td>
                      <td className="py-5 px-6"><div className="h-4 bg-slate-100 rounded-lg mx-auto w-16"></div></td>
                      <td className="py-5 px-6"><div className="h-6 bg-slate-100 rounded-full mx-auto w-16"></div></td>
                      <td className="py-5 px-6"><div className="h-6 bg-slate-100 rounded-full mx-auto w-14"></div></td>
                    </tr>
                  ))
                ) : sortedFilteredAppointments.length === 0 ? (
                  // Empty State Message
                  <tr>
                    <td colSpan="9" className="py-12 px-6 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <i className="fa-solid fa-folder-open text-slate-300 text-4xl mb-2"></i>
                        <p className="text-sm font-bold text-slate-800">No patient bookings logged</p>
                        <p className="text-xs text-slate-500">There are no appointments registered on the selected date.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Rendered records
                  paginatedAppointments.map((app, index) => {
                    const serialNo = (currentPage - 1) * pageSize + index + 1;
                    
                    // Booking status color class
                    let bookingBadgeClass = 'bg-amber-50 text-amber-600 border border-amber-100';
                    if (app.status === 'Confirmed') bookingBadgeClass = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                    else if (app.status === 'Cancelled') bookingBadgeClass = 'bg-rose-50 text-rose-600 border border-rose-100';

                    // Payment status color class
                    const isPaid = !!app.payId;
                    const paymentBadgeClass = isPaid
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'bg-rose-50 text-rose-600 border border-rose-100';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="py-4 px-6 text-center text-xs font-bold text-slate-600">{serialNo}</td>
                        <td className="py-4 px-6">
                          <p className="text-xs font-bold text-slate-900">{app.patientName}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{app.patientEmail || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-700">{app.patientPhone}</td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-700">{app.dept}</td>
                        <td className="py-4 px-6 text-xs font-bold text-slate-800">{app.doctorName}</td>
                        <td className="py-4 px-6 text-center text-xs font-bold text-slate-700 whitespace-nowrap">{formatDateExtended(app.date)}</td>
                        <td className="py-4 px-6 text-center text-xs font-semibold text-slate-700">{app.slot}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide ${bookingBadgeClass}`}>
                            {app.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide ${paymentBadgeClass}`}>
                            {isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="py-4 px-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Page {currentPage} of {totalPages} ({sortedFilteredAppointments.length} total records)
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Print-Only Template (hidden on screen, visible during window.print()) */}
      <div id="print-area" className="hidden p-8 font-sans text-black">
        {/* Print Letterhead Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Superspeciality Doctors Consultation</h1>
            <p style={{ fontSize: '10px', color: '#555', margin: '0' }}>Deesa Highway Crossroads, Palanpur, Gujarat - 385001</p>
            <p style={{ fontSize: '10px', color: '#555', margin: '0' }}>Contact: +91 2742 250001 | Email: info@superspecialitydoctors.com</p>
            <p style={{ fontSize: '10px', color: '#555', margin: '0' }}>Website: www.superspecialitydoctors.com</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0066FF', margin: '0 0 5px 0' }}>Daily Patient Report</h2>
            <p style={{ fontSize: '10px', margin: '0' }}><strong>Report Date:</strong> {selectedDate === 'all' ? 'All Scheduled Dates' : formatDateExtended(selectedDate)}</p>
            <p style={{ fontSize: '9px', color: '#777', margin: '3px 0 0 0' }}>Generated On: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Print Summary Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px', padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', margin: '0 0 5px 0', fontWeight: 'bold' }}>Total Patients</p>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>{statistics.total}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#10b981', textTransform: 'uppercase', margin: '0 0 5px 0', fontWeight: 'bold' }}>Confirmed</p>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>{statistics.confirmed}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#f59e0b', textTransform: 'uppercase', margin: '0 0 5px 0', fontWeight: 'bold' }}>Pending</p>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>{statistics.pending}</h3>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#ef4444', textTransform: 'uppercase', margin: '0 0 5px 0', fontWeight: 'bold' }}>Cancelled</p>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>{statistics.cancelled}</h3>
          </div>
        </div>

        {/* Print Patient Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Mobile Number</th>
              <th>Department</th>
              <th>Doctor Name</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Booking Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedFilteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '20px', color: '#777' }}>No appointments registered.</td>
              </tr>
            ) : (
              sortedFilteredAppointments.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{app.patientName}</strong>
                    <br />
                    <span style={{ fontSize: '8px', color: '#666' }}>{app.patientEmail || ''}</span>
                  </td>
                  <td>{app.patientPhone}</td>
                  <td>{app.dept}</td>
                  <td>{app.doctorName}</td>
                  <td>{formatDateExtended(app.date)}</td>
                  <td>{app.slot}</td>
                  <td style={{ fontWeight: 'bold', color: app.status === 'Confirmed' ? '#10b981' : app.status === 'Cancelled' ? '#ef4444' : '#f59e0b' }}>
                    {app.status || 'Pending'}
                  </td>
                  <td style={{ fontWeight: 'bold', color: app.payId ? '#0066FF' : '#ef4444' }}>
                    {app.payId ? 'Paid' : 'Unpaid'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Signature Line */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', pageBreakInside: 'avoid' }}>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ borderBottom: '1px solid #94a3b8', marginBottom: '8px', height: '40px' }}></div>
            <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', margin: '0' }}>Chief Admin</p>
            <p style={{ fontSize: '9px', color: '#94a3b8', margin: '2px 0 0 0' }}>Authorized Signature</p>
          </div>
        </div>

        {/* Print Footer */}
        <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#777' }}>
          <span>Generated by Hospital Administration Software  |  Confidential Medical Report</span>
          <span>Superspeciality Doctors Consultation ERP System</span>
        </div>
      </div>

    </div>
  );
}
