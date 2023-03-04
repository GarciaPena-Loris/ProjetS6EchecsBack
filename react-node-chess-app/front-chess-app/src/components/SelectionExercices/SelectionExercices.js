import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Components.css"
import "./SelectionExercices.css"
import exercice1 from './imagesExercices/exercice1.png';
import exercice2 from './imagesExercices/exercice2.png';
import exercice3 from './imagesExercices/exercice3.png';
import exercice4 from './imagesExercices/exercice4.png';
import exercice5 from './imagesExercices/exercice5.png';

export default function SelectionExercices() {
    const [selectedExercice, setSelectedExercice] = useState(null);
    const [dataExo, setDataExo] = useState([]);
    const token = sessionStorage.getItem('token');

    const handleExerciceClick = (exercice) => {
        setSelectedExercice(exercice);
    };

    //useEffect recupere les info de chaques exercices au chargement de la page
    useEffect(() => {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/exercises',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        axios(config)
            .then(response => {
                setDataExo(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

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
                {dataExo.map((exercice) => (
                    <div className="img-wrapper" key={exercice.id}>
                        <img
                            className="imgExo"
                            src={exercice1}
                            alt={`Exercice ${exercice.id}`}
                            onClick={() => handleExerciceClick(exercice)}
                        />
                        <p className="exo-name">{exercice.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
