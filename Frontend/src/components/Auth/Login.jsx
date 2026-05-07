import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    // Estado para la animación del panel
    const [isActive, setIsActive] = useState(false);
    
    // Estados para el login
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    // --- FUNCIÓN DE LOGIN ---
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert(`Bienvenido, ${data.user.nombre_completo}`);
                if (onLoginSuccess) onLoginSuccess(data.user);
            } else {
                alert(data.mensaje || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error en el login:", error);
            alert("No se pudo conectar con el servidor");
        }
    };

    // --- FUNCIÓN DE REGISTRO (AÑADIDA) ---
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
        // Accedemos a los valores de los inputs del formulario de registro
        const datosRegistro = {
            nombre_completo: e.target[0].value,
            id_carrera: e.target[1].value,
            correo_institucional: e.target[2].value,
            password_hash: e.target[3].value
        };

        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosRegistro)
            });
            
            const data = await res.json();

            if (res.ok) {
                alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
                setIsActive(false); // Mueve el panel al lado del Login (Azul)
            } else {
                alert(data.mensaje || "Error al registrarse");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error al conectar con el servidor");
        }
    };

    return (
        <div className={`container ${isActive ? "right-panel-active" : ""}`} id="container">
            
            {/* Panel de Registro */}
            <div className="form-container sign-up-container">
                <form onSubmit={handleRegisterSubmit}>
                    <h1>Crea una Cuenta</h1>
                    <input type="text" placeholder="Nombre Completo" required />
                    
                    {/* Selector de Carrera */}
                    <select className="select-carrera" defaultValue="" required>
                        <option value="" disabled>Selecciona tu Carrera</option>
                        <option value="1">Lic. en Ciencias Jurídicas</option>
                        <option value="2">Lic. en Administración de Empresas</option>
                        <option value="3">Lic. en Mercadeo</option>
                        <option value="4">Lic. en Contaduria Publica</option>
                        <option value="5">Ing. Electrica</option>
                        <option value="6">Ing. Industrial</option>
                        <option value="7">Ing. en Sistemas Computacionales</option>
                        <option value="8">Ing. en Agronegocios</option>
                        <option value="9">Tec. en Logística y Aduanas</option>
                        <option value="10">Lic. en Psicología</option>
                        <option value="11">Tec. en Enfermería</option>
                    </select>

                    <input type="email" placeholder="Correo Institucional" required />
                    <input type="password" placeholder="Contraseña" required />
                    <button type="submit" className="btn-main">REGISTRARSE</button>
                </form>
            </div>

            {/* Panel de Login */}
            <div className="form-container sign-in-container">
                <form onSubmit={handleLoginSubmit}>
                    <h1>Iniciar Sesión</h1>
                    <input 
                        type="email" 
                        placeholder="Correo Institucional" 
                        required 
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn-main">INICIAR SESIÓN</button>
                </form>
            </div>

            {/* Overlay */}
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>¡Hola!, ¿eres nuevo por aca?</h1>
                        <p>Regístrate con tus datos personales para utilizar las funciones del sitio</p>
                        <button className="ghost" onClick={() => setIsActive(false)}>Iniciar sesión</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>¡Bienvenido de nuevo!</h1>
                        <p>Ingresa tus datos personales para utilizar las funciones del sitio</p>
                        <button className="ghost" onClick={() => setIsActive(true)}>Registrarse</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;