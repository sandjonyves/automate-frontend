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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl w-[90vw] max-w-4xl h-[90vh] overflow-auto relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light leading-none transition-colors duration-200"
        >
          ×
        </button>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Opération sur les automates
          </h2>
          <p className="text-gray-600">
            Sélectionner deux automates pour {operation === 'union' ? 'Union' : operation === 'intersection' ? 'Intersection' : 'Concaténation'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Premier automate</label>
            <select
              value={automateId1}
              onChange={(e) => setAutomateId1(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 shadow-sm"
              style={{ 
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                WebkitAppearance: 'menulist',
                MozAppearance: 'menulist',
                appearance: 'menulist'
              }}
              required
            >
              <option value="" style={{ color: '#6b7280', backgroundColor: 'white' }}>
                Sélectionner un automate
              </option>
              {automates && automates.length > 0 && automates.map((automate) => {
                return (
                  <option 
                    key={`automate-1-${automate.id}`} 
                    value={automate.id}
                    style={{ 
                      color: 'black', 
                      backgroundColor: 'white',
                      fontWeight: 'normal'
                    }}
                  >
                    {automate.name || automate.id || 'Automate sans nom'}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Deuxième automate</label>
            <select
              value={automateId2}
              onChange={(e) => setAutomateId2(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-200 shadow-sm"
              style={{ 
                color: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                WebkitAppearance: 'menulist',
                MozAppearance: 'menulist',
                appearance: 'menulist'
              }}
              required
            >
              <option value="" style={{ color: '#6b7280', backgroundColor: 'white' }}>
                Sélectionner un automate
              </option>
              {automates && automates.length > 0 && automates.map((automate) => {
                return (
                  <option 
                    key={`automate-2-${automate.id}`} 
                    value={automate.id}
                    style={{ 
                      color: 'black', 
                      backgroundColor: 'white',
                      fontWeight: 'normal'
                    }}
                  >
                    {automate.name || automate.id || 'Automate sans nom'}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 rounded-xl bg-gray-500/90 text-white font-medium hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Exécuter
            </button>
          </div>
        </form>
        
        {automate && (
          <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-inner">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Résultat de l'opération
            </h3>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm">
              <GraphViewer graph={graph} automate={automate} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomateOperationModal;