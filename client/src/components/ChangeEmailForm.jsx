import React, { useState } from 'react';
import { FiMail, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import styles from '../styles/AuthModal.module.css';
import { authAPI } from '../api/auth';
import SuccessModal from './SuccessModal';

const ChangeEmailForm = ({ onClose, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        newEmail: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Очищаем ошибку при изменении поля
        if (error) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.changeEmail(formData.newEmail, formData.password);
            
            // Обновляем данные пользователя в localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, email: response.user.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                onUpdateSuccess(response.user);
                onClose();
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setError(error.message || 'Ошибка при изменении email. Пожалуйста, попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FiX />
                    </button>

                    <div className={styles.modalContent}>
                        <div className={styles.successIcon}>
                            <FiMail />
                        </div>
                        <h2 className={styles.modalTitle}>Изменение email</h2>
                        <p className={styles.modalSubtitle}>
                            Введите новый email и текущий пароль
                        </p>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <div className={styles.inputWrapper}>
                                    <FiMail className={styles.inputIcon} />
                                    <input
                                        type="email"
                                        name="newEmail"
                                        value={formData.newEmail}
                                        onChange={handleChange}
                                        placeholder="Новый email"
                                        required
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.inputWrapper}>
                                    <FiMail className={styles.inputIcon} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Текущий пароль"
                                        required
                                        className={styles.input}
                                    />
                                    <button
                                        type="button"
                                        className={styles.passwordToggle}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {error && <div className={styles.errorMessage}>{error}</div>}

                            <button 
                                type="submit" 
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Изменение...' : 'Изменить email'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {showSuccessModal && (
                <SuccessModal 
                    message="Email успешно изменен" 
                />
            )}
        </>
    );
};

export default ChangeEmailForm; 