// components/EpsilonClosureModal.jsx
import React, { useState } from 'react';
import { handleEpsilonClosure } from '../actions/epsilonClosure';

const EpsilonClosureModal = ({ isOpen, onClose, automateId }) => {
  const [stateName, setStateName] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!stateName.trim()) {
      setError("Veuillez entrer un nom d'état.");
      return;
    }

    setResult('');
    setError('');
    await handleEpsilonClosure(automateId, stateName, setError, setResult);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Fermeture epsilon</h2>

        <input
          type="text"
          placeholder="Nom de l'état (ex: q0)"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
          className="w-full border px-3 py-2 rounded-md mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {result && (
          <div className="bg-gray-100 p-2 rounded text-sm mb-2">
            <strong>ε-Fermeture de {stateName} :</strong> {result}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
            Fermer
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            Calculer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpsilonClosureModal;
