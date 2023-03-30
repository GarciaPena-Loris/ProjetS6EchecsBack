import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "../Components.css"
import "./SelectionExercices.css"

export default function SelectionExercices() {
    const [dataExo, setDataExo] = useState([]);
    const token = sessionStorage.getItem('token');
    const navigate=useNavigate();

    const handleExerciceClick = (exercice) => {
        navigate('/exercices', { state: {exercice: exercice} });
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
    }, [token]);

    return (
        <div>
            <h1>Sélectionnez un exercice :</h1>
            <div className="image-container">
                {dataExo.map((exercice) => (
                    <div className="img-wrapper" key={exercice.id}>
                        <img
                            className="imgExo"
                            src={`${exercice.image}`}
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
