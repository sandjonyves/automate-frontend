
import { handleAddTransition, handleRemoveTransition } from './formHandlers';

const TransitionsSection = ({ formData, setFormData, newTransition, setNewTransition, errors, setErrors }) => {
  return (
    <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-300/30">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mr-3 flex items-center justify-center text-sm">🔄</span>
        Transitions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <select
          value={newTransition.source}
          onChange={(e) => setNewTransition({ ...newTransition, source: e.target.value })}
          className="p-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
        >
          <option value="" className="bg-gray-800">État source</option>
          {formData.states.map((state) => (
            <option key={state} value={state} className="bg-gray-800">
              {state}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={newTransition.symbole}
          onChange={(e) => setNewTransition({ ...newTransition, symbole: e.target.value })}
          placeholder="Symbole (ou ε)"
          maxLength={10}
          className="p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
        />

        <input
          type="text"
          value={newTransition.destination}
          onChange={(e) => setNewTransition({ ...newTransition, destination: e.target.value })}
          placeholder={newTransition.isList ? 'Destinations (séparées par des virgules)' : 'État destination'}
          className="p-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
        />

        <button
          type="button"
          onClick={() => handleAddTransition(formData, setFormData, newTransition, setNewTransition, errors, setErrors)}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          🔄 Ajouter
        </button>
      </div>

      <div className="mb-6">
        <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
          <input
            type="checkbox"
            checked={newTransition.isList}
            onChange={(e) => setNewTransition({ ...newTransition, isList: e.target.checked })}
            className="w-4 h-4 text-purple-500 bg-transparent border-2 border-white/30 rounded focus:ring-purple-400 focus:ring-2"
          />
          <span className="text-white">Destination multiple (NFA/ε-NFA)</span>
        </label>
      </div>

      {(errors.transitionSource || errors.transitionSymbole || errors.transitionDestination) && (
        <div className="mb-4 space-y-1">
          {errors.transitionSource && <p className="text-red-400 text-sm animate-pulse">{errors.transitionSource}</p>}
          {errors.transitionSymbole && <p className="text-red-400 text-sm animate-pulse">{errors.transitionSymbole}</p>}
          {errors.transitionDestination && <p className="text-red-400 text-sm animate-pulse">{errors.transitionDestination}</p>}
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(formData.transitions).map(([source, trans]) =>
          Object.entries(trans).map(([symbole, dest], index) => (
            <div key={`${source}-${symbole}`} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-400/10 to-pink-400/10 border border-purple-300/30 rounded-xl animate-fadeIn">
              <span className="text-white font-medium">
                <span className="text-purple-300">{source}</span>
                <span className="mx-2 text-gray-400">--</span>
                <span className="text-pink-300">{symbole || 'ε'}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="text-cyan-300">{Array.isArray(dest) ? dest.join(', ') : dest}</span>
              </span>
              <button
                type="button"
                onClick={() => handleRemoveTransition(source, symbole, formData, setFormData)}
                className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 hover:bg-red-400/10 rounded-lg"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransitionsSection;
