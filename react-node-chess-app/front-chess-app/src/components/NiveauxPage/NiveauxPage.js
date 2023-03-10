import { useLocation } from 'react-router-dom';
import Nomenclature from '../Exercices/Nomenclature/Nomenclature';
import Nomenclature2 from '../Exercices/Nomenclature/Nomenclature2';
import Nomenclature3 from '../Exercices/Nomenclature/Nomenclature3';
import Nomenclature4 from '../Exercices/Nomenclature/Nomenclature4';

export default function NiveauxPage() {
    const location = useLocation();
    const exercice = location.state.exercice;
    const niveau = location.state.niveau;
    const index = location.state.index;

    console.log(exercice);
    console.log(niveau);
    console.log(index);

    // Créez une structure de données pour stocker les composants de chaque niveau
    const niveaux = {
        1: {
            1: <Nomenclature />,
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
        <div>
            <h1>Exercice {exercice.id}</h1>
            <h1>Niveau {index}</h1>
            {/* Affichez le composant récupéré */}
            {NiveauComponent}
        </div>
    );
    }