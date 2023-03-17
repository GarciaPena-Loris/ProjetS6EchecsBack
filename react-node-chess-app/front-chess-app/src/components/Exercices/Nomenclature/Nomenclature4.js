import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
// validation réponse
import axios from "axios";
import { decodeToken } from "react-jwt";


class Nomenclature4 extends React.Component {
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
        this.pointsGagne = props.pointsGagnes;
        this.pointsPerdu = props.pointsPerdus;
        this.points = 0;
        // decode token
        const decoded = decodeToken(sessionStorage.token);
        this.name = decoded.name;

        this.nomPiece = '';
        this.pos = '';
        this.idLevel = props.idLevel;
        this.couleurP = '#af80dc';
        this.couleurM = '#ff555f';

        this.positionPieceP = ``;
        this.positionPieceM = ``;
        this.positionPieceA = ``;
        this.optionManger = ``;
        this.genererPieceAleatoire();
    }

    genererPion = (couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA) => {
        if (couleur === 'b') {
            // position piece qui mange
            colonneP = Math.floor(Math.random() * 6) + 1;
            ligneP = Math.floor(Math.random() * 7) + 2;

            // position piece ambigue
            colonneA = colonneP + 2;
            ligneA = ligneP;

            // position piece mangé
            colonneM = colonneP + 1;
            ligneM = ligneP - 1;
        }
        else {
            // position piece qui mange
            colonneP = Math.floor(Math.random() * 5) + 1;
            ligneP = Math.floor(Math.random() * 7) + 1;

            // position piece ambigue
            colonneA = colonneP + 2;
            ligneA = ligneP;

            // position piece mangé
            colonneM = colonneP + 1;
            ligneM = ligneP + 1;
        }
        return [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA];
    }

    genererTour = (couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA) => {
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

                // position piece ambigue
                colonneA = colonneP;
                if (ligneM < ligneP) { // position en dessous
                    ligneA = Math.floor(Math.random() * (ligneM - 1)) + 1;
                }
                else { // position au dessus
                    ligneA = Math.floor(Math.random()) + (ligneM + 1);
                }
            }
            else { // meme ligne
                // position piece mangé
                ligneM = ligneP;
                do {
                    colonneM = Math.floor(Math.random() * 6) + 2; ///// warning
                }
                while (colonneM === colonneP);

                // position piece ambigue
                ligneA = ligneP;
                if (colonneM < colonneP) { // position à gauche
                    colonneA = Math.floor(Math.random() * (colonneM - 1)) + 1;
                }
                else { // position à droite
                    colonneA = Math.floor(Math.random()) + (colonneM + 1);
                }
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

                // position piece ambigue
                ligneA = ligneM;
                do {
                    colonneA = Math.floor(Math.random() * 8) + 1;
                }
                while (colonneA === colonneM);
            }
            else { // meme ligne

                // position piece mangé
                ligneM = ligneP;
                do {
                    colonneM = Math.floor(Math.random() * 8) + 1;
                }
                while (colonneM === colonneP);

                // position piece ambigue
                colonneA = colonneM;
                do {
                    ligneA = Math.floor(Math.random() * 8) + 1;
                }
                while (ligneA === ligneM);
            }
        }
        return [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA];
    }

    genererCavalier = (couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA) => {
        // position piece qui mange
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;

        // 4 cas
        if (colonneP <= 4 && ligneP <= 4) { // bas gauche
            if (Math.random() < 0.5) { // x+2 y+1
                // position piece mangé
                colonneM = colonneP + 2
                ligneM = ligneP + 1
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece ambigue
                    colonneA = colonneM + 2
                    ligneA = ligneM + 1
                }
                else {
                    colonneA = colonneM + 1
                    ligneA = ligneM + 2
                }
            }
            else {
                // position piece mangé
                colonneM = colonneP + 1
                ligneM = ligneP + 2
                // position piece ambigue
                if (Math.random() < 0.5) { // x+2 y+1
                    colonneA = colonneM + 2
                    ligneA = ligneM + 1
                }
                else {
                    colonneA = colonneM + 1
                    ligneA = ligneM + 2
                }
            }
        }
        if (colonneP > 4 && ligneP <= 4) {  // bas droite
            if (Math.random() < 0.5) { // x-2 y+1
                // position piece mangé
                colonneM = colonneP - 2
                ligneM = ligneP + 1
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece ambigue
                    colonneA = colonneM - 2
                    ligneA = ligneM + 1
                }
                else {
                    colonneA = colonneM - 1
                    ligneA = ligneM + 2
                }
            }
            else {
                // position piece mangé
                colonneM = colonneP - 1
                ligneM = ligneP + 2
                // position piece ambigue
                if (Math.random() < 0.5) { // x+2 y+1
                    colonneA = colonneM - 2
                    ligneA = ligneM + 1
                }
                else {
                    colonneA = colonneM - 1
                    ligneA = ligneM + 2
                }
            }
        }
        if (colonneP <= 4 && ligneP > 4) { // haut gauche
            if (Math.random() < 0.5) { // x+2 y+1
                // position piece mangé
                colonneM = colonneP + 2
                ligneM = ligneP - 1
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece ambigue
                    colonneA = colonneM + 2
                    ligneA = ligneM - 1
                }
                else {
                    colonneA = colonneM + 1
                    ligneA = ligneM - 2
                }
            }
            else {
                // position piece mangé
                colonneM = colonneP + 1
                ligneM = ligneP - 2
                // position piece ambigue
                if (Math.random() < 0.5) { // x+2 y+1
                    colonneA = colonneM + 2
                    ligneA = ligneM - 1
                }
                else {
                    colonneA = colonneM + 1
                    ligneA = ligneM - 2
                }
            }
        }
        if (colonneP > 4 && ligneP > 4) { // haut droite
            if (Math.random() < 0.5) { // x+2 y+1
                // position piece mangé
                colonneM = colonneP - 2
                ligneM = ligneP - 1
                if (Math.random() < 0.5) { // x+2 y+1
                    // position piece ambigue
                    colonneA = colonneM - 2
                    ligneA = ligneM - 1
                }
                else {
                    colonneA = colonneM - 1
                    ligneA = ligneM - 2
                }
            }
            else {
                // position piece mangé
                colonneM = colonneP - 1
                ligneM = ligneP - 2
                // position piece ambigue
                if (Math.random() < 0.5) { // x+2 y+1
                    colonneA = colonneM - 2
                    ligneA = ligneM - 1
                }
                else {
                    colonneA = colonneM - 1
                    ligneA = ligneM - 2
                }
            }
        }
        return [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA];
    }

    genererFou = (couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA) => {
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
        return [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA];
    }

    genererReine = (couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA) => {
        //piece qui mange 
        colonneP = Math.floor(Math.random() * 8) + 1;
        ligneP = Math.floor(Math.random() * 8) + 1;
        //piece qui sera mangé 
        colonneM = Math.floor(Math.random() * 8) + 1;
        do { ligneM = Math.floor(Math.random() * 8) + 1; }
        while ((colonneM === colonneP && ligneM === ligneP) || (ligneM !== ligneP && colonneM !== colonneP
            && ligneM !== (ligneP + Math.abs(colonneP - colonneM) || ligneP - Math.abs(colonneP - colonneM))));
        return [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA];
    }

    genererRoi = (couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA) => {
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
        return [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA];
    }

    genererPieceAleatoire() {
        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        var colonneP, colonneM, colonneA, ligneP, ligneM, ligneA, coul, coulM, couleur;
        this.state.chess.clear();

        //choix couleur
        if (Math.random() < 0.5) {
            couleur = 'b';
            coul = 'b';
            coulM = 'w';
            this.state.chess.load('kK6/8/8/8/8/8/8/8 b -- - 0 1');
            this.state.chess.remove('a8');
            this.state.chess.remove('b8');

        }
        else {
            coul = 'w';
            coulM = 'b';
        }

        // premiere etape choisir piece
        const pieces = ['p', 'r', 'n', 'b', 'q', 'k'];
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        this.piece = piece;

        // 3 cas
        if (piece === 'p') { // pions
            [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA] = this.genererPion(couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA);
        }
        else if (piece === 'r') { // tours
            [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA] = this.genererTour(couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA);
        }
        else if (piece === 'n') { // cavaliers
            [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA] = this.genererCavalier(couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA);
        }
        else if (piece === 'b') { // fou
            [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA] = this.genererFou(couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA);
        }
        else if (piece === 'q') { // reine
            [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA] = this.genererReine(couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA);
        }
        else if (piece === 'k') { // roi
            [colonneP, ligneP, colonneM, ligneM, colonneA, ligneA] = this.genererRoi(couleur, colonneP, ligneP, colonneM, ligneM, colonneA, ligneA);
        }

        // liste des positions
        this.positionPieceP = `${alpha[colonneP - 1]}${ligneP}`;
        this.positionPieceM = `${alpha[colonneM - 1]}${ligneM}`;
        this.positionPieceA = `${alpha[colonneA - 1]}${ligneA}`;

        if (Math.random() < 0.5) {
            this.state.chess.put({ type: `${piece}`, color: `${coul}` }, this.positionPieceA) // A
        }
        if (Math.random() < 0.5) {
            this.state.chess.put({ type: `q`, color: `${coulM}` }, this.positionPieceM) // M
            this.optionManger = `manger la reine`;

        } else if (piece === 'p') {
            if (coul === 'b' && ligneP === 7) {
                colonneM = colonneP;
                if (Math.random() < 0.5) { ligneM = 5 } else ligneM = 6;
            } else if (coul === 'w' && ligneP === 2) {
                colonneM = colonneP;
                if (Math.random() < 0.5) { ligneM = 4 } else ligneM = 3;
            }
            else { colonneM = colonneP; }
        }

        this.state.chess.put({ type: `${piece}`, color: `${coul}` }, this.positionPieceP); // P

        if (piece === 'p') this.nomPiece = `le pion`
        else if (piece === 'r') this.nomPiece = `la tour`
        else if (piece === 'n') this.nomPiece = `le cavalier`
        else if (piece === 'b') this.nomPiece = `le fou`
        else if (piece === 'q') this.nomPiece = `la reine`
        else if (piece === 'k') this.nomPiece = `le roi`
        this.nomPiece += ` en ${this.positionPieceP}`

        this.pos = this.positionPieceM;

        var coup = '';
        if (piece !== 'p') {
            coup += piece.toUpperCase();
        }

        if (this.state.chess.get(this.positionPieceA) && piece !== 'p') {
            if (colonneA === colonneP) {
                coup += ligneP;
            }
            else coup += alpha[colonneP - 1];
        }

        if (this.state.chess.get(this.positionPieceM)) {
            if (piece === 'p') {
                coup += alpha[colonneP - 1];
            }
            coup += 'x';
        }
        coup += alpha[colonneM - 1] + ligneM;
        if (piece === 'p' && (ligneM === 1 || ligneM === 8)) {
            coup += '=Q';
        }

        console.log(coup);
        this.coup = coup;

        // deplacement
        setTimeout(() => {
            const { chess } = this.state;
            chess.move(this.coup);
            this.setState({ chess: chess });
        }, 1000);
    }

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

    handleClick = () => {
        const { inputValue, chess } = this.state;

        if (inputValue === this.coup || (this.piece === 'p' && inputValue === 'p' + this.coup)) {
            const text = `Bonne réponse ! La pièce est en ${inputValue}, vous gagné ${this.pointsGagne} points.`;
            this.points = this.pointsGagne;
            this.setState({
                correctMessage: text,
                incorrectMessage: '',
                inputValue: '',
                chess: chess,
                showCorrect: true,
                showIncorrect: false
            });
            chess.move(inputValue);
        }
        else {
            let text = '';
            if (this.props.exerciceElo <= 0) {
                text = `Mauvaise réponse ! Le coup n'est pas '${inputValue}', vous perdez 0 points.`;
                this.points = 0;
            }
            else {
                text = `Mauvaise réponse ! Le coup n'est pas '${inputValue}', vous perdez ${this.pointsPerdu} points.`;
                this.points = -(this.pointsPerdu);
            }
            this.setState({
                incorrectMessage: text,
                correctMessage: '',
                inputValue: '',
                chess: chess,
                showCorrect: false,
                showIncorrect: true
            });
        }
        setTimeout(() => {
            this.setState({ showCorrect: false, showIncorrect: false });
        }, 8000); // Efface le message après 3 secondes
        setTimeout(() => {
            this.handleUpdate();
        }, 2000);
    };

    handleUpdate = () => {
        try {
            // chiffre un code crypte du type id_level/name/eloExerciceActuel/newelo(- or +)
            const CryptoJS = require("crypto-js");
            const message = this.idLevel + "/" + this.name + "/" + this.props.exerciceElo + "/" + this.points;
            const encrypted = CryptoJS.AES.encrypt(message, process.env.REACT_APP_CRYPTO_SECRET).toString();

            const formData = {
                'points': this.points,
                'encrypted': encrypted
            };
            var config = {
                method: 'put',
                maxBodyLength: Infinity,
                url: `http://localhost:3001/unlockLevel/save/${this.name}/${this.idLevel}`,
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

    handleClickReplay = () => {
        const { chess } = this.state;
        chess.undo();
        this.setState({ chess: chess, });

        setTimeout((deplacement) => {
            const { chess } = this.state;
            this.setState({ chess: chess, });
            chess.move(this.coup);
        }, 1000);
    }


    render() {
        return (
            <div className="container-general">
                <div className="jeu">
                    <div className="plateau-gauche">
                        <Chessboard
                            position={this.state.chess.fen()}
                            animationDuration={800}
                            arePiecesDraggable={false}
                            customSquare={this.customSquare}
                        />
                    </div>
                    <div className="elements-droite">
                        <i className="consigne">
                            Ecrivez le coup pour que <span style={{ color: `${this.couleurP}` }}> {this.nomPiece}
                            </span> aille <span style={{ color: `${this.couleurM}` }}> {this.optionManger} en {this.positionPieceM} </span>
                        </i>
                        <input className="reponse-input"
                            type="text"
                            placeholder="Entrez la position..."
                            value={this.state.inputValue}
                            onChange={this.handleInputChange} />
                        <button className="valider-bouton actual-bouton" onClick={this.handleClickReplay}>Refaire</button>
                        <button className="valider-bouton actual-bouton"
                            onClick={this.handleClick}
                            {...(this.state.inputValue.length < 3 && { disabled: true })}
                        >
                            Valider
                        </button>
                        {this.state.correctMessage &&
                            <div className={`response correct-response ${this.state.showCorrect ? 'show' : ''}`}>
                                {this.state.correctMessage}
                            </div>
                        }
                        {this.state.incorrectMessage &&
                            <div className={`response incorrect-response ${this.state.showIncorrect ? 'show' : ''}`}>
                                {this.state.incorrectMessage}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Nomenclature4;