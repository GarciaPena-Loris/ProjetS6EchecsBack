import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
// validation réponse
import axios from "axios";
import { decodeToken } from "react-jwt";

import { Button, ButtonGroup, Grid, Stack, createTheme, ThemeProvider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChessKing as whiteKing,
    faChessQueen as whiteQueen,
    faChessRook as whiteRook,
    faChessBishop as whiteBishop,
    faChessKnight as whiteKnight,
    faChessPawn as whitePawn
} from '@fortawesome/free-regular-svg-icons'



class Nomenclature2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',
            showCorrect: false,
            showIncorrect: false,
            chess: new Chess()
        };
        // validation réponse
        this.pointsGagnes = props.pointsGagnes;
        this.pointsPerdus = props.pointsPerdus;
        this.points = 0;
        // decode token
        const decoded = decodeToken(sessionStorage.token);
        this.name = decoded.name;

        this.nomPiece = '';
        this.pos = '';
        this.idExercice = props.idExercice;
        this.couleurP = '#af80dc';
        this.couleurM = '#ff555f';

        this.genererPieceAleatoire();
    }

    //#region Génération pièce aléatoire
    genererPion = (couleur, colonneP, ligneP, colonneM, ligneM) => {
        if (couleur === 'b') {
            // position piece qui mange
            colonneP = Math.floor(Math.random() * 6) + 1;
            ligneP = Math.floor(Math.random() * 7) + 2;


            // position piece mangé
            colonneM = colonneP + 1;
            ligneM = ligneP - 1;
        }
        else {
            // position piece qui mange
            colonneP = Math.floor(Math.random() * 5) + 1;
            ligneP = Math.floor(Math.random() * 7) + 1;

            // position piece mangé
            colonneM = colonneP + 1;
            ligneM = ligneP + 1;
        }
        return [colonneP, ligneP, colonneM, ligneM];
    }

    genererTour = (couleur, colonneP, ligneP, colonneM, ligneM) => {
        // position piece qui mange
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;

        if (Math.random() < 0.5) { // choix entre L ou I
            // position I
            if (Math.random() < 0.5) { // choix entre ligne ou colonne
                // meme colonne
                // position piece mangé
                colonneM = colonneP;
                do {
                    ligneM = Math.floor(Math.random() * 6) + 2;
                }
                while (ligneM === ligneP);
            }
            else { // meme ligne
                // position piece mangé
                ligneM = ligneP;
                do {
                    colonneM = Math.floor(Math.random() * 6) + 2; ///// warning
                }
                while (colonneM === colonneP);
            }
        }
        else { // position L
            if (Math.random() < 0.5) { // choix entre ligne ou colonne
                // meme colonne

                // position piece mangé
                colonneM = colonneP;
                do {
                    ligneM = Math.floor(Math.random() * 8) + 1;
                }
                while (ligneM === ligneP);
            }
            else { // meme ligne

                // position piece mangé
                ligneM = ligneP;
                do {
                    colonneM = Math.floor(Math.random() * 8) + 1;
                }
                while (colonneM === colonneP);
            }
        }
        return [colonneP, ligneP, colonneM, ligneM];
    }

    genererCavalier = (couleur, colonneP, ligneP, colonneM, ligneM) => {
        // position piece qui mange
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;

        // 4 cas
        if (colonneP <= 4 && ligneP <= 4) { // bas gauche
            if (Math.random() < 0.5) { // x+2 y+1
                // position piece mangé
                colonneM = colonneP + 2
                ligneM = ligneP + 1
            }
            else {
                // position piece mangé
                colonneM = colonneP + 1
                ligneM = ligneP + 2
            }
        }
        if (colonneP > 4 && ligneP <= 4) {  // bas droite
            if (Math.random() < 0.5) { // x-2 y+1
                // position piece mangé
                colonneM = colonneP - 2
                ligneM = ligneP + 1
            }
            else {
                // position piece mangé
                colonneM = colonneP - 1
                ligneM = ligneP + 2
            }
        }
        if (colonneP <= 4 && ligneP > 4) { // haut gauche
            if (Math.random() < 0.5) { // x+2 y+1
                // position piece mangé
                colonneM = colonneP + 2
                ligneM = ligneP - 1
            }
            else {
                // position piece mangé
                colonneM = colonneP + 1
                ligneM = ligneP - 2
            }
        }
        if (colonneP > 4 && ligneP > 4) { // haut droite
            if (Math.random() < 0.5) { // x+2 y+1
                // position piece mangé
                colonneM = colonneP - 2
                ligneM = ligneP - 1
            }
            else {
                // position piece mangé
                colonneM = colonneP - 1
                ligneM = ligneP - 2
            }
        }
        return [colonneP, ligneP, colonneM, ligneM];
    }

    genererFou = (couleur, colonneP, ligneP, colonneM, ligneM) => {
        //piece qui mange 
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;
        //piece qui sera mangé 
        do {
            do {
                colonneM = Math.floor(Math.random() * 8) + 1;
            }
            while (colonneM === colonneP);
            ligneM = ligneP + Math.abs(colonneP - colonneM);
            if (ligneM > 8) {
                ligneM = ligneP - Math.abs(colonneP - colonneM);
            }
        } while (ligneM < 0 || ligneM > 8);
        return [colonneP, ligneP, colonneM, ligneM];
    }

    genererDame = (couleur, colonneP, ligneP, colonneM, ligneM) => {
        //piece qui mange 
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;
        //piece qui sera mangé 
        colonneM = Math.floor(Math.random() * 8) + 1;
        do { ligneM = Math.floor(Math.random() * 8) + 1; }
        while ((colonneM === colonneP && ligneM === ligneP) || (ligneM !== ligneP && colonneM !== colonneP
            && ligneM !== (ligneP + Math.abs(colonneP - colonneM) || ligneP - Math.abs(colonneP - colonneM))));
        return [colonneP, ligneP, colonneM, ligneM];
    }

    genererRoi = (couleur, colonneP, ligneP, colonneM, ligneM) => {
        //piece qui mange 
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;
        //piece qui sera mangé 
        do {
            colonneM = Math.floor(Math.random() * 3) + (colonneP - 1);
            ligneM = Math.floor(Math.random() * 3) + (ligneP - 1);
        }
        while (colonneM > 8 || colonneM < 1 || ligneM > 8 || ligneM < 1 ||
            (ligneM === ligneP && colonneM === colonneP));
        return [colonneP, ligneP, colonneM, ligneM];
    }

    genererPieceAleatoire = () => {
        this.state.chess.clear();
        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        let colonneP, colonneM, ligneP, ligneM, coulP, coulM, couleur, coup = '';

        //choix couleur
        if (Math.random() < 0.5) {
            // si noir positionner roi noir et blanc puis enlever
            couleur = 'b';
            coulP = 'b';
            coulM = 'w';
            this.state.chess.load('kK6/8/8/8/8/8/8/8 b -- - 0 1');
            this.state.chess.remove('a8');
            this.state.chess.remove('b8');

        }
        else {
            coulP = 'w';
            coulM = 'b';
        }

        // choix piece
        const pieces = ['p', 'r', 'n', 'b', 'q', 'k'];
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        this.piece = piece;

        // pour chaque piece
        if (piece === 'p') { // pions
            [colonneP, ligneP, colonneM, ligneM] = this.genererPion(couleur, colonneP, ligneP, colonneM, ligneM);
        }
        else if (piece === 'r') { // tours
            [colonneP, ligneP, colonneM, ligneM] = this.genererTour(couleur, colonneP, ligneP, colonneM, ligneM);
        }
        else if (piece === 'n') {
            [colonneP, ligneP, colonneM, ligneM] = this.genererCavalier(couleur, colonneP, ligneP, colonneM, ligneM);
        }
        else if (piece === 'b') {
            [colonneP, ligneP, colonneM, ligneM] = this.genererFou(couleur, colonneP, ligneP, colonneM, ligneM);
        }
        else if (piece === 'q') {
            [colonneP, ligneP, colonneM, ligneM] = this.genererDame(couleur, colonneP, ligneP, colonneM, ligneM);
        }
        else if (piece === 'k') {
            [colonneP, ligneP, colonneM, ligneM] = this.genererRoi(couleur, colonneP, ligneP, colonneM, ligneM);
        }
        this.positionPieceP = `${alpha[colonneP - 1]}${ligneP}`;
        this.positionPieceM = `${alpha[colonneM - 1]}${ligneM}`;

        this.state.chess.put({ type: `${piece}`, color: `${coulP}` }, this.positionPieceP) // P
        this.state.chess.put({ type: `q`, color: `${coulM}` }, this.positionPieceM) // M


        // nom de la piece
        if (piece === 'p') this.nomPiece = `le pion`
        else if (piece === 'r') this.nomPiece = `la tour`
        else if (piece === 'n') this.nomPiece = `le cavalier`
        else if (piece === 'b') this.nomPiece = `le fou`
        else if (piece === 'q') this.nomPiece = `la reine`
        else if (piece === 'k') this.nomPiece = `le roi`
        this.nomPiece += ` en ${this.positionPieceP}`

        // nom coup a faire
        if (piece !== 'p') {
            coup += piece.toUpperCase();
        }
        if (piece === 'p') {
            coup += alpha[colonneP - 1];
        }
        coup += 'x'; // manger
        coup += alpha[colonneM - 1] + ligneM; // position de la piece mangé

        this.coup = coup;
    };
    //#endregion

    // couleur des cases
    customSquare = React.forwardRef((props, ref) => {
        const { children, square, style } = props;
        if (square === this.positionPieceP) {
            return (
                <div ref={ref} style={{ ...style, position: "relative", backgroundColor: this.couleurP }}> {/* pièce qui mange */}
                    {children}
                </div>
            );
        }
        else if (square === this.positionPieceM) {
            return (
                <div ref={ref} style={{ ...style, position: "relative", backgroundColor: this.couleurM }}> {/* pièce mangé */}
                    {children}
                </div>
            );
        }
        else {
            return (
                <div ref={ref} style={{ ...style, position: "relative" }}>
                    {children}
                </div>
            );
        }
    });

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleClearButtonClick = () => {
        this.setState({ inputValue: '' });
    };

    handlePiece = (event) => {
        this.setState({ inputValue: this.state.inputValue + event });
    };

    handleClick = () => {
        const { inputValue } = this.state;
        if (inputValue === this.coup || (this.piece === 'p' && inputValue === 'p' + this.coup)) {
            const text = `Bonne réponse ! La pièce est en ${inputValue}, vous gagné ${this.pointsGagnes} points.`;
            this.points = this.pointsGagnes;
            this.setState({
                message: text,
                inputValue: '',
                showCorrect: true,
                showIncorrect: false
            });
        }
        else {
            let text = `Mauvaise réponse ! La pièce n'est pas en '${inputValue}', vous perdez ${Math.min(this.props.exerciceElo, this.pointsPerdus)} points.`;
            this.points = -(Math.min(this.props.exerciceElo, this.pointsPerdus));
            this.setState({
                message: text,
                inputValue: '',
                showCorrect: false,
                showIncorrect: true
            });
        }
        setTimeout(() => {
            this.setState({ showCorrect: false, showIncorrect: false, message: '' });

            if (this.points !== 0)
                this.handleUpdate();
            else
                this.genererPieceAleatoire();
        }, 3000); // Efface le message après 3 secondes
    }

    handleUpdate = () => {
        try {
            // chiffre un code crypte du type id_level/name/eloExerciceActuel/newelo(- or +)
            const CryptoJS = require("crypto-js");
            const message = this.idExercice + "/" + this.name + "/" + this.props.exerciceElo + "/" + this.points;
            console.log("🚀 ~ file: Nomenclature2.js:376 ~ Nomenclature2 ~ message:", message)
            const encrypted = CryptoJS.AES.encrypt(message, process.env.REACT_APP_CRYPTO_SECRET).toString();

            const formData = {
                'points': this.points,
                'encrypted': encrypted
            };
            var config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `http://localhost:3001/unlockLevel/save/${this.name}/${this.idExercice}`,
                headers: {
                    'Authorization': `Bearer ${sessionStorage.token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: formData
            };
            axios(config)
                .then((response) => {
                    // maj de l'elo
                    this.props.setExerciceElo(response.data.newEloExercise);
                    this.props.updateGlobalElo(response.data.newEloUser);

                    // affichage nouvelle piece
                    this.genererPieceAleatoire();
                })
                .catch((error) => {
                    console.log(error);

                    // affichage nouvelle piece
                    this.genererPieceAleatoire();
                });
        } catch (error) {
            console.error(error);
        }
    }

    styles = {
        button: {
            textTransform: 'none',
            fontWeight: 'bold',
        },
    };

    piecesBlanches = [
        <Button key="pion" onClick={() => this.handlePiece("P")}><FontAwesomeIcon icon={whitePawn} size="xl" /></Button>,
        <Button key="tour" onClick={() => this.handlePiece("R")}><FontAwesomeIcon icon={whiteRook} size="xl" /></Button>,
        <Button key="fou" onClick={() => this.handlePiece("B")}><FontAwesomeIcon icon={whiteBishop} size="xl" /></Button>,
        <Button key="cavalier" onClick={() => this.handlePiece("N")}><FontAwesomeIcon icon={whiteKnight} size="xl" /></Button>,
        <Button key="reine" onClick={() => this.handlePiece("Q")}><FontAwesomeIcon icon={whiteQueen} size="xl" /></Button>,
        <Button key="roi" onClick={() => this.handlePiece("K")}><FontAwesomeIcon icon={whiteKing} size="xl" /></Button>,
    ];
    lignes = [
        "8", "7", "6", "5", "4", "3", "2", "1"
    ];

    colonnes = [
        "a", "b", "c", "d", "e", "f", "g", "h"
    ]
    custom = [
        "x", "O-O", "O-O-O", "=", "e.p."
    ]

    theme = createTheme({
        palette: {
            primary: {
                main: '#b58863',
            },
            secondary: {
                main: '#f0d9b5',
            },
        },
    });


    render() {
        return (
            <div className="container-general">
                <div className="jeu">
                    <div className="plateau-gauche">
                        <Chessboard
                            position={this.state.chess.fen()}
                            arePiecesDraggable={false}
                            customSquare={this.customSquare}
                        />
                    </div>
                    <div className="elements-droite">
                        <i className="consigne">
                            Ecrivez le coup pour que <span style={{ color: `${this.couleurP}` }}> {this.nomPiece}
                            </span> mange <span style={{ color: `${this.couleurM}` }}> la reine en {this.positionPieceM} </span>
                        </i>
                        <div className="boutons">
                            <ThemeProvider theme={this.theme}>
                                <Grid container spacing={1} direction="column" justifyContent="space-between">
                                    <Grid item xs={12} sm={6} md={3} container alignItems="center" justifyContent="space-between">
                                        <ButtonGroup orientation="vertical" variant="contained" >
                                            {this.lignes.map((line, index) => {
                                                const colorClass = index % 2 === 0 ? "secondary" : "primary";
                                                return (
                                                    <Button key={line} sx={this.styles.button} variant="contained" color={colorClass} onClick={() => this.handlePiece(line)}>
                                                        {line}
                                                    </Button>
                                                );
                                            })}
                                        </ButtonGroup>
                                        <ButtonGroup size="large" orientation="vertical" color="secondary" variant="contained" >
                                            {this.piecesBlanches}
                                        </ButtonGroup>
                                        <ButtonGroup size="large" orientation="vertical" color="secondary" variant="contained" >
                                            {this.custom.map((line, index) => {
                                                return (
                                                    <Button key={line} sx={this.styles.button} variant="contained" onClick={() => this.handlePiece(line)}>
                                                        {line}
                                                    </Button>
                                                );
                                            })}
                                        </ButtonGroup>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3} container direction="column" alignItems="center" justifyContent="flex-start" >
                                        <Grid item>
                                            <ButtonGroup variant="contained" color="secondary">
                                                {this.colonnes.map((line, index) => {
                                                    const colorClass = index % 2 === 0 ? "primary" : "secondary";
                                                    return (
                                                        <Button key={line} sx={this.styles.button} variant="contained" color={colorClass} onClick={() => this.handlePiece(line)}>
                                                            {line}
                                                        </Button>
                                                    );
                                                })}
                                            </ButtonGroup>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ThemeProvider>
                        </div>
                        <Stack spacing={2} direction="row" alignItems="center">
                            <input className="reponse-input"
                                type="text"
                                placeholder="Entrez la position..."
                                value={this.state.inputValue}
                                onChange={this.handleInputChange} />
                            <Button variant="contained" color="error" onClick={this.handleClearButtonClick}>
                                ✕
                            </Button>
                        </Stack>
                        <button className="valider-bouton actual-bouton"
                            onClick={this.handleClick}
                            {...(this.state.inputValue.length < 3 && { disabled: true })}
                        >
                            Valider
                        </button>
                        <div className={`response ${this.state.showCorrect ? 'show' : this.state.showIncorrect ? 'show incorrect' : ''}`}>
                            {this.state.message}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Nomenclature2;