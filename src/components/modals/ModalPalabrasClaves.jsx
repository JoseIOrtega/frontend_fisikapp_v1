import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import styles from "./ModalPalabrasClaves.module.css";

function ModalPalabrasClaves({ show, onHide, onSave }) {
  const [formData, setFormData] = useState({
    termino: ""
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
    if (!formData.termino.trim()) {
      newErrors.termino = "El término es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    onSave(formData);
    setFormData({ termino: "" });
    setErrors({});
  };

  const handleCancel = () => {
    setFormData({ termino: "" });
    setErrors({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} centered size="lg" className={styles.modalContent}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Palabra Clave</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Término / Palabra Clave *</Form.Label>
            <Form.Control
              type="text"
              name="termino"
              placeholder="Ej: Velocidad, Aceleración, Vector, Movimiento"
              value={formData.termino}
              onChange={handleChange}
              isInvalid={!!errors.termino}
            />
            <Form.Control.Feedback type="invalid">
              {errors.termino}
            </Form.Control.Feedback>
            <Form.Text className="text-muted mt-2">
              Ingresa conceptos clave relacionados con el laboratorio
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Agregar Palabra Clave
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalPalabrasClaves;
