
import { handleAddSymbole, handleRemoveSymbole } from './formHandlers';

const AlphabetSection = ({ formData, setFormData, newSymbole, setNewSymbole, errors, setErrors }) => {
  return (
    <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl p-6 border border-green-300/30">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-400 rounded-full mr-3 flex items-center justify-center text-sm">Σ</span>
        Alphabet
      </h3>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={newSymbole}
          onChange={(e) => setNewSymbole(e.target.value)}
          maxLength={10}
          className="flex-1 p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
          placeholder="Nouveau symbole"
        />
        <button
          type="button"
          onClick={() => handleAddSymbole(formData, setFormData, newSymbole, setNewSymbole, errors, setErrors)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          ✨ Ajouter
        </button>
      </div>
      {errors.newSymbole && <p className="text-red-400 text-sm mb-4 animate-pulse">{errors.newSymbole}</p>}

      <div className="flex flex-wrap gap-2">
        {formData.alphabet.map((symbole, index) => (
          <span
            key={symbole}
            className="inline-flex items-center bg-gradient-to-r from-green-400/20 to-teal-400/20 border border-green-300/50 rounded-full px-4 py-2 text-white font-medium animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {symbole}
            <button
              type="button"
              onClick={() => handleRemoveSymbole(symbole, formData, setFormData)}
              className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              ❌
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AlphabetSection;
