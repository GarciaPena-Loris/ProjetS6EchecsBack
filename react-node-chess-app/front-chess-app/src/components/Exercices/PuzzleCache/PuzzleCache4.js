import React from "react";
import './PuzzleCache.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess, SQUARES } from 'chess.js'
// validation réponse
import axios from "axios";


//import { decodeToken } from "react-jwt";

class PuzzleCache extends React.Component {
    static SQUARES = [
        'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
    ];
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',
            showCorrect: false,
            showIncorrect: false,
            chess: new Chess(),
            pos: '',
            text: '',
        };
        this.currentIndex = 0

        // validation réponse
        this.pointsGagne = props.pointsGagnes;
        this.pointsPerdu = props.pointsPerdus;
        this.points = 0;
        // decode token
        //const decoded = decodeToken(sessionStorage.token);
        //this.name = decoded.name;

        this.coup = '';
        this.idLevel = props.idLevel;
        this.couleurP = '#af80dc';
        this.couleurM = '#ff555f';
        this.historicMove = [];

        this.genererMouvement();
    }

    genererMouvement = () => {
        let intervalId;
        intervalId = setInterval(() => {
            let possibleMoves = this.state.chess.moves();
            let possibleXMoves = possibleMoves.filter(element => element.includes("x"));
            if (possibleXMoves.length >= 1) {
                possibleMoves = possibleXMoves;
            }
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            this.state.chess.move(possibleMoves[randomIndex]);
            this.historicMove.push(possibleMoves[randomIndex]);
            this.setState({ chess: this.state.chess });
            const boardValue = this.RevaluateBoard(this.state.chess);
            if (boardValue > 0) {
                clearInterval(intervalId);
                console.log("w");
                console.log(possibleMoves[randomIndex].slice(-2));
                this.state.chess.undo();
                if (possibleMoves[randomIndex].slice(-1) == '+') {
                    this.state.pos = possibleMoves[randomIndex].slice(-3, -1);
                }
                else { this.state.pos = possibleMoves[randomIndex].slice(-2); }
                this.state.text = 'Ecrivez le coup pour prendre la pièce en ';
                this.coup = possibleMoves[randomIndex];
                console.log(this.coup);
            }
            if (boardValue < 0) {
                clearInterval(intervalId);
                console.log("b");
                console.log(possibleMoves[randomIndex].slice(-2));
                this.state.chess.undo();
                if (possibleMoves[randomIndex].slice(-1) == '+') {
                    this.state.pos = possibleMoves[randomIndex].slice(-3, -1);
                }
                else { this.state.pos = possibleMoves[randomIndex].slice(-2); }
                this.state.text = 'Quelle pièce (p,n,b,r,q,k) peut être mangé en  ';
                this.coup = this.state.chess.get(this.state.pos).type;
                console.log(this.coup);
                console.log(this.coup);
            }
        }, 800);
    };

    //#region Afficher coup
    safeGameMutate = (modify) => {
        this.setState((g) => {
            const update = { ...g };
            modify(update);
            return update;
        })
    }

    makeRandomMove = () => {
        const possibleMoves = this.state.chess.moves();

        // exit if the this.state.chess is over
        if (this.state.chess.game_over() || this.state.chess.in_draw() || possibleMoves.length === 0) return;

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        this.safeGameMutate((game) => {
            game.move(possibleMoves[randomIndex]);
        });
    }

    onDrop = (sourceSquare, targetSquare) => {
        const chessCopy = this.state.chess;
        try {
            const move = chessCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: "q", // always promote to a queen for example simplicity
            });
            this.setState({ chess: chessCopy })
        }
        catch { // illegal move
            const text = `Le mouvement ${targetSquare} n'est pas possible !`;
            this.setState({
                incorrectMessage: text,
                showIncorrect: true
            });
            setTimeout(() => {
                this.setState({ showCorrect: false, showIncorrect: false });
            }, 3000); // Efface le message après 3 secondes
            return false;
        }

        return true;
    }

    //#endregion
    rejouer = (event) => {
        let currentIndex = 0;
        this.setState({ chess: new Chess() });

        let intervalId = setInterval(() => {
            if (currentIndex < this.historicMove.length - 1) {
                this.state.chess.move(this.historicMove[currentIndex]);
                this.setState({ chess: this.state.chess });
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }

        }, 800);
    };

    //#region calcule du meilleur coup

    RevaluateBoard(chess) {
        const pieceValues = {
            'p': 1,
            'n': 3,
            'b': 3,
            'r': 5,
            'q': 9,
            'k': 0
        };
        let value = 0;
        SQUARES.forEach(Element => {
            if (this.state.chess.get(Element)) {
                value += this.state.chess.get(Element).color === 'w' ? pieceValues[this.state.chess.get(Element).type] : -pieceValues[this.state.chess.get(Element).type];
            }
        });
        console.log(value);
        return value;
    }


    //#endregion 



    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleClick = () => {
        const { inputValue, chess } = this.state;
        let compareValue = '';
        switch (this.coup) {
            case 'p':
                compareValue = 'pion';
                break;
            case 'n':
                compareValue = 'cavalier';
                break;
            case 'b':
                compareValue = 'fou';
                break;
            case 'r':
                compareValue = 'tour';
                break;
            case 'q':
                compareValue = 'dame';
                break;
            case 'k':
                compareValue = 'roi';
                break;
        }
        if (inputValue === this.coup || (this.piece === 'p' && inputValue === 'p' + this.coup) || inputValue === compareValue) {
            const text = `Bonne réponse ! Vous gagné ${this.pointsGagne} points.`;
            this.points = this.pointsGagne;
            this.setState({
                correctMessage: text,
                incorrectMessage: '',
                inputValue: '',
                chess: chess,
                showCorrect: true,
                showIncorrect: false
            });
            if (inputValue.length >= 3) {
                chess.move(inputValue);
            }
        }
        else {
            let text = '';
            if (this.props.exerciceElo <= 0) {
                text = `Mauvaise réponse ! Vous perdez 0 points. Tentez une autre réponse.`;
                this.points = 0;
            }
            else {
                text = `Mauvaise réponse ! Vous perdez ${this.pointsPerdu} points. Tentez une autre réponse.`;
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

    }

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

    customPieces = () => {
        const piecesBlanche = ["wN", "wB", "wR", "wQ", "wP", "wK"];
        const piecesNoire = ["bN", "bB", "bR", "bQ", "bP", "bK"];
        const returnPieces = {};
        piecesBlanche.map((p) => {
            returnPieces[p] = ({ squareWidth }) => (
                <img src="https://i.imgur.com/Br9K7hP.png" alt="piece" style={{ width: squareWidth, height: squareWidth }}></img>
            );
            return null;
        });
        piecesNoire.map((p) => {
            returnPieces[p] = ({ squareWidth }) => (
                <img src="https://i.imgur.com/Br9K7hP.png" alt="pions" style={{ width: squareWidth, height: squareWidth }}></img>
            );
            return null;
        });
        return returnPieces;
    };

    render() {
        return (
            <div className="container-general">
                <div className="jeu">
                    <div className="plateau-gauche">
                        <h2 id="txt"> {this.state.text} {this.state.pos}.</h2>
                        <Chessboard
                            position={this.state.chess.fen()}
                            onPieceDrop={this.onDrop}
                            customPieces={this.customPieces()}
                        />
                    </div>
                    <div className="elements-droite">
                        <i className="consigne">
                            Ecrivez le coup pour que <span style={{ color: `${this.couleurP}` }}>
                                {this.nomPiece}
                            </span> mange la reine en <span style={{ color: `${this.couleurM}` }}>
                                {this.positionPieceM}
                            </span>
                        </i>
                        <input className="reponse-input"
                            type="text"
                            placeholder="Entrez la position..."
                            value={this.state.inputValue}
                            onChange={this.handleInputChange} />
                        <button className="valider-bouton actual-bouton"
                            onClick={this.handleClick}
                            {...(this.state.inputValue.length < 1 && { disabled: true })}
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
                        <button className="valider-bouton actual-bouton"
                            onClick={this.rejouer}
                        >
                            Rejouer
                        </button>
                        <button className="valider-bouton actual-bouton"
                            onClick={this.RevaluateBoard.bind(this)}
                        >
                            caclcule avantage
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PuzzleCache;