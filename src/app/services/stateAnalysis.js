import api from '@/app/lib/axios';

export const handleStateAnalysis = async (id, setError) => {
  try {
    const response = await api.get(`/api/automates/${id}/states-analysis/`);
    const analysis = response.data;
    console.log('State Analysis:', analysis);
    alert(`Analyse des états : ${JSON.stringify(analysis, null, 2)}`);
    setError('');
  } catch (err) {
    console.error('State analysis error:', err.response?.data || err.message);
    setError(err.response?.data?.detail || 'Erreur lors de l\'analyse des états.');
  }
};