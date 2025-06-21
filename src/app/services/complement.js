import api from '@/app/lib/axios';
import { generateGraph } from './utils';

export async function handleComplement(automateId, setAutomate, setGraph, setError, setIsLoading) {
  try {
    setIsLoading(true);
    const response = await api.post('/api/complement/', {
      automate_id: automateId,
    });
    setAutomate(response.data);
    console.log(response.data)
    setGraph(generateGraph(response.data.states, response.data.transitions?.transitions || response.data.transitions || {}));
    setError('');
    setIsLoading(false);
    return response.data;
  } catch (err) {
    setError(err.response?.data.error || 'Erreur lors du calcul du complément de l\'automate.');
    console.error('Complement error:', err);
    setIsLoading(false);
    return null;
  }
}

