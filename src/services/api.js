import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Configuración global de axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Interceptor para manejar errores de red y timeout
axios.interceptors.request.use(
    config => {
        config.timeout = 5000; // timeout de 5 segundos
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ERR_NETWORK') {
            console.error('Error de conexión con el servidor. Verifique que el servidor esté corriendo.');
            return Promise.reject(new Error('No se pudo conectar con el servidor. Por favor, inténtelo más tarde.'));
        }
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users`, {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            address: userData.address || ''
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        console.log('Intentando login con:', credentials);
        const response = await axios.post('/api/auth/authenticate', {
            email: credentials.email,
            password: credentials.password
        });
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            return response.data;
        }
        throw new Error('No se recibió token del servidor');
    } catch (error) {
        console.error('Error completo:', error);
        
        if (error.response) {
            const errorMessage = error.response.data?.message || error.response.data?.error || 'Error desconocido';
            switch (error.response.status) {
                case 401:
                    throw new Error('Email o contraseña incorrectos');
                case 403:
                    throw new Error('Acceso denegado - Verifica tus credenciales');
                default:
                    throw new Error(errorMessage);
            }
        }
        throw error; // Propagar el error del interceptor
    }
};

export const logoutUser = async () => {
    try {
        // Intentar hacer logout en el servidor
        await axios.post(`${API_URL}/api/auth/logout`);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        // Siempre limpiar el estado local
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Actualizar los datos del usuario
export const updateUserProfile = async (userData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}/api/users`, {
            username: userData.username,
            email: userData.email,
            address: userData.address
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw error;
    }
};

// Obtener el perfil del usuario
export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw error;
    }
};