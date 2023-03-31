import React from "react";
import './Notation.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from "axios";
import { decodeToken } from "react-jwt";
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Howl, Howler } from 'howler';

class Notation4 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            showCorrect: false,
            showIncorrect: false,
            coordonnees: true,
            orientation: "white",
            selectedLanguage: 'fr',
            piecesLanguage: ['P', 'T', 'F', 'C', 'D', 'R'],
            moveFrom: '',
            rightClickedSquares: {},
            moveSquares: {},
            optionSquares: {},
            chess: new Chess()
        };
        // validation réponse
        this.pointsGagnes = props.pointsGagnes;
        this.pointsPerdus = props.pointsPerdus;
        this.points = 0;

        // decode token
        const decoded = decodeToken(sessionStorage.token);
        this.name = decoded.name;

        this.realCoup = '';
        this.idExercice = props.idExercice;

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
        this.switchOn = new Howl({
            src: ['/sons/switchOn.mp3']
        });
        this.switchOff = new Howl({
            src: ['/sons/switchOff.mp3']
        });
    }

    componentDidMount() {
        this.genererPieceAleatoire();
    }

    genererPieceAleatoire() {
        const { chess } = this.state;

        // effectuer un nombre aléatoire de coups aléatoires
        const nbCoups = Math.floor(Math.random() * 15) + 5;
        for (let i = 0; i < nbCoups; i++) {
            const coups = chess.moves();
            const coup = coups[Math.floor(Math.random() * coups.length)];
            chess.move(coup);
        }
        if (nbCoups % 2 === 0) {
            this.setState({ orientation: "white" });
        }
        else {
            this.setState({ orientation: "black" });
        }

        // recuperer un coup aléatoire
        const listePiecesLangue = {
            en: ['P', 'R', 'B', 'N', 'Q', 'K'],
            fr: ['P', 'T', 'F', 'C', 'D', 'R'],
            es: ['P', 'T', 'A', 'C', 'D', 'R'],
            de: ['B', 'S', 'L', 'T', 'D', 'K'],
            it: ['P', 'T', 'A', 'C', 'D', 'R'],
            ru: ['П', 'К', 'С', 'Л', 'Ф', 'Кр'],
            cn: ['卒', '马', '象', '车', '后', '帅'],
        }

        const coups = chess.moves();
        let coup = coups[Math.floor(Math.random() * coups.length)];

        if (coup.length > 2) {
            const index = listePiecesLangue['en'].indexOf(coup.charAt(0));
            const piece = listePiecesLangue[this.state.selectedLanguage][index];

            this.realCoup = piece + coup.slice(1);
        }
        else {
            this.realCoup = coup;
        }

        this.setState({ chess: chess });
    }

    // handles

    // sons
    handlePieceHover = () => {
        Howler.volume(0.1);
        this.soundHover.play();
    };

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
        if (this.realCoup.length > 2) {
            const index = listePiecesLangue[this.state.selectedLanguage].indexOf(this.realCoup.charAt(0));
            const piece = listePiecesLangue[event.target.value][index];

            this.realCoup = piece + this.realCoup.slice(1);
        }
        this.setState({ selectedLanguage: event.target.value, piecesLanguage: listePiecesLangue[event.target.value] });
    }

    handleClick = () => {
        Howler.volume(0.3);
        this.soundUp.play();
        const { inputValue } = this.state;
        if (this.coups.includes(inputValue) || (this.piece === 'P' && this.coups.includes(inputValue.slice(1)))) {
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
            let text = `Mauvaise réponse ! La piéce était en ${this.coups[0]}, vous perdez ${Math.min(this.props.exerciceElo, this.pointsPerdus)} points.`;
            this.points = -(Math.min(this.props.exerciceElo, this.pointsPerdus));
            this.setState({
                message: text,
                inputValue: '',
                showCorrect: false,
                showIncorrect: true
            });
        }
        setTimeout(() => {
            this.coups = [];
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

    // afficher coup possible

    getMoveOptions= (square) => {
        const moves = this.state.chess.moves({
            square,
            verbose: true,
        });
        if (moves.length === 0) {
            return false;
        }

        const newSquares = {};
        moves.map((move) => {
            newSquares[move.to] = {
                background:
                    this.state.chess.get(move.to) && this.state.chess.get(move.to).color !== this.state.chess.get(square).color
                        ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
                        : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                borderRadius: "50%",
            };
            return move;
        });
        newSquares[square] = {
            background: "rgba(255, 255, 0, 0.4)",
        };
        this.setState({ optionSquares: newSquares });
        return true;
    }

    onSquareClick= (square) => {
        this.setState({ rightClickedSquares: {} });

        let resetFirstMove = (square) => {
            const hasOptions = this.getMoveOptions(square);
            if (hasOptions)
                this.setState({ moveFrom: square });
        }

        // from square
        if (!this.state.moveFrom) {
            resetFirstMove(square);
            return;
        }

        // attempt to make move


        this.setState({ moveFrom: "", optionSquares: {} });
    }

    onSquareRightClick = (square) => {
        const colour = "rgba(0, 0, 255, 0.4)";
        this.setState(prevState => {
            const newRightClickedSquares = {
                ...prevState.rightClickedSquares,
                [square]:
                    prevState.rightClickedSquares[square] &&
                        prevState.rightClickedSquares[square].backgroundColor === colour
                        ? undefined
                        : { backgroundColor: colour }
            };

            return { rightClickedSquares: newRightClickedSquares };
        });

    }

    Android12Switch = styled(Switch)(({ theme, disabled }) => ({
        padding: 8,
        cursor: disabled ? 'not-allowed' : 'pointer', // ajout de la propriété cursor
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
        return (
            <div className="container-general">
                <div className="plateau-gauche">
                    <Chessboard
                        key="board"
                        position={this.state.chess.fen()}
                        customSquare={this.customSquare}
                        boardOrientation={this.state.orientation}
                        showBoardNotation={this.state.coordonnees}
                        animationDuration={800}
                        arePiecesDraggable={false}
                        onSquareClick={this.onSquareClick}
                        onSquareRightClick={this.onSquareRightClick}
                        customBoardStyle={{
                            borderRadius: "4px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                        }}
                        customSquareStyles={{
                            ...this.state.moveSquares,
                            ...this.state.optionSquares,
                            ...this.state.rightClickedSquares,
                        }}
                    />
                </div>
                <div className="elements-droite">
                    <i className="consigne">
                        Faite le coup <span style={{ color: `${this.couleurP}` }}> {this.realCoup}
                        </span>
                    </i>
                    <div className="option">
                        <ThemeProvider theme={this.theme}>
                            <FormControlLabel
                                control={<this.Android12Switch
                                    checked={this.state.coordonnees === true}
                                    color="secondary"
                                />}
                                label={'Coordonnée'}
                                onChange={this.handleCoordonnees}
                                style={{
                                    textDecoration: this.state.coordonnees === false && 'line-through'
                                }}
                            />
                        </ThemeProvider>
                        <select className="language-selector" value={this.state.selectedLanguage} onMouseDown={() => this.handlePieceDown()} onChange={this.handleLanguageChange}>
                            <option value="fr">Français 🇫🇷</option>
                            <option value="en">English 🇬🇧</option>
                            <option value="es">Español 🇪🇸</option>
                            <option value="de">Deutsch 🇩🇪</option>
                            <option value="it">Italiano 🇮🇹</option>
                            <option value="ru">Русский 🇷🇺</option>
                            <option value="cn">中文 🇨🇳</option>
                        </select>
                    </div>
                    <div className={`response ${this.state.showCorrect ? 'show' : this.state.showIncorrect ? 'show incorrect' : ''}`}>
                        {this.state.message}
                    </div>
                </div>
            </div>
        );
    }
}

export default Notation4;