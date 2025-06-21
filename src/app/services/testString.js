import api from '@/app/lib/axios';

export const handleTestString = async (id, testString, setTestResult, setError) => {
  try {
    const response = await api.post(`/api/automata/${id}/test-string/`, { string: testString });
    setTestResult(response.data.result);
    setError('');
  } catch (err) {
    setError(err.response?.data?.detail || 'Erreur lors du test de la chaîne.');
  }
};