import React from "react";
import './Bombe.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Howl, Howler } from 'howler';

class BombeEX3 extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',

            chess: new Chess(),
            chessBis: new Chess()
        };
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


    }
    genererPlateau = () => {
        // this.chess.turn('b');
        const { chess, chessBis } = this.state;
        var colonneP, colonneB, colonneA, ligneP, ligneB, ligneA;
        // premiere etape choisir piece

        //choix couleur
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
                    (colonneB !== colonneP - 1 || ligneB !== ligneP + 1)&&
                    (colonneB !== colonneP - 1 || ligneB !== ligneP - 1)&&
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
        console.log("tabBomb", this.tabBomb)


        this.setState({ chess: chess, chessBis: chessBis })

        if (chessBis.moves().length === 0) {
            this.genererPlateau();
        }

    }
    componentDidMount() {
        this.genererPlateau();
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
                            let text = "EXPLOOSIIOOONN !";
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
        else {for (let i = 0; i < this.tabBomb.length; i++) { // verifie chaque bombe 
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
                            let text = "EXPLOOSIIOOONN !";
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
        }}
        if (inputValue === `${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}` ||
            inputValue === `${this.piece}`.toUpperCase() + `${this.alpha[this.colonneA - 1]}${this.ligneA}`) {
            if (!this.faireMouvementChessBis(`${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`)) {
                return;
            };
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
                this.setState({ inputValue: '', chessBis: chessBis });
            }
            else {
                this.setState({ inputValue: '', incorrectMessage: "et non bonhomme, ce coup n'est pas bon" });
            }
        }
    };


    render() {
        return (
            <div className="container">
                <div className="chesscenter">
                    <h2 id="txt">Ecrivez le coup pour que {this.nomPiece} mange le drapeau en {this.pos} sans toucher les bombes</h2>
                    <Chessboard
                        position={this.state.chess.fen()}
                        arePiecesDraggable={false}
                        animationDuration={600}
                        customPieces={this.customPieces()}
                    />
                </div>
                <div className="elementsDroite">
                    <input id="saisieposition" type="text" placeholder="Entrez le mouvement..." value={this.state.inputValue} onChange={this.handleInputChange}></input>
                    <button id="checkposition" onClick={this.handleClick}>Valider</button>
                    <div id="correctMessage">{this.state.correctMessage} </div>
                    <div id="incorrectMessage">{this.state.incorrectMessage} </div>
                </div>
            </div>
        );
    }
}


export default BombeEX3;