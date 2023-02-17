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
      <div className="divAccueil">
        <h1 className="titre">BLIND CHESS</h1>
        <img src={imageAccueil} alt="imgAcceuil" width="377" height="377"></img>
      </div>  
      <div className="divMargin">
        <button onClick={handleClickConnexion} className="button-4">Se connecter</button>
      </div>
      <div className="divMargin">
        <button onClick={handleClickInscription} className="button-4">S'inscrire</button>
      </div>
    </div>
  );
}

