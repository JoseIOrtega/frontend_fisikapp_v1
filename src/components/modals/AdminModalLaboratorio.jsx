import { Modal, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import styles from "./AdminModalLaboratorio.module.css";

function ExampleModal({ show, onHide, categorias = [] }) {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    nuevaCategoria: ""
  });
  const [categoriasLocal, setCategoriasLocal] = useState(categorias);

  // Actualizar categorías locales cuando cambien las props
  useEffect(() => {
    setCategoriasLocal(categorias);
  }, [categorias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Validar que se haya ingresado un nombre
    if (formData.nombre.trim() === "") {
      alert("⚠️ Por favor, ingresa el nombre del laboratorio.");
      return;
    }

    // Validar que se haya seleccionado una categoría (existente o nueva)
    if (formData.categoria === "" && formData.nuevaCategoria.trim() === "") {
      alert("⚠️ Por favor, selecciona una categoría o crea una nueva.");
      return;
    }

    // Validar si hay nueva categoría
    if (formData.nuevaCategoria.trim() !== "") {
      // Verificar si la categoría ya existe (comparación sin mayúsculas/minúsculas)
      const categoriaExiste = categoriasLocal.some(
        cat => cat.toLowerCase() === formData.nuevaCategoria.toLowerCase()
      );

      if (categoriaExiste) {
        alert(`⚠️ La categoría "${formData.nuevaCategoria}" ya existe.`);
        return; // No continuar si la categoría ya existe
      } else {
        // Agregar la nueva categoría a la lista
        setCategoriasLocal([...categoriasLocal, formData.nuevaCategoria]);
      }
    }

    // Aquí puedes agregar la lógica para guardar el laboratorio
    setFormData({ nombre: "", categoria: "", nuevaCategoria: "" });
    onHide();
  };

  const handleCancel = () => {
    setFormData({ nombre: "", categoria: "", nuevaCategoria: "" });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered size="lg" className={styles.modalContent}>
      <Modal.Header closeButton>
        <Modal.Title>Añadir Laboratorio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre Laboratorio</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingresa el nombre del laboratorio"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              disabled={formData.nuevaCategoria.trim() !== ""}
            >
              <option value="">Selecciona una categoría</option>
              {categoriasLocal.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nueva Categoría</Form.Label>
            <Form.Control
              type="text"
              name="nuevaCategoria"
              placeholder="Ingresa una nueva categoría (opcional)"
              value={formData.nuevaCategoria}
              onChange={handleChange}
              disabled={formData.categoria !== ""}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExampleModal;