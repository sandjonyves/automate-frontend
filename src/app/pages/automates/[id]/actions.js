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
    setError(err.response?.data.error || 'Erreur lors du chargement de l\'automate.');
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
      setError(err.response?.data.error || 'Erreur lors de la suppression.');
    }
  }
};

export const handleTestString = async (id, testString, setTestResult, setError) => {
  try {
    const response = await api.post(`/api/automata/${id}/test-string/`, { string: testString });
    setTestResult(response.data.result);
    setError('');
  } catch (err) {
    setError(err.response?.data.error || 'Erreur lors du test de la chaîne.');
  }
};

export const handleConvertToRegex = async (id, setError) => {
  try {
    const response = await api.post(`/api/automates/${id}/to-regex/`);
    alert(`Expression régulière : ${response.data.regex}`);
    console.log(`Expression régulière : ${response.data.regex}`);
    setError('');
  } catch (err) {
    setError(err.response?.data.error || 'Erreur lors de la conversion en regex.');
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
      edges: Object.entries(afdData.transitions.transitions).flatMap(([source, trans]) =>
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
    setError(err.response?.data.error || 'Erreur lors de la conversion en AFD.');
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
      edges: Object.entries(afdCompleteData.transitions.transitions).flatMap(([source, trans]) =>
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
      setError(err.response?.data.error || 'Erreur lors de la complétion de l\'AFD.');
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
    setError(err.response?.data.error || 'Erreur lors de l\'analyse des états.');
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
      edges: Object.entries(emondedData.transitions.transitions).flatMap(([source, trans]) =>
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
    setError(err.response?.data.error || 'Erreur lors de l\'émondage de l\'automate.');
  } finally {
    setIsLoading(false);
  }
};

export const handleConvertToAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/to-afn/`);
    const afnData = response.data;
    console.log('AFN converti:', afnData);
    setAutomate(afnData);
    setGraph({
      nodes: afnData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
      edges: Object.entries(afnData.transitions.transitions).flatMap(([source, trans]) =>
        Object.entries(trans).flatMap(([symbole, destArray]) =>
          (Array.isArray(destArray) ? destArray : [destArray]).map(dest => ({
            from: source,
            to: dest, // Les transitions peuvent être multiples dans un AFN
            label: symbole,
            arrows: 'to',
          }))
        )
      ),
    });
    setError('');
  } catch (err) {
    console.error('Conversion to AFN error:', err.response?.data || err.message);
    setError(err.response?.data.error || 'Erreur lors de la conversion en AFN.');
  } finally {
    setIsLoading(false);
  }
};

export const handleConvertToEpsilonAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);
    const response = await api.post(`/api/automates/${id}/to-epsilon-afn/`);
    let data = response.data;

    // Ajouter un nom aléatoire si absent
    if (!data.name || data.name.trim() === '') {
      data = { ...data, name: `Automate_Epsilon_${Math.floor(Math.random() * 10000)}` };
    }

    // Ajouter ε à l'alphabet si absent
    if (!data.alphabet.includes('ε')) {
      data = { ...data, alphabet: [...new Set([...data.alphabet, 'ε'])] };
    }

    // Stocker l'état précédent pour annulation
    const previousAutomate = { ...data };
    const previousGraph = { ...setGraph };

    // Appliquer la conversion temporairement
    setAutomate(data);
    setGraph(generateGraph(data.states, data.transitions));

    // Afficher le popup de confirmation
    const saveConfirmed = await confirmSave(data);

    if (saveConfirmed) {
      // Enregistrer l'automate
      await api.post(`/api/automates/`, data);
      setError('');
    } else {
      // Revenir à l'état précédent en cas d'annulation
      setAutomate(previousAutomate);
      setGraph(previousGraph);
      setError('Conversion annulée.');
    }
  } catch (err) {
    console.error('Erreur Epsilon AFN:', err.response?.data || err.message);
    setError(err.response?.data.error || 'Erreur lors de la conversion en AFN avec epsilon.');
  } finally {
    setIsLoading(false);
  }
};

export const generateGraph = (states, transitions) => {
  const validStates = new Set(states);

  // Dictionnaire de mapping "1" → "q1", si besoin
  const stateMap = {};
  for (const state of states) {
    const match = state.match(/^q?(\d+)$/); // Match q1 ou 1
    if (match) {
      const num = match[1];
      stateMap[num] = state; // Ex: stateMap["1"] = "q1"
    }
  }

  return {
    nodes: states.map((state) => ({
      id: state,
      label: state,
      shape: 'circle',
    })),
    edges: Object.entries(transitions || {}).flatMap(([source, transitionMap]) =>
      Object.entries(transitionMap || {}).flatMap(([symbol, destinations]) => {
        const destArray = Array.isArray(destinations) ? destinations : [destinations];

        return destArray
          .map((dest) => {
            // Corrige "1" en "q1" si nécessaire
            const realDest = validStates.has(dest) ? dest : stateMap[dest];
            return realDest && validStates.has(realDest)
              ? {
                  from: source,
                  to: realDest,
                  label: symbol === '' || symbol === 'ε' ? 'ε' : symbol,
                  arrows: 'to',
                }
              : null;
          })
          .filter(Boolean); // Supprime les null
      })
    ),
  };
};

export const handleFromEpsilonAFN = async (id, setAutomate, setGraph, setError, setIsLoading) => {
  try {
    setIsLoading(true);

    const response = await api.post(`/api/automates/${id}/from-epsilon-afn/`);
    let data = response.data;

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
  } catch (err) {
    console.error('Erreur de conversion depuis Epsilon AFN:', err.response?.data || err.message);
    setError(err.response?.data.error || 'Erreur lors de la conversion depuis Epsilon AFN.');
  } finally {
    setIsLoading(false);
  }
};

export const handleEpsilonClosure = async (id, stateName, setError) => {
  try {
    const response = await api.get(`/api/automates/${id}/epsilon-closure/${stateName}/`);
    const closure = response.data;
    console.log('Epsilon Closure:', closure);
    alert(`Fermeture epsilon de ${stateName} : ${JSON.stringify(closure, null, 2)}`);
    setError('');
  } catch (err) {
    console.error('Epsilon closure error:', err.response?.data || err.message);
    setError(err.response?.data.error || 'Erreur lors du calcul de la fermeture epsilon.');
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
    setError(err.response?.data.error || 'Erreur lors de la conversion d\'Epsilon AFN en AFD.');
  } finally {
    setIsLoading(false);
  }
};

export const confirmSave = (automate) => {
  return new Promise((resolve) => {
    if (window.confirm(`Automate converti en Epsilon AFN. Voulez-vous enregistrer cet automate ?\nNom: ${automate.name}\nÉtats: ${automate.states.join(', ')}`)) {
      resolve(true); // Enregistrer
    } else {
      resolve(false); // Annuler
    }
  });
};
