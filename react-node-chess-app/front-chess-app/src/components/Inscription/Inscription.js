import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Inscription.css"
import axios from "axios";

export default function Inscription() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [reponseServeur, setReponseServeur] = useState("");

    // verifie si la personne est connecté si oui, la renvoie sur la page de selection d'exercice
    useEffect(()=>{
        if(sessionStorage.token){(navigate("/selectionExercices"))}
    });

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const qs = require('qs');
        const formData = {
            'name': username,
            'password': password
        };
        var config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/users/signup',
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
                navigate("/connexion")
            })
            .catch(function (error) {
                console.log(error.response.data);
                setReponseServeur(error.response.data);
            });
    };

    // Vérification si les deux mots de passe sont identiques
    const checkPasswordMatch = () => {
        if (password === confirmPassword) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    };

    return (
        <div className="container">
            <div className="connexion">
                <div className="form">
                    <header>
                        <form onSubmit={handleSubmit}>
                            <h1>Inscription</h1>
                            <div>
                                <input
                                    placeholder="Nom de compte"
                                    value={username}
                                    onChange={handleUsernameChange}
                                    required
                                ></input>
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onBlur={checkPasswordMatch}
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Confirmation du mot de passe"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    onBlur={checkPasswordMatch}
                                    required
                                />
                            </div>
                            <button
                                className="button-4"
                                type="submit"
                                role="button"
                                disabled={buttonDisabled} // utilisez la variable buttonDisabled ici
                            >
                                S'inscrire
                            </button>
                        </form>
                    </header>
                </div>
            </div>
        </div>
    );
}
