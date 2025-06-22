
'use client';

import { useState } from 'react';
import BasicInfoSection from './BasicInfoSection';
import AlphabetSection from './AlphabetSection';
import StatesSection from './StatesSection';
import TransitionsSection from './TransitionsSection';
import { handleSubmit } from './formHandlers';
import { fadeInStyles } from './styles';
import { useRouter } from 'next/navigation';



const AutomateForm = ({ setAutomate}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    states: [],
    initial_state: '',
    final_states: [],
    alphabet: [],
    transitions: {},
    automaton_type: 'DFA',
  });
  const [newSymbole, setNewSymbole] = useState('');
  const [newState, setNewState] = useState('');
  const [newTransition, setNewTransition] = useState({
    source: '',
    symbole: '',
    destination: '',
    isList: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 animate-pulse">
            Créateur d'Automates
          </h1>
          <p className="text-xl text-gray-300">Construisez vos automates finis avec style</p>
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <BasicInfoSection
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
              <AlphabetSection
                formData={formData}
                setFormData={setFormData}
                newSymbole={newSymbole}
                setNewSymbole={setNewSymbole}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
            <div className="space-y-6">
              <StatesSection
                formData={formData}
                setFormData={setFormData}
                newState={newState}
                setNewState={setNewState}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
          </div>

          <TransitionsSection
            formData={formData}
            setFormData={setFormData}
            newTransition={newTransition}
            setNewTransition={setNewTransition}
            errors={errors}
            setErrors={setErrors}
          />

          <div className="mt-8 text-center">
            <button
              onClick={(e) => {
                handleSubmit(e, formData, setAutomate, router, setErrors, setIsSubmitting)
                
                
              }}
              disabled={isSubmitting}
              className={`px-12 py-4 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 animate-pulse'
              }`}
            >
              {isSubmitting ? 'Création en cours...' : '✨ Créer l\'Automate ✨'}
            </button>
            {errors.submit && <p className="text-red-400 text-sm mt-4 animate-pulse">{errors.submit}</p>}
          </div>
        </div>
      </div>
      <style jsx>{fadeInStyles}</style>
    </div>
  );
};

export default AutomateForm;
