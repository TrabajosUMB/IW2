// Clase para manejar la base de datos local
class UserDatabase {
    constructor() {
        this.dbName = 'userRegistrationDB';
        this.usersKey = 'registeredUsers';
        this.initializeDB();
    }

    initializeDB() {
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }

    saveUser(userData) {
        const users = this.getUsers();
        
        // Generar ID único
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            registrationDate: new Date().toISOString()
        };
        
        // Verificar si el email ya existe
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }
        
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        return newUser;
    }

    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    deleteUser(userId) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        localStorage.setItem(this.usersKey, JSON.stringify(filteredUsers));
    }

    clearDatabase() {
        localStorage.removeItem(this.usersKey);
        this.initializeDB();
    }

    getStatistics() {
        const users = this.getUsers();
        return {
            totalUsers: users.length,
            recentRegistrations: users.filter(user => {
                const registrationDate = new Date(user.registrationDate);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return registrationDate > oneWeekAgo;
            }).length
        };
    }
}

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.submitBtn = document.getElementById('submitBtn');
        this.successMessage = document.getElementById('successMessage');
        this.validators = {};
        this.isValid = false;
        this.database = new UserDatabase(); // Inicializar base de datos
        
        this.init();
    }

    init() {
        this.setupValidators();
        this.setupEventListeners();
        this.validateForm();
    }

    setupValidators() {
        // Validador de nombre completo
        this.validators.fullName = {
            validate: (value) => {
                if (!value || value.trim().length < 3) {
                    return 'El nombre completo debe tener al menos 3 caracteres';
                }
                if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    return 'El nombre solo puede contener letras y espacios';
                }
                return '';
            },
            element: document.getElementById('fullName'),
            errorElement: document.getElementById('fullNameError')
        };

        // Validador de email
        this.validators.email = {
            validate: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    return 'El correo electrónico es obligatorio';
                }
                if (!emailRegex.test(value)) {
                    return 'Ingrese un correo electrónico válido';
                }
                return '';
            },
            element: document.getElementById('email'),
            errorElement: document.getElementById('emailError')
        };

        // Validador de contraseña
        this.validators.password = {
            validate: (value) => {
                if (!value) {
                    return 'La contraseña es obligatoria';
                }
                if (value.length < 8) {
                    return 'La contraseña debe tener al menos 8 caracteres';
                }
                if (!/[A-Z]/.test(value)) {
                    return 'La contraseña debe tener al menos una mayúscula';
                }
                if (!/[0-9]/.test(value)) {
                    return 'La contraseña debe tener al menos un número';
                }
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                    return 'La contraseña debe tener al menos un carácter especial';
                }
                return '';
            },
            element: document.getElementById('password'),
            errorElement: document.getElementById('passwordError')
        };

        // Validador de confirmar contraseña
        this.validators.confirmPassword = {
            validate: (value) => {
                const password = document.getElementById('password').value;
                if (!value) {
                    return 'Debe confirmar la contraseña';
                }
                if (value !== password) {
                    return 'Las contraseñas no coinciden';
                }
                return '';
            },
            element: document.getElementById('confirmPassword'),
            errorElement: document.getElementById('confirmPasswordError')
        };

        // Validador de fecha de nacimiento
        this.validators.birthDate = {
            validate: (value) => {
                if (!value) {
                    return 'La fecha de nacimiento es obligatoria';
                }
                
                const birthDate = new Date(value);
                const today = new Date();
                
                // Verificar que la fecha no sea futura
                if (birthDate > today) {
                    return 'La fecha de nacimiento no puede ser futura';
                }
                
                // Calcular edad de forma precisa
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();
                
                // Ajustar edad si el cumpleaños aún no ha pasado este año
                if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                    age--;
                }
                
                console.log('🎂 Validación fecha:', {
                    input: value,
                    birthDate: birthDate.toISOString(),
                    today: today.toISOString(),
                    calculatedAge: age,
                    monthDiff: monthDiff,
                    dayDiff: dayDiff
                });
                
                if (age < 18) {
                    return 'Debes tener al menos 18 años para registrarte';
                }
                
                return '';
            },
            element: document.getElementById('birthDate'),
            errorElement: document.getElementById('birthDateError')
        };

        // Validador de celular
        this.validators.cellPhone = {
            validate: (value) => {
                if (!value) {
                    return 'El número de celular es obligatorio';
                }
                
                // Limpiar el valor para que solo contenga números
                const cleanValue = value.replace(/\D/g, '');
                
                console.log('📱 Validación celular:', {
                    original: value,
                    clean: cleanValue,
                    length: cleanValue.length,
                    startsWith3: cleanValue.startsWith('3'),
                    regex: /^[3][0-9]{9}$/.test(cleanValue)
                });
                
                if (!/^[3][0-9]{9}$/.test(cleanValue)) {
                    return 'El celular debe tener 10 dígitos y comenzar con 3 (formato colombiano)';
                }
                
                return '';
            },
            element: document.getElementById('cellPhone'),
            errorElement: document.getElementById('cellPhoneError')
        };

        // Validador de teléfono (opcional)
        this.validators.phoneNumber = {
            validate: (value) => {
                if (!value) {
                    return ''; // Es opcional, si está vacío es válido
                }
                
                const cleanValue = value.replace(/\D/g, '');
                
                if (cleanValue.length < 10) {
                    return 'El teléfono debe tener al menos 10 dígitos numéricos';
                }
                
                return '';
            },
            element: document.getElementById('phoneNumber'),
            errorElement: document.getElementById('phoneNumberError')
        };

        // Validador de términos y condiciones
        this.validators.terms = {
            validate: () => {
                const termsCheckbox = document.getElementById('terms');
                if (!termsCheckbox.checked) {
                    return 'Debes aceptar los términos y condiciones';
                }
                return '';
            },
            element: document.getElementById('terms'),
            errorElement: document.getElementById('termsError')
        };
    }

    setupEventListeners() {
        // Event listeners para validación en tiempo real
        Object.keys(this.validators).forEach(fieldName => {
            const validator = this.validators[fieldName];
            
            if (validator.element.type === 'checkbox') {
                validator.element.addEventListener('change', () => {
                    this.validateField(fieldName);
                });
            } else {
                validator.element.addEventListener('input', () => {
                    this.validateField(fieldName);
                });
                
                validator.element.addEventListener('blur', () => {
                    this.validateField(fieldName);
                });
            }
        });

        // Event listener para el formulario
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Event listener para el botón de reset
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetForm();
        });

        // Validación especial para confirmar contraseña cuando cambia la contraseña original
        document.getElementById('password').addEventListener('input', () => {
            if (this.validators.confirmPassword.element.value) {
                this.validateField('confirmPassword');
            }
        });
    }

    validateField(fieldName) {
        const validator = this.validators[fieldName];
        let value;
        
        if (validator.element.type === 'checkbox') {
            value = validator.element.checked;
        } else {
            value = validator.element.value;
        }
        
        // Manejar campos opcionales (teléfono)
        const isOptional = fieldName === 'phoneNumber';
        
        // Si el campo está vacío y es opcional, es válido automáticamente
        if (!value && isOptional) {
            this.clearFieldState(validator.element, validator.errorElement);
            return true;
        }
        
        // Para checkbox, validar directamente
        if (validator.element.type === 'checkbox') {
            const error = validator.validate(value);
            if (error) {
                this.showError(validator.element, validator.errorElement, error);
                return false;
            } else {
                this.showSuccess(validator.element, validator.errorElement);
                return true;
            }
        }
        
        // Si el campo está vacío y es obligatorio, mostrar como inválido
        if (!value) {
            this.showError(validator.element, validator.errorElement, 'Este campo es obligatorio');
            return false;
        }
        
        const error = validator.validate(value);
        
        if (error) {
            this.showError(validator.element, validator.errorElement, error);
            return false;
        } else {
            this.showSuccess(validator.element, validator.errorElement);
            return true;
        }
    }

    showError(element, errorElement, message) {
        element.classList.remove('valid');
        element.classList.add('invalid');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    showSuccess(element, errorElement) {
        element.classList.remove('invalid');
        element.classList.add('valid');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    clearFieldState(element, errorElement) {
        element.classList.remove('valid', 'invalid');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    validateForm() {
        let isFormValid = true;
        const invalidFields = [];
        const fieldStatus = {};
        
        Object.keys(this.validators).forEach(fieldName => {
            const isValid = this.validateField(fieldName);
            fieldStatus[fieldName] = {
                isValid: isValid,
                value: this.validators[fieldName].element.type === 'checkbox' 
                    ? this.validators[fieldName].element.checked 
                    : this.validators[fieldName].element.value
            };
            
            if (!isValid) {
                isFormValid = false;
                invalidFields.push(fieldName);
            }
        });
        
        // Debug: mostrar diagnóstico completo
        console.log('🔍 DIAGNÓSTICO COMPLETO DEL FORMULARIO:');
        console.log('=====================================');
        console.log('📋 Estado de todos los campos:', fieldStatus);
        console.log('❌ Campos inválidos:', invalidFields);
        console.log('📊 Estado del formulario:', {
            isValid: isFormValid,
            submitBtnDisabled: this.submitBtn.disabled,
            totalFields: Object.keys(this.validators).length,
            validFields: Object.keys(this.validators).length - invalidFields.length,
            invalidCount: invalidFields.length
        });
        
        // Mostrar condiciones específicas para cada campo inválido
        if (invalidFields.length > 0) {
            console.log('⚠️ CONDICIONES NO CUMPLIDAS:');
            invalidFields.forEach(fieldName => {
                const validator = this.validators[fieldName];
                const value = validator.element.type === 'checkbox' 
                    ? validator.element.checked 
                    : validator.element.value;
                console.log(`  • ${fieldName}: "${value}"`);
            });
        } else {
            console.log('✅ TODOS LOS CAMPOS VÁLIDOS - Botón habilitado');
        }
        console.log('=====================================');
        
        this.isValid = isFormValid;
        this.submitBtn.disabled = !isFormValid;
        
        return isFormValid;
    }

    handleSubmit() {
        if (this.validateForm()) {
            try {
                // Obtener datos del formulario
                const formData = this.getFormData();
                
                // Guardar en la base de datos
                const savedUser = this.database.saveUser(formData);
                
                // Mostrar mensaje de éxito con información del usuario guardado
                this.showSuccessMessage(savedUser);
                
                // Ocultar el formulario
                this.form.style.display = 'none';
                
                // Opcional: Resetear el formulario después de unos segundos
                setTimeout(() => {
                    if (confirm('¿Deseas registrar otro usuario?')) {
                        this.resetForm();
                        this.form.style.display = 'block';
                        this.successMessage.classList.add('hidden');
                    }
                }, 5000);
                
                console.log('Usuario guardado exitosamente:', savedUser);
                console.log('Total de usuarios registrados:', this.database.getUsers().length);
                
            } catch (error) {
                // Manejar errores (ej: email duplicado)
                this.showErrorMessage(error.message);
                console.error('Error al guardar usuario:', error);
            }
        } else {
            // Enfocar el primer campo inválido
            const firstInvalid = this.form.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    }

    showSuccessMessage(user) {
        const successDiv = document.getElementById('successMessage');
        successDiv.innerHTML = `
            <h3>¡Registro exitoso!</h3>
            <p><strong>ID de usuario:</strong> ${user.id}</p>
            <p><strong>Nombre:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Fecha de registro:</strong> ${new Date(user.registrationDate).toLocaleString()}</p>
            <p><strong>Total de usuarios registrados:</strong> ${this.database.getUsers().length}</p>
        `;
        successDiv.classList.remove('hidden');
    }

    showErrorMessage(message) {
        const successDiv = document.getElementById('successMessage');
        successDiv.innerHTML = `
            <h3 style="color: #dc3545;">❌ Error en el registro</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="background: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                Intentar de nuevo
            </button>
        `;
        successDiv.classList.remove('hidden');
    }

    resetForm() {
        this.form.reset();
        
        // Limpiar todos los estados de validación
        Object.keys(this.validators).forEach(fieldName => {
            const validator = this.validators[fieldName];
            this.clearFieldState(validator.element, validator.errorElement);
        });
        
        // Ocultar mensaje de éxito
        this.successMessage.classList.add('hidden');
        
        // Deshabilitar botón de envío
        this.submitBtn.disabled = true;
        this.isValid = false;
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
}

// Inicializar el validador cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    const validator = new FormValidator('registrationForm');
    
    // Hacer el validador y la base de datos disponibles globalmente para debugging
    window.formValidator = validator;
    window.userDatabase = validator.database;
    
    // Agregar funciones globales para debugging
    window.viewUsers = () => {
        console.log('Usuarios registrados:', window.userDatabase.getUsers());
        console.log('Estadísticas:', window.userDatabase.getStatistics());
        return window.userDatabase.getUsers();
    };
    
    window.clearDatabase = () => {
        if (confirm('¿Estás seguro de que quieres borrar todos los usuarios?')) {
            window.userDatabase.clearDatabase();
            console.log('Base de datos borrada');
            location.reload();
        }
    };
    
    // Función para probar el formulario con datos de prueba
    window.testForm = () => {
        console.log('🧪 Llenando formulario con datos de prueba...');
        
        // Datos de prueba válidos
        const testData = {
            fullName: 'Juan Pérez García',
            email: 'juan.perez@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!',
            birthDate: '2000-01-01',
            cellPhone: '3001234567',
            phoneNumber: '',
            terms: true
        };
        
        // Llenar campos
        Object.keys(testData).forEach(fieldName => {
            const element = document.getElementById(fieldName);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = testData[fieldName];
                } else {
                    element.value = testData[fieldName];
                }
                console.log(`✅ Campo ${fieldName} llenado con: ${testData[fieldName]}`);
            }
        });
        
        // Forzar validación
        setTimeout(() => {
            validator.validateForm();
            console.log('🔍 Formulario validado después de llenar datos de prueba');
        }, 100);
    };
    
    // Función para diagnosticar el estado actual
    window.diagnoseForm = () => {
        console.log('🔍 DIAGNÓSTICO INMEDIATO:');
        const allFields = ['fullName', 'email', 'password', 'confirmPassword', 'birthDate', 'cellPhone', 'phoneNumber', 'terms'];
        
        allFields.forEach(fieldName => {
            const element = document.getElementById(fieldName);
            if (element) {
                const value = element.type === 'checkbox' ? element.checked : element.value;
                const isValid = validator.validateField(fieldName);
                console.log(`${fieldName}: "${value}" -> ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
            }
        });
        
        validator.validateForm();
    };
    
    console.log('Formulario de registro inicializado');
    console.log('Comandos disponibles:');
    console.log('- viewUsers(): Ver todos los usuarios registrados');
    console.log('- clearDatabase(): Borrar todos los usuarios');
    console.log('- testForm(): Llenar formulario con datos de prueba válidos');
    console.log('- diagnoseForm(): Diagnosticar estado actual del formulario');
});
