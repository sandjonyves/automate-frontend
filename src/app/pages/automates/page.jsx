'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/axios';
import { handleUnion } from '@/app/services/union';
import { handleIntersection } from '@/app/services/intersection';
import { handleConcatenate } from '@/app/services/concatenate'; // Ajout de l'import
import GraphViewer from '@/app/components/automates/GraphViewer';
import AutomateOperationModal from '@/app/components/AutomateOperationModal';
import AutomateList from '@/app/components/AutomateList';
import { generateGraph } from '@/app/services/utils';

export default function AutomatesListPage() {
  const [automates, setAutomates] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [operation, setOperation] = useState('');
  const [operationResult, setOperationResult] = useState(null);
  const [automate, setAutomate] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const router = useRouter();

  useEffect(() => {
    const fetchAutomates = async () => {
      try {
        const response = await api.get('/api/automates/');
        console.log(response.data)
        setAutomates(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data.error || 'Erreur lors du chargement des automates.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAutomates();
  }, []);

  const handleConsult = (id) => {
    router.push(`/pages/automates/${id}`);
  };

  const openModal = (op) => {
    setOperation(op);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setOperation('');
    setAutomate(null);
    setGraph({ nodes: [], edges: [] });
  };

  const handleOperation = async (automateId1, automateId2, operation) => {
    if (!automateId1 || !automateId2) {
      setError('Veuillez sélectionner deux automates.');
      return;
    }
    if (automateId1 === automateId2) {
      setError('Veuillez sélectionner deux automates différents.');
      return;
    }

    try {
      let result;
      console.log(`Executing ${operation} with automateId1: ${automateId1}, automateId2: ${automateId2}`);
      if (operation === 'union') {
        result = await handleUnion(automateId1, automateId2, setOperationResult, setError);
        console.log('Union result:', result);
      } else if (operation === 'intersection') {
        result = await handleIntersection(automateId1, automateId2, setOperationResult, setError);
        console.log('Intersection result:', result);
      } else if (operation === 'concatenate') {
        result = await handleConcatenate(automateId1, automateId2, setOperationResult, setError);
        console.log('Concatenate result:', result);
      }

      if (result) {
        if (!result.name || result.name.trim() === '') {
          result = { ...result, name: `Automate_${operation}_${Math.floor(Math.random() * 10000)}` };
        }
        setAutomate(result);
        setGraph(generateGraph(result.states, result.transitions?.transitions || result.transitions || {}));
        setOperationResult(result);
        setError('');
      } else {
        setError(`Aucun résultat retourné pour l'opération ${operation}.`);
      }
    } catch (err) {
      setError(err.response?.data.error || `Erreur lors de l'opération ${operation}. Détails: ${err.message}`);
      console.error(`Error in ${operation}:`, err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des Automates</h1>
      <div className="mb-4 space-x-4">
        <button
          onClick={() => router.push('automates/create')}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          CRÉER UN AUTOMATE
        </button>
        <button
          onClick={() => openModal('union')}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-200"
        >
          UNION
        </button>
        <button
          onClick={() => openModal('intersection')}
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors duration-200"
        >
          INTERSECTION
        </button>
        <button
          onClick={() => openModal('concatenate')}
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-200"
        >
          CONCATÉNER
        </button>
      </div>

      {isLoading && (
        <div className="text-center p-4">
          <p className="text-gray-500">Chargement...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!isLoading && <AutomateList automates={automates} onConsult={handleConsult} />}

      <AutomateOperationModal
        isOpen={showModal}
        onClose={closeModal}
        onOperation={handleOperation}
        automates={automates}
        operation={operation}
        graph={graph}
        automate={automate}
      />
    </div>
  );
}