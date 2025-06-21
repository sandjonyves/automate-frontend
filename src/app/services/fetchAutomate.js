import api from '@/app/lib/axios';

export const fetchAutomate = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  console.log('ID from query:', id); // Debug log
  if (!id) {
    setError('ID non défini dans l\'URL.');
    setIsLoading(false);
    return;
  }

  try {
    console.log(`Fetching automate with ID: ${id}`); // Debug log
    const response = await api.get(`/api/automates/${id}/`);
    console.log('API Response:', response.data); // Debug log
    const data = response.data;
    setAutomate(data);
    setGraph({
      nodes: data.states.map(state => ({
        id: state,
        label: state,
        shape: 'circle',
      })),
      edges: Object.entries(data.transitions || {}).flatMap(([source, transitionMap]) => {
        return Object.entries(transitionMap || {}).flatMap(([symbol, destinations]) => {
          const destArray = Array.isArray(destinations) ? destinations : [destinations];
          return destArray.map(dest => ({
            from: source,
            to: dest,
            label: symbol === '' ? 'ε' : symbol,
            arrows: 'to',
          }));
        });
      }),
    });
    setError('');
  } catch (err) {
    console.error('Fetch error:', err.response?.data || err.message); // Debug log
    setError(err.response?.data.error );
  } finally {
    setIsLoading(false);
  }
};