import api from '@/app/lib/axios';

export const handleDelete = async (id, router, setError) => {
  if (confirm('Voulez-vous vraiment supprimer cet automate ?')) {
    try {
      await api.delete(`/api/automata/${id}/`);
      router.push('/automates');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la suppression.');
    }
  }
};