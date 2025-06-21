'use client';
import { useState } from 'react';
import GraphViewer from '@/app/components/automates/GraphViewer';

const PageView = ({
  automate,
  graph,
  error,
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
  handleAFDToEpsilonAFN,
  handleMinimizeAFD,
  handleCanonizeAutomate,
  handleRegexToEpsilonAFN,
  handleBuildAutomaton,
  router,
  handleComplement, // Ajout de la prop
}) => {
  const [stateName, setStateName] = useState('');

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
        <div className="p-4 mb-4 text-lg text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          {error}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6">{automate.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section gauche : Visualisation */}
        <div className="lg:w-2/3">
          <div className="border rounded-lg p-4 bg-white shadow">
            <GraphViewer graph={graph} automate={automate} />
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-semibold mb-2">Détails</h2>
            <p><strong>Description :</strong> {automate.description || 'Aucune'}</p>
            <p><strong>Type :</strong> {automate.automaton_type}</p>
            <p><strong>Alphabet :</strong> {automate.alphabet?.join(', ')}</p>
            <p><strong>États :</strong> {automate.states?.join(', ')}</p>
            <p><strong>État initial :</strong> {automate.initial_state}</p>
            <p><strong>États finaux :</strong> {automate.final_states?.join(', ')}</p>
            <p><strong>Transitions :</strong></p>
            <ul className="list-disc pl-5">
              {Object.entries(automate.transitions || {}).flatMap(([source, trans]) =>
                Object.entries(trans || {}).flatMap(([symbole, destArray]) => {
                  const destinations = Array.isArray(destArray) ? destArray : [destArray];
                  return destinations.map(dest => (
                    <li key={`${source}-${symbole}-${dest}`}>
                      {source} --{symbole || 'ε'}-- {dest}
                    </li>
                  ));
                })
              )}
            </ul>
          </div>
        </div>

        {/* Section droite : Opérations */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">Opérations</h2>

            <button
              onClick={() => router.push(`/automates/${automate.id}/edit`)}
              className="w-full bg-yellow-500 text-white p-2 rounded mb-2 hover:bg-yellow-600 transition-colors duration-200"
            >
              Modifier
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-red-500 text-white p-2 rounded mb-2 hover:bg-red-600 transition-colors duration-200"
            >
              Supprimer
            </button>

            <button
              onClick={handleConvertToRegex}
              className="w-full bg-green-500 text-white p-2 rounded mb-2 hover:bg-green-600 transition-colors duration-200"
            >
              Convertir en Regex
            </button>

            <button
              onClick={handleConvertToAFD}
              className="w-full bg-purple-500 text-white p-2 rounded mb-2 hover:bg-purple-600 transition-colors duration-200"
            >
              Convertir en AFD
            </button>

            <button
              onClick={handleCompleteAFD}
              className="w-full bg-indigo-500 text-white p-2 rounded mb-2 hover:bg-indigo-600 transition-colors duration-200"
            >
              Compléter AFD
            </button>

            <button
              onClick={handleMinimizeAFD}
              className="w-full bg-lime-500 text-white p-2 rounded mb-2 hover:bg-lime-600 transition-colors duration-200"
            >
              Minimiser AFD
            </button>

            <button
              onClick={handleCanonizeAutomate}
              className="w-full bg-emerald-500 text-white p-2 rounded mb-2 hover:bg-emerald-600 transition-colors duration-200"
            >
              Canoniser Automate
            </button>

            <button
              onClick={handleStateAnalysis}
              className="w-full bg-teal-500 text-white p-2 rounded mb-2 hover:bg-teal-600 transition-colors duration-200"
            >
              Analyser les États
            </button>

            <button
              onClick={handleEmondage}
              className="w-full bg-orange-500 text-white p-2 rounded mb-2 hover:bg-orange-600 transition-colors duration-200"
            >
              Émonder
            </button>

            <button
              onClick={handleConvertToAFN}
              className="w-full bg-pink-500 text-white p-2 rounded mb-2 hover:bg-pink-600 transition-colors duration-200"
            >
              Convertir en AFN
            </button>

            <button
              onClick={handleConvertToEpsilonAFN}
              className="w-full bg-blue-500 text-white p-2 rounded mb-2 hover:bg-blue-600 transition-colors duration-200"
            >
              Convertir en Epsilon AFN
            </button>

            <button
              onClick={handleFromEpsilonAFN}
              className="w-full bg-cyan-500 text-white p-2 rounded mb-2 hover:bg-cyan-600 transition-colors duration-200"
            >
              Convertir depuis Epsilon AFN
            </button>

            <button
              onClick={handleFromEpsilonAFNToAFD}
              className="w-full bg-violet-500 text-white p-2 rounded mb-2 hover:bg-violet-600 transition-colors duration-200"
            >
              Convertir Epsilon AFN en AFD
            </button>

            <button
              onClick={handleAFDToEpsilonAFN}
              className="w-full bg-amber-500 text-white p-2 rounded mb-2 hover:bg-amber-600 transition-colors duration-200"
            >
              Convertir AFD en Epsilon AFN
            </button>

            <button
              onClick={handleComplement} // Ajout du bouton
              className="w-full bg-rose-500 text-white p-2 rounded mb-2 hover:bg-rose-600 transition-colors duration-200"
            >
              Complément
            </button>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Regex vers Epsilon AFN</h3>
              <div className="flex">
                <input
                  type="text"
                  value={regexInput}
                  onChange={(e) => setRegexInput(e.target.value)}
                  placeholder="Entrez une expression régulière"
                  className="p-3 border border-gray-300 rounded mr-2 flex-1 text-base text-gray-800 bg-gray-50 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-colors duration-200"
                />
                <button
                  onClick={handleRegexToEpsilonAFN}
                  className="bg-fuchsia-500 text-white p-2 rounded hover:bg-fuchsia-600 transition-colors duration-200"
                >
                  Convertir
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Construire Automate (Glushkov)</h3>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={GlushkovRegexInput}
                  onChange={(e) => setGlushkovRegexInput(e.target.value)}
                  placeholder="Nom de l'automate"
                  className="p-3 border border-gray-300 rounded text-base text-gray-800 bg-gray-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors duration-200"
                />
                <button
                  onClick={handleBuildAutomaton}
                  className="bg-rose-500 text-white p-2 rounded hover:bg-rose-600 transition-colors duration-200"
                >
                  Construire
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Tester une chaîne</h3>
              <div className="flex">
                <input
                  type="text"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Entrez une chaîne"
                  className="p-3 border border-gray-300 rounded mr-2 flex-1 text-base text-gray-800 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
                <button
                  onClick={handleTestString}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Tester
                </button>
              </div>
              {testResult !== null && (
                <p className={`mt-2 text-sm ${testResult ? 'text-green-500' : 'text-red-500'}`}>
                  {testResult ? 'Chaîne acceptée' : 'Chaîne rejetée'}
                </p>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Fermeture Epsilon</h3>
              <div className="flex">
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="Nom de l'état"
                  className="p-3 border border-gray-300 rounded mr-2 flex-1 text-base text-gray-800 bg-gray-50 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                />
                <button
                  onClick={() => {
                    const state = stateName.trim();
                    if (state && automate.states.includes(state)) {
                      handleEpsilonClosure(state);
                    } else {
                      alert('Veuillez entrer un état valide.');
                    }
                  }}
                  className="bg-cyan-500 text-white p-2 rounded hover:bg-cyan-600 transition-colors duration-200"
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