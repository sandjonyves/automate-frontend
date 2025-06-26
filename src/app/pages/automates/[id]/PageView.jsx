'use client';
import { useState } from 'react';
import GraphViewer from '@/app/components/automates/GraphViewer';

const PageView = ({
  automate,
  graph,
  error,
  setError,
  isLoading,
  testString,
  testResult,
  setTestString,
  regexInput,
  setRegexInput,
  GlushkovRegexInput,
  setGlushkovRegexInput,
  handleDelete,
  handleTestString,
  handleConvertToRegex,
  handleConvertToAFD,
  handleCompleteAFD,
  handleStateAnalysis,
  handleEmondage,
  handleConvertToAFN,
  handleConvertToEpsilonAFN,
  handleFromEpsilonAFN,
  handleEpsilonClosure,
  handleFromEpsilonAFNToAFD,
  handleMinimizeAFD,
  handleCanonizeAutomate,
  handleRegexToEpsilonAFN,
  handleBuildAutomaton,
  handleComplement,
  router,
}) => {
  const [stateName, setStateName] = useState('');
  const [operationResult, setOperationResult] = useState(null);

  // Fonction pour gérer les opérations et stocker le résultat
  const handleOperation = async (operationFunc, ...args) => {
    
    try {
      const result = await operationFunc(...args);
      setOperationResult(result);
    } catch (err) {
      setOperationResult({ error: `Erreur : ${err.message}` });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!automate) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-500">Automate non trouvé.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div
          className="p-4 mb-4 text-lg text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">{automate.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Partie gauche : Affichage */}
        <div className="lg:w-2/3">
          <div className="border rounded-lg p-4 bg-white shadow">
            <GraphViewer graph={graph} automate={automate} />
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-semibold mb-2">Détails</h2>
            <p>
              <strong>Description :</strong> {automate.description || 'Aucune'}
            </p>
            <p>
              <strong>Type :</strong> {automate.automaton_type}
            </p>
            <p>
              <strong>Alphabet :</strong> {automate.alphabet?.join(', ')}
            </p>
            <p>
              <strong>États :</strong> {automate.states?.join(', ')}
            </p>
            <p>
              <strong>État initial :</strong> {automate.initial_state}
            </p>
            <p>
              <strong>États finaux :</strong> {automate.final_states?.join(', ')}
            </p>
            <p>
              <strong>Transitions :</strong>
            </p>
            <ul className="list-disc pl-5">
              {Object.entries(automate.transitions || {}).flatMap(([source, trans]) =>
                Object.entries(trans || {}).flatMap(([symbol, dest]) => {
                  const destinations = Array.isArray(dest) ? dest : [dest];
                  return destinations.map((d) => (
                    <li key={`${source}-${symbol}-${d}`}>
                      {source} --{symbol || 'ε'}-- {d}
                    </li>
                  ));
                })
              )}
            </ul>
          </div>

          {/* Affichage du résultat de l'opération */}
          {operationResult && (
            <div className="mt-4 p-4 bg-blue-100 rounded">
              <h2 className="text-lg font-semibold mb-2">Résultat de l'opération</h2>
              {operationResult.error ? (
                <p className="text-red-600">{operationResult.error}</p>
              ) : (
                <>
                  <p>
                    <strong>Type :</strong> {operationResult.automaton_type || 'Non défini'}
                  </p>
                  <p>
                    <strong>Alphabet :</strong> {operationResult.alphabet?.join(', ') || 'Aucun'}
                  </p>
                  <p>
                    <strong>États :</strong> {operationResult.states?.join(', ') || 'Aucun'}
                  </p>
                  <p>
                    <strong>État initial :</strong> {operationResult.initial_state || 'Aucun'}
                  </p>
                  <p>
                    <strong>États finaux :</strong> {operationResult.final_states?.join(', ') || 'Aucun'}
                  </p>
                  <p>
                    <strong>Transitions :</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {Object.entries(operationResult.transitions || {}).flatMap(([source, trans]) =>
                      Object.entries(trans || {}).flatMap(([symbol, dest]) => {
                        const destinations = Array.isArray(dest) ? dest : [dest];
                        return destinations.map((d) => (
                          <li key={`${source}-${symbol}-${d}`}>
                            {source} --{symbol || 'ε'}-- {d}
                          </li>
                        ));
                      })
                    )}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* Partie droite : Opérations */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">Opérations</h2>

            <button
              onClick={() => handleOperation(handleDelete)}
              className="w-full bg-red-500 text-white p-2 rounded mb-2 hover:bg-red-600"
            >
              Supprimer
            </button>

            {/* Boutons pour toutes les opérations, indépendamment du type */}
            <button
              onClick={() => handleOperation(handleCompleteAFD)}
              className="w-full bg-indigo-500 text-white p-2 rounded mb-2 hover:bg-indigo-600"
            >
              Compléter l'AFD
            </button>
            <button
              onClick={() => handleOperation(handleMinimizeAFD)}
              className="w-full bg-lime-500 text-white p-2 rounded mb-2 hover:bg-lime-600"
            >
              Minimiser l'AFD
            </button>
            <button
              onClick={() => handleOperation(handleCanonizeAutomate)}
              className="w-full bg-emerald-500 text-white p-2 rounded mb-2 hover:bg-emerald-600"
            >
              Canoniser
            </button>
            <button
              onClick={() => handleOperation(handleConvertToRegex)}
              className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600"
            >
              Convertir en Regex
            </button>
            <button
              onClick={() => handleOperation(handleConvertToAFN)}
              className="w-full bg-pink-500 text-white p-2 rounded mb-2 hover:bg-pink-600"
            >
              AFD → AFN
            </button>
            <button
              onClick={() => handleOperation(handleConvertToEpsilonAFN)}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600"
            >
              AFD → ε-AFN
            </button>
            <button
              onClick={() => handleOperation(handleComplement)}
              className="w-full bg-rose-500 text-white p-2 rounded mb-2 hover:bg-rose-600"
            >
              Complément
            </button>
            <button
              onClick={() => handleOperation(handleConvertToAFD)}
              className="w-full bg-purple-500 text-white p-2 rounded mb-2 hover:bg-purple-600"
            >
              AFN → AFD
            </button>
            <button
              onClick={() => handleOperation(handleFromEpsilonAFN)}
              className="w-full bg-cyan-500 text-white p-2 rounded mb-2 hover:bg-cyan-600"
            >
              ε-AFN → AFN
            </button>
            <button
              onClick={() => handleOperation(handleFromEpsilonAFNToAFD)}
              className="w-full bg-violet-500 text-white p-2 rounded mb-2 hover:bg-violet-600"
            >
              ε-AFN → AFD
            </button>
            <button
              onClick={() => handleOperation(handleStateAnalysis)}
              className="w-full bg-teal-500 text-white p-2 rounded mb-2 hover:bg-teal-600"
            >
              Analyser les États
            </button>
            <button
              onClick={() => handleOperation(handleEmondage)}
              className="w-full bg-orange-500 text-white p-2 rounded mb-2 hover:bg-orange-600"
            >
              Émonder l'automate
            </button>

            {/* Construire avec Regex (Thompson) */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Construire Automate (Thompson)</h3>
              <div className="flex">
                <input
                  type="text"
                  value={regexInput}
                  onChange={(e) => setRegexInput(e.target.value)}
                  placeholder="Entrez une expression régulière"
                  className="p-3 border border-gray-300 rounded mr-2 flex-1"
                />
                <button
                  onClick={() => handleOperation(handleRegexToEpsilonAFN)}
                  className="bg-fuchsia-500 text-white p-2 rounded hover:bg-fuchsia-600"
                >
                  Construire
                </button>
              </div>
            </div>

            {/* Construire avec Regex (Glushkov) */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Construire Automate (Glushkov)</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={GlushkovRegexInput}
                  onChange={(e) => setGlushkovRegexInput(e.target.value)}
                  placeholder="Entrez une expression régulière"
                  className="p-3 border border-gray-300 rounded"
                />
                <button
                  onClick={() => handleOperation(handleBuildAutomaton)}
                  className="bg-rose-500 text-white p-2 rounded hover:bg-rose-600"
                >
                  Construire
                </button>
              </div>
            </div>

            {/* Fermeture epsilon */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Fermeture Epsilon</h3>
              <div className="flex">
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Nom de l'état"
                  className="p-3 border border-gray-300 rounded mr-2 flex-1"
                />
                <button
                  onClick={() => {
                    // alert()
                    const state = stateName.trim();
                    if (state && automate.states.includes(state)) {
                      // alert()
                      handleEpsilonClosure(automate.id,state,setError)
                    } else {
                      setError('Veuillez entrer un état valide.')
                      // setOperationResult({ error: 'Veuillez entrer un état valide.' });
                    }
                  }}
                  className="bg-cyan-500 text-white p-2 rounded hover:bg-cyan-600"
                >
                  Calculer Fermeture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageView;