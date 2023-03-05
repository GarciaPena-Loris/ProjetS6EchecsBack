import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "../Components.css"
import "./NomenclatureExo.css"

export default function NomenclatureExo() {
    const [dataLevels, setDataLevels] = useState([]);
    const token = sessionStorage.getItem('token');
    //verifie si la personne est bien connecté avant de charger la page
    useEffect(() => {
        if (!token) { (navigate("/connexion")) }
    });

    //useEffect recupere les info de chaques levels au chargement de la page
    useEffect(() => {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/levels/allLevels/1',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setDataLevels(response.data.sort((a, b) => b.id - a.id));
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div className="container">
            <h1>Nomenclature des exercices</h1>
            <div className="button-column">
                {dataLevels.map((level) => (
                    <div key={level.id} className="button-wrapper">
                        <Link to={`/niveaux/${level.id}`} className="button">
                            {level.name}
                        </Link>
                        <div className="level-number">
                            {`Niveau ${level.id}`}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}