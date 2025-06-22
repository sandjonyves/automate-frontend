
import { handleAddState, handleRemoveState, handleToggleFinalState } from './formHandlers';

const StatesSection = ({ formData, setFormData, newState, setNewState, errors, setErrors }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-300/30">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mr-3 flex items-center justify-center text-sm">⚡</span>
        États
      </h3>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
          className="flex-1 p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
          placeholder="Nom de l'état"
        />
        <button
          type="button"
          onClick={() => handleAddState(formData, setFormData, newState, setNewState, errors, setErrors)}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          ⚡ Ajouter
        </button>
      </div>
      {errors.newState && <p className="text-red-400 text-sm mb-4 animate-pulse">{errors.newState}</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {formData.states.map((state, index) => (
          <span
            key={state}
            className="inline-flex items-center bg-gradient-to-r from-orange-400/20 to-red-400/20 border border-orange-300/50 rounded-full px-4 py-2 text-white font-medium animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {state}
            <button
              type="button"
              onClick={() => handleRemoveState(state, formData, setFormData)}
              className="ml-2 text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              ❌
            </button>
          </span>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">État initial</label>
        <select
          value={formData.initial_state}
          onChange={(e) => setFormData({ ...formData, initial_state: e.target.value })}
          className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-300"
        >
          <option value="" className="bg-gray-800">Sélectionner un état</option>
          {formData.states.map((state) => (
            <option key={state} value={state} className="bg-gray-800">
              🚀 {state}
            </option>
          ))}
        </select>
        {errors.initial_state && <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.initial_state}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-4">États finaux</label>
        <div className="grid grid-cols-2 gap-2">
          {formData.states.map((state) => (
            <label key={state} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.final_states.includes(state)}
                onChange={() => handleToggleFinalState(state, formData, setFormData)}
                className="w-4 h-4 text-orange-500 bg-transparent border-2 border-white/30 rounded focus:ring-orange-400 focus:ring-2"
              />
              <span className="text-white">{state}</span>
            </label>
          ))}
        </div>
        {errors.final_states && <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.final_states}</p>}
      </div>
    </div>
  );
};

export default StatesSection;
