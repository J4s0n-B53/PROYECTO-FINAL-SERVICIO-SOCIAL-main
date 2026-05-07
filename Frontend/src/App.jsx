import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Auth/Login';
import ListaOfertas from './components/ListaOfertas';

function App() {
  
  const [user, setUser] = useState( null); 

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* RUTA 1: Login (Raíz) */}
          <Route 
            path="/" 
            element={!user ? <Login onLoginSuccess={setUser} /> : <Navigate to="/ofertas" />} 
          />
          
          {/* RUTA 2: Ofertas (Protegida) */}
          <Route 
            path="/ofertas" 
            element={user ? <ListaOfertas carreraId={user.carrera} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;