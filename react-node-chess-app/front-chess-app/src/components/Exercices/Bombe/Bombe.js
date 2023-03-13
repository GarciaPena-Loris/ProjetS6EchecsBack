import React from "react";
import './Bombe.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

class Bombe extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',
            nomPiece: '',
            pos: '',
            chess: new Chess()
        };

        const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        var colonneP, colonneB, colonneA, ligneP, ligneB, ligneA, coul, coulM, couleur, colonneM, ligneM;
        this.state.chess.clear();
        

        //choix couleur
        couleur = 'b';
        coul = 'b';
        coulM = 'w';


        // this.chess.turn('b');

        // premiere etape choisir piece
        const pieces = ['p', 'r', 'n', 'b', 'q', 'k'];
        const piece = 'r'
        // pieces[Math.floor(Math.random() * pieces.length)];
        this.piece = piece;


        if (piece === 'r') { // tours
            // position tour
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;

            // position bombe
            let cpt = 0;
            while (cpt < 5) {
                colonneB = Math.floor(Math.random() * 8) + 1;
                ligneB = Math.floor(Math.random() * 8) + 1;
                if ((ligneB !== ligneP && colonneB !== colonneP) &&
                    (ligneB !== 1 && colonneB !== 1) && (ligneB !== 1 && colonneB !== 8)
                    && (ligneB !== 8 && colonneB !== 1) && (ligneB !== 8 && colonneB !== 8) && //Pas dans les coins
                    (ligneB !== 1 && colonneB !== 2) && (ligneB !== 1 && colonneB !== 7)
                    && (ligneB !== 8 && colonneB !== 2) && (ligneB !== 8 && colonneB !== 7) &&
                    (ligneB !== 2 && colonneB !== 1) && (ligneB !== 2 && colonneB !== 8)
                    && (ligneB !== 7 && colonneB !== 1) && (ligneB !== 7 && colonneB !== 8)) {
                    if (!this.state.chess.get(`${alpha[colonneB - 1]}${ligneB}`)) {
                        this.state.chess.put({ type: 'p', color: 'b' }, `${alpha[colonneB - 1]}${ligneB}`);
                        cpt++;
                    }
                }
            }

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






        this.state.chess.put({ type: 'n', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A

        this.state.chess.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P

        if (piece === 'p') this.state.nomPiece = `le pion en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'r') this.state.nomPiece = `la tour en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'n') this.state.nomPiece = `le cavalier en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'b') this.state.nomPiece = `le fou en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'q') this.state.nomPiece = `la reine en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'k') this.state.nomPiece = `le roi en ${alpha[colonneP - 1]}${ligneP}`

        

        this.state.pos = `${alpha[colonneA - 1]}${ligneA}`;

        this.alpha = alpha;
        this.colonneA = colonneA;
        this.ligneA = ligneA;
        this.caseArriv = this.state.chess.get(`${alpha[colonneA - 1]}${ligneA}`);
        

    }

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleClick = () => {
        const { inputValue, chess } = this.state;
        this.setState({ chess: chess, correctMessage: '', incorrectMessage: '', inputValue: '' });

        chess.move(inputValue);
        this.setState({ chess: chess });
        console.log("avant de mettre la piece");
        console.log(chess.moves({ verbose: true }));
        if ((!chess.get('a8')) && (!chess.get('b8'))) {
            chess.put({ type: 'q', color: 'b' }, 'a8');
            console.log("avant de faire le move");

            console.log(chess.moves({ verbose: true }));

            chess.move('Qb8');
            chess.remove('b8');
        } else if (!chess.get('h1') && !chess.get('g1')) {
            if (chess.get('a8')) {
                chess.remove('a8')
                chess.put({ type: 'q', color: 'b' }, 'h1');
                chess.move('Qg1');
                chess.remove('g1');
                chess.put({ type: 'r', color: 'w' }, 'a8')
            } else if (chess.get('b8')) {
                chess.remove('b8')
                chess.put({ type: 'q', color: 'b' }, 'h1');
                chess.move('Qg1');
                chess.remove('g1');
                chess.put({ type: 'r', color: 'w' }, 'b8')
            }
        }
        else if (!chess.get('h1') && !chess.get('h2')) {
            chess.put({ type: 'q', color: 'b' }, 'h1');
            chess.move('Qh2');
            chess.remove('h2');
        }
        if (inputValue === 'Rx'+`${this.alpha[this.colonneA - 1]}${this.ligneA}`) {
            try {
                chess.move(`${this.alpha[this.colonneA - 1]}${this.ligneA}`)
            } catch(error){console.log("Non !")}
            const text = "Bravo c'était ça !";
            this.setState({ chess: chess, correctMessage: text });
            console.log(chess.get(`${this.alpha[this.colonneA - 1]}${this.ligneA}`))
        }
    };


    render() {
        return (
            <div className="container">
                <div className="chesscenter">
                    <h2 id="txt">Ecrivez le coup pour que {this.state.nomPiece} aille en {this.state.pos} sans toucher les bombes</h2>
                    <Chessboard
                        position={this.state.chess.fen()}
                        squareStyles={{ e4: { backgroundColor: "yellow" } }}
                        arePiecesDraggable={false}
                        width={400}
                        animationDuration={800}
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