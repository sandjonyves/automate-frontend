'use client'

import { useState } from 'react';
import api from '@/app/lib/axios';


const RegexFromEquationsPage = () => {
  const [equations, setEquations] = useState([{ variable: '', equation: '' }]);
  const [variableInitiale, setVariableInitiale] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // Ajouter une nouvelle équation
  const handleAddEquation = () => {
    setEquations([...equations, { variable: '', equation: '' }]);
  };

  // Mettre à jour une équation
  const handleEquationChange = (index, field, value) => {
    const newEquations = [...equations];
    newEquations[index][field] = value;
    setEquations(newEquations);
  };

  // Supprimer une équation
  const handleRemoveEquation = (index) => {
    if (equations.length > 1) {
      setEquations(equations.filter((_, i) => i !== index));
    }
  };

  // Valider et soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    const newErrors = {};

    // Validation
    if (!variableInitiale) {
      newErrors.variableInitiale = 'La variable initiale est requise.';
    }

    const equationObj = {};
    const variables = new Set();
    equations.forEach((eq, index) => {
      if (!eq.variable) {
        newErrors[`variable_${index}`] = 'La variable est requise.';
      }
      if (!eq.equation) {
        newErrors[`equation_${index}`] = 'L\'équation est requise.';
      }
      if (eq.variable && variables.has(eq.variable)) {
        newErrors[`variable_${index}`] = 'La variable doit être unique.';
      }
      if (eq.variable) {
        variables.add(eq.variable);
        equationObj[eq.variable] = eq.equation;
      }
    });

    if (!variables.has(variableInitiale)) {
      newErrors.variableInitiale = 'La variable initiale doit être une des variables définies.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.post('/api/regex/from-equations/', {
        equations: equationObj,
        variable_initiale: variableInitiale,
      });
      console.log(response)
      setResult(response.data.expression_reguliere);
      setErrors({});
    } catch (err) {
      setError(err.response?.data.error || 'Erreur lors de la génération de l\'expression régulière.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Générer une Expression Régulière</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        {/* Équations */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Équations</label>
          {equations.map((eq, index) => (
            <div key={index} className="flex mb-2 items-center">
              <input
                type="text"
                placeholder="Variable (ex: X0)"
                value={eq.variable}
                onChange={(e) => handleEquationChange(index, 'variable', e.target.value)}
                className="p-2 border rounded mr-2 w-1/4"
              />
              <input
                type="text"
                placeholder="Équation (ex: aX1 + bX2)"
                value={eq.equation}
                onChange={(e) => handleEquationChange(index, 'equation', e.target.value)}
                className="p-2 border rounded mr-2 flex-1"
              />
              {equations.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEquation(index)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Supprimer
                </button>
              )}
              <div className="ml-2">
                {errors[`variable_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`variable_${index}`]}</p>
                )}
                {errors[`equation_${index}`] && (
                  <p className="text-red-500 text-sm">{errors[`equation_${index}`]}</p>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddEquation}
            className="bg-green-500 text-white p-2 rounded mt-2"
          >
            Ajouter une équation
          </button>
        </div>

        {/* Variable initiale */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Variable initiale</label>
          <input
            type="text"
            placeholder="Variable initiale (ex: X0)"
            value={variableInitiale}
            onChange={(e) => setVariableInitiale(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
          {errors.variableInitiale && (
            <p className="text-red-500 text-sm">{errors.variableInitiale}</p>
          )}
        </div>

        {/* Bouton de soumission */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Générer
        </button>
      </form>

      {/* Résultat ou erreur */}
      {result && (
        <div className="mt-4 p-4  rounded">
          <h2 className="text-lg font-semibold">Expression Régulière</h2>
          <p>{result}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};

export default RegexFromEquationsPage;