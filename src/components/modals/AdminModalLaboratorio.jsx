import { Modal, Button } from "react-bootstrap";

function ExampleModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Título del Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Este modal ya viene con estilos y animaciones.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ExampleModal;