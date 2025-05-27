import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import styles from '../styles/AuthModal.module.css';

const SuccessModal = ({ message }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <div className={styles.successIcon}>
                        <FiCheckCircle />
                    </div>
                    <h2 className={styles.modalTitle}>Успешно!</h2>
                    <p className={styles.modalSubtitle}>{message}</p>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal; 