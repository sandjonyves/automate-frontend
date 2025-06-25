import api from '@/app/lib/axios';
import {generateGraph} from './utils'

export const handleConvertToAFD = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/convert/`);
    var data = response.data.afd;
    
    if(!response.data.fd) {
      console.log(response.data,1111111111111111111111111111);
      setError(response.data.message)
    }else{
    setAutomate(data);
    setGraph(generateGraph(data.states, data.transitions));
    }

    // setGraph({
    //   nodes: afdData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
    //   edges: Object.entries(afdData.transitions.transitions).flatMap(([source, trans]) =>
    //     Object.entries(trans).map(([symbole, dest]) => ({
    //       from: source,
    //       to: Array.isArray(dest) ? dest[0] : dest, // Normalisation
    //       label: symbole,
    //       arrows: 'to',
    //     }))
    //   ),
    // });
   
  } catch (err) {
    console.error('Conversion error:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};

export const handleCompleteAFD = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/complete/`);
       let data = response.data;
        console.log('AFD complet:', data);
       // Ajouter un nom aléatoire si absent
      
   
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
    
    // setAutomate(afdCompleteData);
    // setGraph({
    //   nodes: afdCompleteData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
    //   edges: Object.entries(afdCompleteData.transitions.transitions).flatMap(([source, trans]) =>
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
    console.error('Completion error:', err.response?.data || err.message);
    if (err.response?.status === 400 && err.response?.data?.error === 'Automaton must be deterministic (AFD).') {
      setError('L’automate n’est pas déterministe (AFN).');
    } else {
      setError(err.response?.data.error || 'Erreur lors de la complétion de l\'AFD.');
    }
  } finally {
    setIsLoading(false);
  }
};

export const handleFromEpsilonAFNToAFD = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/from-epsilon-afn-to-afd/`);
    var afdData = response.data;
    console.log('AFD converti depuis Epsilon AFN:', afdData);

    // Ajouter un nom aléatoire si absent
    if (!afdData.name || afdData.name.trim() === '') {
      afdData = { ...afdData, name: `AFD_From_Epsilon_${Math.floor(Math.random() * 10000)}` };
    }

    // Normaliser les transitions si elles sont imbriquées
    let realTransitions = afdData.transitions?.transitions ?? afdData.transitions;

    setAutomate(afdData);
    setGraph({
      nodes: afdData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(realTransitions).flatMap(([source, trans]) =>
        Object.entries(trans).map(([symbole, dest]) => ({
          from: source,
          to: Array.isArray(dest) ? dest[0] : dest, // Normalisation pour AFD
          label: symbole,
          arrows: 'to',
        }))
      ),
    });
    setError('');
  } catch (err) {
    console.error('Erreur de conversion Epsilon AFN vers AFD:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};