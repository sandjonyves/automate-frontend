// actions/epsilonClosure.js
import api from "@/app/lib/axios";

export const handleEpsilonClosure = async (id, stateName, setError, setResult) => {
  try {
    const response = await api.get(`/api/automates/${id}/epsilon-closure/${stateName}/`);
    const closure = response.data.epsilon_closure;
    setResult(closure.join(', '));
    setError('');
  } catch (err) {
    console.error('Erreur fermeture ε:', err.response?.data || err.message);
    setError(err.response?.data.error );
    setResult('');
  }
};
