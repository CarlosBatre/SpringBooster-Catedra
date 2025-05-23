import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    address: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Cargar datos del usuario al montar el componente
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError('Error al cargar los datos del usuario');
      }
    };

    loadUserData();
  }, []);

  const handleEdit = (field) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        'http://localhost:8080/api/users/profile',
        { [field]: userData[field] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditing((prev) => ({
        ...prev,
        [field]: false,
      }));
      setSuccess(`${field} actualizado correctamente`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error(`Error al actualizar ${field}:`, error);
      setError(`Error al actualizar ${field}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Tu Perfil</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Información personal y detalles de la cuenta</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 mx-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <div className="border-t border-gray-200">
          <dl>
            {/* Username */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nombre de usuario</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                {isEditing.username ? (
                  <>
                    <input
                      type="text"
                      value={userData.username}
                      onChange={(e) => handleChange('username', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md mr-2"
                    />
                    <button
                      onClick={() => handleSave('username')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{userData.username}</span>
                    <button
                      onClick={() => handleEdit('username')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                  </>
                )}
              </dd>
            </div>

            {/* Email */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                {isEditing.email ? (
                  <>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md mr-2"
                    />
                    <button
                      onClick={() => handleSave('email')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{userData.email}</span>
                    <button
                      onClick={() => handleEdit('email')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                  </>
                )}
              </dd>
            </div>

            {/* Address */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                {isEditing.address ? (
                  <>
                    <input
                      type="text"
                      value={userData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md mr-2"
                    />
                    <button
                      onClick={() => handleSave('address')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                  </>
                ) : (
                  <>
                    <span>{userData.address}</span>
                    <button
                      onClick={() => handleEdit('address')}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
