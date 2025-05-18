import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Configuración global de axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Interceptor para manejar expiración del token (1 minuto)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            // Redireccionar al login si es necesario
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Interceptor para añadir el token a las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configurar axios para incluir las credenciales en las solicitudes
axios.defaults.withCredentials = true;

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
        console.log('Intentando iniciar sesión con:', credentials.username);
        const response = await axios.post('/api/auth/login', credentials, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        
        console.log('Respuesta del servidor:', response.data);
        
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
            // Configurar el token para futuras peticiones
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            return response.data;
        } else {
            console.error('Respuesta sin token:', response.data);
            throw new Error('No se recibió token del servidor');
        }
    } catch (error) {
        console.error('Error completo:', error);
        
        if (error.response) {
            console.error('Error del servidor:', error.response.data);
            const errorMessage = error.response.data?.message || error.response.data?.error || 'Error desconocido';
            switch (error.response.status) {
                case 401:
                    throw new Error('Usuario o contraseña incorrectos');
                case 403:
                    throw new Error('Acceso denegado - Verifica tus credenciales');
                default:
                    throw new Error(errorMessage);
            }
        }
        throw new Error('Error de conexión con el servidor');
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