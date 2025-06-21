import api from '@/app/lib/axios';
import { generateGraph } from './utils';

export const handleIntersection = async (automateId1, automateId2, setOperationResult, setError) => {
  try {
    const response = await api.post('/api/intersection/', {
      automate_id1: automateId1,
      automate_id2: automateId2,
    });
    const result = response.data;
  
      
    setOperationResult(result);
    setError('');
    return result; // Retourner les données pour visualisation
  } catch (err) {
    console.error('Intersection error:', err.response?.data || err.message);
    setError(err.response?.data?.error || 'Erreur lors de l\'intersection des automates.');
    return null;
  }
};