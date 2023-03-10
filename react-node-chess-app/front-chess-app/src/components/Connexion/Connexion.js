import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import "../Components.css"
import "./Connexion.css"

export default function Connexion() {
    const navigate = useNavigate();
    const [nomCompte, setNomCompte] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [reponseServeur, setReponseServeur] = useState("");

    // verifie si la personne est connecté si oui, la renvoie sur la page de selection d'exercice 
    useEffect(()=>{
        if(sessionStorage.token){(navigate("/selectionExercices"))}
    });

    const handleConnexion = async (event) => {
        event.preventDefault();
        const qs = require('qs');
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
        console.log(formData);
        axios(config)
            .then(function (response) {
                console.log(response.data);
                setReponseServeur(response.data);
                // Pour stocker le token dans la variable de session
                sessionStorage.setItem('token', response.data.token);

                navigate("/selectionExercices");
            })
            .catch(function (error) {
                console.log(error.response.data);
                setReponseServeur(error.response.data);
            });
    };

    return (
        <div className="container">
            <div className="connexion">
                <div className="form">
                    <form onSubmit={handleConnexion} action="" methode="post">
                        <h1>Connexion</h1>
                        <div>
                            <input placeholder="Nom de compte" value={nomCompte} onChange={(event) => setNomCompte(event.target.value)} />
                        </div>
                        <div>
                            <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(event) => setMotDePasse(event.target.value)} />
                        </div>
                        <button className="button-4" role="button">Se connecter</button>
                    </form>
                </div>
            </div>
            <div>
                {reponseServeur.error && (
                    <div className="errors">
                        <b>{reponseServeur.error}</b>
                    </div>
                )}
            </div>
        </div>

    );
}
