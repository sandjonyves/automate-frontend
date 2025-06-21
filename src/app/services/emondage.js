import api from '@/app/lib/axios';
import { generateGraph } from './utils';
export const handleEmondage = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/emondage/`);
   
    var data = response.data; 
    // console.log('Automate émondé:', emondedData);
       setAutomate(data);
       setGraph(generateGraph(data.states, data.transitions));
 
    setError('');
  } catch (err) {
    console.error('Emondage error:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};  