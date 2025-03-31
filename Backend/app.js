const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2/promise');
const cors = require('cors')
const session = require('express-session')


// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: 'http://localhost:3001',  // Origen permitido para las peticiones
  credentials: true // Permite el envío de cookies en peticiones cross-origin
}))


// Configuración de sesiones
app.use(session({
  secret: 'habhcbvhbhdvb', // Clave secreta para firmar la cookie de sesión
}))

// Conexión a la base de datos MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'login',
});


// Ruta para la autenticación de usuarios
app.get('/login', async (req, res) => {
  console.log('Query params:', req.query);
  const datos = req.query;
  // A simple SELECT query
  try {
        // Consulta a la base de datos para verificar credenciales
    const [results, fields] = await connection.query(
      "SELECT * FROM `usuarios` WHERE `correo_electronico` = ? AND `contraseña` = ?",
      [datos.correo_electronico, datos.contraseña]
    );
    
    if (results.length > 0) {
      // Si las credenciales son correctas, guarda el email en la sesión
      req.session.correo_electronico = datos.correo_electronico;
      res.status(200).send("Datos Correctos")
    } else {
      res.status(401).send("Datos incorrectos")
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Error en el servidor");
  }
})
// Ruta para validar si hay una sesión activa
app.get('/validate', (req, res) => {
  console.log("Sesión actual:", req.session);
  if (req.session.correo_electronico) {
    // Si existe correo_electronico en la sesión, el usuario está autenticado
    res.status(200).send('Sesion validada')
  } else {
    res.status(401).send('No autorizado')
  }
})

// Inicia el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})