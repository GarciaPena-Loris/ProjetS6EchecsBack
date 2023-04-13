import React from "react";
import './PuzzleCache.css';
import '../Exercices.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess, SQUARES } from 'chess.js'
import FormControlLabel from '@mui/material/FormControlLabel';
import { decodeToken } from "react-jwt";
import { Stack } from '@mui/material';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Howl, Howler } from 'howler';

// validation réponse
import axios from "axios";

class PuzzleCache3 extends React.Component {
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
            message: '',
            showCorrect: false,
            showIncorrect: false,
            orientation: "white",
            coordonnees: true,
            selectedLanguage: 'fr',
            piecesLanguage: ['P', 'T', 'F', 'C', 'D', 'R'],
            coloredSquares: {},
            chess: new Chess(),
        };
        this.currentIndex = 0

        // validation réponse
        this.pointsGagne = props.pointsGagnes;
        this.pointsPerdu = props.pointsPerdus;
        this.points = 0;

        this.coup = '';
        this.languageCoup = '';
        this.pos = '';
        this.text = 'Deplacement en cours...';
        this.idExercice = props.idExercice;
        this.couleurP = '#af80dc';
        this.couleurM = '#ff555f';
        this.historicMove = [];
        this.pieceMangee = false;

        // decode token
        const decoded = decodeToken(sessionStorage.token);
        this.name = decoded.name;

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

    componentDidMount() {
        this.genererMouvement();
    }

    genererMouvement = () => {
        const newChess = new Chess();
        this.setState({ chess: newChess });

        this.pieceMangee = false;
        this.historicMove = [];
        const listePiecesLangue = {
            en: ['P', 'R', 'B', 'N', 'Q', 'K'],
            fr: ['P', 'T', 'F', 'C', 'D', 'R'],
            es: ['P', 'T', 'A', 'C', 'D', 'R'],
            de: ['B', 'S', 'L', 'T', 'D', 'K'],
            it: ['P', 'T', 'A', 'C', 'D', 'R'],
            ru: ['П', 'К', 'С', 'Л', 'Ф', 'Кр'],
            cn: ['卒', '马', '象', '车', '后', '帅'],
        }
        let intervalId;
        intervalId = setInterval(() => {
            let possibleMoves = newChess.moves();
            let possibleXMoves = possibleMoves.filter(element => element.includes("x"));
            if (possibleXMoves.length >= 1) {
                possibleMoves = possibleXMoves;
            }
            const randomIndex = Math.floor(Math.random() * possibleMoves.length);
            newChess.move(possibleMoves[randomIndex]);
            this.historicMove.push(possibleMoves[randomIndex]);
            this.setState({ chess: newChess });
            const boardValue = this.RevaluateBoard(newChess);
            if (boardValue > 0) {
                clearInterval(intervalId);
                newChess.undo();
                if (possibleMoves[randomIndex].slice(-1) === '+') {
                    this.pos = possibleMoves[randomIndex].slice(-3, -1);
                }
                else {
                    this.pos = possibleMoves[randomIndex].slice(-2);
                }
                this.text = 'Ecrivez le coup pour prendre la pièce en ';
                this.coup = possibleMoves[randomIndex];
                if (this.coup.charAt(0) === this.coup.charAt(0).toUpperCase()) {
                    const index = listePiecesLangue['en'].indexOf(this.coup.charAt(0));
                    const piece = listePiecesLangue[this.state.selectedLanguage][index];

                    this.languageCoup = piece + this.coup.slice(1);
                }
                else {
                    this.languageCoup = this.coup;
                }
            }
            if (boardValue < 0) {
                clearInterval(intervalId);
                newChess.undo();
                if (possibleMoves[randomIndex].slice(-1) === '+') {
                    this.pos = possibleMoves[randomIndex].slice(-3, -1);
                }
                else {
                    this.pos = possibleMoves[randomIndex].slice(-2);
                }
                this.text = 'Ecrivez la piece qui va être mangé en  ';
                const piece = newChess.get(this.pos).type;
                const indexPiece = listePiecesLangue['en'].indexOf(piece.toUpperCase());
                this.languageCoup = listePiecesLangue[this.state.selectedLanguage][indexPiece];
                this.pieceMangee = true;
            }
            this.setState({
                chess: newChess, coloredSquares: {
                    [this.pos]: { backgroundColor: this.couleurM },
                },
            });
        }, 800);
    };

    //#region Rejouer coup  
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
    //#endregion

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
            if (chess.get(Element)) {
                value += chess.get(Element).color === 'w' ? pieceValues[chess.get(Element).type] : -pieceValues[chess.get(Element).type];
            }
        });
        return value;
    }
    //#endregion 



    // handles

    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleKeyPress = (event) => {
        if (this.state.inputValue.length >= 1) {
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
        this.text = 'Deplacement en cours...';
        this.pos = '';
        this.setState({ showCorrect: false, showIncorrect: false, message: '', coloredSquares: {} });
        this.genererMouvement();
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

    handleLanguageChange = (event) => {
        Howler.volume(0.3);
        this.soundUp.play();

        const listePiecesLangue = {
            en: ['P', 'R', 'B', 'N', 'Q', 'K'],
            fr: ['P', 'T', 'F', 'C', 'D', 'R'],
            es: ['P', 'T', 'A', 'C', 'D', 'R'],
            de: ['B', 'S', 'L', 'T', 'D', 'K'],
            it: ['P', 'T', 'A', 'C', 'D', 'R'],
            ru: ['П', 'К', 'С', 'Л', 'Ф', 'Кр'],
            cn: ['卒', '马', '象', '车', '后', '帅'],
        }
        if (this.languageCoup.charAt(0) === this.languageCoup.charAt(0).toUpperCase()) {
            const index = listePiecesLangue[this.state.selectedLanguage].indexOf(this.languageCoup.charAt(0));
            const piece = listePiecesLangue[event.target.value][index];

            this.languageCoup = piece + this.languageCoup.slice(1);
        }
        this.setState({ selectedLanguage: event.target.value, piecesLanguage: listePiecesLangue[event.target.value] });
    }

    handleClick = () => {
        Howler.volume(0.3);
        this.soundUp.play();
        const { inputValue, chess } = this.state;

        if (inputValue === this.languageCoup || (this.piece === 'p' && inputValue === 'p' + this.coup)) {
            Howler.volume(0.2);
            this.soundWin.play();
            const message = `Bonne réponse ! Vous gagné ${this.pointsGagne} points.`;
            this.points = this.pointsGagne;
            this.setState({
                message: message,
                inputValue: '',
                chess: chess,
                showCorrect: true,
                showIncorrect: false
            });
            if (inputValue.length >= 3) {
                chess.move(this.coup);
            }
            setTimeout(() => {
                this.text = 'Deplacement en cours...';
                this.pos = '';
                this.setState({ showCorrect: false, showIncorrect: false, message: '', coloredSquares: {} });

                this.handleUpdate();

                this.genererMouvement();
            }, 3000); // Génerer le plateau 3 secondes
        }
        else {
            Howler.volume(0.3);
            this.soundWrong.play();
            let message = '';
            if (this.props.exerciceElo <= 0) {
                message = `Mauvaise réponse ! Vous perdez 0 points. Tentez une autre réponse.`;
                this.points = 0;
            }
            else {
                message = `Mauvaise réponse ! Vous perdez ${this.pointsPerdu} points. Tentez une autre réponse.`;
                this.points = -(this.pointsPerdu);
            }
            this.setState({
                message: message,
                inputValue: '',
                chess: chess,
                showCorrect: false,
                showIncorrect: true
            });
            setTimeout(() => {
                this.handleUpdate();
            }, 1000);
        }
    }

    handleUpdate = () => {
        try {
            // chiffre un code crypte du type idExercice/name/eloExerciceActuel/newelo(- or +)
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
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    customPieces = () => {
        const piecesBlanche = ["wN", "wB", "wR", "wQ", "wP"];
        const roi = ["wK", "bK"];
        const piecesNoire = ["bN", "bB", "bR", "bQ", "bP"];
        const returnPieces = {};
        piecesBlanche.map((p) => {
            returnPieces[p] = ({ squareWidth }) => (
                <img src="https://i.imgur.com/Br9K7hP.png" alt="piece" style={{ width: squareWidth, height: squareWidth }}></img>
            );
            return null;
        });
        piecesNoire.map((p) => {
            returnPieces[p] = ({ squareWidth }) => (
                <img src="https://i.imgur.com/DqZkC4h.png" alt="pions" style={{ width: squareWidth, height: squareWidth }}></img>
            );
            return null;
        });
        roi.map((p) => {
            returnPieces[p] = ({ squareWidth }) => (
                <img src="https://i.imgur.com/70jzGYv.png" alt="roi" style={{ width: squareWidth, height: squareWidth }}></img>
            );
            return null;
        });
        return returnPieces;
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
                        {this.text} <span style={{ color: `${this.couleurM}` }}> {this.pos} </span>
                    </i>
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
                        <select className="language-selector"
                            value={this.state.selectedLanguage}
                            onMouseDown={() => this.handlePieceDown()}
                            onChange={this.handleLanguageChange}>
                            <option value="fr">Français 🇫🇷</option>
                            <option value="en">English 🇬🇧</option>
                            <option value="es">Español 🇪🇸</option>
                            <option value="de">Deutsch 🇩🇪</option>
                            <option value="it">Italiano 🇮🇹</option>
                            <option value="ru">Русский 🇷🇺</option>
                            <option value="cn">中文 🇨🇳</option>
                        </select>
                    </div>
                    {this.pieceMangee ?
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
                        </div>
                        :
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
                        </div>}
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
                                onClick={this.handleClearButtonClick} >
                                <span className="texte-3D texte-clean">
                                    ✘
                                </span>
                            </button>
                        </Stack>

                        <Stack className="stack" spacing={2} direction="row" alignItems="center">
                            <button className="bouton-3D"
                                title="Valider"
                                {...(this.state.inputValue.length < 1 && { disabled: true })}
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
                                onClick={this.rejouer}
                                onMouseDown={() => this.handlePieceDown()}>
                                <span className="texte-3D texte-replay">
                                    Refaire
                                </span>
                            </button>
                            {this.state.showIncorrect && <button className="bouton-3D button-replay"
                                title="Nouveau ↺"
                                onMouseEnter={() => this.handlePieceHover()}
                                onMouseUp={this.handleClickNouveau}
                                onMouseDown={() => this.handlePieceDown()}>
                                <span className="texte-3D texte-replay">
                                    Nouveau ↺
                                </span>
                            </button>}
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

export default PuzzleCache3;