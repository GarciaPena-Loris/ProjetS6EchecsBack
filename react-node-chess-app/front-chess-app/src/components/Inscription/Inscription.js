import React from "react";
import "../Connexion/Connexion.css"

export default function Inscription(){
    return(
        <div className="form">
            <header>
                <form action="" methode="post">
                    <h1>Inscription</h1>
                    <div>
                        <input placeholder="Nom de compte"></input>
                    </div>
                    <div>
                        <input type="password" placeholder="Mot de passe" className="input100"></input>
                    </div>
                    <div>
                        <input type="password" placeholder="Confirmer le mot de passe" className="input100"></input>
                    </div>
                    <button class="button-4" role="button">Se connecter</button>
                </form>
            </header>
        </div>
    );
}
