const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Joi = require('joi');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Seguridad
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por IP
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Conexión a la base de datos
const dbPath = path.join(__dirname, 'database', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        process.exit(1);
    }
    console.log('Conectado a la base de datos SQLite.');
});

// Esquema de validación con Joi
const userSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    birthDate: Joi.string().isoDate().required(),
    cellphone: Joi.string().pattern(/^3[0-9]{9}$/).required(),
    phone: Joi.string().pattern(/^\d{10,}$/).optional(),
    documentType: Joi.string().valid('CC', 'TI', 'CE', 'PA').required(),
    documentNumber: Joi.string().pattern(/^\d{6,12}$/).required(),
    gender: Joi.string().valid('M', 'F', 'O').required(),
    city: Joi.string().required(),
    otherCity: Joi.string().when('city', {
        is: 'Otra',
        then: Joi.string().min(3).required(),
        otherwise: Joi.string().optional()
    }),
    address: Joi.string().min(8).required(),
    postalCode: Joi.string().pattern(/^\d{6}$/).optional(),
    username: Joi.string().pattern(/^[a-zA-Z0-9._]{5,15}$/).required(),
    securityQuestion: Joi.string().required(),
    securityAnswer: Joi.string().min(3).required(),
    biography: Joi.string().min(20).optional(),
    contactPrefs: Joi.array().min(1).required(),
    termsAccepted: Joi.boolean().valid(true).required()
});

// Función para registrar logs de auditoría
function logAudit(userId, action, details, req) {
    const logData = {
        userId: userId || null,
        action: action,
        details: JSON.stringify(details),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown'
    };

    db.run(
        `INSERT INTO audit_logs (userId, action, details, ipAddress, userAgent) VALUES (?, ?, ?, ?, ?)`,
        [logData.userId, logData.action, logData.details, logData.ipAddress, logData.userAgent],
        (err) => {
            if (err) console.error('Error al registrar log de auditoría:', err.message);
        }
    );
}

// Middleware para logging de solicitudes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Rutas API

// GET - Obtener todos los usuarios (con paginación)
app.get('/api/users', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all(
        `SELECT id, fullName, email, username, documentType, documentNumber, 
                cellphone, city, createdAt 
         FROM users 
         ORDER BY createdAt DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset],
        (err, rows) => {
            if (err) {
                console.error('Error al obtener usuarios:', err.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Obtener total de registros
            db.get('SELECT COUNT(*) as total FROM users', (err, countRow) => {
                if (err) {
                    console.error('Error al contar usuarios:', err.message);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }

                res.json({
                    users: rows,
                    pagination: {
                        page: page,
                        limit: limit,
                        total: countRow.total,
                        pages: Math.ceil(countRow.total / limit)
                    }
                });
            });
        }
    );
});

// GET - Obtener usuario por ID
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.get(
        `SELECT id, fullName, email, username, documentType, documentNumber, 
                cellphone, phone, gender, city, otherCity, address, postalCode,
                biography, contactPrefs, createdAt, updatedAt 
         FROM users WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) {
                console.error('Error al obtener usuario:', err.message);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (!row) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(row);
        }
    );
});

// POST - Crear nuevo usuario
app.post('/api/users', async (req, res) => {
    try {
        // Validar datos de entrada
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                error: 'Datos inválidos',
                details: error.details.map(detail => detail.message)
            });
        }

        const userData = value;

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Convertir array de contactPrefs a string
        userData.contactPrefs = JSON.stringify(userData.contactPrefs);

        // Insertar usuario
        db.run(
            `INSERT INTO users (
                fullName, email, password, birthDate, cellphone, phone,
                documentType, documentNumber, gender, city, otherCity,
                address, postalCode, username, securityQuestion,
                securityAnswer, biography, contactPrefs, termsAccepted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userData.fullName,
                userData.email,
                hashedPassword,
                userData.birthDate,
                userData.cellphone,
                userData.phone || null,
                userData.documentType,
                userData.documentNumber,
                userData.gender,
                userData.city,
                userData.otherCity || null,
                userData.address,
                userData.postalCode || null,
                userData.username,
                userData.securityQuestion,
                userData.securityAnswer,
                userData.biography || null,
                userData.contactPrefs,
                userData.termsAccepted ? 1 : 0
            ],
            function(err) {
                if (err) {
                    console.error('Error al crear usuario:', err.message);
                    
                    // Manejar errores de unicidad
                    if (err.message.includes('UNIQUE constraint failed')) {
                        if (err.message.includes('email')) {
                            return res.status(400).json({ error: 'El email ya está registrado' });
                        } else if (err.message.includes('username')) {
                            return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
                        } else if (err.message.includes('documentNumber')) {
                            return res.status(400).json({ error: 'El número de documento ya está registrado' });
                        } else if (err.message.includes('cellphone')) {
                            return res.status(400).json({ error: 'El número de celular ya está registrado' });
                        }
                    }
                    
                    return res.status(500).json({ error: 'Error al crear usuario' });
                }

                // Registrar log de auditoría
                logAudit(this.lastID, 'USER_CREATED', { email: userData.email, username: userData.username }, req);

                // Responder sin incluir la contraseña
                res.status(201).json({
                    message: 'Usuario creado exitosamente',
                    userId: this.lastID,
                    user: {
                        id: this.lastID,
                        fullName: userData.fullName,
                        email: userData.email,
                        username: userData.username
                    }
                });
            }
        );

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT - Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Validar datos (excluyendo contraseña para actualización parcial)
        const updateSchema = userSchema.fork(['password'], (schema) => schema.optional());
        const { error, value } = updateSchema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Datos inválidos',
                details: error.details.map(detail => detail.message)
            });
        }

        const userData = value;

        // Construir consulta dinámica
        const updates = [];
        const values = [];

        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined && key !== 'password') {
                if (key === 'contactPrefs') {
                    updates.push(`${key} = ?`);
                    values.push(JSON.stringify(userData[key]));
                } else {
                    updates.push(`${key} = ?`);
                    values.push(userData[key]);
                }
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No hay datos para actualizar' });
        }

        updates.push('updatedAt = CURRENT_TIMESTAMP');
        values.push(id);

        db.run(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values,
            function(err) {
                if (err) {
                    console.error('Error al actualizar usuario:', err.message);
                    return res.status(500).json({ error: 'Error al actualizar usuario' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                // Registrar log de auditoría
                logAudit(id, 'USER_UPDATED', { updatedFields: Object.keys(userData) }, req);

                res.json({
                    message: 'Usuario actualizado exitosamente',
                    changes: this.changes
                });
            }
        );

    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE - Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Error al eliminar usuario:', err.message);
            return res.status(500).json({ error: 'Error al eliminar usuario' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Registrar log de auditoría
        logAudit(id, 'USER_DELETED', { userId: id }, req);

        res.json({
            message: 'Usuario eliminado exitosamente',
            changes: this.changes
        });
    });
});

// GET - Estadísticas de la base de datos
app.get('/api/stats', (req, res) => {
    const stats = {};

    db.get('SELECT COUNT(*) as totalUsers FROM users', (err, row) => {
        if (err) {
            console.error('Error al obtener estadísticas:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        stats.totalUsers = row.totalUsers;

        // Obtener usuarios por ciudad
        db.all(
            `SELECT city, COUNT(*) as count 
             FROM users 
             GROUP BY city 
             ORDER BY count DESC`,
            (err, rows) => {
                if (err) {
                    console.error('Error al obtener usuarios por ciudad:', err.message);
                    return res.status(500).json({ error: 'Error interno del servidor' });
                }

                stats.usersByCity = rows;

                // Obtener usuarios registrados hoy
                db.get(
                    `SELECT COUNT(*) as todayUsers 
                     FROM users 
                     WHERE DATE(createdAt) = DATE('now')`,
                    (err, row) => {
                        if (err) {
                            console.error('Error al obtener usuarios de hoy:', err.message);
                            return res.status(500).json({ error: 'Error interno del servidor' });
                        }

                        stats.todayUsers = row.todayUsers;
                        res.json(stats);
                    }
                );
            }
        );
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\nCerrando servidor...');
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('Conexión a la base de datos cerrada.');
        }
        process.exit(0);
    });
});
