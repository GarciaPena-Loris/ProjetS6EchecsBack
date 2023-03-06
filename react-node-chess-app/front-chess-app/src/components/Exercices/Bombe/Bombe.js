import React from "react";
import './Bombe.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { text } from "express";

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
        this.alpha = alpha;
        this.colonneA = colonneA;
        this.ligneA = ligneA;

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

        // 3 cas
        if (piece === 'p') { // pions
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
        }
        else if (piece === 'r') { // tours
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
                        this.state.chess.put({ type: 'p', color: 'w' }, `${alpha[colonneB - 1]}${ligneB}`);
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

        else if (piece === 'n') {
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

        } else if (piece === 'b') {
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
        }
        else if (piece === 'q') {
            //piece qui mange 
            colonneP = Math.floor(Math.random() * 8) + 1;
            ligneP = Math.floor(Math.random() * 8) + 1;
            //piece qui sera mangé 
            colonneM = Math.floor(Math.random() * 8) + 1;
            do { ligneM = Math.floor(Math.random() * 8) + 1; }
            while ((colonneM === colonneP && ligneM === ligneP) || (ligneM !== ligneP && colonneM !== colonneP
                && ligneM !== (ligneP + Math.abs(colonneP - colonneM) || ligneP - Math.abs(colonneP - colonneM))));


        }
        else if (piece === 'k') {
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
        }




        this.state.chess.put({ type: 'p', color: 'b' }, `${alpha[colonneA - 1]}${ligneA}`) // A

        this.state.chess.put({ type: `${piece}`, color: 'w' }, `${alpha[colonneP - 1]}${ligneP}`); // P

        if (piece === 'p') this.state.nomPiece = `le pion en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'r') this.state.nomPiece = `la tour en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'n') this.state.nomPiece = `le cavalier en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'b') this.state.nomPiece = `le fou en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'q') this.state.nomPiece = `la reine en ${alpha[colonneP - 1]}${ligneP}`
        else if (piece === 'k') this.state.nomPiece = `le roi en ${alpha[colonneP - 1]}${ligneP}`

        this.state.pos = `${alpha[colonneM - 1]}${ligneM}`;

        var coup = '';
        if (piece !== 'p') {
            coup += piece.toUpperCase();
        }

        if (this.state.chess.get(`${alpha[colonneA - 1]}${ligneA}`) && piece !== 'p') {
            if (colonneA === colonneP) {
                coup += ligneP;
            }
            else coup += alpha[colonneP - 1];
        }

        if (this.state.chess.get(`${alpha[colonneM - 1]}${ligneM}`)) {
            if (piece === 'p') {
                coup += alpha[colonneP - 1];
            }
            coup += 'x';
        }
        coup += alpha[colonneM - 1] + ligneM;
        if (piece === 'p' && (ligneM === 1 || ligneM === 8)) {
            coup += '=Q';
        }

        console.log(this.state.chess.moves({ verbose: true }))
        this.coup = coup;

        // ----------------------
        this.caseARemove = alpha[colonneP - 1] + ligneP;
        // ----------------------

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
        if (!chess.get(`${this.alpha[this.colonneA - 1]}${this.ligneA}`)){
            const text = "Bravo c'était ça !";
            this.setState({ chess: chess, correctMessage: text, incorrectMessage: '', inputValue: '' });
        }
    };


    render() {
        return (
            <div className="container">
                <div className="chesscenter">
                    <h2 id="txt">Ecrivez le coup pour que {this.state.nomPiece} aille en {this.state.pos}</h2>
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