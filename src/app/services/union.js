import api from '@/app/lib/axios';
import { generateGraph } from './utils';

export const handleUnion = async (automateId1, automateId2, setOperationResult, setError) => {
  try {
    const response = await api.post('/api/union/', {
      automate_id1: automateId1,
      automate_id2: automateId2,
    });
    const result = response.data;
    var data = response.data; 
    console.log(data);
       
        //    setAutomate(data);
        //    setGraph(generateGraph(data.states, data.transitions));
    setOperationResult(result);
    setError('');
    return result;
  } catch (err) {
    console.error('Union error:', err.response?.data || err.message);
    setError(err.response?.data?.error || 'Erreur lors de l\'union des automates.');
    return null;
  }
};