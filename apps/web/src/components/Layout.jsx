import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="text-4xl animate-wiggle">🍭</div>
              <Link to="/" className="text-3xl font-display font-bold gradient-text">
                Sweet Delights
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Welcome back!</p>
                      <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-sweet-400 to-sweet-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <span>⚙️</span>
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>✨</span>
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="mt-20 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-2xl font-display font-bold gradient-text mb-2">
              🍭 Sweet Delights 🍭
            </div>
            <p className="text-gray-600">
              Bringing joy through the sweetest treats since 2024
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-2xl">
              <span className="animate-bounce-slow">🍰</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.2s'}}>🍪</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.4s'}}>🍫</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.6s'}}>🧁</span>
              <span className="animate-bounce-slow" style={{animationDelay: '0.8s'}}>🍬</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
