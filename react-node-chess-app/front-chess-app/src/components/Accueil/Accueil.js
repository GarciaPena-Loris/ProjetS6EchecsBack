import React from "react";
import "../Components.css"
import { Navigate, useNavigate } from "react-router-dom";
import { redirect } from "react-router-dom";

export default function Accueil() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/connexion");
  }

  return (
    <div>
      <h1>BLIND CHESS</h1>
      <div className="divMargin">
        <button onClick={handleClick} className="button-4">Se connecter</button>
      </div>
      <div className="divMargin">
        <button onClick={handleClick} className="button-4">S'inscrire</button>
      </div>
    </div>
  );
}

