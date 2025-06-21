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
    // setGraph({
    //   nodes: emondedData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
    //   edges: Object.entries(emondedData.transitions.transitions).flatMap(([source, trans]) =>
    //     Object.entries(trans).map(([symbole, dest]) => ({
    //       from: source,
    //       to: Array.isArray(dest) ? dest[0] : dest, // Normalisation
    //       label: symbole,
    //       arrows: 'to',
    //     }))
    //   ),
    // });
    setError('');
  } catch (err) {
    console.error('Emondage error:', err.response?.data || err.message);
    setError(err.response?.data?.detail || 'Erreur lors de l\'émondage de l\'automate.');
  } finally {
    setIsLoading(false);
  }
};  