import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signin.css';

const Usuarios = () => {
  const navigate = useNavigate();
  
  // Inicializar table como un array vacío
  const [table, setTable] = useState([]);

  // Actualizar tabla de usuarios
  async function getUsers() {
    try {
      const request = await fetch('https://loginexpress-production-1f75.up.railway.app/usuarios', {
        credentials: 'include'
      });
      
      if (request.ok) {
        const answer = await request.json();
        console.log("Usuarios recibidos:", answer);
        setTable(answer);
      } else {
        console.error("Error en la petición:", await request.text());
      }
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);
    }
  }

  async function deleteUser(id) {
    try {
      const request = await fetch('https://loginexpress-production-1f75.up.railway.app/usuarios?id='+id, {
        credentials: 'include', 
        method: 'DELETE'
      });
      
      if (request.ok) {
        const answer = await request.json();
        alert("Usuario eliminado con exito")
        setTable(answer);
      }
    } catch (error) {
      console.error("Error eliminando usuarios:", error);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const request = await fetch('https://loginexpress-production-1f75.up.railway.app/validate', {
          credentials: 'include'
        });
        
        if (request.ok) {
          getUsers(); // Cargar usuarios si está autenticado
        } else {
          // Si no está autenticado, redirigir al login
          navigate('/signin');
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
        navigate('/signin');
      }
    }
    
    // Verificar autenticación al cargar el componente
    checkAuth();
  }, [navigate]);

  return (
    <div className="signin-container">
      <img 
        src="/img/logo_coffee_background.png" 
        alt="logo" 
        className="header-image" 
      />
      
      <div className="forms-container">
        {/* Tabla de usuarios registrados */}
        <div className="table-container">
          <h2>Registered Users</h2>
          <table className='users-table'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Password</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {table.length > 0 ? (
                table.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.correo_electronico}</td>
                    <td>{user.contraseña}</td>
                    <td>
                      <button onClick={()=>{deleteUser(user.id)}}>X</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;