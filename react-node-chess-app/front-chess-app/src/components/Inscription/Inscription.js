import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Inscription.css"
import axios from "axios";

export default function Inscription() {
    // verifie si la personne est connecté si oui, la renvoie sur la page de selection d'exercice
    const navigate = useNavigate();
    if (sessionStorage.token) { (navigate("/selectionExercices")) }

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [reponseServeur, setReponseServeur] = useState("");
    const passwordIsValid = /^(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);


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
        <div className="container-inscription">
            <form className="form-inscription" onSubmit={handleSubmit}>
                <h1>Inscription</h1>
                <input
                    className="input-inscription"
                    placeholder="Nom de compte"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                />
                <i className="info">
                    (3 caractères minimum)
                </i>
                <input
                    className="input-inscription"
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <i className="info">
                    (8 caractères minimum, 1 chiffre et 1 caractère spécial)
                </i>
                <input
                    className="input-inscription"
                    type="password"
                    placeholder="Confirmation du mot de passe"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                />
                {username !== "" &&
                    username.length >= 3 &&
                    passwordIsValid &&
                    password === confirmPassword ?
                    (
                        <button
                            className="bouton-custom bouton-custom-form"
                            type="submit">
                            S'inscrire
                        </button>
                    ) :
                    (
                        <button
                            className="bouton-custom bouton-custom-form"
                            type="submit"
                            disabled={true}>
                            S'inscrire
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
