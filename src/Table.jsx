import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './table.css';
import { useSampleManager } from './hooks/useSampleManager';

const Table = () => {
  const navigate = useNavigate();
  
  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        credentials: 'include'
      });
      
      if (response.ok) {
        // Si la sesión se cerró correctamente, navegar al login
        navigate('/', { replace: true });
      } else {
        console.error("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const {
    filteredSamples,
    modalOpen,
    form,
    handleSearch,
    handleChange,
    handleSubmit,
    openModal,
    closeModal,
    deleteSample,
    generatePDF
  } = useSampleManager();

  return (
    <div className="sample-table-container">
      <div className="sample-table-content">
        {/* Cabecera de la tabla con logo y botones de navegación */}
        <div className="sample-table-header">
          {/* Logo y título */}
          <div className="sample-table-logo">
            <img src="/img/logo_coffee_background.png" alt="QC Master Logo" />
            <h3>Sample Manager</h3>
          </div>
          {/* Enlaces de navegación */}
          <div className="sample-table-navigation">
            <button onClick={handleLogout} className="nav-button">Logout</button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="sample-table-search-bar">
          <input 
            type="text" 
            placeholder="Search samples" 
            onChange={e => handleSearch(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        {/* Botones de acción principales */}
        <div className="sample-table-actions">
          <button className="btn btn-pdf" onClick={generatePDF}>Generate PDF Report</button>
          <button className="btn btn-add" onClick={() => openModal('add')}>Add samples</button>
        </div>

        {/* Tabla de muestras */}
        <table className="sample-table-data">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quality</th>
              <th>Origin</th>
              <th>Tasting date</th>
              <th>Tasting time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSamples.map((sample, index) => (
              <tr key={index}>
                <td>{sample.id}</td>
                <td>{sample.quality}</td>
                <td>{sample.origin}</td>
                <td>{sample.date}</td>
                <td>{sample.time}</td>
                <td>
                  <button 
                    className="btn btn-edit" 
                    onClick={() => openModal('edit', index)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => deleteSample(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para añadir/editar muestras */}
        {modalOpen && (
          <div className="sample-table-modal">
            <div className="modal-content">
              <span className="btn-close" onClick={closeModal}>&times;</span>
              <h2>{form.id ? 'Edit Sample' : 'Add Sample'}</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="id">ID:</label>
                <input 
                  type="text" 
                  id="id" 
                  value={form.id} 
                  onChange={handleChange} 
                  required 
                />

                <label htmlFor="quality">Quality:</label>
                <select 
                  id="quality" 
                  value={form.quality} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Pink Bourbon">Pink Bourbon</option>
                  <option value="Geisha">Geisha</option>
                  <option value="Tabi">Tabi</option>
                  <option value="Caturra">Caturra</option>
                  <option value="Castillo">Castillo</option>
                </select>

                <label htmlFor="origin">Origin:</label>
                <select 
                  id="origin" 
                  value={form.origin} 
                  onChange={handleChange} 
                  required
                >
                  <option value="">-- Select --</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Costa Rica">Costa Rica</option>
                </select>

                <label htmlFor="date">Tasting Date:</label>
                <input 
                  type="date" 
                  id="date" 
                  value={form.date} 
                  onChange={handleChange} 
                  required 
                />

                <label htmlFor="time">Tasting Time:</label>
                <input 
                  type="time" 
                  id="time" 
                  value={form.time} 
                  onChange={handleChange} 
                  required 
                />

                <button type="submit" className="btn btn-add">
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;