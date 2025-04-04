import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

const SignUp = () => {
  const navigate = useNavigate();
  
  const [formSignUp, setFormSignUp] = useState({ 
    correo_electronico: '', 
    contraseña: '' 
  });

  const handleChangeSignUp = (e) => {
    setFormSignUp({ ...formSignUp, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      const request = await fetch(
        `http://localhost:3000/register?correo_electronico=${encodeURIComponent(formSignUp.correo_electronico)}&contraseña=${encodeURIComponent(formSignUp.contraseña)}`
      );
      
      if (request.ok) {
        alert("Registro exitoso");
        
        // Limpiar formulario de registro
        setFormSignUp({
          correo_electronico: '',
          contraseña: ''
        });
        
        // Opcional: Navegar a la página de usuarios
        navigate('/usuarios');
      } else {
        alert("Error al registrar");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alert("Error de conexión con el servidor");
    }
  };
  
  // Función para navegar a Table.jsx
  const goToTable = () => {
    navigate('/table', { replace: true });
  };

  return (
    <div className="signin-container">
      <img 
        src="/img/logo_coffee_background.png" 
        alt="logo" 
        className="header-image" 
      />
      
      <div className="forms-container">
        {/* Formulario de registro */}
        <form className="signup-form" onSubmit={handleSignUp}>
          <h2>Sign Up</h2>
          <input
            type="email"
            name="correo_electronico"
            placeholder="Email"
            value={formSignUp.correo_electronico}
            onChange={handleChangeSignUp}
            required
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Password"
            value={formSignUp.contraseña}
            onChange={handleChangeSignUp}
            required
          />
          <button type="submit">Sign Up</button>
          
          {/* Botón para navegar a Table.jsx */}
          <button 
            type="button" 
            onClick={goToTable} 
            className="go-to-table-btn"
            style={{
              marginTop: '15px',
              backgroundColor: '#5D4343',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Go to Sample Manager
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;