import api from '@/app/lib/axios';
import { generateGraph, confirmSave } from '@/app/services/utils';

export const handleBuildAutomaton = async (regex, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/build-automaton/`, { regex });
    let data = response.data;
    console.log('Automate construit (Glushkov):', data);

    // Ajouter un nom aléatoire si absent
    if (!data.name || data.name.trim() === '') {
      data = { ...data, name: `Automate_Glushkov_${Math.floor(Math.random() * 10000)}` };
    }

    // Stocker l'état précédent pour annulation
    const previousAutomate = { ...data };
    const previousGraph = { ...setGraph };

    // Appliquer la construction temporairement
    setAutomate(data);
    setGraph(generateGraph(data.states, data.transitions));

    // Afficher le popup de confirmation
    // const saveConfirmed = await confirmSave(data);

    // if (saveConfirmed) {
    //   // Enregistrer l'automate
    //   await api.post(`/api/automates/`, data);
    //   setError('');
    // } else {
    //   // Revenir à l'état précédent en cas d'annulation
    //   setAutomate(previousAutomate);
    //   setGraph(previousGraph);
    //   setError('Construction annulée.');
    // }
  } catch (err) {
    console.error('Erreur construction automate:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};