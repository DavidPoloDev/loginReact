import { useEffect, useState, useCallback } from 'react';

// Este es un hook personalizado para manejar las muestras de café
export const useSampleManager = () => {

  // Estado para guardar las muestras de café
  // useState con función inicializadora para cargar desde localStorage o usar valores por defecto
  const [samples, setSamples] = useState(() => {
    // Intenta obtener las muestras guardadas en localStorage
    const savedSamples = localStorage.getItem('coffeeSamples');
    return savedSamples ? JSON.parse(savedSamples) : [
      // Muestras por defecto si no hay nada en localStorage
      { id: '0001', quality: 'Pink Bourbon', origin: 'Colombia', date: '2024-07-15', time: '08:00' },
      { id: '0002', quality: 'Geisha', origin: 'Colombia', date: '2024-07-15', time: '14:00' },
      { id: '0003', quality: 'Tabi', origin: 'Colombia', date: '2024-07-16', time: '10:00' }
    ];
  });
  
  // Estado para las muestras filtradas (para búsquedas)
  const [filteredSamples, setFilteredSamples] = useState(samples);
  // Estado para controlar si el modal está abierto o cerrado
  const [modalOpen, setModalOpen] = useState(false);
  // Estado para guardar el índice de la muestra que se está editando
  const [editingSample, setEditingSample] = useState(null);
  // Estado para el formulario de añadir/editar muestra
  const [form, setForm] = useState({ id: '', quality: '', origin: '', date: '', time: '' });
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  // Función para buscar muestras
  // useCallback para evitar recrear la función en cada render
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    const trimmedTerm = term.toLowerCase().trim();
    
    // Si no hay término de búsqueda, mostrar todas las muestras
    if (!trimmedTerm) {
      setFilteredSamples(samples);
    } else {
      // Filtrar las muestras según el término de búsqueda
      setFilteredSamples(samples.filter(sample =>
        sample.id.toLowerCase().includes(trimmedTerm) ||
        sample.quality.toLowerCase().includes(trimmedTerm) ||
        sample.origin.toLowerCase().includes(trimmedTerm) ||
        sample.date.includes(trimmedTerm)
      ));
    }
  }, [samples]);

  // Efecto para guardar las muestras en localStorage y actualizar las muestras filtradas
  useEffect(() => {
    // Guardar muestras en localStorage cada vez que cambian
    localStorage.setItem('coffeeSamples', JSON.stringify(samples));

    // Actualizar las muestras filtradas cuando cambian las muestras
    handleSearch(searchTerm);
  }, [samples, handleSearch, searchTerm]);

  // Función para abrir el modal (añadir o editar)
  const openModal = useCallback((mode, index = null) => {
    if (mode === 'add') {
      // Si es modo "añadir", crear un nuevo ID basado en el máximo ID existente
      const maxId = Math.max(...samples.map(s => parseInt(s.id, 10)), 0);
      const newId = String(maxId + 1).padStart(4, '0');
      
      // Inicializar el formulario con valores por defecto
      setForm({ 
        id: newId, 
        quality: '', 
        origin: '', 
        date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        time: '' 
      });
      setEditingSample(null);
    } else if (mode === 'edit' && index !== null) {
      // Si es modo "editar", cargar los datos de la muestra seleccionada
      setForm({...filteredSamples[index]});
      setEditingSample(index);
    }
    // Abrir el modal
    setModalOpen(true);
  }, [filteredSamples, samples]);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  // Función para manejar cambios en los campos del formulario
  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [id]: value }));
  }, []);

  // Enviar formulario (añadir/editar muestra)
  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Validación básica: asegurarse de que los campos requeridos estén llenos
    if (!form.id || !form.quality || !form.origin || !form.date) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    if (editingSample !== null) {
      // Si estamos editando, actualizar la muestra existente
      const updated = [...samples];
      const originalIndex = samples.findIndex(s => s.id === filteredSamples[editingSample].id);
      
      if (originalIndex !== -1) {
        updated[originalIndex] = form;
        setSamples(updated);
      }
    } else {
      // Si estamos añadiendo, verificar que el ID no exista ya
      if (samples.some(s => s.id === form.id)) {
        alert('El ID ya existe. Por favor use otro.');
        return;
      }
      
      // Añadir la nueva muestra
      setSamples(prevSamples => [...prevSamples, form]);
    }
    
    // Cerrar el modal después de guardar
    closeModal();
  }, [editingSample, filteredSamples, form, samples, closeModal]);

  // Eliminar muestra
  const deleteSample = useCallback((index) => {
    // Pedir confirmación antes de eliminar
    if (window.confirm('¿Estás seguro de eliminar esta muestra?')) {
      const toDelete = filteredSamples[index];
      setSamples(prevSamples => prevSamples.filter(s => s.id !== toDelete.id));
    }
  }, [filteredSamples]);

  // Generar PDF
  const generatePDF = useCallback(() => {
    try {
      // Verificar si la biblioteca jsPDF está cargada
      if (typeof window.jspdf === 'undefined') {
        alert('La biblioteca jsPDF no está cargada. Por favor, asegúrese de incluirla en su proyecto.');
        return;
      }
      
      // Crear un nuevo documento PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Agregar título al PDF
      doc.setFontSize(16);
      doc.text("Reporte de Muestras de Café", 14, 15);
      
      // Agregar fecha de generación
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 22);
      
      // Crear la tabla con los datos de las muestras
      const columns = ["ID", "Calidad", "Origen", "Fecha de Catación", "Hora"];
      const rows = samples.map(sample => [
        sample.id, 
        sample.quality, 
        sample.origin, 
        sample.date, 
        sample.time
      ]);
      
      // Usar autoTable para crear una tabla bonita
      doc.autoTable({ 
        head: [columns], 
        body: rows, 
        startY: 30,
        headStyles: { fillColor: [75, 46, 46] }, // Color café oscuro para los encabezados
        alternateRowStyles: { fillColor: [245, 245, 245] } // Filas alternadas con gris claro
      });
      
      // Agregar total de muestras al final
      const finalY = doc.lastAutoTable.finalY || 30;
      doc.text(`Total de muestras: ${samples.length}`, 14, finalY + 10);
      
      // Guardar el PDF
      doc.save("reporte_muestras_cafe.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF. Verifica la consola para más detalles.");
    }
  }, [samples]);

  // Retornar todos los estados y funciones que necesitamos usar en otros componentes
  return {
    samples,
    filteredSamples,
    modalOpen,
    form,
    editingSample,
    handleSearch,
    openModal,
    closeModal,
    handleChange,
    handleSubmit,
    deleteSample,
    generatePDF
  };
};