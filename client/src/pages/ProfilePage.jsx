// src/pages/ProfilePage.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import { FiUser, FiMail, FiShield, FiEdit2, FiCamera, FiX, FiArrowLeft, FiLock, FiSettings } from "react-icons/fi";
import ConfirmModal from "../components/ConfirmModal";
import ChangePasswordForm from '../components/ChangePasswordForm';
import ChangeEmailForm from '../components/ChangeEmailForm';
import ChangeNameForm from '../components/ChangeNameForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [showAvatarConfirm, setShowAvatarConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/auth");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Загружаем сохраненную аватарку, если она есть
    const savedAvatar = localStorage.getItem(`avatar_${parsedUser.id}`);
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, [navigate]);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Админ';
      case 'moderator':
        return 'Модератор';
      case 'user':
        return 'Пользователь';
      default:
        return 'Пользователь';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin':
        return styles.roleAdmin;
      case 'moderator':
        return styles.roleModerator;
      case 'user':
        return styles.roleUser;
      default:
        return styles.roleUser;
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Создаем превью изображения
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target.result);
        // Сохраняем аватар в localStorage
        localStorage.setItem(`avatar_${user.id}`, e.target.result);
      };
      reader.readAsDataURL(file);

      // TODO: Здесь можно добавить загрузку файла на сервер
      // const formData = new FormData();
      // formData.append('avatar', file);
      // await axios.post('/api/upload-avatar', formData);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Произошла ошибка при загрузке аватарки');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmRemoveAvatar = () => {
    setAvatar(null);
    localStorage.removeItem(`avatar_${user.id}`);
    setShowDeleteConfirm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleUpdateSuccess = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.container}>
        <div className={styles.profileSection}>
          <h1 className={styles.pageTitle}>Профиль</h1>
          
          <div className={styles.profileInfo}>
            <div className={styles.avatarContainer} onClick={handleAvatarClick}>
              {avatar ? (
                <div 
                  className={styles.profileAvatar} 
                  style={{ backgroundImage: `url(${avatar})` }}
                >
                  <div className={styles.avatarOverlay}>
                    <FiCamera size={24} />
                  </div>
                  <button 
                    className={styles.removeAvatarButton}
                    onClick={handleRemoveAvatar}
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {user.username?.charAt(0).toUpperCase()}
                  <div className={styles.avatarOverlay}>
                    <FiCamera size={24} />
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            
            <div className={styles.userInfo}>
              <div className={styles.userHeader}>
                <h2 className={styles.username}>{user.username}</h2>
                <div className={`${styles.role} ${getRoleClass(user.role)}`}>
                  <FiShield className={styles.roleIcon} />
                  <span>{getRoleLabel(user.role)}</span>
                </div>
              </div>
              
              <div className={styles.userDetails}>
                <div className={styles.detailItem}>
                  <FiMail className={styles.detailIcon} />
                  <div className={styles.detailContent}>
                    <span className={styles.detailLabel}>Email</span>
                    <span className={styles.detailValue}>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.settingsGrid}>
            <button 
              className={styles.settingButton}
              onClick={() => setShowNameForm(true)}
            >
              <FiUser className={styles.settingIcon} />
              <span>Изменить имя</span>
              <FiEdit2 className={styles.editIcon} />
            </button>

            <button 
              className={styles.settingButton}
              onClick={() => setShowEmailForm(true)}
            >
              <FiMail className={styles.settingIcon} />
              <span>Изменить почту</span>
              <FiEdit2 className={styles.editIcon} />
            </button>

            <button 
              className={styles.settingButton}
              onClick={() => setShowPasswordForm(true)}
            >
              <FiLock className={styles.settingIcon} />
              <span>Изменить пароль</span>
              <FiEdit2 className={styles.editIcon} />
            </button>
          </div>
        </div>
      </div>
      <Footer />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmRemoveAvatar}
        title="Удаление аватарки"
        message="Вы уверены, что хотите удалить аватарку?"
      />

      {showPasswordForm && (
        <ChangePasswordForm
          onClose={() => setShowPasswordForm(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {showEmailForm && (
        <ChangeEmailForm
          onClose={() => setShowEmailForm(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {showNameForm && (
        <ChangeNameForm
          onClose={() => setShowNameForm(false)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ProfilePage;
