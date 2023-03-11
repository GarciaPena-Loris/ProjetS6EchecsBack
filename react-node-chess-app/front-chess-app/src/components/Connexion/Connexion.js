import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Connexion.css"

export default function Connexion() {
    // verifie si la personne est connecté si oui, la renvoie sur la page de selection d'exercice 
    const navigate = useNavigate();
    if (sessionStorage.token) { (navigate("/selectionExercices")) };

    const [nomCompte, setNomCompte] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [reponseServeur, setReponseServeur] = useState("");


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
            .then(function (response) {
                console.log(response.data);
                // Pour stocker le token dans la variable de session
                sessionStorage.setItem('token', response.data.token);

                navigate('/selectionExercices');
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    setReponseServeur(error.response.data.error);
                }
                else {
                    setReponseServeur(error.message);
                }
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
