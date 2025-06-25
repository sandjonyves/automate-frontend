'use client';

import { useEffect } from "react";

const AutomateList = ({ automates, onConsult }) => {
  useEffect(()=>{
    {console.log(automates)}
  },[])
  if (!automates.length) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Aucun automate trouvé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {automates.map((automate) => (
        
        <div
          key={automate.id}
          className="border rounded-lg shadow-lg p-6 bg-white hover:shadow-xl transition-shadow duration-200"
        >
          <h2 className="text-xl font-semibold mb-2">{automate.name}</h2>
          <p className="text-gray-600 mb-2 truncate">{automate.description || 'Aucune description'}</p>
          <p className="text-sm text-gray-500 mb-4">Type: {automate.automaton_type}</p>
          <button
            onClick={() => onConsult(automate.id)}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Consulter
          </button>
        </div>
      ))}
    </div>
  );
};

export default AutomateList;