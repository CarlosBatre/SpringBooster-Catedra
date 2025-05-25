import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Products from './components/pages/Products';
import Profile from './components/pages/Profile';
import Cart from './components/pages/Cart';
import PrivateRoute from './components/PrivateRoute';
import DashboardAdmin from './components/pages/DashboardAdmin';
import CrearProducto from './components/pages/CrearProducto';
import EditarProducto from './components/pages/EditarProducto';
import OrderForm from './components/pages/OrderForm';
import GestionUsuariosAdmin from './components/pages/GestionUsuariosAdmin';
import GestionPedidosAdmin from './components/pages/GestionPedidosAdmin';
import DetallePedidoAdmin from './components/pages/DetallePedidoAdmin';
import RoleProtectedRoute from './components/RoleProtecteRoute';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
           <Route
          path="/create-order"
          element={
            <PrivateRoute>
              <OrderForm />
            </PrivateRoute>
          }
        />

        <Route path="/admin/dashboard" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
            <DashboardAdmin />
          </RoleProtectedRoute>
        } />

        <Route path="/admin/dashboard/crear-producto" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
            <CrearProducto />
          </RoleProtectedRoute>
        } />

        <Route path="/admin/dashboard/editar-producto/:id" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
            <EditarProducto />
          </RoleProtectedRoute>
        } />

        <Route path="/admin/dashboard/gestion-usuarios" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
            <GestionUsuariosAdmin />
          </RoleProtectedRoute>
        } />

        <Route path="/admin/dashboard/gestion-pedidos" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
            <GestionPedidosAdmin />
          </RoleProtectedRoute>
        } />

        <Route path="/admin/dashboard/pedidos/:id" element={
          <RoleProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
            <DetallePedidoAdmin />
          </RoleProtectedRoute>
        } />
       
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
