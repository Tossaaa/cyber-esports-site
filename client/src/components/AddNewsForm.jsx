import React, { useState } from 'react';
import styles from '../styles/AddNewsForm.module.css';
import { FiX } from 'react-icons/fi';

const AddNewsForm = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      date: 'Только что',
      image: formData.image ? URL.createObjectURL(formData.image) : null
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        <h2>Добавить новость</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Заголовок</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image">Изображение (необязательно)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Добавить новость
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewsForm; 