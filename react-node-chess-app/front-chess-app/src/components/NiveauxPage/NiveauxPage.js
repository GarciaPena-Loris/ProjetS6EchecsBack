import { useLocation, useNavigate } from 'react-router-dom';
import "./NiveauxPage.css"

// imporation des composants de chaque niveau
import Nomenclature from '../Exercices/Nomenclature/Nomenclature';
import Nomenclature2 from '../Exercices/Nomenclature/Nomenclature2';
import Nomenclature3 from '../Exercices/Nomenclature/Nomenclature3';
import Nomenclature4 from '../Exercices/Nomenclature/Nomenclature4';

export default function NiveauxPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const exercice = location.state.exercice;
    const niveau = location.state.niveau;
    const index = location.state.index;

    console.log(exercice);
    console.log(niveau);
    console.log(index);

    // Créez une structure de données pour stocker les composants de chaque niveau
    const niveaux = {
        1: {
            1: <Nomenclature pointsGagnes="5" pointsPerdus="2" />,
            2: <Nomenclature2 />,
            3: <Nomenclature3 />,
            4: <Nomenclature4 />,
            // etc...
        },
        // etc...
    };

    // Récupérez le composant à afficher en fonction des id
    const NiveauComponent = niveaux[exercice.id][index];

    return (
        <div className="level-container">
            <div className="level-header">
                <button className="valider-bouton back-button" onClick={() => navigate(-1)}>← Retour</button> {/* Retourne à la page précédente */}
                <div className="level-label">Exercice <i>{exercice.name}</i> : <i>niveau {index}</i></div>
            </div>
            {/* Affichez le composant récupéré */}
            <div className="level-jeux">
                {NiveauComponent}
            </div>
        </div>
    );
}