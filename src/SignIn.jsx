import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

const SignIn = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ 
    correo_electronico: '', 
    contraseña: '' 
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const request = await fetch(
        `http://localhost:3000/login?correo_electronico=${encodeURIComponent(form.correo_electronico)}&contraseña=${encodeURIComponent(form.contraseña)}`,
        {credentials: 'include'}
      );
      
      if (request.ok) {
        alert("Inicio de sesión exitoso");
        // Navegar a la página de registro después del login exitoso
        navigate('/signup');
      } else {
        alert("Usuario o clave incorrecta");
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="signin-container">
      <img 
        src="/img/logo_coffee_background.png" 
        alt="logo" 
        className="header-image" 
      />
      
      <div className="forms-container">
        {/* Formulario de inicio de sesión */}
        <form className="signin-form" onSubmit={handleSubmit}>
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
    </div>
  );
};

export default SignIn;