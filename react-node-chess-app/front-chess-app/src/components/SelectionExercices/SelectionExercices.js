import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Components.css"
import exercice1 from './imagesExercices/exercice1.png';
import exercice2 from './imagesExercices/exercice2.png';
import exercice3 from './imagesExercices/exercice3.png';
import exercice4 from './imagesExercices/exercice4.png';
import exercice5 from './imagesExercices/exercice5.png';

export default function SelectionExercices() {
    const [selectedExercice, setSelectedExercice] = useState(null);

    const handleExerciceClick = (exercice) => {
        setSelectedExercice(exercice);
    };

    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/">Accueil</Link></li>
                    <li>|</li>
                    <li><Link to="/compte">Mon compte</Link></li>
                </ul>
            </nav>
            <h1>Sélectionnez un exercice :</h1>
            <div className="image-container">
                <img
                    className="imgExo"
                    src={exercice1}
                    alt="Exercice 1"
                    onClick={() => handleExerciceClick(1)}
                />
                <img
                    className="imgExo"  
                    src={exercice2}
                    alt="Exercice 2"
                    onClick={() => handleExerciceClick(2)}
                />
                <img
                    className="imgExo"
                    src={exercice3}
                    alt="Exercice 3"
                    onClick={() => handleExerciceClick(3)}
                />
                <img
                    className="imgExo"
                    src={exercice4}
                    alt="Exercice 4"
                    onClick={() => handleExerciceClick(4)}
                />
                <img
                    className="imgExo"
                    src={exercice5}
                    alt="Exercice 5"
                    onClick={() => handleExerciceClick(5)}
                />
            </div>
        </div>
    );
}