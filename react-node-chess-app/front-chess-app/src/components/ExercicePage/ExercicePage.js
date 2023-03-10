import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import "../Components.css"
import "./ExercicePage.css"

export default function ExercicePage() {
    const [dataLevels, setDataLevels] = useState([]);
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const exercice = location.state.exercice;
    const exerciceId = exercice.id;

    //fonction pour les boutons 
    const handleLevelClick = (level) => {
        // navigate("/"+dataExo.name.toLowerCase()+"/niveau"+level.id);
        navigate('/niveaux', { state: { exerciceId: exerciceId, niveauId: level.id } });
    };

    
    //useEffect recupere les info de chaques levels au chargement de la page
    useEffect(() => {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/levels/allLevels/' + exerciceId,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setDataLevels(response.data.sort((a, b) => a.id - b.id));
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div className="exercice-page">
            <div>
                <h1 className="exercice-title">{exercice.name}</h1>
                <i className="exercice-description-name">Règles du jeu :</i>
                <p className="exercice-description">{exercice.description}</p>
            </div>
            <div className="levels-container">
                <div className="level-header">
                    <div className="level-title"> Niveaux </div>
                    <div className="level-title">Description</div>
                </div>
                {dataLevels.map((level, index) => (
                    <div key={level.id} className="level-row">
                        <div className="level-name-container">
                            <div className="level-name">{level.name}</div>
                            <button className="level-button" onClick={() => handleLevelClick(level)}>Niveau {index + 1} </button>
                        </div>
                        <div className="level-name-container">
                            <div className="level-description">{level.rules}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
