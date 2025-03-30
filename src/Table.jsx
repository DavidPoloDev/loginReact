import React from 'react'; // Importamos React para crear el componente
import { Link } from 'react-router-dom'; // Importamos Link para la navegación entre páginas
import './table.css'; // Importamos los estilos CSS específicos
import { useSampleManager } from './hooks/useSampleManager'; // Importamos nuestro hook personalizado

// Componente de tabla para gestionar las muestras de café
const Table = () => {
  // Usamos desestructuración para obtener todas las funciones y estados del hook useSampleManager
  const {
    filteredSamples, // Muestras filtradas (por búsqueda)
    modalOpen,       // Estado para controlar si el modal está abierto
    form,            // Estado del formulario (añadir/editar)
    handleSearch,    // Función para búsqueda
    handleChange,    // Función para cambios en el formulario
    handleSubmit,    // Función para enviar el formulario
    openModal,       // Función para abrir el modal
    closeModal,      // Función para cerrar el modal
    deleteSample,    // Función para eliminar una muestra
    generatePDF      // Función para generar un PDF
  } = useSampleManager();

  // Estructura del componente
  return (
    // Contenedor principal
    <div className="table-container">
      <div className="table-content">
        {/* Cabecera de la tabla con logo y botones de navegación */}
        <div className="table-header">
          {/* Logo y título */}
          <div className="table-logo">
            <img src="/img/logo_coffee_background.png" alt="QC Master Logo" />
            <h3>Sample Manager</h3>
          </div>
          {/* Enlaces de navegación */}
          <div className="table-navigation">
            <Link to="/signin" className="nav-button">Sign In</Link>
            <Link to="/signup" className="nav-button">Sign Up</Link>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="table-search-bar">
          <input 
            type="text" 
            placeholder="Search samples" 
            onChange={e => handleSearch(e.target.value)} // Ejecuta la búsqueda al escribir
          />
          <button className="search-btn">Search</button>
        </div>

        {/* Botones de acción principales */}
        <div className="table-actions">
          <button className="btn btn-pdf" onClick={generatePDF}>Generate PDF Report</button>
          <button className="btn btn-add" onClick={() => openModal('add')}>Add samples</button>
        </div>

        {/* Tabla de muestras */}
        <table className="table-data">
          {/* Encabezados de la tabla */}
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
          {/* Cuerpo de la tabla con los datos */}
          <tbody>
            {/* Mapeo de las muestras filtradas para crear filas */}
            {filteredSamples.map((sample, index) => (
              <tr key={index}>
                <td>{sample.id}</td>
                <td>{sample.quality}</td>
                <td>{sample.origin}</td>
                <td>{sample.date}</td>
                <td>{sample.time}</td>
                {/* Columna de acciones (editar/eliminar) */}
                <td>
                  <button 
                    className="btn btn-edit" 
                    onClick={() => openModal('edit', index)} // Abre modal para editar esta muestra
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => deleteSample(index)} // Elimina esta muestra
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para añadir/editar muestras (solo se muestra cuando modalOpen es true) */}
        {modalOpen && (
          <div className="table-modal">
            <div className="modal-content">
              {/* Botón para cerrar el modal */}
              <span className="btn-close" onClick={closeModal}>&times;</span>
              {/* Título dinámico según sea añadir o editar */}
              <h2>{form.id ? 'Edit Sample' : 'Add Sample'}</h2>
              {/* Formulario para añadir/editar muestra */}
              <form onSubmit={handleSubmit}>
                {/* Campo para ID */}
                <label htmlFor="id">ID:</label>
                <input 
                  type="text" 
                  id="id" 
                  value={form.id} 
                  onChange={handleChange} 
                  required 
                />

                {/* Selector para Calidad */}
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

                {/* Selector para Origen */}
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

                {/* Campo para Fecha de catación */}
                <label htmlFor="date">Tasting Date:</label>
                <input 
                  type="date" 
                  id="date" 
                  value={form.date} 
                  onChange={handleChange} 
                  required 
                />

                {/* Campo para Hora de catación */}
                <label htmlFor="time">Tasting Time:</label>
                <input 
                  type="time" 
                  id="time" 
                  value={form.time} 
                  onChange={handleChange} 
                  required 
                />

                {/* Botón para guardar los cambios */}
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

// Exportamos el componente para usarlo en otras partes de la aplicación
export default Table;