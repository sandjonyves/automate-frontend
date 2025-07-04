
import { handleCreateAutomate } from '@/app/services/createService';
import { generateGraph } from '@/app/services/utils';

export const handleAddSymbole = (
  formData,
  setFormData,
  newSymbole,
  setNewSymbole,
  errors,
  setErrors
) => {
  let symbole = newSymbole.trim() === '' ? 'ε' : newSymbole.trim(); // ⬅️ vide devient 'ε'

  if (formData.alphabet.includes(symbole)) {
    setErrors({ ...errors, newSymbole: 'Ce symbole existe déjà.' });
    return;
  }

  setFormData({ ...formData, alphabet: [...formData.alphabet, symbole] });
  setNewSymbole('');
  setErrors({ ...errors, newSymbole: '' });
};


export const handleRemoveSymbole = (symbole, formData, setFormData) => {
  setFormData({
    ...formData,
    alphabet: formData.alphabet.filter((s) => s !== symbole),
    transitions: Object.fromEntries(
      Object.entries(formData.transitions).map(([state, trans]) => [
        state,
        Object.fromEntries(Object.entries(trans).filter(([s]) => s !== symbole)),
      ])
    ),
  });
};

export const handleAddState = (formData, setFormData, newState, setNewState, errors, setErrors) => {
  if (!newState) return;
  if (formData.states.includes(newState)) {
    setErrors({ ...errors, newState: 'Cet état existe déjà.' });
    return;
  }
  setFormData({ ...formData, states: [...formData.states, newState] });
  setNewState('');
  setErrors({ ...errors, newState: '' });
};

export const handleRemoveState = (state, formData, setFormData) => {
  setFormData({
    ...formData,
    states: formData.states.filter((s) => s !== state),
    initial_state: formData.initial_state === state ? '' : formData.initial_state,
    final_states: formData.final_states.filter((s) => s !== state),
    transitions: Object.fromEntries(
      Object.entries(formData.transitions).filter(([s]) => s !== state)
    ),
  });
};

export const handleToggleFinalState = (state, formData, setFormData) => {
  setFormData({
    ...formData,
    final_states: formData.final_states.includes(state)
      ? formData.final_states.filter((s) => s !== state)
      : [...formData.final_states, state],
  });
};
export const handleAddTransition = (
  formData,
  setFormData,
  newTransition,
  setNewTransition,
  errors,
  setErrors
) => {
  let { source, symbole, destination, isList } = newTransition;

  if (symbole === '') symbole = 'ε'; // considérer vide comme epsilon

  if (!source || symbole === undefined || !destination) return;

  // Validation
  if (!formData.states.includes(source)) {
    setErrors({ ...errors, transitionSource: 'État source invalide.' });
    return;
  }

  if (symbole && !formData.alphabet.includes(symbole) && symbole !== 'ε') {
    setErrors({ ...errors, transitionSymbole: 'Symbole invalide.' });
    return;
  }

  const destinations = isList
    ? destination.split(',').map((d) => d.trim()).filter((d) => d)
    : [destination];

  for (const dest of destinations) {
    if (!formData.states.includes(dest)) {
      setErrors({ ...errors, transitionDestination: `État destination ${dest} invalide.` });
      return;
    }
  }

  const updatedTransitions = { ...formData.transitions };

  if (!updatedTransitions[source]) {
    updatedTransitions[source] = {};
  }

  if (!updatedTransitions[source][symbole]) {
    updatedTransitions[source][symbole] = [];
  }

  updatedTransitions[source][symbole] = Array.from(new Set([
    ...updatedTransitions[source][symbole],
    ...destinations
  ]));

  setFormData({
    ...formData,
    transitions: updatedTransitions
  });

  setNewTransition({
    source: '',
    symbole: '',
    destination: '',
    isList: false
  });
  setErrors({});
};


export const handleRemoveTransition = (source, symbole, formData, setFormData) => {
  const newTransitions = { ...formData.transitions };
  delete newTransitions[source][symbole];
  if (Object.keys(newTransitions[source]).length === 0) {
    delete newTransitions[source];
  }
  setFormData({ ...formData, transitions: newTransitions });
};

export const handleSubmit = async (e, formData, setAutomate,router, setErrors, setIsSubmitting) => {
    
  e.preventDefault();
  const newErrors = {};

//   if (!formData.name) newErrors.name = 'Le nom est requis.';
//   if (!formData.initial_state) newErrors.initial_state = "L'état initial est requis.";
//   if (!formData.states.includes(formData.initial_state)) {
//     newErrors.initial_state = "L'état initial doit être dans la liste des états.";
//   }

  for (const f of formData.final_states) {
    if (!formData.states.includes(f)) {
      newErrors.final_states = `L'état final ${f} n'est pas dans la liste des états.`;
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  const payload = {
    automaton_type: formData.automaton_type,
    name: formData.name,
    description: formData.description,
    states: formData.states,
    initial_state: formData.initial_state,
    final_states: formData.final_states,
    alphabet: formData.alphabet,
    transitions: formData.transitions,
  };

  setIsSubmitting(true);
  try {
    const response = await handleCreateAutomate(payload);
    console.log(response)
    router.push(`/pages/automates/${response.data.id}`)
        // console.log(response)
    //   setAutomate(response.data);
      
    //   setGraph(generateGraph(response.data.states, response.data.transitions));
    //   setErrors({});
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'automate:', error);
    setErrors({
      submit: error.response?.data?.detail || 'Erreur lors de la création de l\'automate. Veuillez réessayer.',
    });
  } finally {
    setIsSubmitting(false);
  }
};
