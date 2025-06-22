
const BasicInfoSection = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-300/30">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 flex items-center justify-center text-sm">ℹ️</span>
        Informations de base
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">Nom de l'automate</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
          placeholder="Ex: Automate de validation"
        />
        {errors.name && <p className="text-red-400 text-sm mt-2 animate-pulse">{errors.name}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm h-24 resize-none"
          placeholder="Décrivez votre automate..."
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-200 mb-2">Type d'automate</label>
        <select
          value={formData.automaton_type}
          onChange={(e) => setFormData({ ...formData, automaton_type: e.target.value })}
          className="w-full p-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
        >
          <option value="DFA" className="bg-gray-800">🔵 Déterministe (DFA)</option>
          <option value="NFA" className="bg-gray-800">🟡 Non Déterministe (NFA)</option>
          <option value="ε-NFA" className="bg-gray-800">🔶 Epsilon-NFA (ε-NFA)</option>
        </select>
      </div>
    </div>
  );
};

export default BasicInfoSection;
