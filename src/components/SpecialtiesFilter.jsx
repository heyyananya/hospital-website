import React, { useState, useEffect } from 'react';

const getDepartmentsList = () => {
  let depts = [];
  try {
    const localDepts = JSON.parse(localStorage.getItem('phh_departments'));
    if (Array.isArray(localDepts) && localDepts.length > 0) {
      depts = localDepts.map(d => d.name);
    }
  } catch (e) {
    console.error('Error reading departments from localStorage:', e);
  }

  // Default fallback list if localStorage is empty
  if (depts.length === 0) {
    depts = [
      'Cardiology',
      'Neurology',
      'Pulmonology',
      'Psychology',
      'Orthopedics',
      'Dermatology',
      'ENT',
      'Pediatrics',
      'Gynecology',
      'General Medicine'
    ];
  }

  // Pin the requested initial specialties so they are always at the start
  const pinned = ['Cardiology', 'Neurology', 'Pulmonology', 'Psychology', 'Orthopedics'];
  
  // Filter out pinned items from the fetched list to avoid duplicates,
  // then gather any remaining/newly added departments
  const remaining = depts.filter(d => !pinned.includes(d));

  // Combine: 'all', then pinned specialties, then remaining ones
  return [
    { id: 'all', defaultLabel: 'All Specialties' },
    ...pinned.map(name => ({ id: name, defaultLabel: name })),
    ...remaining.map(name => ({ id: name, defaultLabel: name }))
  ];
};

export default function SpecialtiesFilter() {
  const [specialties, setSpecialties] = useState(() => getDepartmentsList());
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [lang, setLang] = useState(() => {
    return window.currentLanguage || localStorage.getItem('phh_lang') || 'en';
  });

  useEffect(() => {
    // Hook into the global setLanguage function to know when to translate
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = (selectedLang) => {
      if (typeof originalSetLanguage === 'function') {
        originalSetLanguage(selectedLang);
      }
      setLang(selectedLang);
    };

    // Expose active specialty setter to global scope so search suggestions can trigger it
    window.setActiveSpecialty = (deptName) => {
      setActiveSpecialty(deptName);
      
      // Auto expand if the selected department is in the remaining (collapsed) list
      const index = specialties.findIndex(spec => spec.id === deptName);
      if (index >= 6) {
        setIsExpanded(true);
      }
    };

    // Hook into page synchronization function to reload departments dynamically
    const originalSync = window.performLandingPageSync;
    window.performLandingPageSync = () => {
      if (typeof originalSync === 'function') {
        originalSync();
      }
      setSpecialties(getDepartmentsList());
    };

    return () => {
      window.setLanguage = originalSetLanguage;
      window.performLandingPageSync = originalSync;
      delete window.setActiveSpecialty;
    };
  }, [specialties]);

  const handleSpecialtyClick = (id) => {
    setActiveSpecialty(id);
    
    // Call the global renderDoctorsList function to filter the grid
    if (typeof window.renderDoctorsList === 'function') {
      window.renderDoctorsList(id);
    }
  };

  const getLocalizedLabel = (id, defaultLabel) => {
    if (id === 'all') {
      if (lang === 'gu') return 'તમામ વિભાગો';
      if (lang === 'hi') return 'सभी विभाग';
      return 'All Specialties';
    }
    if (typeof window.getTranslation === 'function') {
      return window.getTranslation(id);
    }
    return defaultLabel;
  };

  const getLocalizedShowMore = () => {
    if (lang === 'gu') return 'વધુ દર્શાવો';
    if (lang === 'hi') return 'और दिखाएं';
    return 'Show More';
  };

  const getLocalizedShowLess = () => {
    if (lang === 'gu') return 'ઓછું દર્શાવો';
    if (lang === 'hi') return 'कम दिखाएं';
    return 'Show Less';
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const initialSpecialties = specialties.slice(0, 6);
  const remainingSpecialties = specialties.slice(6);

  return (
    <div className="flex flex-col items-center gap-[15px] w-full">
      {/* Container for initial specialties and toggle button */}
      <div className="flex flex-wrap justify-center gap-[15px] w-full">
        {initialSpecialties.map((spec) => (
          <button
            key={spec.id}
            onClick={() => handleSpecialtyClick(spec.id)}
            className={`filter-btn active:scale-95 transition-all duration-300 ${
              activeSpecialty === spec.id ? 'active' : ''
            }`}
          >
            {getLocalizedLabel(spec.id, spec.defaultLabel)}
          </button>
        ))}

        {/* Toggle Button inline with first row if there is space, wrapping naturally */}
        {remainingSpecialties.length > 0 && (
          <button
            onClick={toggleExpand}
            className="filter-btn flex items-center gap-2 transition-all duration-300 font-semibold"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? getLocalizedShowLess() : getLocalizedShowMore()}</span>
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-xs transition-transform duration-300`}></i>
          </button>
        )}
      </div>

      {/* Container for remaining specialties that expands smoothly */}
      {remainingSpecialties.length > 0 && (
        <div
          className={`flex flex-wrap justify-center gap-[15px] w-full transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded 
              ? 'max-h-[500px] opacity-100 py-[5px]' 
              : 'max-h-0 opacity-0 py-0 pointer-events-none'
          }`}
        >
          {remainingSpecialties.map((spec) => (
            <button
              key={spec.id}
              onClick={() => handleSpecialtyClick(spec.id)}
              className={`filter-btn active:scale-95 transition-all duration-300 ${
                activeSpecialty === spec.id ? 'active' : ''
              }`}
            >
              {getLocalizedLabel(spec.id, spec.defaultLabel)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
