import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../services/api';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getUserProfile();
      setUserData({
        username: data.username || '',
        email: data.email || '',
        address: data.address || ''
      });
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      setError('Error al cargar los datos del usuario');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateUserProfile(userData);
      setIsEditing(false);
      setSuccess('Datos actualizados correctamente');
      setTimeout(() => setSuccess(''), 3000);
      await loadUserData(); // Recargar los datos después de actualizar
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      setError(error.message || 'Error al actualizar los datos');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChange = (field, value) => {
    setUserData(prev => ({
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
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nombre de usuario</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Dirección</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  value={userData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:px-6">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Editar Perfil
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;
