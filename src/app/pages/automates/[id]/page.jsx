'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import GraphViewer from '../../../components/automates/GraphViewer';

const Page = () => {
  const [automate, setAutomate] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testString, setTestString] = useState('');
  const [testResult, setTestResult] = useState(null);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    console.log('ID from query:', id); // Debug log
    if (!id) {
      setError('ID non défini dans l\'URL.');
      setIsLoading(false);
      return;
    }

    const fetchAutomate = async () => {
      try {
        console.log(`Fetching automate with ID: ${id}`); // Debug log
        const response = await api.get(`/api/automates/${id}/`);
        console.log('API Response:', response.data); // Debug log
        const data = response.data;
        setAutomate(data);
        setGraph({
          nodes: data.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
          edges: Object.entries(data.transitions).flatMap(([source, trans]) =>
            Object.entries(trans).map(([symbole, dest]) => ({
              from: source,
              to: Array.isArray(dest) ? dest[0] : dest,
              label: symbole || 'ε',
              arrows: 'to',
            }))
          ),
        });
        setError('');
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message); // Debug log
        setError(err.response?.data?.detail || 'Erreur lors du chargement de l\'automate.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAutomate();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Voulez-vous vraiment supprimer cet automate ?')) {
      try {
        await api.delete(`/api/automata/${id}/`);
        router.push('/automates');
      } catch (err) {
        setError(err.response?.data?.detail || 'Erreur lors de la suppression.');
      }
    }
  };

  const handleTestString = async () => {
    try {
      const response = await api.post(`/api/automata/${id}/test-string/`, { string: testString });
      setTestResult(response.data.result);
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors du test de la chaîne.');
    }
  };

  const handleConvertToRegex = async () => {
    try {
      const response = await api.post(`/api/automates/${id}/to-regex/`);
      alert(`Expression régulière : ${response.data.regex}`);
      console.log(`Expression régulière : ${response.data.regex}`)
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la conversion en regex.');
    }
  };

  const handleConvertToAFD = async () => {
    try {
      setIsLoading(true);
      const response = await api.post(`/api/automates/${id}/convert/`);
      const afdData = response.data.afd;
      console.log(afdData)
      setAutomate(afdData);
      setGraph({
        nodes: afdData.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
        edges: Object.entries(afdData.transitions).flatMap(([source, trans]) =>
          Object.entries(trans).map(([symbole, dest]) => ({
            from: source,
            to: dest,
            label: symbole,
            arrows: 'to',
          }))
        ),
      });
      setError('');
    } catch (err) {
      console.error('Conversion error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Erreur lors de la conversion en AFD.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="p-4 bg-red-100 rounded">
          <p className="text-red-500">{error}</p>
        </div>
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
            <p><strong>Alphabet :</strong> {automate.alphabet.join(', ')}</p>
            <p><strong>États :</strong> {automate.states.join(', ')}</p>
            <p><strong>État initial :</strong> {automate.initial_state}</p>
            <p><strong>États finaux :</strong> {automate.final_states.join(', ')}</p>
            <p><strong>Transitions :</strong></p>
            <ul className="list-disc pl-5">
              {Object.entries(automate.transitions).map(([source, trans]) =>
                Object.entries(trans).map(([symbole, dest]) => (
                  <li key={`${source}-${symbole}`}>
                    {source} --{symbole || 'ε'}-- {Array.isArray(dest) ? dest.join(', ') : dest}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Section droite : Opérations */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">Opérations</h2>
            <button
              onClick={() => router.push(`/automates/${id}/edit`)}
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
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Tester une chaîne</h3>
              <div className="flex">
                <input
                  type="text"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Entrez une chaîne"
                  className="p-2 border rounded mr-2 flex-1"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;