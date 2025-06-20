'use client'

import { useState } from 'react';
import AutomateForm from '../../../components/automates/AutomateForm';
import GraphViewer from '../../../components/automates/GraphViewer';
import AutomateLoader from '../../../components/automates/AutomateLoader';


const AutomataPage = () => {
  const [automate, setAutomate] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Automates</h1>
      <AutomateForm setAutomate={(data) => {
        setAutomate(data);
        setGraph({
          nodes: data.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
          edges: Object.entries(data.transitions).flatMap(([source, trans]) =>
            Object.entries(trans).map(([symbole, dest]) => ({
              from: source,
              to: Array.isArray(dest) ? dest[0] : dest, // Simplification pour la visualisation
              label: symbole || 'ε',
              arrows: 'to',
            }))
          ),
        });
      }} />
      {automate && <GraphViewer graph={graph} />}
      <AutomateLoader setAutomate={(data) => {
        setAutomate(data);
        setGraph({
          nodes: data.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
          edges: Object.entries(data.transitions).flatMap(([source, trans]) =>
            Object.entries(trans).map(([symbole, dest]) => ({
              from: source,
              to: Array.isArray(dest) ? dest[0] : dest, // Simplification pour la visualisation
              label: symbole || 'ε',
              arrows: 'to',
            }))
          ),
        });
      }} />
    </div>
  );
};

export default AutomataPage;