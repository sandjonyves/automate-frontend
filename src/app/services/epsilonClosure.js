import api from '@/app/lib/axios';

export const handleEpsilonClosure = async (id, stateName, setError) => {
  alert(stateName)
  try {
    const response = await api.get(`/api/automates/${id}/epsilon-closure/${stateName}/`);
    const closure = response.data;
    console.log('Epsilon Closure:', closure);
    alert(`Fermeture epsilon de ${stateName} : ${JSON.stringify(closure, null, 2)}`);
    setError('');
  } catch (err) {
    console.error('Epsilon closure error:', err.response?.data || err.message);
    setError(err.response?.data.error );
  }
};