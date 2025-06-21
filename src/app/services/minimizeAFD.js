import api from '@/app/lib/axios';

export const handleMinimizeAFD = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/minimize/`);
    var minimizedData = response.data;
    console.log('AFD Minimisé:', minimizedData);

    // Ajouter un nom aléatoire si absent
    if (!minimizedData.name || minimizedData.name.trim() === '') {
      minimizedData = { ...minimizedData, name: `AFD_Minimized_${Math.floor(Math.random() * 10000)}` };
    }

    // Normaliser les transitions si elles sont imbriquées
    let realTransitions = minimizedData.transitions?.transitions ?? minimizedData.transitions;

    setAutomate(minimizedData);
    setGraph({
      nodes: minimizedData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
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
    console.error('Erreur de minimisation AFD:', err.response?.data || err.message);
    if (err.response?.status === 400 && err.response?.data?.error === 'Automaton must be deterministic (AFD).') {
      setError('L’automate n’est pas déterministe (AFN).');
    } else {
      setError(err.response?.data?.detail || 'Erreur lors de la minimisation de l\'AFD.');
    }
  } finally {
    setIsLoading(false);
  }
};