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

    setAutomate(data);
    setGraph(generateGraph(data.states, data.transitions));
 
  } catch (err) {
    console.error('Erreur AFD vers Epsilon AFN:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};