// Patrones de validación
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    cellphoneColombia: /^3[0-9]{9}$/,
    phone: /^\d{10,}$/,
    document: /^\d{6,12}$/,
    username: /^[a-zA-Z0-9._]{5,15}$/,
    postalCode: /^\d{6}$/
};

// Estado del formulario
let formState = {
    isValid: false,
    fields: {}
};

// Funciones reutilizables
function setValid(field) {
    const element = document.getElementById(field);
    const errorElement = document.getElementById(`error-${field}`);
    
    if (element) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    formState.fields[field] = true;
}

function setInvalid(field, message) {
    const element = document.getElementById(field);
    const errorElement = document.getElementById(`error-${field}`);
    
    if (element) {
        element.classList.remove('is-valid');
        element.classList.add('is-invalid');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    formState.fields[field] = false;
}

// Validadores por campo
const validators = {
    fullName: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres';
        return null;
    },
    
    email: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (!patterns.email.test(value)) return 'Debe ingresar un correo electrónico válido';
        return null;
    },
    
    password: (value) => {
        if (!value) return 'Este campo es obligatorio';
        if (value.length < 8) return 'Debe tener al menos 8 caracteres';
        if (!patterns.password.test(value)) return 'Debe incluir al menos 1 mayúscula, 1 número y 1 carácter especial';
        return null;
    },
    
    confirmPassword: (value) => {
        const password = document.getElementById('password').value;
        if (!value) return 'Este campo es obligatorio';
        if (value !== password) return 'Las contraseñas no coinciden';
        return null;
    },
    
    birthDate: (value) => {
        if (!value) return 'Este campo es obligatorio';
        const birthDate = new Date(value);
        const today = new Date();
        const age = Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < 18) return 'Debe ser mayor de 18 años';
        return null;
    },
    
    cellphone: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (!patterns.cellphoneColombia.test(value)) return 'Debe ingresar un celular colombiano válido (10 dígitos, empieza con 3)';
        return null;
    },
    
    phone: (value) => {
        if (value && !patterns.phone.test(value)) return 'Debe tener al menos 10 dígitos numéricos';
        return null;
    },
    
    documentType: (value) => {
        if (!value) return 'Este campo es obligatorio';
        return null;
    },
    
    documentNumber: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (!patterns.document.test(value)) return 'Debe tener entre 6 y 12 dígitos';
        return null;
    },
    
    gender: (value) => {
        const selected = document.querySelector('input[name="gender"]:checked');
        if (!selected) return 'Este campo es obligatorio';
        return null;
    },
    
    city: (value) => {
        if (!value) return 'Este campo es obligatorio';
        return null;
    },
    
    otherCity: (value) => {
        const city = document.getElementById('city').value;
        if (city === 'Otra') {
            if (!value.trim()) return 'Este campo es obligatorio cuando selecciona "Otra"';
            if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres';
        }
        return null;
    },
    
    address: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (value.trim().length < 8) return 'Debe tener al menos 8 caracteres';
        return null;
    },
    
    postalCode: (value) => {
        if (value && !patterns.postalCode.test(value)) return 'Debe tener exactamente 6 dígitos';
        return null;
    },
    
    username: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (!patterns.username.test(value)) return 'Debe tener 5-15 caracteres, solo letras, números, puntos y guiones bajos';
        return null;
    },
    
    securityQuestion: (value) => {
        if (!value) return 'Este campo es obligatorio';
        return null;
    },
    
    securityAnswer: (value) => {
        if (!value.trim()) return 'Este campo es obligatorio';
        if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres';
        return null;
    },
    
    contactPrefs: () => {
        const checkboxes = document.querySelectorAll('input[name="contactPrefs"]:checked');
        if (checkboxes.length === 0) return 'Debe seleccionar al menos una preferencia de contacto';
        return null;
    },
    
    biography: (value) => {
        if (value && value.trim().length < 20) return 'Si completa este campo, debe tener al menos 20 caracteres';
        return null;
    },
    
    terms: () => {
        const checkbox = document.getElementById('terms');
        if (!checkbox.checked) return 'Debe aceptar los términos y condiciones';
        return null;
    }
};

// Validar un campo específico
function validateField(fieldName) {
    let value;
    let error;
    
    // Manejar diferentes tipos de campos
    if (fieldName === 'gender') {
        const selected = document.querySelector('input[name="gender"]:checked');
        value = selected ? selected.value : '';
        error = validators[fieldName](value);
    } else if (fieldName === 'contactPrefs') {
        error = validators[fieldName]();
    } else if (fieldName === 'terms') {
        error = validators[fieldName]();
    } else {
        const element = document.getElementById(fieldName);
        if (element) {
            value = element.value;
            error = validators[fieldName](value);
        }
    }
    
    if (error) {
        setInvalid(fieldName, error);
        return false;
    } else {
        setValid(fieldName);
        return true;
    }
}

// Validar todo el formulario
function validateForm() {
    const fields = [
        'fullName', 'email', 'password', 'confirmPassword', 'birthDate',
        'cellphone', 'phone', 'documentType', 'documentNumber', 'gender',
        'city', 'otherCity', 'address', 'postalCode', 'username',
        'securityQuestion', 'securityAnswer', 'contactPrefs', 'biography', 'terms'
    ];
    
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    formState.isValid = isValid;
    updateSubmitState();
    
    return isValid;
}

// Actualizar estado del botón de envío
function updateSubmitState() {
    const submitBtn = document.getElementById('submitBtn');
    const allRequiredValid = Object.values(formState.fields).every(valid => valid === true);
    const termsAccepted = document.getElementById('terms').checked;
    
    if (allRequiredValid && termsAccepted) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Manejar campo condicional de "Otra ciudad"
function handleCityChange() {
    const citySelect = document.getElementById('city');
    const otherCityGroup = document.getElementById('otherCityGroup');
    
    if (citySelect.value === 'Otra') {
        otherCityGroup.style.display = 'block';
        document.getElementById('otherCity').setAttribute('required', 'required');
    } else {
        otherCityGroup.style.display = 'none';
        document.getElementById('otherCity').removeAttribute('required');
        setValid('otherCity');
    }
    
    updateSubmitState();
}

// Mostrar resumen de datos
function showSummary(formData) {
    const summaryData = document.getElementById('summaryData');
    
    const summaryHTML = `
        <h3>Resumen del Registro</h3>
        <div class="summary-item">
            <span class="summary-label">Nombre:</span>
            <span class="summary-value">${formData.get('fullName')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Email:</span>
            <span class="summary-value">${formData.get('email')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Usuario:</span>
            <span class="summary-value">${formData.get('username')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Documento:</span>
            <span class="summary-value">${formData.get('documentType')} ${formData.get('documentNumber')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Celular:</span>
            <span class="summary-value">${formData.get('cellphone')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Ciudad:</span>
            <span class="summary-value">${formData.get('city') === 'Otra' ? formData.get('otherCity') : formData.get('city')}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Preferencias de contacto:</span>
            <span class="summary-value">${formData.getAll('contactPrefs').join(', ')}</span>
        </div>
    `;
    
    summaryData.innerHTML = summaryHTML;
}

// Cerrar modal
function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
    document.getElementById('registrationForm').reset();
    
    // Limpiar estados de validación
    document.querySelectorAll('.is-valid, .is-invalid').forEach(element => {
        element.classList.remove('is-valid', 'is-invalid');
    });
    
    document.querySelectorAll('.error-message').forEach(element => {
        element.textContent = '';
    });
    
    // Resetear estado
    formState = {
        isValid: false,
        fields: {}
    };
    
    updateSubmitState();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const citySelect = document.getElementById('city');
    
    // Event listeners para validación en tiempo real
    const fields = [
        'fullName', 'email', 'password', 'confirmPassword', 'birthDate',
        'cellphone', 'phone', 'documentType', 'documentNumber',
        'city', 'otherCity', 'address', 'postalCode', 'username',
        'securityQuestion', 'securityAnswer', 'biography'
    ];
    
    fields.forEach(fieldName => {
        const element = document.getElementById(fieldName);
        if (element) {
            element.addEventListener('input', () => validateField(fieldName));
            element.addEventListener('change', () => validateField(fieldName));
            element.addEventListener('blur', () => validateField(fieldName));
        }
    });
    
    // Event listeners para radio buttons
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', () => validateField('gender'));
    });
    
    // Event listeners para checkboxes de contacto
    document.querySelectorAll('input[name="contactPrefs"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => validateField('contactPrefs'));
    });
    
    // Event listener para términos
    document.getElementById('terms').addEventListener('change', () => {
        validateField('terms');
        updateSubmitState();
    });
    
    // Event listener para cambio de ciudad
    citySelect.addEventListener('change', () => {
        validateField('city');
        handleCityChange();
    });
    
    // Event listener para otro campo de ciudad
    document.getElementById('otherCity').addEventListener('input', () => validateField('otherCity'));
    
    // Validación especial para confirmar contraseña cuando cambia la contraseña
    document.getElementById('password').addEventListener('input', () => {
        validateField('password');
        // Revalidar confirmar contraseña si ya tiene valor
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (confirmPassword) {
            validateField('confirmPassword');
        }
    });
    
    // Submit del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = new FormData(form);
            
            // Guardar en localStorage (opcional)
            const formDataObj = {};
            formData.forEach((value, key) => {
                if (!formDataObj[key]) {
                    formDataObj[key] = value;
                } else {
                    if (!Array.isArray(formDataObj[key])) {
                        formDataObj[key] = [formDataObj[key]];
                    }
                    formDataObj[key].push(value);
                }
            });
            
            localStorage.setItem('userRegistration', JSON.stringify(formDataObj));
            
            // Mostrar confirmación
            showSummary(formData);
            document.getElementById('confirmModal').style.display = 'flex';
        }
    });
    
    // Reset del formulario
    resetBtn.addEventListener('click', function() {
        setTimeout(() => {
            // Limpiar estados de validación
            document.querySelectorAll('.is-valid, .is-invalid').forEach(element => {
                element.classList.remove('is-valid', 'is-invalid');
            });
            
            document.querySelectorAll('.error-message').forEach(element => {
                element.textContent = '';
            });
            
            // Resetear estado
            formState = {
                isValid: false,
                fields: {}
            };
            
            // Ocultar campo de otra ciudad
            document.getElementById('otherCityGroup').style.display = 'none';
            
            updateSubmitState();
        }, 10);
    });
    
    // Inicializar estado del botón
    updateSubmitState();
});
