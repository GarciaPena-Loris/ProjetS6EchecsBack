import React from "react";
import './Bombe.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Stack } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Howl, Howler } from 'howler';

class Bombe4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',
            showCorrect: false,
            showIncorrect: false,
            orientation: "white",
            coordonnees: true,
            selectedLanguage: 'fr',
            piecesLanguage: ['P', 'T', 'F', 'C', 'D', 'R'],
            coloredSquares: {},

            chess: new Chess(),
            chessBis: new Chess()
        };
        this.pointsGagnes = props.pointsGagnes;
        this.pointsPerdus = props.pointsPerdus;
        this.points = 0;
        this.idExercice = props.idExercice;

        this.nomPiece = ''
        this.pos = ''
        this.positionActuelle = '';
        this.positionActuelleBis = '';
        this.movetab = []
        this.explosion = false;
        this.soundExplosion = new Howl({
            src: ['/sons/macron-explosion.mp3']
        });
        this.soundarrivé = new Howl({
            src: ['/sons/win.wav']
        });

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
            src: ['/sons/wrong.wav']
        });
        this.switchOn = new Howl({
            src: ['/sons/switchOn.mp3']
        });
        this.switchOff = new Howl({
            src: ['/sons/switchOff.mp3']
        });

    }
    genererPlateau = () => {
        // this.chess.turn('b');
        const { chess, chessBis } = this.state;
        var colonneP, colonneB, colonneA, ligneP, ligneB, ligneA;
        // premiere etape choisir piece

        var tabBomb = [];
        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        const pieces = ['n', 'b'];

        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        this.piece = piece;
        chess.clear();
        chessBis.clear();

        if (piece === 'n') { // cavalier
            // position cavalier
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;


            // position arrivé
            if (colonneP <= 4 && ligneP <= 4) {     //position de depart en bas a gauche
                do {
                    colonneA = Math.floor(Math.random() * 8) + 1;
                    ligneA = Math.floor(Math.random() * 8) + 1;
                } while ((colonneA <= 4 && ligneA <= 4) || ((colonneA === 1 && ligneA === 8) ||
                    (colonneA === 2 && ligneA === 8)))
            }
            else if (colonneP <= 4 && ligneP > 4) {     //position de départ en haut a gauche 
                do {
                    colonneA = Math.floor(Math.random() * 8) + 1;
                    ligneA = Math.floor(Math.random() * 8) + 1;
                } while ((colonneA <= 4 && ligneA > 4) || ((colonneA === 1 && ligneA === 8) ||
                    (colonneA === 2 && ligneA === 8)));
            }
            else if (colonneP > 4 && ligneP <= 4) {     //position de départ en bas a droite 
                do {
                    colonneA = Math.floor(Math.random() * 8) + 1;
                    ligneA = Math.floor(Math.random() * 8) + 1;
                } while ((colonneA > 4 && ligneA <= 4) || ((colonneA === 1 && ligneA === 8) ||
                    (colonneA === 2 && ligneA === 8)));
            }
            else if (colonneP > 4 && ligneP > 4) {     //position de départ en haut a droite 
                do {
                    colonneA = Math.floor(Math.random() * 8) + 1;
                    ligneA = Math.floor(Math.random() * 8) + 1;
                } while ((colonneA > 4 && ligneA > 4) || ((colonneA === 1 && ligneA === 8) ||
                    (colonneA === 2 && ligneA === 8)));
            }

            // position bombe
            let cpt = 0;
            while (cpt < Math.floor(Math.random() * 12) + 4) {
                colonneB = Math.floor(Math.random() * 6) + 2;
                ligneB = Math.floor(Math.random() * 6) + 2;
                if (!chess.get(`${alpha[colonneB - 1]}${ligneB}`) && // pas deja une bombe
                    (ligneB !== ligneP && colonneB !== colonneP) && // pas sur la case de départ
                    (colonneB !== colonneA && ligneB !== ligneA)) // pas sur la case d'arrivé 
                {
                    chess.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                    chessBis.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                    tabBomb.push(`${alpha[colonneB - 1]}${ligneB}`);
                    cpt++;
                }
            }
        }
        else if (piece === 'b') {

            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;
            let Bcasecolor = chess.squareColor(`${alpha[colonneP - 1]}${ligneP}`);

            // position arrivé
            while (chess.squareColor(`${alpha[colonneA - 1]}${ligneA}`) !== `${Bcasecolor}`) {
                if (colonneP <= 4 && ligneP <= 4) {     //position de depart en bas a gauche
                    do {
                        colonneA = Math.floor(Math.random() * 8) + 1;
                        ligneA = Math.floor(Math.random() * 8) + 1;
                    } while ((colonneA <= 4 && ligneA <= 4) || ((colonneA === 1 && ligneA === 8) ||
                        (colonneA === 2 && ligneA === 8)))
                }
                else if (colonneP <= 4 && ligneP > 4) {     //position de départ en haut a gauche 
                    do {
                        colonneA = Math.floor(Math.random() * 8) + 1;
                        ligneA = Math.floor(Math.random() * 8) + 1;
                    } while ((colonneA <= 4 && ligneA > 4) || ((colonneA === 1 && ligneA === 8) ||
                        (colonneA === 2 && ligneA === 8)));
                }
                else if (colonneP > 4 && ligneP <= 4) {     //position de départ en bas a droite 
                    do {
                        colonneA = Math.floor(Math.random() * 8) + 1;
                        ligneA = Math.floor(Math.random() * 8) + 1;
                    } while ((colonneA > 4 && ligneA <= 4) || ((colonneA === 1 && ligneA === 8) ||
                        (colonneA === 2 && ligneA === 8)));
                }
                else if (colonneP > 4 && ligneP > 4) {     //position de départ en haut a droite 
                    do {
                        colonneA = Math.floor(Math.random() * 8) + 1;
                        ligneA = Math.floor(Math.random() * 8) + 1;
                    } while ((colonneA > 4 && ligneA > 4) || ((colonneA === 1 && ligneA === 8) ||
                        (colonneA === 2 && ligneA === 8)));
                }
            }
            // position bombe
            var cpt = 0;
            while (cpt < Math.floor(Math.random() * 8) + 6) {
                colonneB = Math.floor(Math.random() * 8) + 1;
                ligneB = Math.floor(Math.random() * 8) + 1;
                if ((!chess.get(`${alpha[colonneB - 1]}${ligneB}`)) && // pas deja une piece
                    (colonneB !== colonneA || ligneB !== ligneA) &&
                    (colonneB !== colonneP || ligneB !== ligneP) &&
                    (colonneB !== colonneA + 1 || ligneB !== ligneA + 1) &&
                    (colonneB !== colonneA - 1 || ligneB !== ligneA - 1) &&
                    (colonneB !== colonneA - 1 || ligneB !== ligneA + 1) &&
                    (colonneB !== colonneA + 1 || ligneB !== ligneA - 1) &&//
                    (colonneB !== colonneP + 1 || ligneB !== ligneP + 1) &&
                    (colonneB !== colonneP + 1 || ligneB !== ligneP - 1) &&//
                    (colonneB !== colonneP - 1 || ligneB !== ligneP + 1) &&
                    (colonneB !== colonneP - 1 || ligneB !== ligneP - 1) &&
                    (colonneB !== 1 || ligneB !== 8) &&
                    (colonneB !== 2 || ligneB !== 8) &&
                    chess.squareColor(`${alpha[colonneB - 1]}${ligneB}`) === `${Bcasecolor}`)//sur la meme couleur de case
                {
                    chess.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                    chessBis.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                    tabBomb.push(`${alpha[colonneB - 1]}${ligneB}`);

                    cpt++;
                }
            }
        }

        chess.put({ type: 'n', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A
        chessBis.put({ type: 'n', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A


        chess.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P
        chessBis.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P


        if (piece === 'p') this.nomPiece = `le pion en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'r') this.nomPiece = `la tour en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'n') this.nomPiece = `le cavalier en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'b') this.nomPiece = `le fou en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'q') this.nomPiece = `la reine en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'k') this.nomPiece = `le roi en ${alpha[colonneP - 1]}${ligneP}`

        this.pos = `${alpha[colonneA - 1]}${ligneA}`;
        this.positionActuelle = this.positionActuelleBis = `${alpha[colonneP - 1]}${ligneP}`;

        this.alpha = alpha;
        this.colonneA = colonneA;
        this.ligneA = ligneA;
        this.colonneP = colonneP;
        this.ligneP = ligneP;

        this.caseArriv = chess.get(`${alpha[colonneA - 1]}${ligneA}`);
        this.tabBomb = tabBomb;
        console.log("tabBomb", this.tabBomb);
        console.log("tabBombtaille", this.tabBomb.length);



        this.setState({ chess: chess, chessBis: chessBis })

        if (chessBis.moves().length === 0) {
            this.genererPlateau();
        }

    }
    componentDidMount() {
        this.genererPlateau();
    }
    // position bombe
    PlacerBombesB = () => {
        const { chess, chessBis, inputValue } = this.state;
        this.tabBomb = [];
        var cpt = 0;
        var colonneB = 0;
        var ligneB = 0;
        var colonnePiece = inputValue.slice(-2, -1);
        var lignePiece = inputValue.slice(-1);
        while (cpt < Math.floor(Math.random() * 8) + 5) {
            colonneB = Math.floor(Math.random() * 8) + 1;
            ligneB = Math.floor(Math.random() * 8) + 1;
            if ((!chess.get(`${this.alpha[colonneB - 1]}${ligneB}`)) && // pas deja une piece
                (colonneB !== this.colonneA || ligneB !== this.ligneA) &&
                (colonneB !== colonnePiece || ligneB !== lignePiece) &&
                (colonneB !== this.colonneA + 1 || ligneB !== this.ligneA + 1) &&
                (colonneB !== this.colonneA - 1 || ligneB !== this.ligneA - 1) &&
                (colonneB !== this.colonneA - 1 || ligneB !== this.ligneA + 1) &&
                (colonneB !== colonnePiece + 1 || ligneB !== lignePiece + 1) &&
                (colonneB !== colonnePiece + 1 || ligneB !== lignePiece - 1) &&//
                (colonneB !== 1 || ligneB !== 8) &&
                (colonneB !== 2 || ligneB !== 8) &&
                chess.squareColor(`${this.alpha[colonneB - 1]}${ligneB}`) === `${chess.squareColor(`${this.alpha[this.colonneP - 1]}${this.ligneP}`)}`)//sur la meme couleur de case
            {
                chess.put({ type: 'p', color: 'b' }, `${this.alpha[colonneB - 1]}${ligneB}`);
                chessBis.put({ type: 'p', color: 'b' }, `${this.alpha[colonneB - 1]}${ligneB}`);
                this.tabBomb.push(`${this.alpha[colonneB - 1]}${ligneB}`);

                cpt++;
            }
        }
    }
    clearboard = () => {
        const { chess, chessBis } = this.state;
        chess.clear();
        chessBis.clear();

        chess.put({ type: 'n', color: 'b' }, `${this.alpha[this.colonneA - 1]}${this.ligneA}`) // A
        chessBis.put({ type: 'n', color: 'b' }, `${this.alpha[this.colonneA - 1]}${this.ligneA}`) // A
        chess.put({ type: `${this.piece}`, color: 'w' }, this.positionActuelle); // P
        chessBis.put({ type: `${this.piece}`, color: 'w' }, this.positionActuelleBis); // P
        this.tabBomb = [];

    }
    customPieces = () => {
        let customBomb = {}
        if (this.explosion) {
            customBomb = {
                bP: ({ squareWidth }) => (
                    <img src="https://i.imgur.com/z82FgxP.png" alt="piont noir" style={{ width: squareWidth, height: squareWidth }}></img>
                ),
                bQ: ({ squareWidth }) => (
                    <img src="https://i.gifer.com/YQDj.gif" alt="explosion" style={{ width: squareWidth, height: squareWidth }}></img>
                ),
                bN: ({ squareWidth }) => (
                    <img src="https://cdn-icons-png.flaticon.com/128/4394/4394611.png" alt="arrivé" style={{ width: squareWidth, height: squareWidth }}></img>
                )
            };
        }
        else {
            customBomb = {
                bP: ({ squareWidth }) => (
                    <img src="https://i.imgur.com/z82FgxP.png" alt="piont noir" style={{ width: squareWidth, height: squareWidth }}></img>
                ),
                bN: ({ squareWidth }) => (
                    <img src="https://cdn-icons-png.flaticon.com/128/4394/4394611.png" alt="arrivé" style={{ width: squareWidth, height: squareWidth }}></img>
                )
            };

        }
        return customBomb;
    };

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

    handleClickNouveau = () => {
        Howler.volume(0.3);
        this.soundUp.play();
        this.setState({ showCorrect: false, showIncorrect: false, message: '' });
        this.genererPieceAleatoire();
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

    handleCoordonnees = (event) => {
        Howler.volume(0.3);
        if (event.target.checked) {
            this.switchOff.play();
            this.setState({ coordonnees: true });
        }
        else {
            this.switchOn.play();
            this.setState({ coordonnees: false });
        }
    }

    faireMouvementChess = (newPosition) => {
        const { chess } = this.state;
        if (chess.moves().some(item => item.replace(/[#+]$/, '') === newPosition ||
            chess.moves().some(item => item.replace(/[#+]$/, '') === (newPosition[0] + 'x' + newPosition.slice(1))))) {
            chess.remove(this.positionActuelle);
            chess.put({ type: `${this.piece}`, color: 'w' }, newPosition.slice(-2));
            this.positionActuelle = newPosition.slice(-2);
            this.setState({ chess: chess });
            return true;
        }
        else {
            return false;
        }
    }

    faireMouvementChessBis = (newPosition) => {
        const { chessBis } = this.state;
        if (chessBis.moves().some(item => item.replace(/[#+]$/, '') === newPosition ||
            chessBis.moves().some(item => item.replace(/[#+]$/, '') === (newPosition[0] + 'x' + newPosition.slice(1))))) {
            chessBis.remove(this.positionActuelleBis);
            chessBis.put({ type: `${this.piece}`, color: 'w' }, newPosition.slice(-2));
            this.positionActuelleBis = newPosition.slice(-2);
            this.setState({ chessBis: chessBis });
            return true;
        }
        else {
            return false;
        }
    }
    moiseFOU = () => {
        const { inputValue, chessBis } = this.state;
        let colonneActuelle = this.alpha.indexOf((this.positionActuelleBis.slice(-2, -1))) + 1;
        let colonneFuture = this.alpha.indexOf((inputValue.slice(-2, -1))) + 1;
        let ligneActuelle = (this.positionActuelleBis.slice(-1));
        let ligneFuture = (inputValue.slice(-1));
        var casee = this.positionActuelleBis;
        let ligne = ligneActuelle;
        let colonne = colonneActuelle;

        if (ligneActuelle < ligneFuture) { //cas move en haut
            if (colonneActuelle > colonneFuture) { // cas move en haut a gauche
                for (let i = ligneActuelle; i <= ligneFuture; i++) {
                    colonne--;
                    casee = this.alpha[colonne] + i;
                    console.log(casee);

                    if (this.tabBomb.includes(casee)) {
                        console.log("mais wtf");
                        return casee;
                    }
                }
            }
        }
        console.log("colonne", colonne);

        if (colonneActuelle < colonneFuture && ligneActuelle < ligneFuture) { //cas move en haut a droite
            for (let i = ligneActuelle; i <= ligneFuture; i++) {
                colonne++;
                casee = this.alpha[colonne - 2] + i;
                console.log(casee);

                if (this.tabBomb.includes(casee)) {
                    console.log("mais wtf");
                    return casee;
                }
            }
        }
        if (colonneActuelle > colonneFuture && ligneActuelle > ligneFuture) {//cas move en bas a gauche
            for (let i = ligneActuelle; i >= ligneFuture; i--) {
                colonne--;
                casee = this.alpha[colonne] + i;
                console.log(casee);
                if (this.tabBomb.includes(casee)) {
                    console.log("mais wtf");
                    return casee;
                }
            }
        }
        if (colonneActuelle < colonneFuture && ligneActuelle > ligneFuture) {//cas move en bas a droite
            for (let i = ligneActuelle; i >= ligneFuture; i--) {
                colonne++;
                casee = this.alpha[colonne - 2] + i;
                console.log(casee);
                if (this.tabBomb.includes(casee)) {
                    console.log("mais wtf");
                    return casee;
                }
            }
        }
        return false;
    }

    handleClick = async () => {
        const { inputValue, chess, chessBis } = this.state;
        this.setState({ incorrectMessage: '' })
        let currentIndex = 0;
        if (this.piece === 'b') {
            let bombeEntre = this.moiseFOU();

            if (bombeEntre) { // verifie chaque bombe 

                this.movetab.push(`${this.piece}`.toUpperCase() + 'x' + bombeEntre);
                await new Promise((resolve) => {
                    let intervalId = setInterval(() => { //faire deplacement
                        if (currentIndex < this.movetab.length) {
                            if (this.faireMouvementChess(this.movetab[currentIndex])) {
                                currentIndex++;
                            }
                            else {
                                console.log("error dans explosion");
                                clearInterval(intervalId);
                                resolve(false);
                            }
                        }
                        else {
                            clearInterval(intervalId);
                            this.explosion = true;
                            // transforme en Q et affiche le message
                            chess.remove(bombeEntre);
                            chess.put({ type: 'q', color: 'b' }, bombeEntre)
                            let text = "KABOOM !";
                            Howler.volume(1);
                            this.soundExplosion.play();
                            this.setState({ chess: chess, chessBis: chessBis, incorrectMessage: text });

                            setTimeout(() => { // regere plateau apres 3 sec
                                this.setState({ correctMessage: '', incorrectMessage: '', inputValue: '' });
                                this.genererPlateau();
                                this.movetab = []
                            }, 3000);
                            return;
                        }
                    }, 800);
                });
            }
        }
        else {
            for (let i = 0; i < this.tabBomb.length; i++) { // verifie chaque bombe 
                if (inputValue === `${this.piece}`.toUpperCase() + 'x' + this.tabBomb[i] || //case avec bombe 
                    inputValue === `${this.piece}`.toUpperCase() + this.tabBomb[i]) {
                    this.movetab.push(`${this.piece}`.toUpperCase() + 'x' + this.tabBomb[i]);
                    await new Promise((resolve) => {
                        let intervalId = setInterval(() => { //faire deplacement
                            if (currentIndex < this.movetab.length) {
                                if (this.faireMouvementChess(this.movetab[currentIndex])) {
                                    currentIndex++;
                                }
                                else {
                                    console.log("error dans explosion");
                                    clearInterval(intervalId);
                                    resolve(false);
                                }
                            }
                            else {
                                clearInterval(intervalId);
                                this.explosion = true;
                                // transforme en Q et affiche le message
                                chess.remove(this.tabBomb[i]);
                                chess.put({ type: 'q', color: 'b' }, this.tabBomb[i])
                                let text = "KABOOM !";
                                Howler.volume(1);
                                this.soundExplosion.play();
                                this.setState({ chess: chess, incorrectMessage: text });

                                setTimeout(() => { // regere plateau apres 3 sec
                                    this.setState({ correctMessage: '', incorrectMessage: '', inputValue: '' });
                                    this.genererPlateau();
                                    this.movetab = []
                                }, 3000);
                                return;
                            }
                        }, 800);
                    });
                }
            }
        }
        if (inputValue === `${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}` ||
            inputValue === `${this.piece}`.toUpperCase() + `${this.alpha[this.colonneA - 1]}${this.ligneA}`) {
            if (!this.faireMouvementChessBis(`${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`)) {
                return;
            };
            this.clearboard();
            var text = "Bravo champion !";
            this.movetab.push(`${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`);
            this.setState({ correctMessage: text, incorrectMessage: '' });

            currentIndex = 0;
            // redefinir position depart
            let newIntervalId = setInterval(() => { //faire deplacement
                if (currentIndex < this.movetab.length) {
                    if (this.faireMouvementChess(this.movetab[currentIndex])) {
                        currentIndex++;
                    }
                    else {
                        clearInterval(newIntervalId);
                        console.log("Probleme lors des mouvements");
                        return;
                    }
                } else {
                    Howler.volume(1);
                    this.soundarrivé.play();
                    clearInterval(newIntervalId);
                    setTimeout(() => { // regere plateau apres 3 sec
                        this.setState({ correctMessage: '', incorrectMessage: '', inputValue: '' });
                        this.genererPlateau();
                        this.movetab = []
                    }, 3000);
                }
            }, 800);
        }
        else {
            if (this.faireMouvementChessBis(inputValue)) {
                this.movetab.push(inputValue)
                this.setState({ inputValue: '', chessBis: chessBis, chess: chess });
                this.clearboard();
                this.PlacerBombesB();
            }
            else {
                this.setState({ inputValue: '', incorrectMessage: "Ce coup est interdit !" });
            }
        }
    };


    MaterialUISwitch = styled(Switch)(({ theme, disabled }) => ({
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

    Android12Switch = styled(Switch)(({ theme }) => ({
        padding: 8,
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&:before, &:after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&:after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));
    theme = createTheme({
        palette: {
            secondary: {
                main: '#af80dc',
            },
        },
    });


    render() {
        const piecesBlanchesNom = [
            "Pion", "Tour", "Fou", "Cavalier", "Dame", "Roi"
        ]
        let lignes = this.state.orientation === 'white'
            ? ["8", "7", "6", "5", "4", "3", "2", "1"]
            : ["1", "2", "3", "4", "5", "6", "7", "8"];
        let colonnes = this.state.orientation === 'white'
            ? ["a", "b", "c", "d", "e", "f", "g", "h"]
            : ["h", "g", "f", "e", "d", "c", "b", "a"];
        const custom = [
            "x", "O-O", "O-O-O", "=", "+", "#"
            // "x" pour la prise, "O-O" pour le petit roque, "O-O-O" pour le grand roque, 
            //"=" pour la promotion, "+" pour echec, "#" pour le mat
        ]
        const customCoup = [
            "prise", "petit roque", "grand roque", "promotion", "echec", "mat"
        ]
        return (
            <div className="container-general">
                <div className="plateau-gauche">
                    <div className="option">
                        <FormControlLabel
                            control={<this.MaterialUISwitch
                                checked={this.state.orientation === 'white'}
                                color="secondary"
                            />}
                            label={this.state.orientation === 'white' ? 'Plateau coté Blancs' : 'Plateau coté Noirs'}
                            onChange={this.handleOrientation}
                        />
                        <ThemeProvider theme={this.theme}>
                            <FormControlLabel
                                control={<this.Android12Switch
                                    checked={this.state.coordonnees === true}
                                    color="secondary"
                                />}
                                label={'Coordonnées'}
                                onChange={this.handleCoordonnees}
                                style={{
                                    textDecoration: this.state.coordonnees === false && 'line-through'
                                }}
                            />
                        </ThemeProvider>
                    </div>
                    <Chessboard
                        key="board"
                        position={this.state.chess.fen()}
                        arePiecesDraggable={false}
                        customPieces={this.customPieces()}
                        customSquareStyles={this.state.coloredSquares}
                        boardOrientation={this.state.orientation}
                        showBoardNotation={this.state.coordonnees}
                    />
                </div>
                <div className="elements-droite">
                    <i className="consigne">
                        Ecrivez le coup pour que {this.nomPiece} mange le drapeau en {this.pos} sans toucher les bombes
                    </i>
                    <div className="boutons">
                        <div className="groupe-butons" >
                            {this.state.piecesLanguage.map((line, index) => { // pion tour fou cavalier reine roi
                                return (
                                    <button className={`pushable ${(index % 2) ? 'pushable-clair' : 'pushable-fonce'}`}
                                        key={piecesBlanchesNom[index]}
                                        title={piecesBlanchesNom[index]}
                                        onMouseEnter={() => this.handlePieceHover()}
                                        onMouseUp={() => this.handlePieceUp(this.state.piecesLanguage[index])}
                                        onMouseDown={() => this.handlePieceDown()}>
                                        <span className={`front ${(index % 2) ? 'fronts-clair' : 'fronts-fonce'}`}>
                                            {line}
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
                            <select className="language-selector" value={this.state.selectedLanguage} onMouseDown={() => this.handlePieceDown()} onChange={this.handleLanguageChange}>
                                <option value="fr">🇫🇷</option>
                                <option value="en">🇬🇧</option>
                                <option value="es">🇪🇸</option>
                                <option value="de">🇩🇪</option>
                                <option value="it">🇮🇹</option>
                                <option value="ru">🇷🇺</option>
                                <option value="cn">🇨🇳</option>
                            </select>
                            <input className="reponse-input"
                                type="text"
                                placeholder="Réponse..."
                                value={this.state.inputValue}
                                onChange={this.handleInputChange}
                                onKeyDown={this.handleKeyPress}
                                ref={this.monInputRef} />
                            <button className="bouton-3D button-clean"
                                title="supprimer"
                                onMouseDown={() => this.handlePieceDown()}
                                onMouseEnter={() => this.handlePieceHover()}
                                onClick={this.handleClearButtonClick} >
                                <span className="texte-3D texte-clean">
                                    ✘
                                </span>
                            </button>
                        </Stack>

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
                    </div>
                    <div className={`response ${this.state.showCorrect ? 'show' : this.state.showIncorrect ? 'show incorrect' : ''}`}>
                        {this.state.message}
                    </div>
                </div>
            </div>
        );
    }
}

export default Bombe4;