'use client'

import { useState } from 'react';
import api from '../../lib/axios';

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
    isList: false, // Pour gérer les destinations multiples (NFA/ε-NFA)
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
      const response = await api.post('/api/automates/', formData);
      setAutomate(response.data);
      console.log(response)
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
      setErrors({ submit: error.response?.data?.detail || 'Erreur lors de la création de l\'automate.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Créer un Automate</h2>

      {/* Nom */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>

      {/* Type d'automate */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Type d'automate</label>
        <select
          value={formData.automaton_type}
          onChange={(e) => setFormData({ ...formData, automaton_type: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="DFA">Déterministe (DFA)</option>
          <option value="NFA">Non Déterministe (NFA)</option>
          <option value="ε-NFA">Epsilon-NFA (ε-NFA)</option>
        </select>
      </div>

      {/* Alphabet */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Alphabet</label>
        <div className="flex">
          <input
            type="text"
            value={newSymbole}
            onChange={(e) => setNewSymbole(e.target.value)}
            maxLength={10}
            className="p-2 border rounded mr-2"
            placeholder="Symbole"
          />
          <button
            type="button"
            onClick={handleAddSymbole}
            className="bg-green-500 text-white p-2 rounded"
          >
            Ajouter
          </button>
        </div>
        {errors.newSymbole && <p className="text-red-500 text-sm">{errors.newSymbole}</p>}
        <div className="mt-2">
          {formData.alphabet.map((symbole) => (
            <span
              key={symbole}
              className="inline-block bg-gray-200 rounded px-2 py-1 mr-2 mb-2"
            >
              {symbole}
              <button
                type="button"
                onClick={() => handleRemoveSymbole(symbole)}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* États */}
      <div className="mb-4">
        <label className="block text-sm font-medium">États</label>
        <div className="flex">
          <input
            type="text"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            className="p-2 border rounded mr-2"
            placeholder="Nom de l'état"
          />
          <button
            type="button"
            onClick={handleAddState}
            className="bg-green-500 text-white p-2 rounded"
          >
            Ajouter
          </button>
        </div>
        {errors.newState && <p className="text-red-500 text-sm">{errors.newState}</p>}
        <div className="mt-2">
          {formData.states.map((state) => (
            <span
              key={state}
              className="inline-block bg-gray-200 rounded px-2 py-1 mr-2 mb-2"
            >
              {state}
              <button
                type="button"
                onClick={() => handleRemoveState(state)}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* État initial */}
      <div className="mb-4">
        <label className="block text-sm font-medium">État initial</label>
        <select
          value={formData.initial_state}
          onChange={(e) => setFormData({ ...formData, initial_state: e.target.value })}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="">Sélectionner un état</option>
          {formData.states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.initial_state && <p className="text-red-500 text-sm">{errors.initial_state}</p>}
      </div>

      {/* États finaux */}
      <div className="mb-4">
        <label className="block text-sm font-medium">États finaux</label>
        {formData.states.map((state) => (
          <label key={state} className="block">
            <input
              type="checkbox"
              checked={formData.final_states.includes(state)}
              onChange={() => handleToggleFinalState(state)}
              className="mr-2"
            />
            {state}
          </label>
        ))}
        {errors.final_states && <p className="text-red-500 text-sm">{errors.final_states}</p>}
      </div>

      {/* Transitions */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Transitions</label>
        <div className="flex flex-col space-y-2">
          <select
            value={newTransition.source}
            onChange={(e) => setNewTransition({ ...newTransition, source: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">État source</option>
            {formData.states.map((state) => (
              <option key={state} value={state}>
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
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={newTransition.destination}
            onChange={(e) => setNewTransition({ ...newTransition, destination: e.target.value })}
            placeholder={newTransition.isList ? 'Destinations (séparées par des virgules)' : 'État destination'}
            className="p-2 border rounded"
          />
          <label>
            <input
              type="checkbox"
              checked={newTransition.isList}
              onChange={(e) => setNewTransition({ ...newTransition, isList: e.target.checked })}
              className="mr-2"
            />
            Destination multiple (NFA/ε-NFA)
          </label>
          <button
            type="button"
            onClick={handleAddTransition}
            className="bg-green-500 text-white p-2 rounded"
          >
            Ajouter Transition
          </button>
        </div>
        {errors.transitionSource && <p className="text-red-500 text-sm">{errors.transitionSource}</p>}
        {errors.transitionSymbole && <p className="text-red-500 text-sm">{errors.transitionSymbole}</p>}
        {errors.transitionDestination && (
          <p className="text-red-500 text-sm">{errors.transitionDestination}</p>
        )}
        <div className="mt-2">
          {Object.entries(formData.transitions).map(([source, trans]) =>
            Object.entries(trans).map(([symbole, dest]) => (
              <div key={`${source}-${symbole}`} className="bg-gray-200 rounded px-2 py-1 mb-2">
                {source} --{symbole || 'ε'}-- {Array.isArray(dest) ? dest.join(', ') : dest}
                <button
                  type="button"
                  onClick={() => handleRemoveTransition(source, symbole)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bouton de soumission */}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Créer Automate
      </button>
      {errors.submit && <p className="text-red-500 text-sm mt-2">{errors.submit}</p>}
    </form>
  );
};

export default AutomateForm;