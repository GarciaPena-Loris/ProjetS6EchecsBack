import React from "react";
import './Bombe.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Howl, Howler } from 'howler';

class Bombe extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',

            chess: new Chess(),
        };
        this.nomPiece = ''
        this.pos = ''
        this.positionActuelle = '';
        this.movetab = []
        this.explosion = false;
        this.soundExplosion = new Howl({
            src: ['/sons/macron-explosion.mp3']
        });
        this.soundarrive = new Howl({
            src: ['/sons/win.wav']
        });


    }
    genererPlateau = () => {
        // this.chess.turn('b');
        const { chess } = this.state;
        var colonneP, colonneB, colonneA, ligneP, ligneB, ligneA, coul, coulM, couleur;
        // premiere etape choisir piece

        //choix couleur
        couleur = 'b';
        coul = 'b';
        coulM = 'w';
        var tabBomb = [];
        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];


        const piece = 'r'
        this.piece = piece;
        chess.clear();

        if (piece === 'r') { // tour
            // position tour
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
                if (!chess.get(`${alpha[colonneB - 1]}${ligneB}`) && // pas déjà une bombe
                    (ligneB !== ligneP || colonneB !== colonneP) && // pas sur la case de départ
                    (colonneB !== colonneA || ligneB !== ligneA)) // pas sur la case d'arrivée
                {
                    chess.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                    tabBomb.push(`${alpha[colonneB - 1]}${ligneB}`);
                    cpt++;
                }
            }
        }

        chess.put({ type: 'n', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A


        chess.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P


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

        this.setState({ chess: chess })

        if (chess.moves().length === 0) {
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
        console.log(chess.moves());
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

    moise = () => {
        const { inputValue, chess } = this.state;
        if (inputValue.slice(-1) === this.positionActuelle.slice(-1)) { // meme ligne, donc analyser les colonnes
            let colonneActuelle = this.alpha.indexOf((this.positionActuelle.slice(-2, -1))) + 1;
            let colonneFuture = this.alpha.indexOf((inputValue.slice(-2, -1))) + 1;
            console.log(colonneActuelle)
            console.log(colonneFuture)

            if (colonneActuelle - colonneFuture < 0) { // si actuel est a gauche de futur
                for (let i = colonneActuelle; i < colonneFuture; i++) {
                    console.log(this.alpha[i] + this.positionActuelle.slice(-1));
                    console.log("alpha",this.alpha[i]);
                    if (this.tabBomb.includes(this.alpha[i] + this.positionActuelle.slice(-1))) {
                        return this.alpha[i] + this.positionActuelle.slice(-1);
                    }
                }
            }
            else {
                for (let i = colonneActuelle-1; i > colonneFuture; i--) { // si actuel est a droite de futur*
                    console.log(this.alpha[i ] + this.positionActuelle.slice(-1));
                    if (this.tabBomb.includes(this.alpha[i] + this.positionActuelle.slice(-1))) {
                        return this.alpha[i] + this.positionActuelle.slice(-1);
                    }
                }
            }
        }
        else if (inputValue.slice(-2, -1) === this.positionActuelle.slice(-2, -1)) { // meme colonne, donc analyser les lignes
            let ligneActuelle = (this.positionActuelle.slice(-1));
            let ligneFuture = (inputValue.slice(-1));

            if (ligneActuelle - ligneFuture < 0) { // si actuel est en dessous de futur
                for (let i = ligneActuelle; i <= ligneFuture; i++) {
                    if (this.tabBomb.includes(this.positionActuelle.slice(-2, -1) + i)) {
                        return this.positionActuelle.slice(-2, -1) + i;
                    }
                }
            }
            else {
                for (let i = ligneActuelle; i > ligneFuture; i--) { // si actuel au dessus de futur
                    if (this.tabBomb.includes(this.positionActuelle.slice(-2, -1) + i)) {
                        return this.positionActuelle.slice(-2, -1) + i;
                    }
                }
            }
        }
        return false;
    }

    handleClick = async () => {
        const { inputValue, chess } = this.state;

        let bombeEntre = this.moise();
        console.log(bombeEntre);

        if (bombeEntre) {
            this.faireMouvementChess(`${this.piece}`.toUpperCase() + 'x' + bombeEntre);
            this.setState({ chess: chess });

            setTimeout(() => { // regere plateau apres 3 sec
                this.explosion = true;
                // transforme en Q et affiche le message
                chess.remove(bombeEntre);
                chess.put({ type: 'q', color: 'b' }, bombeEntre);
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
            }, 500);

        }
        else {
            console.log("Ya pas de bombe chef !");
            if (inputValue === `${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}` ||
                inputValue === `${this.piece}`.toUpperCase() + `${this.alpha[this.colonneA - 1]}${this.ligneA}`) { // si case arrive
                if (!this.faireMouvementChess(`${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`)) {
                    this.setState({ inputValue: '', incorrectMessage: "Eh oh c'est interdit ⛔ petit malin va." });
                    return;
                };
                this.faireMouvementChess(`${this.piece}`.toUpperCase() + 'x' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`)
                var text = "Bravo c'était ça !";
                this.setState({ correctMessage: text, incorrectMessage: '' });
                // redefinir position depart

                Howler.volume(1);
                this.soundarrive.play();
                setTimeout(() => { // regere plateau apres 3 sec
                    this.setState({ correctMessage: '', incorrectMessage: '', inputValue: '' });
                    this.genererPlateau();
                    this.movetab = []
                }, 3000);
            }
            else {
                if (this.faireMouvementChess(inputValue)) {
                    this.setState({ inputValue: '', chess: chess });
                }
                else {
                    this.setState({ inputValue: '', incorrectMessage: "T'ES VRAIMENT UNE GROSSE MERDE ! VA TE PENDRE ENCULÉ" });
                }
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


export default Bombe;