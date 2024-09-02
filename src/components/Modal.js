import React from 'react';
import '../styles/Modal.css'; // Importing styles for the Modal component

/**
 * Modal component for displaying overlay dialogs.
 * @param {boolean} show - Determines if the modal should be visible.
 * @param {function} onClose - Callback function to handle closing the modal.
 * @param {string} title - Title to display at the top of the modal.
 * @param {React.ReactNode} children - Content to display inside the modal.
 * @returns {React.ReactNode} - Rendered modal component or null if not visible.
 */
const Modal = ({ show, onClose, title, children }) => {
    // Return null if the modal should not be shown
    if (!show) return null;

    return (
        <div className='modal-backdrop'>
            {/* Modal content container */}
            <div className='modal-content'>
                {/* Modal title */}
                <h3>{title}</h3>
                {/* Modal body content */}
                <div>{children}</div>
                {/* Close button */}
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
