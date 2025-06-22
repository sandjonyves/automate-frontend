import { useState } from 'react';
import api from '../../lib/axios';

const AutomateLoader = ({ setAutomate, setGraph }) => {
  const [automateId, setAutomateId] = useState('');
  const [error, setError] = useState('');

  const handleFetchAutomate = async () => {
    if (!automateId || isNaN(automateId)) {
      setError('Veuillez entrer un ID valide.');
      return;
    }

    try {
      
      const response = await api.get(`/api/automata/${automateId}/`);
      const data = response.data;
      setAutomate(data);
          setAutomate(data);
          setGraph(generateGraph(data.states, data.transitions));
      setError('');
      setAutomateId('');
    } catch (error) {
      setError(error.response?.data?.error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Charger un Automate</h2>
      <div className="flex items-center">
        <input
          type="number"
          placeholder="ID de l'automate"
          value={automateId}
          onChange={(e) => setAutomateId(e.target.value)}
          className="p-2 border rounded mr-2 w-48"
        />
        <button
          onClick={handleFetchAutomate}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Charger
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default AutomateLoader;