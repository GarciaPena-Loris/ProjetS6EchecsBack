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

export default function Compte() {
    const { updateGlobalAvatar } = useContext(GlobalContext);
    const [dataCompte, setDataCompte] = useState([]);
    const [dataExos, setDataExos] = useState([]);
    const [dataElo, setDataElo] = useState([]);
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
                setSelectedImageUrl(response.data.imageProfil);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

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
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, [token]);

    //recupere le elo max de chaque exercices
    useEffect(() => {
        for (let i = 1; i <= nbExo; i++) {
            console.log('alo');
            var config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://localhost:3001/levels/maxElo/' + i,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            axios(config)
                .then(response => {
                    dataElo.push(response.data.eloMax);
                    console.log(response.data);
                    console.log(dataElo);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [nbExo]);


    return (
        <div>
            <h1>{name}</h1>
            <AvatarCompte
                imageProfil={selectedImageUrl}
                handleAfficherAvatar={handleAfficherAvatar}
                setShowPopup={setShowPopup}
            />
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
                <p className="titre">Elo dans les différents exercices</p>
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
                                    completed={60}
                                    maxCompleted={dataElo[exercice.id-1]}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}
