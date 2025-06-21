import api from '@/app/lib/axios';

export async function handleConcatenate(automateId1, automateId2, setOperationResult, setError) {
  try {
    const response = await api.post('/api/concatenate/', {
      automate_id1: automateId1, // Correction des clés
      automate_id2: automateId2, // Correction des clés
    });
    setOperationResult(response.data);
    return response.data;
  } catch (err) {
    setError(err.response?.data.error || 'Erreur lors de la concaténation des automates.');
    console.error('Concatenation error:', err);
    return null;
  }
}