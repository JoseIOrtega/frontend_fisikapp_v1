import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import styles from "./ModalObjetivos.module.css";

function ModalObjetivos({ show, onHide, onSave }) {
  const [formData, setFormData] = useState({
    objetivo: ""
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
    if (!formData.objetivo.trim()) {
      newErrors.objetivo = "El objetivo es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    onSave(formData);
    setFormData({ objetivo: "" });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ objetivo: "" });
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered size="lg" className={styles.modalContent}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Objetivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Descripción del Objetivo *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="objetivo"
              placeholder="Ej: Que el estudiante comprenda la Segunda Ley de Newton y pueda aplicarla en problemas cotidianos"
              value={formData.objetivo}
              onChange={handleChange}
              isInvalid={!!errors.objetivo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.objetivo}
            </Form.Control.Feedback>
            <Form.Text className="text-muted mt-2">
              Redacta el objetivo pedagógico de manera clara y específica
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Agregar Objetivo
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalObjetivos;
