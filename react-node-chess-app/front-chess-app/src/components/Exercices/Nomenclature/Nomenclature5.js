import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
// validation réponse
import axios from "axios";
import { decodeToken } from "react-jwt";
import { Stack } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {
    faChessKing as whiteKing,
    faChessQueen as whiteQueen,
    faChessRook as whiteRook,
    faChessBishop as whiteBishop,
    faChessKnight as whiteKnight,
    faChessPawn as whitePawn
} from '@fortawesome/free-regular-svg-icons'
import { Howl, Howler } from 'howler';

class Nomenclature4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            message: '',
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

        this.positionPieceP = ``;
        this.positionPieceM = ``;
        this.positionPieceA = ``;
        this.optionManger = ``;

        this.monInputRef = React.createRef();

        this.soundHover = new Howl({
            src: ['/sons/hover.mp3']
        });
        this.soundDown = new Howl({
            src: ['/sons/clicdown.wav']
        });
        this.soundUp = new Howl({
            src: ['/sons/clicup.wav']
        });
        this.soundWin = new Howl({
            src: ['/sons/win.wav']
        });
        this.soundWrong = new Howl({
            src: ['/sons/evil.ogg']
        });
    }

    componentDidMount() {
        this.genererPieceAleatoire();
        if (Math.random() < 0.5) {
            this.setState({ orientation: "black" });
        }
        this.monInputRef.current.focus();
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
        const { chess } = this.state;
        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        var colonneP, colonneM, colonneA, ligneP, ligneM, ligneA, coul, coulM, couleur;
        chess.clear();

        //choix couleur
        if (Math.random() < 0.5) {
            couleur = 'b';
            coul = 'b';
            coulM = 'w';
            chess.load('kK6/8/8/8/8/8/8/8 b -- - 0 1');
            chess.remove('a8');
            chess.remove('b8');

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
            chess.put({ type: `${piece}`, color: `${coul}` }, this.positionPieceA) // A
        }
        if (Math.random() < 0.7) {
            chess.put({ type: `q`, color: `${coulM}` }, this.positionPieceM) // M
            this.optionManger = `manger la reine`;
        } else if (piece === 'p') {
            if (coul === 'b' && ligneP === 7) {
                colonneM = colonneP;
                if (Math.random() < 0.5) { ligneM = 5 } else ligneM = 6;
            } else if (coul === 'w' && ligneP === 2) {
                colonneM = colonneP;
                if (Math.random() < 0.5) { ligneM = 4 } else ligneM = 3;
            }
            colonneM = colonneP;
            this.positionPieceM = `${alpha[colonneM - 1]}${ligneM}`;
        }

        chess.put({ type: `${piece}`, color: `${coul}` }, this.positionPieceP); // P

        if (piece === 'p') this.nomPiece = `le pion`
        else if (piece === 'r') this.nomPiece = `la tour`
        else if (piece === 'n') this.nomPiece = `le cavalier`
        else if (piece === 'b') this.nomPiece = `le fou`
        else if (piece === 'q') this.nomPiece = `la reine`
        else if (piece === 'k') this.nomPiece = `le roi`

        this.pos = this.positionPieceM;

        var coup = '';
        if (piece !== 'p') {
            coup += piece.toUpperCase();
        }

        if (chess.get(this.positionPieceA) && piece !== 'p') {
            if (colonneA === colonneP) {
                coup += ligneP;
            }
            else coup += alpha[colonneP - 1];
        }

        if (chess.get(this.positionPieceM)) {
            if (piece === 'p') {
                coup += alpha[colonneP - 1];
            }
            coup += 'x';
        }
        coup += alpha[colonneM - 1] + ligneM;
        if (piece === 'p' && (ligneM === 1 || ligneM === 8)) {
            coup += '=Q';
        }

        this.coup = coup;
        this.setState({ chess: chess });

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

    // handles

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleKeyPress = (event) => {
        if (this.state.inputValue.length >= 3) {
            if (event.key === "Enter") {
                // Appeler la fonction de vérification
                this.handleClick();
            }
        }
    }

    // sons
    handleClearButtonClick = () => {
        Howler.volume(0.3);
        this.soundUp.play();
        this.setState({ inputValue: '' });
    };

    handlePieceHover = () => {
        Howler.volume(0.1);
        this.soundHover.play();
    };

    handlePieceUp = (event) => {
        Howler.volume(0.3);
        this.soundUp.play();
        this.setState({ inputValue: this.state.inputValue + event });
        this.monInputRef.current.focus();
    };

    handlePieceDown = () => {
        Howler.volume(0.3);
        this.soundDown.play();
    };

    handleOrientation = (event) => {
        Howler.volume(0.3);
        if (event.target.checked) {
            this.switchOff.play();
            this.setState({ orientation: 'white' });
        }
        else {
            this.switchOn.play();
            this.setState({ orientation: 'black' });
        }
    }

    handleClick = () => {
        Howler.volume(0.3);
        this.soundUp.play();
        const { inputValue } = this.state;
        if (inputValue === this.coup || (this.piece === 'p' && inputValue === 'p' + this.coup)) {
            Howler.volume(0.3);
            this.soundWin.play();
            const text = `Bonne réponse ! La pièce est en ${inputValue}, vous gagné ${this.pointsGagnes} points.`;
            this.points = this.pointsGagnes;
            this.setState({
                message: text,
                chess: this.state.chess,
                inputValue: '',
                showCorrect: true,
                showIncorrect: false
            });
        }
        else {
            Howler.volume(1);
            this.soundWrong.play();
            let text = `Mauvaise réponse ! La piéce était en ${this.coup}, vous perdez ${Math.min(this.props.exerciceElo, this.pointsPerdus)} points.`;
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

    handleClickReplay = () => {
        Howler.volume(0.3);
        this.soundUp.play();

        const { chess } = this.state;
        chess.undo();
        this.setState({ chess: chess, });

        setTimeout((deplacement) => {
            const { chess } = this.state;
            this.setState({ chess: chess, });
            chess.move(this.coup);
        }, 1000);
    }


    MaterialUISwitch = styled(Switch)(({ disabled }) => ({
        width: 62,
        height: 34,
        padding: 7,
        cursor: disabled ? 'not-allowed' : 'pointer', // ajout de la propriété cursor
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundColor: "white",
                    borderRadius: '50%',
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: disabled ? 'rgba(255, 255, 255, 0.5)' : '#cccccc',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: '#001e3c',
            width: 32,
            height: 32,
            '&:before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundColor: disabled ? '#c7c7c7' : 'black',
                borderRadius: '50%',
            },
        },
        '& .Mui-disabled': {
            opacity: 0.5,
        },
    }));


    render() {
        const piecesBlanchesNom = [
            "Pion", "Tour", "Fou", "Cavalier", "Reine", "Roi"
        ]
        const piecesBlanchesIcon = [
            whitePawn, whiteRook, whiteBishop, whiteKnight, whiteQueen, whiteKing
        ]
        const piecesBlanchesInput = [
            "P", "R", "B", "N", "Q", "K"
        ]
        let lignes = this.state.orientation === 'white'
            ? ["8", "7", "6", "5", "4", "3", "2", "1"]
            : ["1", "2", "3", "4", "5", "6", "7", "8"];
        let colonnes = this.state.orientation === 'white'
            ? ["a", "b", "c", "d", "e", "f", "g", "h"]
            : ["h", "g", "f", "e", "d", "c", "b", "a"];
        const custom = [
            "x", "O-O", "O-O-O", "=", "e.p.", "+"
            // "x" pour la prise, "O-O" pour le petit roque, "O-O-O" pour le grand roque, 
            //"=" pour la promotion, "e.p." pour la prise en passant, "+" pour le mat
        ]
        const customCoup = [
            "prise", "petit roque", "grand roque", "promotion", "prise en passant", "mat"
        ]
        return (
            <div className="container-general">
                <div className="plateau-gauche">
                    <Chessboard
                        key="board"
                        position={this.state.chess.fen()}
                        arePiecesDraggable={false}
                        customSquare={this.customSquare}
                        animationDuration={500}
                        boardOrientation={this.state.orientation}
                    />
                </div>
                <div className="elements-droite">
                    <i className="consigne">
                        Ecrivez le coup réalisé par <span style={{ color: `${this.couleurP}` }}> {this.nomPiece}
                        </span>
                    </i>
                    <FormControlLabel
                        control={<this.MaterialUISwitch
                            checked={this.state.orientation === 'white'}
                            disabled={true}
                        />}
                        label={
                            <div style={{ color: this.state.orientation === 'white' ? 'white' : 'black' }}>
                                {this.state.orientation === 'white' ? 'Plateau côté Blancs' : 'Plateau côté Noirs'}
                            </div>
                        }
                        onChange={this.handleOrientation}
                        style={{
                            color: this.state.orientation === 'white' ? 'white' : 'black',
                        }}
                    />
                    <div className="boutons">
                        <div className="groupe-butons" >
                            {piecesBlanchesIcon.map((line, index) => { // pion tour fou cavalier reine roi
                                return (
                                    <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                                        key={piecesBlanchesNom[index]}
                                        title={piecesBlanchesNom[index]}
                                        onMouseEnter={() => this.handlePieceHover()}
                                        onMouseUp={() => this.handlePieceUp(piecesBlanchesInput[index])}
                                        onMouseDown={() => this.handlePieceDown()}>
                                        <span className={`front ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                                            <FontAwesomeIcon icon={line} />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="groupe-butons">
                            {colonnes.map((line, index) => { // a b c d e f g h
                                return (
                                    <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                                        key={line}
                                        title={line}
                                        onMouseEnter={() => this.handlePieceHover()}
                                        onMouseUp={() => this.handlePieceUp(line)}
                                        onMouseDown={() => this.handlePieceDown()}>
                                        <span className={`front ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                                            {line}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="groupe-butons" >
                            {lignes.map((line, index) => { // 1 2 3 4 5 6 7 8
                                return (
                                    <button className={`pushable ${(index % 2) ? 'pushable-fonce' : 'pushable-clair'}`}
                                        key={line}
                                        title={line}
                                        onMouseEnter={() => this.handlePieceHover()}
                                        onMouseUp={() => this.handlePieceUp(line)}
                                        onMouseDown={() => this.handlePieceDown()}>
                                        <span className={`front ${(index % 2) ? 'fronts-fonce' : 'fronts-clair'}`}>
                                            {line}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="groupe-butons" >
                            {custom.map((line, index) => { // x O-O O-O-O = e.p. +
                                return (
                                    <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                                        key={line}
                                        title={customCoup[index]}
                                        onMouseEnter={() => this.handlePieceHover()}
                                        onMouseUp={() => this.handlePieceUp(line)}
                                        onMouseDown={() => this.handlePieceDown()}>
                                        <span className={`front custom ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                                            {line}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="input">
                        <Stack spacing={2} direction="row" alignItems="center">
                            <input className="reponse-input"
                                type="text"
                                placeholder="Entrez la position..."
                                value={this.state.inputValue}
                                onChange={this.handleInputChange}
                                onKeyDown={this.handleKeyPress}
                                ref={this.monInputRef} />
                            <button className="bouton-3D button-clean"
                                title="supprimer"
                                onMouseDown={() => this.handlePieceDown()}
                                onMouseEnter={() => this.handlePieceHover()}
                                onClick={this.handleClearButtonClick}>
                                <span className="texte-3D texte-clean">
                                    ✘
                                </span>
                            </button>
                        </Stack>

                        <Stack className="stack" spacing={2} direction="row" alignItems="center">
                            <button className="bouton-3D"
                                title="Valider"
                                {...(this.state.inputValue.length < 3 && { disabled: true })}
                                onMouseEnter={() => this.handlePieceHover()}
                                onMouseUp={this.handleClick}
                                onMouseDown={() => this.handlePieceDown()}>
                                <span className="texte-3D">
                                    Valider
                                </span>
                            </button>
                            <button className="bouton-3D button-replay"
                                title="Refaire"
                                onMouseEnter={() => this.handlePieceHover()}
                                onMouseUp={this.handleClickReplay}
                                onMouseDown={() => this.handlePieceDown()}>
                                <span className="texte-3D texte-replay">
                                    Refaire
                                </span>
                            </button>
                        </Stack>
                    </div>
                    <div className={`response ${this.state.showCorrect ? 'show' : this.state.showIncorrect ? 'show incorrect' : ''}`}>
                        {this.state.message}
                    </div>
                </div>
            </div>
        );
    }
}

export default Nomenclature4;