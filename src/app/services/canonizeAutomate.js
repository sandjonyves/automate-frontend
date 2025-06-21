import api from '@/app/lib/axios';

export const handleCanonizeAutomate = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.get(`/api/automates/${id}/canonize/`);
    var canonizedData = response.data;
    console.log('Automate Canonisé:', canonizedData);

    // Ajouter un nom aléatoire si absent
    if (!canonizedData.name || canonizedData.name.trim() === '') {
      canonizedData = { ...canonizedData, name: `Automate_Canonized_${Math.floor(Math.random() * 10000)}` };
    }

    // Normaliser les transitions si elles sont imbriquées
    let realTransitions = canonizedData.transitions?.transitions ?? canonizedData.transitions;

    setAutomate(canonizedData);
    setGraph({
      nodes: canonizedData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(realTransitions).flatMap(([source, trans]) =>
        Object.entries(trans).map(([symbole, dest]) => ({
          from: source,
          to: Array.isArray(dest) ? dest[0] : dest, // Normalisation
          label: symbole,
          arrows: 'to',
        }))
      ),
    });
    setError('');
  } catch (err) {
    console.error('Erreur de canonisation:', err.response?.data || err.message);
    setError(err.response?.data.error);
  } finally {
    setIsLoading(false);
  }
};