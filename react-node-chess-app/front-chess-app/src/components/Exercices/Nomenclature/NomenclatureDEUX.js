import React from "react";
import './Nomenclature.css';
import '../../Components.css';
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

class NomenclatureDEUX extends React.Component {
    constructor() {
        super();
        this.state = {
            inputValue: '',
            correctMessage: '',
            incorrectMessage: '',
            chess: new Chess()
        };
        this.state.chess.load('4r3/8/2p2NPk/1p6/pP2p1R1/P1N5/2P2K2/3r4 w - - 1 45')
    }
    
    handleInputChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };


    handleClick = () => {
        const { inputValue, chess } = this.state;
        if (inputValue === "Ncxe4") {
          const text = "Bravo c'était ça !";
          chess.move(inputValue);
          this.setState({ chess: chess, correctMessage: text, incorrectMessage: '', inputValue: '' });

        }
        else {
            const text = "NON ! TU ES NUL ! TOUT LE MONDE A REUSSI SAUF TOI !"
            this.setState({ chess: chess, incorrectMessage: text, correctMessage: '', inputValue: '' });

        }
    }

    render() {
        return (
            <div className="container">
                <div className="chesscenter">
                    <h2>Ecrivez le coup pour que le cavalier en c3 aille en e4</h2>
                    <Chessboard
                        position={this.state.chess.fen()}
                        arePiecesDraggable={false}
                        width={400}
                    />
                </div>
                <div class="elementsDroite">
                    <input id="saisieposition" type="text" placeholder="Entrez le mouvement..." value={this.state.inputValue} onChange={this.handleInputChange}></input>
                    <button id="checkposition" onClick={this.handleClick}>Valider</button>
                    <div id="correctMessage">{this.state.correctMessage} </div>
                    <div id="incorrectMessage">{this.state.incorrectMessage} </div>
                </div>
            </div>
        );
    }
}

export default NomenclatureDEUX;