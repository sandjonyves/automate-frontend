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
      <AutomateForm setAutomate={setAutomate} setGraph={setGraph} />
    
     
    </div>
  );
};

export default AutomataPage;