import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Assuming you have a Dashboard component

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        {/* Public Route: Anyone can access the login page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes: Only accessible if authToken exists */}
        <Route>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* You can add more protected routes here later */}
        </Route>
        
        {/* Redirect root path to the dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      </AuthProvider>
    </BrowserRouter>
    
  );
}

export default App;
