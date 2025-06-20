import api from '../../../lib/axios';

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
      nodes: data.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(data.transitions).flatMap(([source, trans]) =>
        Object.entries(trans).map(([symbole, dest]) => ({
          from: source,
          to: Array.isArray(dest) ? dest[0] : dest, // Prendre la première destination si tableau
          label: symbole || 'ε',
          arrows: 'to',
        }))
      ),
    });
    setError('');
  } catch (err) {
    console.error('Fetch error:', err.response?.data || err.message); // Debug log
    setError(err.response?.data?.detail || 'Erreur lors du chargement de l\'automate.');
  } finally {
    setIsLoading(false);
  }
};

export const handleDelete = async (id, router, setError) => {
  if (confirm('Voulez-vous vraiment supprimer cet automate ?')) {
    try {
      await api.delete(`/api/automata/${id}/`);
      router.push('/automates');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la suppression.');
    }
  }
};

export const handleTestString = async (id, testString, setTestResult, setError) => {
  try {
    const response = await api.post(`/api/automata/${id}/test-string/`, { string: testString });
    setTestResult(response.data.result);
    setError('');
  } catch (err) {
    setError(err.response?.data?.detail || 'Erreur lors du test de la chaîne.');
  }
};

export const handleConvertToRegex = async (id, setError) => {
  try {
    const response = await api.post(`/api/automates/${id}/to-regex/`);
    alert(`Expression régulière : ${response.data.regex}`);
    console.log(`Expression régulière : ${response.data.regex}`);
    setError('');
  } catch (err) {
    setError(err.response?.data?.detail || 'Erreur lors de la conversion en regex.');
  }
};

export const handleConvertToAFD = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/convert/`);
    const afdData = response.data.afd;
    console.log(afdData);
    setAutomate(afdData);
    setGraph({
      nodes: afdData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(afdData.transitions).flatMap(([source, trans]) =>
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
    console.error('Conversion error:', err.response?.data || err.message);
    setError(err.response?.data?.detail || 'Erreur lors de la conversion en AFD.');
  } finally {
    setIsLoading(false);
  }
};

export const handleCompleteAFD = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/complete/`);
    const afdCompleteData = response.data;
    console.log('AFD Complété:', afdCompleteData);
    setAutomate(afdCompleteData);
    setGraph({
      nodes: afdCompleteData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(afdCompleteData.transitions).flatMap(([source, trans]) =>
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
    console.error('Completion error:', err.response?.data || err.message);
    if (err.response?.status === 400 && err.response?.data?.error === 'Automaton must be deterministic (AFD).') {
      setError('L’automate n’est pas déterministe (AFN).');
    } else {
      setError(err.response?.data?.detail || 'Erreur lors de la complétion de l\'AFD.');
    }
  } finally {
    setIsLoading(false);
  }
};

export const handleStateAnalysis = async (id, setError) => {
  try {
    const response = await api.get(`/api/automates/${id}/states-analysis/`);
    const analysis = response.data;
    console.log('State Analysis:', analysis);
    alert(`Analyse des états : ${JSON.stringify(analysis, null, 2)}`);
    setError('');
  } catch (err) {
    console.error('State analysis error:', err.response?.data || err.message);
    setError(err.response?.data?.detail || 'Erreur lors de l\'analyse des états.');
  }
};

export const handleEmondage = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/emondage/`);
    const emondedData = response.data;
    console.log('Automate émondé:', emondedData);
    setAutomate(emondedData);
    setGraph({
      nodes: emondedData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(emondedData.transitions).flatMap(([source, trans]) =>
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
    console.error('Emondage error:', err.response?.data || err.message);
    setError(err.response?.data?.detail || 'Erreur lors de l\'émondage de l\'automate.');
  } finally {
    setIsLoading(false);
  }
};