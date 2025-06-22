import api from '@/app/lib/axios';

export const handleCreateAutomate = async (
  data
 
) => {
  try {
    const response = await api.post(`/api/automates/`, data);
   return response
  } catch (error) {
    console.log(error)
    // setError(
    //   error.response?.data?.detail ||
    //   'Erreur lors de la récupération de l\'automate.'
    // );
  }
};
