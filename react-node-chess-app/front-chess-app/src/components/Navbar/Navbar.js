import { React, useContext } from 'react';
import Avatar from 'react-avatar';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext/GlobalContext';
import "./Navbar.css"

function Navbar() {
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const { globalElo, globalAvatar } = useContext(GlobalContext);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
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
            <div className='element-droite'>
                {globalElo && token && (
                    <span className='elo'>{globalElo} points d'élo </span>
                )}
                {token && (
                    <>
                        <Link to="/compte"><Avatar className='avatar-navbar' size='40' round={true} src={globalAvatar} /></Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar