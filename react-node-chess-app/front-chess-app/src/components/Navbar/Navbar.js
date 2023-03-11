import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css"

function Navbar() {
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };


    return (
        <nav>
            <ul>
                <li><Link to="/">Accueil</Link></li>
                <li>|</li>
                {token ? (
                    <>
                        <li><Link to="/selectionExercices">Exercices</Link></li>
                        <li>|</li>
                        <li><Link to="/compte">Mon compte</Link></li>
                    </>
                ) : (
                    <li><Link to="/connexion">Connexion</Link></li>
                )}
                {token && (
                    <>
                        <li>|</li>
                        <li><button onClick={handleLogout} className="logout">Déconnexion</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar