import { useEffect, useState, useCallback } from 'react';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

// Este es un hook personalizado para manejar las muestras de café
export const useSampleManager = () => {
  const [samples, setSamples] = useState(() => {
    const savedSamples = localStorage.getItem('coffeeSamples');
    return savedSamples ? JSON.parse(savedSamples) : [
      { id: '0001', quality: 'Pink Bourbon', origin: 'Colombia', date: '2024-07-15', time: '08:00' },
      { id: '0002', quality: 'Geisha', origin: 'Colombia', date: '2024-07-15', time: '14:00' },
      { id: '0003', quality: 'Tabi', origin: 'Colombia', date: '2024-07-16', time: '10:00' }
    ];
  });

  const [filteredSamples, setFilteredSamples] = useState(samples);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState(null);
  const [form, setForm] = useState({ id: '', quality: '', origin: '', date: '', time: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    const trimmedTerm = term.toLowerCase().trim();

    if (!trimmedTerm) {
      setFilteredSamples(samples);
    } else {
      setFilteredSamples(samples.filter(sample =>
        sample.id.toLowerCase().includes(trimmedTerm) ||
        sample.quality.toLowerCase().includes(trimmedTerm) ||
        sample.origin.toLowerCase().includes(trimmedTerm) ||
        sample.date.includes(trimmedTerm)
      ));
    }
  }, [samples]);

  useEffect(() => {
    localStorage.setItem('coffeeSamples', JSON.stringify(samples));
    handleSearch(searchTerm);
  }, [samples, handleSearch, searchTerm]);

  const openModal = useCallback((mode, index = null) => {
    if (mode === 'add') {
      const maxId = Math.max(...samples.map(s => parseInt(s.id, 10)), 0);
      const newId = String(maxId + 1).padStart(4, '0');

      setForm({
        id: newId,
        quality: '',
        origin: '',
        date: new Date().toISOString().split('T')[0],
        time: ''
      });
      setEditingSample(null);
    } else if (mode === 'edit' && index !== null) {
      setForm({ ...filteredSamples[index] });
      setEditingSample(index);
    }
    setModalOpen(true);
  }, [filteredSamples, samples]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [id]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    if (!form.id || !form.quality || !form.origin || !form.date) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (editingSample !== null) {
      const updated = [...samples];
      const originalIndex = samples.findIndex(s => s.id === filteredSamples[editingSample].id);

      if (originalIndex !== -1) {
        updated[originalIndex] = form;
        setSamples(updated);
      }
    } else {
      if (samples.some(s => s.id === form.id)) {
        alert('El ID ya existe. Por favor use otro.');
        return;
      }

      setSamples(prevSamples => [...prevSamples, form]);
    }

    closeModal();
  }, [editingSample, filteredSamples, form, samples, closeModal]);

  const deleteSample = useCallback((index) => {
    if (window.confirm('¿Estás seguro de eliminar esta muestra?')) {
      const toDelete = filteredSamples[index];
      setSamples(prevSamples => prevSamples.filter(s => s.id !== toDelete.id));
    }
  }, [filteredSamples]);

  const generatePDF = useCallback(() => {
    try {
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Reporte de Muestras de Café", 14, 15);

      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 22);

      const columns = ["ID", "Calidad", "Origen", "Fecha de Catación", "Hora"];
      const rows = samples.map(sample => [
        sample.id,
        sample.quality,
        sample.origin,
        sample.date,
        sample.time
      ]);

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 30,
        headStyles: { fillColor: [75, 46, 46] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });

      const finalY = doc.lastAutoTable.finalY || 30;
      doc.text(`Total de muestras: ${samples.length}`, 14, finalY + 10);

      doc.save("reporte_muestras_cafe.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF. Verifica la consola para más detalles.");
    }
  }, [samples]);

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
