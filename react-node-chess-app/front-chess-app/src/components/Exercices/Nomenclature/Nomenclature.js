import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from "axios";
import { decodeToken } from "react-jwt";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

class Nomenclature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      message: '',
      showCorrect: false,
      showIncorrect: false,
      chess: new Chess(),
    };
    this.pointsGagnes = props.pointsGagnes;
    this.pointsPerdus = props.pointsPerdus;
    this.points = 0;
    this.idExercice = props.idExercice;
    this.position = '';
    this.couleurCase = "#7e9d4e";
    this.usePieceString = [];

    // decode token
    const decoded = decodeToken(sessionStorage.token);
    this.name = decoded.name;

  }

  componentDidMount() {
    this.genererPieceAleatoire();
  }



  genererPieceAleatoire = () => {
    const { chess } = this.state;
    const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    chess.clear(); // Vide le plateau
    let colonneP = Math.floor(Math.random() * 8) + 1;
    let ligneP = Math.floor(Math.random() * 8) + 1;
    const colors = ['b', 'w'];
    let color = colors[Math.floor(Math.random() * colors.length)];
    const pieces = ['P', 'N', 'B', 'R', 'Q', 'K'];
    let piece = pieces[Math.floor(Math.random() * pieces.length)];
    this.position = `${alpha[colonneP - 1]}${ligneP}`;

    this.usePieceString.push(piece + this.position);
    this.usePieceString.push(piece.toLowerCase() + this.position);
    chess.put({ type: piece, color: color }, this.position); // Place la pièce sur le plateau

    this.setState({ chess: this.state.chess });
  };

  // couleur des cases
  customSquare = React.forwardRef((props, ref) => {
    const { children, square, style } = props;
    if (square === this.position) {
      return (
        <div ref={ref} style={{ ...style, position: "relative", backgroundColor: this.couleurCase }}> {/* pièce qui mange */}
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

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  handleClearButtonClick = () => {
    this.setState({ inputValue: '' });
  };

  handlePiece = (event) => {
    this.setState({ inputValue: this.state.inputValue + event });
  };


  handleClick = () => {
    const { inputValue } = this.state;
    if (this.usePieceString.includes(inputValue)) {
      const text = `Bonne réponse ! La pièce est en ${inputValue}, vous gagné ${this.pointsGagnes} points.`;
      this.points = this.pointsGagnes;
      this.setState({
        message: text,
        inputValue: '',
        showCorrect: true,
        showIncorrect: false
      });
    }
    else {
      let text = `Mauvaise réponse ! La pièce n'est pas en '${inputValue}', vous perdez ${Math.min(this.props.exerciceElo, this.pointsPerdus)} points.`;
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
      this.handleUpdate();
    }, 3000); // Efface le message après 3 secondes
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

          // affichage nouvelle piece
          this.genererPieceAleatoire();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  pieces = [
    <Button key="pion" onClick={() => this.handlePiece("p")}>p</Button>,
    <Button key="tour" onClick={() => this.handlePiece("r")}>r</Button>,
    <Button key="fou" onClick={() => this.handlePiece("b")}>b</Button>,
    <Button key="cavalier" onClick={() => this.handlePiece("n")}>n</Button>,
    <Button key="reine" onClick={() => this.handlePiece("q")}>q</Button>,
    <Button key="roi" onClick={() => this.handlePiece("k")}>k</Button>,
  ];
  lignes = [
    <Button key="huit" onClick={() => this.handlePiece("8")}>8</Button>,
    <Button key="sept" onClick={() => this.handlePiece("7")}>7</Button>,
    <Button key="six" onClick={() => this.handlePiece("6")}>6</Button>,
    <Button key="cinq" onClick={() => this.handlePiece("5")}>5</Button>,
    <Button key="quatre" onClick={() => this.handlePiece("4")}>4</Button>,
    <Button key="trois" onClick={() => this.handlePiece("3")}>3</Button>,
    <Button key="deux" onClick={() => this.handlePiece("2")}>2</Button>,
    <Button key="un" onClick={() => this.handlePiece("1")}>1</Button>,
  ];
  colonnes = [
    <Button key="h" onClick={() => this.handlePiece("h")}>h</Button>,
    <Button key="g" onClick={() => this.handlePiece("g")}>g</Button>,
    <Button key="f" onClick={() => this.handlePiece("f")}>f</Button>,
    <Button key="e" onClick={() => this.handlePiece("e")}>e</Button>,
    <Button key="d" onClick={() => this.handlePiece("d")}>d</Button>,
    <Button key="c" onClick={() => this.handlePiece("c")}>c</Button>,
    <Button key="b" onClick={() => this.handlePiece("b")}>b</Button>,
    <Button key="a" onClick={() => this.handlePiece("a")}>a</Button>,
  ];

  render() {
    return (
      <div className="container-general">
        <div className="jeu">
          <div className="plateau-gauche">
            <Chessboard
              position={this.state.chess.fen()}
              arePiecesDraggable={false}
              customSquare={this.customSquare}
            />
          </div>
          <div className="elements-droite">
            <i className="consigne">
              Ecrivez la position de la pièce
            </i>
            <div className="boutons">
              <Stack className="boutons"
                spacing={{ xs: 1, sm: 2, md: 4 }}
                direction="row"
                alignItems="flex-start"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <ButtonGroup
                  orientation="vertical"
                  color="success"
                  variant="contained"
                >
                  {this.pieces}
                </ButtonGroup>
                <ButtonGroup
                  orientation="vertical"
                  color="success"
                  variant="contained"
                >
                  {this.colonnes}
                </ButtonGroup>
                <ButtonGroup
                  orientation="vertical"
                  color="success"
                  variant="contained"
                >
                  {this.lignes}
                </ButtonGroup>
              </Stack>

            </div>
            <Stack direction="row" alignItems="center">
              <input className="reponse-input"
                type="text"
                placeholder="Entrez la position..."
                value={this.state.inputValue}
                onChange={this.handleInputChange} />
              <Button variant="contained" color="error" onClick={this.handleClearButtonClick}>
                ✕
              </Button>
            </Stack>

            <button className="valider-bouton actual-bouton"
              onClick={this.handleClick}
              {...(this.state.inputValue.length < 3 && { disabled: true })}
            >
              Valider
            </button>
            <div className={`response ${this.state.showCorrect ? 'show' : this.state.showIncorrect ? 'show incorrect' : ''}`}>
              {this.state.message}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Nomenclature;