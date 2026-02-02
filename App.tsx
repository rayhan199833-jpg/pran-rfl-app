
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Simple persistence check
  useEffect(() => {
    const savedUser = localStorage.getItem('pran_rfl_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (username: string) => {
    const newUser = { username, isAuthenticated: true };
    setUser(newUser);
    localStorage.setItem('pran_rfl_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pran_rfl_user');
  };

  return (
    <div className="min-h-screen">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
