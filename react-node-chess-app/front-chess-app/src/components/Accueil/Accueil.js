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
        <h1 className="titre">Bienvenue sur MentalChess !</h1>
        <img className="img" src="https://i.imgur.com/0EKRDDl.png" alt="imgAcceuil" width="700" height="700"></img>
      </div>
      <div className="divMargin">
        {!sessionStorage.getItem('token') ? (
          <>
            <button onClick={handleClickConnexion} className="bouton-3D">
              <span className="texte-3D">
                Se Connecter
              </span>
            </button>
            <div className="space"></div>
            <button onClick={handleClickInscription} className="bouton-3D">
            <span className="texte-3D">
                S'inscrire
              </span>
            </button>
          </>
        ) : (
          <button onClick={handleClickEntrainement} className="bouton-3D">
            <span className="texte-3D">
                S'entrainer
              </span>
          </button>
        )}
      </div>
    </div>
  );
}

