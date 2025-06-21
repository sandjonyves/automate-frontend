import api from '@/app/lib/axios';
import { generateGraph, confirmSave } from './utils';

export const handleConvertToAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/to-afn/`);
    var data = response.data; 
    console.log(data)
       setAutomate(data);
       setGraph(generateGraph(data.states, data.transitions));
    setError('');
  } catch (err) {
    console.error('Conversion to AFN error:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};

export const handleConvertToEpsilonAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/to-epsilon-afn/`);
    let data = response.data;

    // Ajouter un nom aléatoire si absent
    if (!data.name || data.name.trim() === '') {
      data = { ...data, name: `Automate_Epsilon_${Math.floor(Math.random() * 10000)}` };
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
    //   // setAutomate(previousAutomate);
    //   // setGraph(previousGraph);
    //   setError('Conversion annulée.');
    // }
  } catch (err) {
    
    console.error('Erreur Epsilon AFN:', err.message);
    setError(err.response?.data.error );
  } finally {
    setIsLoading(false);
  }
};

export const handleFromEpsilonAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);

    const response = await api.post(`/api/automates/${id}/from-epsilon-afn/`);
    let data = response.data;

    // Ajouter un nom aléatoire si absent
    if (!data.name || data.name.trim() === '') {
      data = { ...data, name: `AFN_Sans_Epsilon_${Math.floor(Math.random() * 10000)}` };
    }

    // Normaliser les transitions si elles sont imbriquées dans .transitions
    let realTransitions = data.transitions?.transitions ?? data.transitions;

    // Assure que les destinations sont toujours des tableaux
    const fixedTransitions = {};
    for (const [source, trans] of Object.entries(realTransitions || {})) {
      fixedTransitions[source] = {};
      for (const [symbol, dests] of Object.entries(trans || {})) {
        fixedTransitions[source][symbol] = Array.isArray(dests) ? dests : [dests];
      }
    }

    // Appliquer la conversion temporaire
    setAutomate(data);
    setGraph(generateGraph(data.states, fixedTransitions));
  } catch (err) {
    console.error('Erreur de conversion depuis Epsilon AFN:', err.response?.data || err.message);
    setError( err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};