import api from '@/app/lib/axios';

export const handleConvertToRegex = async (id, setError) => {
  try {
    const response = await api.post(`/api/automates/${id}/to-regex/`);
    alert(`Expression régulière : ${response.data.regex}`);
    console.log(`Expression régulière : ${response.data.regex}`);
    setError('');
  } catch (err) {
    setError(err.response?.data.error);
  }
};