import React from "react";
import './Bombe.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

class BombeEX2 extends React.Component {
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
        this.movetab = []


    }
    genererPlateau = () => {
        // this.chess.turn('b');

        var colonneP, colonneB, colonneA, ligneP, ligneB, ligneA, coul, coulM, couleur;
        // premiere etape choisir piece

        //choix couleur
        couleur = 'b';
        coul = 'b';
        coulM = 'w';

        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        const pieces = ['p', 'r', 'n', 'b', 'q', 'k'];

        const piece = 'r'
        // pieces[Math.floor(Math.random() * pieces.length)];
        this.piece = piece;
        this.state.chess.clear();
        this.state.chessBis.clear();

        if (piece === 'r') { // tours
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
        }
        // position bombe
        let cpt = 0;
        while (cpt < Math.floor(Math.random() * 10) + 4) {
            colonneB = Math.floor(Math.random() * 6) + 2;
            ligneB = Math.floor(Math.random() * 6) + 2;
            if (!this.state.chess.get(`${alpha[colonneB - 1]}${ligneB}`) && // pas deja une bombe
                (ligneB !== ligneP && colonneB !== colonneP) && // pas sur la case de départ
                (colonneB !== colonneA && ligneB !== ligneA)) // pas sur la case d'arrivé 
            {
                this.state.chess.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                this.state.chessBis.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);

                cpt++;
            }
        }

        this.state.chess.put({ type: 'n', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A
        this.state.chessBis.put({ type: 'n', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A


        this.state.chess.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P
        this.state.chessBis.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P


        if (piece === 'p') this.nomPiece = `le pion en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'r') this.nomPiece = `la tour en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'n') this.nomPiece = `le cavalier en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'b') this.nomPiece = `le fou en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'q') this.nomPiece = `la reine en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'k') this.nomPiece = `le roi en ${alpha[colonneP - 1]}${ligneP}`

        this.pos = `${alpha[colonneA - 1]}${ligneA}`;

        this.alpha = alpha;
        this.colonneA = colonneA;
        this.ligneA = ligneA;
        this.colonneP = colonneP;
        this.ligneP = ligneP;
        this.caseArriv = this.state.chess.get(`${alpha[colonneA - 1]}${ligneA}`);

        this.setState({ chess: this.state.chess, chessBis: this.state.chessBis })
        console.log(this.state.chessBis.moves({ verbose: true }));

    }
    componentDidMount() {
        this.genererPlateau();
    }


    customPieces = () => {
        const customBomb = {
            bP: ({ squareWidth }) => (
                <img src="https://i.imgur.com/z82FgxP.png" alt="piont noir" style={{ width: squareWidth, height: squareWidth }}></img>
            )
        };
        return customBomb;
    };

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    TourNoir = (n) => {
        const { inputValue, chess, chessBis } = this.state;
        this.setState({ chess: chess, chessBis: chessBis, correctMessage: '', incorrectMessage: '', inputValue: '' });
        switch (n) {
            case chessBis:
                if ((!chessBis.get('a8')) && (!chessBis.get('b8'))) {
                    chessBis.put({ type: 'q', color: 'b' }, 'a8');
                    chessBis.move('Qb8');
                    chessBis.remove('b8');
                }
                else if (chessBis.get('a8')) {
                    chessBis.remove('a8')
                    chessBis.put({ type: 'q', color: 'b' }, 'a8');
                    chessBis.move('Qb8');
                    chessBis.remove('b8');
                    chessBis.put({ type: 'r', color: 'w' }, 'a8')
                } else if (chess.get('b8')) {
                    chessBis.remove('b8')
                    chessBis.put({ type: 'q', color: 'b' }, 'b8');
                    chessBis.move('Qa8');
                    chessBis.remove('a8');
                    chessBis.put({ type: 'r', color: 'w' }, 'b8')

                }
                else if (!chessBis.get('a8') && !chessBis.get('b8')) {
                    chessBis.put({ type: 'q', color: 'b' }, 'h1');
                    chessBis.move('Qh2');
                    chessBis.remove('h2');
                } break;
            case chess:
                if ((!chess.get('a8')) && (!chess.get('b8'))) {
                    chess.put({ type: 'q', color: 'b' }, 'a8');
                    chess.move('Qb8');
                    chess.remove('b8');
                }
                else if (chess.get('a8')) {
                    chess.remove('a8')
                    chess.put({ type: 'q', color: 'b' }, 'a8');
                    chess.move('Qb8');
                    chess.remove('b8');
                    chess.put({ type: 'r', color: 'w' }, 'a8')
                } else if (chess.get('b8')) {
                    chess.remove('b8')
                    chess.put({ type: 'q', color: 'b' }, 'b8');
                    chess.move('Qa8');
                    chess.remove('a8');
                    chess.put({ type: 'r', color: 'w' }, 'b8')

                }
                else if (!chess.get('a8') && !chess.get('b8')) {
                    chess.put({ type: 'q', color: 'b' }, 'h1');
                    chess.move('Qh2');
                    chess.remove('h2');
                } break;
            default:
                console.log("Sorry, we are out of context.");
        };
    }




    handleClick = () => {
        const { inputValue, chess, chessBis } = this.state;
        this.setState({ chess: chess, chessBis: chessBis, correctMessage: '', incorrectMessage: '', inputValue: '' });
        let currentIndex = 0;
        console.log(this.state.chessBis.moves({ verbose: true }));

        if (inputValue === 'Rx' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`) {
            try {
                chessBis.move('Rx' + `${this.alpha[this.colonneA - 1]}${this.ligneA}`)
                this.TourNoir(chessBis);

            } catch (error) {
                console.log("Non !")
                console.log(error)
                return;
            }
            const text = "Bravo c'était ça !";
            var longueur = this.movetab.push(inputValue)

            let intervalId = setInterval(() => {
                if (currentIndex < this.movetab.length) {
                    try { this.state.chess.move(this.movetab[currentIndex]); }
                    catch (error) {
                        console.log(error);
                        clearInterval(intervalId)
                    }
                    this.TourNoir(chess);
                    // this.setState({ chess: this.state.chess });
                    currentIndex++;
                } else {
                    clearInterval(intervalId);
                    this.setState({ chess: chess, correctMessage: text });
                    console.log(chess.get(`${this.alpha[this.colonneA - 1]}${this.ligneA}`))
                    setTimeout(() => {
                        this.setState({ correctMessage: '' });
                        this.genererPlateau();
                        this.movetab = []
                    }, 3000); // Efface le message après 3 secondes
                }
            }, 800);


            // chess.remove(`${this.alpha[this.colonneA - 1]}${this.ligneA}`)
            // chess.remove(`${this.alpha[this.colonneP - 1]}${this.ligneP}`)
            // chess.put({type: 'r', color: 'w'},`${this.alpha[this.colonneA - 1]}${this.ligneA}` )


        }
        else {

            try {
                chessBis.move(inputValue);
            } catch (error) {
                console.log("Pas du tout !")
                return;
            }

            var longueur = this.movetab.push(inputValue)

            console.log(this.movetab)

            this.setState({ chessBis: chessBis });


            this.TourNoir(chessBis);

            console.log(chessBis.moves({ verbose: true }));
        }



    };


    render() {
        return (
            <div className="container">
                <div className="chesscenter">
                    <h2 id="txt">Ecrivez le coup pour que {this.nomPiece} aille en {this.pos} sans toucher les bombes</h2>
                    <Chessboard
                        position={this.state.chess.fen()}
                        squareStyles={{ e4: { backgroundColor: "yellow" } }}
                        arePiecesDraggable={false}
                        width={400}
                        animationDuration={800}
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


export default BombeEX2;