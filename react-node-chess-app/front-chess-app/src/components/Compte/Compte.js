import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
//import "../Components.css"
import "./Compte.css"
import { decodeToken } from "react-jwt";
import Avatar from 'react-avatar';
import AvatarCompte from "./AvatarCompte";
import { GlobalContext } from '../GlobalContext/GlobalContext';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import ProgressBar from "@ramonak/react-progress-bar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChessKing as whiteKing,
    faChessQueen as whiteQueen,
    faChessPawn as whitePawn
} from '@fortawesome/free-regular-svg-icons'

export default function Compte() {
    const { updateGlobalAvatar } = useContext(GlobalContext);
    const [dataCompte, setDataCompte] = useState([]);
    const [dataExos, setDataExos] = useState([]);
    const [dataElo, setDataElo] = useState([]);
    const [dataEloJoueur, setDataEloJoueur] = useState([]);
    const token = sessionStorage.getItem('token');
    const navigate = useNavigate();
    const decoded = decodeToken(sessionStorage.token);
    const name = decoded.name;
    const [nbExo, setNbExo] = useState();


    const imageList = [
        "https://i.imgur.com/JII9pSp.jpg",
        "https://i.imgur.com/3sWnXjG.jpg",
        "https://i.imgur.com/1XZQpMs.jpg",
        "https://i.imgur.com/1TTeAKo.jpg",
        "https://i.imgur.com/GKIQYGN.jpg",
        "https://i.imgur.com/PGf9Olk.jpg"
    ];

    const [showPopup, setShowPopup] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(dataCompte.imageProfil);

    const handleImageChange = (newImageUrl) => {
        // Mettre à jour l'URL de l'image dans le state local
        var data = JSON.stringify({
            "imageProfil": newImageUrl
        });
        // Envoyer une requête PUT à l'API pour mettre à jour l'URL de l'image dans la base de données
        const config = {
            method: "put",
            url: `http://localhost:3001/users/updateAvatar/` + name,
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(response.data);
                setSelectedImageUrl(newImageUrl);
                updateGlobalAvatar(newImageUrl);
            })
            .catch(function (error) {
                console.log(error);
            });
        //location.reload(); refresh la page mais c'est pas le mieux je pense
    };


    const handleAfficherAvatar = (newImageUrl) => {
        setShowPopup(true);
    };
    const handleClosePopup = () => {
        setShowPopup(false);
    };

    //useEffect recupere les info du compte au chargement de la page
    useEffect(() => {
        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost:3001/users/' + name,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        axios(config)
            .then(function (response) {
                setDataCompte(response.data);
                //console.log(response.data);
                setSelectedImageUrl(response.data.imageProfil);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    //recupere le elo dans chaque exo du joueur

    //recupere les info des exercices au chargement de la page
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
                setDataExos(response.data);
                setNbExo(response.data.length);
                //console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    //recupere le elo max de chaque exercices
    useEffect(() => {
        const fetchElo = async () => {
            const EloPromises = [];
            const EloJoueur = [];

            for (let i = 1; i <= nbExo; i++) {
                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/levels/maxElo/' + i,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                EloPromises.push(axios(config));
            }
            const EloResponses = await Promise.all(EloPromises);

            const EloProvisoire = EloResponses.map(response => response.data.eloMax);
            setDataElo(EloProvisoire);
            //console.log(EloProvisoire);

            for (let i = 1; i <= nbExo; i++) {
                var config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:3001/eloExercise/elo/' + name + '/' + i,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                EloJoueur.push(axios(config));
            }
            const EloJoueurRep = await Promise.all(EloJoueur);

            const EloJoueurProvisoire = EloJoueurRep.map(response => response.data.exerciceElo);
            setDataEloJoueur(EloJoueurProvisoire);
            console.log(EloJoueurProvisoire);

        };

        fetchElo();
    }, [nbExo]);

    /*fonction qui gere si l'elo dans une exercice n'est pas renseigné:
        (retourne 0 si oui sinon la valeur)*/
    function eloUndefined(elo) {
        if (elo == undefined) {
            return 0;
        } else { return elo }
    };


    return (
        <div>
            <h1 className="name_display">{name}</h1>
            <AvatarCompte
                imageProfil={selectedImageUrl}
                handleAfficherAvatar={handleAfficherAvatar}
                setShowPopup={setShowPopup}
            />
            <h1>
            {dataCompte.global_elo+" "}  
            <FontAwesomeIcon icon={whitePawn} size="l" />
            </h1>
            {showPopup && (
                <div className="avatar-popup" onClick={handleClosePopup}>
                    {imageList.map((url) => (
                        <Avatar
                            key={url}
                            className="avatar-thumbnail"
                            src={url}
                            alt="Avatar"
                            size="100"
                            round={true}
                            onClick={() => handleImageChange(url)}
                        />
                    ))}
                </div>)}
            <div className="image-container-compte">
                <p className="titre">Progression des exercices :</p>
                {dataExos.map((exercice) => (
                    <div className="img-wrapper-compte" key={exercice.id}>
                        <img
                            className="imgExo-compte"
                            src={`${exercice.image}`}
                            alt={`Exercice ${exercice.id}`}
                        />
                        <div className="nomxp-div">
                            <div className="barxp-div">
                                <ProgressBar
                                    key={exercice.id}
                                    className="barxp"
                                    completed={eloUndefined(dataEloJoueur[exercice.id - 1])}
                                    customLabel={eloUndefined(dataEloJoueur[exercice.id - 1])+" points"}
                                    maxCompleted={dataElo[exercice.id - 1]}
                                    bgColor='#7e9d4e'
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
