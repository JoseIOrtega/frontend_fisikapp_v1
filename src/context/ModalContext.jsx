import { createContext, useState, useContext } from 'react';
import StatusModal from '../components/modals/StatusModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info', // success, error, warning, info
    message: '',
  });

  // Función para abrir el modal desde cualquier parte
  const showModal = (type, message) => {
    setModalConfig({ isOpen: true, type, message });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {/* El componente físico del modal vive aquí */}
      <StatusModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        message={modalConfig.message}
        onClose={closeModal} 
      />
    </ModalContext.Provider>
  );
};

// El "Control Remoto" (Hook)
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal debe usarse dentro de un ModalProvider");
  }
  return context;
};