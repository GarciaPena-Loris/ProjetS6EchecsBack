import React from "react";
import "../Components.css"
import { Navigate, useNavigate } from "react-router-dom";
import imageAccueil from "../../imageAccueil.png"
import { redirect } from "react-router-dom";


export default function Accueil() {
  //fonction utile pour le router (plus particulièrement les boutons)
  const navigate = useNavigate();
  //partie fonctionnel du bouton 'se connecter'
  function handleClickConnexion() {
    navigate("/connexion");
  }

  function handleClickInscription() {
    navigate("/inscription");
  }

  return (
    <div>
      <div>
        <h1 className="titre">BLIND CHESS</h1>
        <img src={imageAccueil} alt="imgAcceuil" width="600" height="600"></img>
      </div>
      <div className="divMargin">
        <button onClick={handleClickConnexion} className="button-4">Se connecter</button>
        <div className="space"></div>
        <button onClick={handleClickInscription} className="button-4">S'inscrire</button>
      </div>
    </div>
  );
}

