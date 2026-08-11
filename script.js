/**
 * Student Registration System - Main Logic
 */

// Validation helper object (exposed globally for test.js compatibility)
const ValidationUtils = {
  isValidName: (name) => {
    return typeof name === 'string' && name.trim().length >= 2 && /^[a-zA-Z\s'.]+$/.test(name.trim());
  },

  isValidEmail: (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return typeof email === 'string' && re.test(email.trim());
  },

  isValidMobile: (mobile) => {
    return typeof mobile === 'string' && /^[0-9]{10}$/.test(mobile.trim());
  },

  isValidBranch: (branch) => {
    return typeof branch === 'string' && branch.trim() !== '';
  },

  isValidRegNumber: (regNum) => {
    return typeof regNum === 'string' && /^[a-zA-Z0-9]{4,20}$/.test(regNum.trim());
  },

  calculatePasswordStrength: (password) => {
    if (!password) return { score: 0, text: 'Empty', color: '#64748b', percentage: 0 };
    
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', color: '#ef4444', percentage: 33 };
    if (score <= 3) return { score: 2, text: 'Medium', color: '#f59e0b', percentage: 66 };
    return { score: 3, text: 'Strong', color: '#10b981', percentage: 100 };
  },

  isValidPassword: (password) => {
    return typeof password === 'string' && password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  }
};

// Export for Node environment (test.js) if available
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ValidationUtils;
}

// DOM Interaction logic (Browser mode)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('registrationForm');
    const studentNameInput = document.getElementById('studentName');
    const emailInput = document.getElementById('email');
    const mobileInput = document.getElementById('mobileNumber');
    const branchSelect = document.getElementById('branch');
    const regNumberInput = document.getElementById('regNumber');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const eyeIcon = document.getElementById('eyeIcon');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    const searchInput = document.getElementById('searchInput');
    const branchFilter = document.getElementById('branchFilter');
    const studentTableBody = document.getElementById('studentTableBody');
    const studentCountBadge = document.getElementById('studentCountBadge');
    const emptyState = document.getElementById('emptyState');
    const toastContainer = document.getElementById('toastContainer');

    let studentsList = [];

    // Initialize App Data
    async function initApp() {
      loadFromLocalStorage();
      if (studentsList.length === 0) {
        await loadFromJSON();
      }
      renderStudentTable();
      setupEventListeners();
    }

    // Load initial JSON data
    async function loadFromJSON() {
      try {
        const response = await fetch('students.json');
        if (response.ok) {
          const jsonStudents = await response.json();
          studentsList = jsonStudents;
          saveToLocalStorage();
        }
      } catch (err) {
        console.log('JSON pre-load fallback active (using empty storage or existing entries).');
      }
    }

    // Local Storage Helpers
    function loadFromLocalStorage() {
      const stored = localStorage.getItem('registered_students');
      if (stored) {
        try {
          studentsList = JSON.parse(stored);
        } catch (e) {
          studentsList = [];
        }
      }
    }

    function saveToLocalStorage() {
      localStorage.setItem('registered_students', JSON.stringify(studentsList));
    }

    // Password Toggle Visibility
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.innerHTML = isPassword
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    });

    // Real-time Field Validation Helper
    function validateField(groupElement, isValid, errorMsg) {
      if (isValid) {
        groupElement.classList.remove('invalid');
        groupElement.classList.add('valid');
      } else {
        groupElement.classList.remove('valid');
        groupElement.classList.add('invalid');
      }
      return isValid;
    }

    // Live Password Strength Meter
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      const strength = ValidationUtils.calculatePasswordStrength(val);
      strengthBar.style.width = strength.percentage + '%';
      strengthBar.style.backgroundColor = strength.color;
      strengthText.textContent = `Password Strength: ${strength.text}`;
      strengthText.style.color = strength.color;

      validateField(
        document.getElementById('group-password'),
        ValidationUtils.isValidPassword(val)
      );
    });

    // Attach Input Event Listeners
    studentNameInput.addEventListener('input', () => {
      validateField(document.getElementById('group-studentName'), ValidationUtils.isValidName(studentNameInput.value));
    });

    emailInput.addEventListener('input', () => {
      validateField(document.getElementById('group-email'), ValidationUtils.isValidEmail(emailInput.value));
    });

    mobileInput.addEventListener('input', () => {
      // Only keep numeric input
      mobileInput.value = mobileInput.value.replace(/[^0-9]/g, '');
      validateField(document.getElementById('group-mobileNumber'), ValidationUtils.isValidMobile(mobileInput.value));
    });

    branchSelect.addEventListener('change', () => {
      validateField(document.getElementById('group-branch'), ValidationUtils.isValidBranch(branchSelect.value));
    });

    regNumberInput.addEventListener('input', () => {
      regNumberInput.value = regNumberInput.value.toUpperCase();
      validateField(document.getElementById('group-regNumber'), ValidationUtils.isValidRegNumber(regNumberInput.value));
    });

    // Event listeners setup for search and filter
    function setupEventListeners() {
      searchInput.addEventListener('input', renderStudentTable);
      branchFilter.addEventListener('change', renderStudentTable);

      form.addEventListener('submit', handleFormSubmit);
    }

    // Form Submission Handler
    function handleFormSubmit(e) {
      e.preventDefault();

      const nameVal = studentNameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const mobileVal = mobileInput.value.trim();
      const branchVal = branchSelect.value;
      const regVal = regNumberInput.value.trim().toUpperCase();
      const passVal = passwordInput.value;

      const isNameValid = validateField(document.getElementById('group-studentName'), ValidationUtils.isValidName(nameVal));
      const isEmailValid = validateField(document.getElementById('group-email'), ValidationUtils.isValidEmail(emailVal));
      const isMobileValid = validateField(document.getElementById('group-mobileNumber'), ValidationUtils.isValidMobile(mobileVal));
      const isBranchValid = validateField(document.getElementById('group-branch'), ValidationUtils.isValidBranch(branchVal));
      const isRegValid = validateField(document.getElementById('group-regNumber'), ValidationUtils.isValidRegNumber(regVal));
      const isPassValid = validateField(document.getElementById('group-password'), ValidationUtils.isValidPassword(passVal));

      if (!isNameValid || !isEmailValid || !isMobileValid || !isBranchValid || !isRegValid || !isPassValid) {
        showToast('Please fix all highlighted errors in the form.', 'danger');
        return;
      }

      // Check for duplicate Registration Number or Email
      const duplicateReg = studentsList.some(s => s.regNumber.toUpperCase() === regVal);
      if (duplicateReg) {
        validateField(document.getElementById('group-regNumber'), false);
        showToast(`Registration Number '${regVal}' is already registered!`, 'danger');
        return;
      }

      const duplicateEmail = studentsList.some(s => s.email.toLowerCase() === emailVal.toLowerCase());
      if (duplicateEmail) {
        validateField(document.getElementById('group-email'), false);
        showToast(`Email '${emailVal}' is already registered!`, 'danger');
        return;
      }

      // Create new student object
      const newStudent = {
        id: Date.now(),
        studentName: nameVal,
        email: emailVal,
        mobileNumber: mobileVal,
        branch: branchVal,
        regNumber: regVal,
        registeredAt: new Date().toLocaleString()
      };

      studentsList.unshift(newStudent);
      saveToLocalStorage();
      renderStudentTable();

      showToast(`Student '${nameVal}' successfully registered!`, 'success');

      // Reset Form
      form.reset();
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('valid', 'invalid');
      });
      strengthBar.style.width = '0%';
      strengthText.textContent = 'Password Strength: Empty';
      strengthText.style.color = '#64748b';
    }

    // Render Student Table
    function renderStudentTable() {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filterBranch = branchFilter.value;

      const filtered = studentsList.filter(student => {
        const matchesSearch = 
          student.studentName.toLowerCase().includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm) ||
          student.regNumber.toLowerCase().includes(searchTerm) ||
          student.mobileNumber.includes(searchTerm);

        const matchesBranch = filterBranch === 'ALL' || student.branch === filterBranch;

        return matchesSearch && matchesBranch;
      });

      studentCountBadge.textContent = `${studentsList.length} Registered`;

      if (filtered.length === 0) {
        studentTableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';
      studentTableBody.innerHTML = filtered.map(student => `
        <tr>
          <td><span class="reg-pill">${escapeHTML(student.regNumber)}</span></td>
          <td><strong>${escapeHTML(student.studentName)}</strong></td>
          <td>${escapeHTML(student.email)}</td>
          <td>${escapeHTML(student.mobileNumber)}</td>
          <td><span class="branch-pill">${escapeHTML(student.branch)}</span></td>
          <td>
            <button class="btn-delete" onclick="deleteStudent(${student.id})" title="Delete Record">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </button>
          </td>
        </tr>
      `).join('');
    }

    // Delete Student Handler
    window.deleteStudent = (id) => {
      const student = studentsList.find(s => s.id === id);
      if (!student) return;

      if (confirm(`Are you sure you want to delete registration for ${student.studentName}?`)) {
        studentsList = studentsList.filter(s => s.id !== id);
        saveToLocalStorage();
        renderStudentTable();
        showToast(`Record for '${student.studentName}' deleted.`, 'danger');
      }
    };

    // Helper: Toast Notifications
    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${
          type === 'success'
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
        }</svg>
        <span>${escapeHTML(message)}</span>
      `;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }

    // Helper: Security Escaping
    function escapeHTML(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Run Initialization
    initApp();
  });
}
