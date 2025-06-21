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

export const confirmSave = (automate) => {
  return new Promise((resolve) => {
    if (window.confirm(`Automate converti en Epsilon AFN. Voulez-vous enregistrer cet automate ?\nNom: ${automate.name}\nÉtats: ${automate.states.join(', ')}`)) {
      resolve(true); // Enregistrer
    } else {
      resolve(false); // Annuler
    }
  });
};