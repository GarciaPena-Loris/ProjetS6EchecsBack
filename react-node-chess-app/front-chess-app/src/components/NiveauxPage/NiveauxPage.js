import { useLocation } from 'react-router-dom';

export default function NiveauxPage() {
    const location = useLocation();
    const exerciceId = location.state.exerciceId;
    const niveauId = location.state.niveauId;

    

}