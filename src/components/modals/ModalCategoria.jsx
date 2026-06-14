import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import styles from "./ModalCategoria.module.css";

function ModalCategoria({ show, onHide, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre de la categoría es requerido";
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    onSave(formData);
    setFormData({ nombre: "", descripcion: "" });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ nombre: "", descripcion: "" });
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered size="lg" className={styles.modalContent}>
      <Modal.Header closeButton>
        <Modal.Title>Nueva Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de Categoría *</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ej: Cinemática, Mecánica, Termodinámica"
              value={formData.nombre}
              onChange={handleChange}
              isInvalid={!!errors.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción Corta *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              placeholder="Describe brevemente el contenido y alcance de esta categoría"
              value={formData.descripcion}
              onChange={handleChange}
              isInvalid={!!errors.descripcion}
            />
            <Form.Control.Feedback type="invalid">
              {errors.descripcion}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Categoría
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalCategoria;
