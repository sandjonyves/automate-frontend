'use client';
import { useState } from 'react';
import GraphViewer from '@/app/components/automates/GraphViewer';

const AutomateOperationModal = ({
  isOpen,
  onClose,
  onOperation,
  automates,
  operation,
  graph,
  automate
}) => {
  const [automateId1, setAutomateId1] = useState('');
  const [automateId2, setAutomateId2] = useState('');

  const closeModal = () => {
    setAutomateId1('');
    setAutomateId2('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOperation(automateId1, automateId2, operation);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90vw] h-[90vh] overflow-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">
          Sélectionner deux automates pour {operation === 'union' ? 'Union' : operation === 'intersection' ? 'Intersection' : 'Concaténation'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Premier automate</label>
            <select
              value={automateId1}
              onChange={(e) => setAutomateId1(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionner un automate</option>
              {automates.map((automate) => (
                <option key={automate.id} value={automate.id}>
                  {automate.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Deuxième automate</label>
            <select
              value={automateId2}
              onChange={(e) => setAutomateId2(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionner un automate</option>
              {automates.map((automate) => (
                <option key={automate.id} value={automate.id}>
                  {automate.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Exécuter
            </button>
          </div>
        </form>

        {automate && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <h3 className="text-lg font-semibold">Résultat de l'opération</h3>
            <GraphViewer graph={graph} automate={automate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomateOperationModal;