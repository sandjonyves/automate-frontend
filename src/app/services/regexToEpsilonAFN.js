import api from '@/app/lib/axios';
import { generateGraph, confirmSave } from '@/app/services/utils';

export const handleRegexToEpsilonAFN = async (regex, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/from-regex/`, { regex });
   
    let data = response.data;
    console.log('Epsilon AFN from Regex:', data);

    // Ajouter un nom aléatoire si absent
    // if (!data.name || data.name.trim() === '') {
    //   data = { ...data, name: `Epsilon_AFN_From_Regex_${Math.floor(Math.random() * 10000)}` };
    // }

    // // Ajouter ε à l'alphabet si absent
    // if (!data.alphabet.includes('ε')) {
    //   data = { ...data, alphabet: [...new Set([...data.alphabet, 'ε'])] };
    // }

    // Stocker l'état précédent pour annulation
    // const previousAutomate = { ...data };
    // const previousGraph = { ...setGraph };

    // Appliquer la conversion temporairement
    setAutomate(data);
    setGraph(generateGraph(data.states, data.transitions));



  } catch (err) {
    console.error('Erreur Regex vers Epsilon AFN:', err.response?.data || err.message);
    setError(err.response?.data.error );
  } finally {
    setIsLoading(false);
  }
};