import api from '@/app/lib/axios';
import { generateGraph, confirmSave } from './utils';

export const handleAFDToEpsilonAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/to-epsilon-afn-from-afd/`);
    let data = response.data;

    // Ajouter un nom aléatoire si absent
    if (!data.name || data.name.trim() === '') {
      data = { ...data, name: `Epsilon_AFN_From_AFD_${Math.floor(Math.random() * 10000)}` };
    }

    // Ajouter ε à l'alphabet si absent
    if (!data.alphabet.includes('ε')) {
      data = { ...data, alphabet: [...new Set([...data.alphabet, 'ε'])] };
    }

    // Stocker l'état précédent pour annulation
    const previousAutomate = { ...data };
    const previousGraph = { ...setGraph };

    // Appliquer la conversion temporairement
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
    //   setError('Conversion annulée.');
    // }
  } catch (err) {
    console.error('Erreur AFD vers Epsilon AFN:', err.response?.data || err.message);
    setError(err.response?.data?.detail || 'Erreur lors de la conversion d\'AFD en Epsilon AFN.');
  } finally {
    setIsLoading(false);
  }
};