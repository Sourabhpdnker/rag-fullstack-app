// frontend/src/services/api.js
const API_BASE_URL = 'http://127.0.0.1:8000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }
    return response.json();
};

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    post: async (endpoint, data) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    postFormData: async (endpoint, formData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });
        return handleResponse(response);
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    }
};