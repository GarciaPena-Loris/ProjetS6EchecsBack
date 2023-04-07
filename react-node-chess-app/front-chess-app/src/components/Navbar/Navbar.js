import { React, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext  } from '../GlobalContext/GlobalContext';
import "./Navbar.css"

function Navbar() {
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { globalElo } = useContext(GlobalContext);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('globalElo');
        navigate('/');
    };

    return (
        <nav className='nav-bar'>
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
                    <>
                        <li><Link to="/connexion" replace>Connexion</Link></li>
                        <li>|</li>
                        <li><Link to="/inscription">Inscription</Link></li>
                    </>
                )}
                {token && (
                    <>
                        <li>|</li>
                        <li><button onClick={handleLogout} className="logout">Déconnexion</button></li>
                    </>
                )}
            </ul>
            {globalElo && (
                <span className='elo'>{globalElo} points d'élo général</span>
            )}
        </nav>
    );
}

export default Navbar