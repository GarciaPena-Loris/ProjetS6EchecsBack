import React from "react";
import "../Components.css"
import { useNavigate } from "react-router-dom";
import imageAccueil from "../../files/imageAccueil.png"


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

  function handleClickEntrainement() {
    navigate("/selectionExercices");
  }

  return (
    <div>
      <div>
        <h1 className="titre">BLIND CHESS</h1>
        <img src={imageAccueil} alt="imgAcceuil" width="600" height="600"></img>
      </div>
      <div className="divMargin">
        {!sessionStorage.getItem('token') ? (
          <>
            <button onClick={handleClickConnexion} className="bouton-custom">Se connecter</button>
            <div className="space"></div>
            <button onClick={handleClickInscription} className="bouton-custom">S'inscrire</button>
          </>
        ) : (
          <button onClick={handleClickEntrainement} className="bouton-custom">S'entraîner</button>
        )}
      </div>
    </div>
  );
}

