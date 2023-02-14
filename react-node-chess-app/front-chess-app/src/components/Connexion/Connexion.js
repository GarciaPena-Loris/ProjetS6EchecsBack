import React from "react";
import "./Connexion.css"

export default function Connexion(){
    return(
        <div className="form">
            <header>
                <form action="" methode="post">
                    <h1>Connexion</h1>
                    <div>
                        <input placeholder="Nom de compte"></input>
                    </div>
                    <div>
                        <input type="password" placeholder="Mot de passe" className="input100"></input>
                    </div>
                    <button class="button-4" role="button">Se connecter</button>
                </form>
            </header>
        </div>
    );
}
