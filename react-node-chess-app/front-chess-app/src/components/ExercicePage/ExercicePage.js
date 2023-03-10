import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "../Components.css"
import "./ExercicePage.css"

export default function ExercicePage({id_exercice}) {
    const [dataLevels, setDataLevels] = useState([]);
    const [dataExo, setDataExo] = useState([]);
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const exerciceid = sessionStorage.getItem('exerciceSelectionne');
    
    //fonction pour les boutons 
    const handleLevelClick = (level) => {
        navigate("/"+dataExo.name.toLowerCase()+"/niveau"+level.id);
    };

    //Pour récuperer les data de l'exo
    useEffect(() => {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/exercises/'+exerciceid,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setDataExo(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    //useEffect recupere les info de chaques levels au chargement de la page
    useEffect(() => {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/levels/allLevels/'+exerciceid,
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
        <div className="exercise-page">
            <div>
                <h1 className="exercise-title">{dataExo.name}</h1>
                <i className="exercise-description-name">Règles du jeu :</i>
                <p className="exercise-description">{dataExo.description}</p>
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
