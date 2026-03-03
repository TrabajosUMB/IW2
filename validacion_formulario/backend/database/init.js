const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Crear base de datos en la carpeta database
const dbPath = path.join(__dirname, 'users.db');

// Conectar a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos SQLite.');
});

// Crear tablas
db.serialize(() => {
    // Tabla de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        birthDate TEXT NOT NULL,
        cellphone TEXT UNIQUE NOT NULL,
        phone TEXT,
        documentType TEXT NOT NULL,
        documentNumber TEXT UNIQUE NOT NULL,
        gender TEXT NOT NULL,
        city TEXT NOT NULL,
        otherCity TEXT,
        address TEXT NOT NULL,
        postalCode TEXT,
        username TEXT UNIQUE NOT NULL,
        securityQuestion TEXT NOT NULL,
        securityAnswer TEXT NOT NULL,
        biography TEXT,
        contactPrefs TEXT NOT NULL,
        termsAccepted INTEGER NOT NULL DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error al crear tabla users:', err.message);
        } else {
            console.log('Tabla users creada o verificada exitosamente.');
        }
    });

    // Tabla de logs para auditoría
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        ipAddress TEXT,
        userAgent TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`, (err) => {
        if (err) {
            console.error('Error al crear tabla audit_logs:', err.message);
        } else {
            console.log('Tabla audit_logs creada o verificada exitosamente.');
        }
    });

    // Crear índices para mejor rendimiento
    db.run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`, (err) => {
        if (err) console.error('Error al crear índice email:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`, (err) => {
        if (err) console.error('Error al crear índice username:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_users_document ON users(documentNumber)`, (err) => {
        if (err) console.error('Error al crear índice document:', err.message);
    });

    db.run(`CREATE INDEX IF NOT EXISTS idx_users_cellphone ON users(cellphone)`, (err) => {
        if (err) console.error('Error al crear índice cellphone:', err.message);
    });
});

// Cerrar conexión
db.close((err) => {
    if (err) {
        console.error('Error al cerrar la conexión:', err.message);
    } else {
        console.log('Base de datos inicializada correctamente.');
        console.log(`Ubicación: ${dbPath}`);
    }
});
