const API_URL = 'http://localhost:5001/api';

export const authAPI = {
    // Регистрация
    register: async (formData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        return response.json();
    },

    // Вход
    login: async (formData) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
        }
        return data;
    },

    // Смена пароля
    changePassword: async (formData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
        }

        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify(formData),
        });
        return response.json();
    },

    async changeUsername(formData) {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Требуется авторизация');
        }

        try {
            const response = await fetch(`${API_URL}/auth/change-username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при изменении имени пользователя');
            }

            return data;
        } catch (error) {
            console.error('Error changing username:', error);
            throw error;
        }
    },

    changeEmail: async (newEmail, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/change-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify({ newEmail, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Ошибка при изменении email');
            }

            return data;
        } catch (error) {
            console.error('Error changing email:', error);
            throw error;
        }
    },
}; 