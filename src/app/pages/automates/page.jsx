'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/axios';


export default function AutomatesListPage() {
  const [automates, setAutomates] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAutomates = async () => {
      try {
        const response = await api.get('/api/automates/');
         console.log(response.data)
        setAutomates(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Erreur lors du chargement des automates.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAutomates();
  }, []);

  const handleConsult = (id) => {
    router.push(`/pages/automates/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des Automates</h1>
            <button
              onClick={() => router.push('automates/create')}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
             CREER UN AUTOMATE
            </button>
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

      {!isLoading && automates.length === 0 && (
        <div className="text-center p-4">
          <p className="text-gray-500">Aucun automate trouvé.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automates.map((automate) => (
          <div
            key={automate.id}
            className="border rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-200"
          >
            <h2 className="text-xl font-semibold mb-2">{automate.name}</h2>
            <p className="text-gray-600 mb-2 truncate">{automate.description || 'Aucune description'}</p>
            <p className="text-sm text-gray-500 mb-4">Type: {automate.automaton_type}</p>
            <button
              onClick={() => handleConsult(automate.id)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Consulter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}