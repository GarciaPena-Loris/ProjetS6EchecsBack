import { React, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { decodeToken } from "react-jwt";
import { GlobalContext } from '../GlobalContext/GlobalContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from "axios";
import { Howl, Howler } from 'howler';


import "./NiveauxPage.css"

// imporation des composants de chaque niveau
import Notation1 from '../Exercices/Notation/Notation1';
import Notation2 from '../Exercices/Notation/Notation2';
import Notation3 from '../Exercices/Notation/Notation3';
import Notation4 from '../Exercices/Notation/Notation4';
import Notation5 from '../Exercices/Notation/Notation5';
import Notation6 from '../Exercices/Notation/Notation6';
import Notation7 from '../Exercices/Notation/Notation7';
import Notation8 from '../Exercices/Notation/Notation8';
import Notation9 from '../Exercices/Notation/Notation9';

export default function NiveauxPage() {
    const [dataUnlock, setDataUnlock] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const exercice = location.state.exercice;
    //const niveau = location.state.niveau;
    const index = location.state.index;
    const nxtLevel = location.state.nxtLevel;
    const dataLevels = location.state.dataLevels;
    const decoded = decodeToken(sessionStorage.token);
    const name = decoded.name;
    const [exerciceElo, setExerciceElo] = useState(null);
    const { updateGlobalElo } = useContext(GlobalContext); // Récupération de globalElo et setGlobalElo avec useContext
    const matches = useMediaQuery("(min-width:1200px)");
    const soundHover = new Howl({
        src: ['/sons/hover.mp3']
    });
    const soundDown = new Howl({
        src: ['/sons/clicdown.wav']
    });
    const soundUp = new Howl({
        src: ['/sons/clicup.wav']
    });

    //console.log(exercice);
    //console.log(niveau);
    //console.log(index);
    //console.log(nxtLevel);

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


    //recupere la list des niveaux debloquées
    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/unlockLevel/' + name,
            headers: {
                'Authorization': `Bearer ${sessionStorage.token}`
            }
        };

        axios.request(config)
            .then((response) => {
                //console.log(JSON.stringify(response.data));
                setDataUnlock(response.data.map(obj => obj.id_level));
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

    const sharedProps = {
        idExercice: exercice.id,
        exerciceElo,
        setExerciceElo,
        updateGlobalElo,
    };

    // Créez une structure de données pour stocker les composants de chaque niveau
    const niveaux = {
        1: {
            1: <Notation1
                {...sharedProps}
                pointsGagnes="5"
                pointsPerdus="2"
                matches={matches} />,
            2: <Notation2
                {...sharedProps}
                pointsGagnes="8"
                pointsPerdus="3"
            />,
            3: <Notation3
                {...sharedProps}
                pointsGagnes="10"
                pointsPerdus="5"
            />,
            4: <Notation4
                {...sharedProps}
                pointsGagnes="15"
                pointsPerdus="5"
            />,
            5: <Notation5
                {...sharedProps}
                pointsGagnes="10"
                pointsPerdus="8"
            />,
            6: <Notation6
                {...sharedProps}
                pointsGagnes="15"
                pointsPerdus="10"
            />,
            7: <Notation7
                {...sharedProps}
                pointsGagnes="5"
                pointsPerdus="15"
            />,
            8: <Notation8
                {...sharedProps}
                pointsGagnes="6"
                pointsPerdus="20"
            />,
            9: <Notation9
                {...sharedProps}
                pointsGagnes="6"
                pointsPerdus="20"
            />,
            // etc...
        },
        // etc...
    };

    const handlePieceHover = () => {
        Howler.volume(0.1);
        soundHover.play();
    };

    const handlePieceDown = () => {
        Howler.volume(0.3);
        soundDown.play();
    };

    const handleLevelClick = (index) => {
        Howler.volume(0.3);
        soundUp.play();
        navigate('/niveaux', { state: { exercice: exercice, index: index, nxtLevel: dataLevels[index], dataLevels: dataLevels} });
    };

    // Récupérez le composant à afficher en fonction des id
    let NiveauComponent = niveaux[exercice.id][index];

    function verifUnlock(id) {
        //console.log(id);
        //console.log(dataUnlock);
        return dataUnlock.includes(id);
    }

    
    return (
        <div className="level-container">
            <div className="level-header">
                <button className="bouton-3D"
                    onClick={() => {
                        Howler.volume(0.3);
                        soundUp.play();
                        navigate('/exercices', { state: {exercice: exercice} });
                    }}
                    onMouseEnter={() => handlePieceHover()}
                    onMouseDown={() => handlePieceDown()}>
                    <span className="texte-3D"> {/* Retourne à la page précédente */}
                        ← Retour
                    </span>
                </button>
                <div className="level-label"><i>{exercice.name}</i> : <i>niveau {index}</i></div>
                <span className="level-elo">{exerciceElo !== null && exerciceElo} points d'élo pour cet <b>exercice</b></span>
                {(index !== Object.keys(niveaux[exercice.id]).length ) &&
                    <button className="bouton-3D"
                        onClick={() => handleLevelClick((index + 1))}
                        onMouseEnter={() => handlePieceHover()}
                        onMouseDown={() => handlePieceDown()}
                        disabled={!verifUnlock(nxtLevel.id)}>
                        <span className="texte-3D"> {/* Retourne à la page précédente */}
                            Suivant →
                        </span>
                    </button>}
            </div>
            {/* Affichez le composant récupéré */}
            <div className="level-jeux">
                {exerciceElo !== null && NiveauComponent}
            </div>
        </div>
    );
}