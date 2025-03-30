import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

const SignIn = () => {
  const navigate = useNavigate();  // Hook para redireccionar a otras rutas
  const [form, setForm] = useState({ 
    correo_electronico: '', 
    contraseña: '' 
  });

  // Función para validar si ya hay una sesión activa
  useEffect(() => {
    async function validate() {
      try {
        const request = await fetch('http://localhost:3000/validate', {
          credentials: 'include' // Incluye cookies en la petición para mantener la sesión
        });
        
        if (request.ok) {
          navigate('/table'); // Si hay sesión activa, redirige a la tabla
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
      }
    }

    validate();
  }, [navigate]);

   // Maneja los cambios en los inputs del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


    // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    try {
       // Envía los datos al servidor para autenticación
      const request = await fetch(
        `http://localhost:3000/login?correo_electronico=${encodeURIComponent(form.correo_electronico)}&contraseña=${encodeURIComponent(form.contraseña)}`,
        {credentials: 'include'}  // Importante para que el navegador guarde las cookies de sesión
      );
      
      if (request.ok) {
        alert("Inicio de session exitoso")
        navigate('/table'); // Redirige a la página de tabla si la autenticación es exitosa
      } else {
        alert("Usuario o clave incorrecta");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
        // JSX del formulario
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <img 
          src="/img/logo_coffee_background.png" 
          alt="logo" 
          className="header-image" 
        />
        <h2>Sign In</h2>
        <input
          type="email"
          name="correo_electronico"
          placeholder="Email"
          value={form.correo_electronico}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Password"
          value={form.contraseña}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;