import { React, useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import axios from "axios";
import "./NiveauxPage.css"

// imporation des composants de chaque niveau
import Nomenclature from '../Exercices/Nomenclature/Nomenclature';
import Nomenclature2 from '../Exercices/Nomenclature/Nomenclature2';
import Nomenclature3 from '../Exercices/Nomenclature/Nomenclature3';
import Nomenclature4 from '../Exercices/Nomenclature/Nomenclature4';

export default function NiveauxPage({ globalElo, setGlobalElo }) {
    const location = useLocation();
    const navigate = useNavigate();
    const exercice = location.state.exercice;
    const niveau = location.state.niveau;
    const index = location.state.index;
    const [exerciceElo, setExerciceElo] = useState(null);
    // console.log(exercice);
    // console.log(niveau);
    // console.log(index);
    useEffect(() => {
        async function setActualExerciceElo() {
            try {
                const decoded = decodeToken(sessionStorage.token);
                const name = decoded.name;
                // get elo
                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `http://localhost:3001/eloExercise/elo/${name}/${exercice.id}`,
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                };
                axios(config)
                    .then(function (response) {
                        console.log("response.data :", response.data.exerciceElo);
                        setExerciceElo(response.data.exerciceElo);
                    })
                    .catch(function (error) {
                        console.log(error.response);
                    });
            }
            catch (error) {
                console.log(error);
            }
        }
        setActualExerciceElo();
    }, [exercice.id]);



    // Créez une structure de données pour stocker les composants de chaque niveau
    const niveaux = {
        1: {
            1: <Nomenclature
                pointsGagnes="5"
                pointsPerdus="2"
                globalElo={globalElo} setGlobalElo={setGlobalElo}
                exerciceElo={exerciceElo} setExerciceElo={setExerciceElo}
            />,
            2: <Nomenclature2 />,
            3: <Nomenclature3 />,
            4: <Nomenclature4 />,
            // etc...
        },
        // etc...
    };

    // Récupérez le composant à afficher en fonction des id
    const NiveauComponent = niveaux[exercice.id][index];

    return (
        <div className="level-container">
            <div className="level-header">
                <button className="valider-bouton back-button" onClick={() => navigate(-1)}>← Retour</button> {/* Retourne à la page précédente */}
                <div className="level-label">Exercice <i>{exercice.name}</i> : <i>niveau {index}</i></div>
                <span className="level-elo">{exerciceElo !== null && exerciceElo} points d'élo pour cet <b>exercice</b></span>
            </div>
            {/* Affichez le composant récupéré */}
            <div className="level-jeux">
                {exerciceElo !== null && NiveauComponent}
            </div>
        </div>
    );
}