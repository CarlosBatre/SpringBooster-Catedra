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
import GestionUsuariosAdmin from './components/pages/GestionUsuariosAdmin';
import GestionPedidosAdmin from './components/pages/GestionPedidosAdmin';
import DetallePedidoAdmin from './components/pages/DetallePedidoAdmin';
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
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
