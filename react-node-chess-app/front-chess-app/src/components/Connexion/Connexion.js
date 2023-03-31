import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../GlobalContext/GlobalContext';
import { decodeToken } from "react-jwt";
import "./Connexion.css"


export default function Connexion() {
    const navigate = useNavigate();

    const [nomCompte, setNomCompte] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [reponseServeur, setReponseServeur] = useState("");
    const { updateGlobalElo,updateGlobalAvatar } = useContext(GlobalContext); // Récupération de globalElo et setGlobalElo avec useContext

    const handleConnexion = async (event) => {
        event.preventDefault();
        const formData = {
            'name': nomCompte,
            'password': motDePasse
        };
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/users/signin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formData
        };
        axios(config)
            .then(async function (response) {
                // Pour stocker le token dans la variable de session
                sessionStorage.setItem('token', response.data.token);
                const decoded = decodeToken(sessionStorage.token);
                const name = decoded.name;
                // get elo
                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `http://localhost:3001/users/globalElo/${name}`,
                    headers: {
                        'Authorization': `Bearer ${response.data.token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                };
                axios(config)
                    .then(function (response) {
                        updateGlobalElo(response.data.global_elo);
                        updateGlobalAvatar(decoded.imageProfil);
                        navigate('/selectionExercices');
                    })
                    .catch(function (error) {
                        console.log(error.response);
                        console.log(error);
                        
                    });
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    setReponseServeur(error.response.data.error);
                }
                else {
                    setReponseServeur(error.message);
                }
                setTimeout(() => {
                    setReponseServeur('');
                }, 4000);
            });
    };

    return (
        <div className="container-connexion">
            <form className="form-connexion" onSubmit={handleConnexion} >
                <h1>Connexion</h1>
                <input
                    className="input-connexion"
                    placeholder="Nom de compte"
                    value={nomCompte}
                    onChange={(event) => setNomCompte(event.target.value)} />
                <input
                    className="input-connexion"
                    type="password"
                    placeholder="Mot de passe"
                    value={motDePasse}
                    onChange={(event) => setMotDePasse(event.target.value)} />
                {nomCompte !== "" && motDePasse !== "" ? (
                    <button
                        className="bouton-custom bouton-custom-form">
                        Se connecter
                    </button>) : (
                    <button
                        className="bouton-custom bouton-custom-form"
                        disabled>
                        Se connecter
                    </button>
                )}
            </form>
            <div>
                {reponseServeur && (
                    <div className="errors">
                        <b>{reponseServeur}</b>
                    </div>
                )}
            </div>
        </div>

    );
}