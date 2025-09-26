import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
