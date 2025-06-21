'use client'

import { useState } from 'react';

const AutomateForm = ({ setAutomate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    automaton_type: 'DFA',
    alphabet: [],
    states: [],
    initial_state: '',
    final_states: [],
    transitions: {},
  });
  const [newSymbole, setNewSymbole] = useState('');
  const [newState, setNewState] = useState('');
  const [newTransition, setNewTransition] = useState({
    source: '',
    symbole: '',
    destination: '',
    isList: false,
  });
  const [errors, setErrors] = useState({});

  // Ajouter un symbole à l'alphabet
  const handleAddSymbole = () => {
    if (!newSymbole) return;
    if (formData.alphabet.includes(newSymbole)) {
      setErrors({ ...errors, newSymbole: 'Ce symbole existe déjà.' });
      return;
    }
    setFormData({ ...formData, alphabet: [...formData.alphabet, newSymbole] });
    setNewSymbole('');
    setErrors({ ...errors, newSymbole: '' });
  };

  // Supprimer un symbole
  const handleRemoveSymbole = (symbole) => {
    setFormData({
      ...formData,
      alphabet: formData.alphabet.filter((s) => s !== symbole),
      transitions: Object.fromEntries(
        Object.entries(formData.transitions).map(([state, trans]) => [
          state,
          Object.fromEntries(Object.entries(trans).filter(([s]) => s !== symbole)),
        ])
      ),
    });
  };

  // Ajouter un état
  const handleAddState = () => {
    if (!newState) return;
    if (formData.states.includes(newState)) {
      setErrors({ ...errors, newState: 'Cet état existe déjà.' });
      return;
    }
    setFormData({ ...formData, states: [...formData.states, newState] });
    setNewState('');
    setErrors({ ...errors, newState: '' });
  };

  // Supprimer un état
  const handleRemoveState = (state) => {
    setFormData({
      ...formData,
      states: formData.states.filter((s) => s !== state),
      initial_state: formData.initial_state === state ? '' : formData.initial_state,
      final_states: formData.final_states.filter((s) => s !== state),
      transitions: Object.fromEntries(
        Object.entries(formData.transitions).filter(([s]) => s !== state)
      ),
    });
  };

  // Ajouter/supprimer un état final
  const handleToggleFinalState = (state) => {
    setFormData({
      ...formData,
      final_states: formData.final_states.includes(state)
        ? formData.final_states.filter((s) => s !== state)
        : [...formData.final_states, state],
    });
  };

  // Ajouter une transition
  const handleAddTransition = () => {
    const { source, symbole, destination, isList } = newTransition;
    if (!source || (!symbole && symbole !== '') || !destination) return;

    if (!formData.states.includes(source)) {
      setErrors({ ...errors, transitionSource: 'État source invalide.' });
      return;
    }
    if (symbole && !formData.alphabet.includes(symbole) && symbole !== 'ε') {
      setErrors({ ...errors, transitionSymbole: 'Symbole invalide.' });
      return;
    }
    const destinations = isList ? destination.split(',').map((d) => d.trim()) : [destination];
    for (const dest of destinations) {
      if (!formData.states.includes(dest)) {
        setErrors({ ...errors, transitionDestination: `État destination ${dest} invalide.` });
        return;
      }
    }

    const newTransitions = { ...formData.transitions };
    if (!newTransitions[source]) newTransitions[source] = {};
    newTransitions[source][symbole || 'ε'] = isList ? destinations : destination;

    setFormData({ ...formData, transitions: newTransitions });
    setNewTransition({ source: '', symbole: '', destination: '', isList: false });
    setErrors({ ...errors, transitionSource: '', transitionSymbole: '', transitionDestination: '' });
  };

  // Supprimer une transition
  const handleRemoveTransition = (source, symbole) => {
    const newTransitions = { ...formData.transitions };
    delete newTransitions[source][symbole];
    if (Object.keys(newTransitions[source]).length === 0) {
      delete newTransitions[source];
    }
    setFormData({ ...formData, transitions: newTransitions });
  };

  // Valider et soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Le nom est requis.';
    if (!formData.initial_state) newErrors.initial_state = 'L\'état initial est requis.';
    if (!formData.states.includes(formData.initial_state)) {
      newErrors.initial_state = 'L\'état initial doit être dans la liste des états.';
    }
    for (const f of formData.final_states) {
      if (!formData.states.includes(f)) {
        newErrors.final_states = `L'état final ${f} n'est pas dans la liste des états.`;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Simulate API call
      const response = { data: formData };
      setAutomate && setAutomate(response.data);
      alert('Automate créé avec succès !');
      setFormData({
        name: '',
        description: '',
        automaton_type: 'DFA',
        alphabet: [],
        states: [],
        initial_state: '',
        final_states: [],
        transitions: {},
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la création de l\'automate.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header avec animation */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-pulse">
            Créateur d'Automates
          </h1>
          <p className="text-xl text-gray-300">Construisez vos automates finis avec style</p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Grille responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Section Informations de base */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-300/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 flex items-center justify-center text-sm">ℹ️</span>
                  Informations de base
                </h3>
                
                {/* Nom */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Nom de l'automate</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Ex: Automate de validation"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm h-24 resize-none"
                    placeholder="Décrivez votre automate..."
                  />
                </div>

                {/* Type d'automate */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Type d'automate</label>
                  <select
                    value={formData.automaton_type}
                    onChange={(e) => setFormData({ ...formData, automaton_type: e.target.value })}
                    className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="DFA" className="bg-gray-800">🔵 Déterministe (DFA)</option>
                    <option value="NFA" className="bg-gray-800">🟡 Non Déterministe (NFA)</option>
                    <option value="ε-NFA" className="bg-gray-800">🔶 Epsilon-NFA (ε-NFA)</option>
                  </select>
                </div>
              </div>

              {/* Section Alphabet */}
              <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-green-300/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mr-3 flex items-center justify-center text-sm">Σ</span>
                  Alphabet
                </h3>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newSymbole}
                    onChange={(e) => setNewSymbole(e.target.value)}
                    maxLength={10}
                    className="flex-1 p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                    placeholder="Nouveau symbole"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymbole}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    ✨ Ajouter
                  </button>
                </div>
                {errors.newSymbole && <p className="text-red-400 text-sm mb-4 animate-pulse">{errors.newSymbole}</p>}
                
                <div className="flex flex-wrap gap-2">
                  {formData.alphabet.map((symbole, index) => (
                    <span
                      key={symbole}
                      className="inline-flex items-center bg-gradient-to-r from-green-400/20 to-teal-400/20 border border-green-300/50 rounded-full px-4 py-2 text-white font-medium animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {symbole}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymbole(symbole)}
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        ❌
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section États et Transitions */}
            <div className="space-y-6">
              
              {/* Section États */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-300/30">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mr-3 flex items-center justify-center text-sm">⚡</span>
                  États
                </h3>
                
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="flex-1 p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                    placeholder="Nom de l'état"
                  />
                  <button
                    type="button"
                    onClick={handleAddState}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    ⚡ Ajouter
                  </button>
                </div>
                {errors.newState && <p className="text-red-400 text-sm mb-4 animate-pulse">{errors.newState}</p>}
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.states.map((state, index) => (
                    <span
                      key={state}
                      className="inline-flex items-center bg-gradient-to-r from-orange-400/20 to-red-400/20 border border-orange-300/50 rounded-full px-4 py-2 text-white font-medium animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {state}
                      <button
                        type="button"
                        onClick={() => handleRemoveState(state)}
                        className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        ❌
                      </button>
                    </span>
                  ))}
                </div>

                {/* État initial */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-200 mb-2">État initial</label>
                  <select
                    value={formData.initial_state}
                    onChange={(e) => setFormData({ ...formData, initial_state: e.target.value })}
                    className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
                  >
                    <option value="" className="bg-gray-800">Sélectionner un état</option>
                    {formData.states.map((state) => (
                      <option key={state} value={state} className="bg-gray-800">
                        🚀 {state}
                      </option>
                    ))}
                  </select>
                  {errors.initial_state && <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.initial_state}</p>}
                </div>

                {/* États finaux */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-4">États finaux</label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.states.map((state) => (
                      <label key={state} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.final_states.includes(state)}
                          onChange={() => handleToggleFinalState(state)}
                          className="w-4 h-4 text-orange-500 bg-transparent border-2 border-white/30 rounded focus:ring-orange-400 focus:ring-2"
                        />
                        <span className="text-white">{state}</span>
                      </label>
                    ))}
                  </div>
                  {errors.final_states && <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.final_states}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section Transitions */}
          <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-300/30">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 flex items-center justify-center text-sm">🔄</span>
              Transitions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <select
                value={newTransition.source}
                onChange={(e) => setNewTransition({ ...newTransition, source: e.target.value })}
                className="p-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              >
                <option value="" className="bg-gray-800">État source</option>
                {formData.states.map((state) => (
                  <option key={state} value={state} className="bg-gray-800">
                    {state}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                value={newTransition.symbole}
                onChange={(e) => setNewTransition({ ...newTransition, symbole: e.target.value })}
                placeholder="Symbole (ou ε)"
                maxLength={10}
                className="p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              />
              
              <input
                type="text"
                value={newTransition.destination}
                onChange={(e) => setNewTransition({ ...newTransition, destination: e.target.value })}
                placeholder={newTransition.isList ? 'Destinations (séparées par des virgules)' : 'État destination'}
                className="p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              />
              
              <button
                type="button"
                onClick={handleAddTransition}
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                🔄 Ajouter
              </button>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTransition.isList}
                  onChange={(e) => setNewTransition({ ...newTransition, isList: e.target.checked })}
                  className="w-4 h-4 text-purple-500 bg-transparent border-2 border-white/30 rounded focus:ring-purple-400 focus:ring-2"
                />
                <span className="text-white">Destination multiple (NFA/ε-NFA)</span>
              </label>
            </div>

            {(errors.transitionSource || errors.transitionSymbole || errors.transitionDestination) && (
              <div className="mb-4 space-y-1">
                {errors.transitionSource && <p className="text-red-400 text-sm animate-pulse">{errors.transitionSource}</p>}
                {errors.transitionSymbole && <p className="text-red-400 text-sm animate-pulse">{errors.transitionSymbole}</p>}
                {errors.transitionDestination && <p className="text-red-400 text-sm animate-pulse">{errors.transitionDestination}</p>}
              </div>
            )}
            
            <div className="space-y-3">
              {Object.entries(formData.transitions).map(([source, trans]) =>
                Object.entries(trans).map(([symbole, dest], index) => (
                  <div key={`${source}-${symbole}`} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-400/10 to-pink-400/10 border border-purple-300/30 rounded-xl animate-fadeIn">
                    <span className="text-white font-medium">
                      <span className="text-purple-300">{source}</span>
                      <span className="mx-2 text-gray-400">--</span>
                      <span className="text-pink-300">{symbole || 'ε'}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-cyan-300">{Array.isArray(dest) ? dest.join(', ') : dest}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTransition(source, symbole)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-400/10 rounded-lg"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="mt-8 text-center">
            <button 
              onClick={handleSubmit} 
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-pulse"
            >
              ✨ Créer l'Automate Magique ✨
            </button>
            {errors.submit && <p className="text-red-400 text-sm mt-4 animate-pulse">{errors.submit}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AutomateForm;