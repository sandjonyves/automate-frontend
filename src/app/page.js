'use client'
import { useState } from 'react';
import Link from 'next/link';
import AutomateForm from './components/automates/AutomateForm';
import GraphViewer from './components/automates/GraphViewer';
import AutomateLoader from './components/automates/AutomateLoader';

export default function AutomataPage() {
  const [showInterface, setShowInterface] = useState(false);
  const [automate, setAutomate] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  const members = [
    { name: "BOUOGNONG MOUOPE STEFAN", id: "23V26V26" },
    { name: "NOSSUPUWO MAZE TASSA OLIVE", id: "22Y1027" },
    { name: "KOUGOUM FOTSING PAVEL", id: "21T2887" },
    { name: "KUETE NZEMTCHOU LORINE SANDRA", id: "22Y1040" },
    { name: "GOUJOU GUIMATSA ZIDANE", id: "21T2899" },
    { name: "MAFFO NGALEU Laetitia", id: "21T2413" },
    { name: "KEMAJOU KOUAGO Steve Anderson", id: "21T2640" },
    { name: "MIKAM DEUGWÉ TRACY-JOLICA", id: "22Y1035" },
    { name: "Wirngo Obed Bonglav", id: "21T2699" },
    { name: "BOUZAP FLORA SANDRA", id: "22U2059" },
    { name: "DJAPANA TINDI CLAIRE ORNELA", id: "21T2438" },
    { name: "NGONGANG NANA LEA", id: "21T2318" },
    { name: "WOUATHOU SANDJON FORTNEY YVES", id: "22T2922" },
    { name: "MISSAKO BELL JOYCE CINDY", id: "21T2445" },
    { name: "MAHACHU FONGANG Aurelie Graciane", id: "22T2924" },
    { name: "TSAKEM KENGNE DJOUELA JACK KEVIN", id: "21T2526" },
    { name: "DONGMO GATSI REINE", id: "21U2391" },
    { name: "BOKOU BOUNA ANGE LARISSA", id: "22W2188" },
    { name: "NANGMO FEULFACK ANNICK DUPLESSE", id: "21S2530" },
    { name: "TCHATCHOUANG DJAMPOU Olivier Nabil", id: "21T2545" }
  ];

  // Page d'accueil stylisée
  if (!showInterface) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Éléments de fond animés */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="max-w-6xl mx-auto text-center">
            {/* Titre principal */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-4">
                AUTOMATES 
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full mb-4"></div>
              <p className="text-xl text-blue-200 font-light">
                Travaux Pratiques - INF342
              </p>
            </div>

            {/* Carte principale */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl max-w-5xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-lg">
                    👥
                  </span>
                  Membres du Groupe
                </h2>
                
                {/* Grille des membres avec scroll */}
                <div className="max-h-80 overflow-y-auto pr-2 mb-8" style={{scrollbarWidth: 'thin', scrollbarColor: '#60a5fa #ffffff20'}}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {members.map((member, index) => (
                      <div 
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        <div className="text-white font-medium text-sm mb-1 leading-tight">
                          {member.name}
                        </div>
                        <div className="text-blue-200 text-xs font-mono">
                          {member.id}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/pages/automates/create">
                <button
                  
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Commencer l'Application
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
                <Link href="/pages/automates/">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50">
                    <span className="relative z-10 flex items-center gap-2">
                      Voir les Automates
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-blue-200/70 text-sm">
                Université de Yaoundé I - NIVEAU 3 INFORMATIQUE
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interface principale
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gestion des Automates</h1>
        <button
          onClick={() => setShowInterface(false)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          ← Retour à l'accueil
        </button>
      </div>
      
      <AutomateForm setAutomate={(data) => {
        setAutomate(data);
        setGraph({
          nodes: data.states.map((state) => ({ id: state, label: state, shape: 'circle' })),
          edges: Object.entries(data.transitions).flatMap(([source, trans]) =>
            Object.entries(trans).map(([symbole, dest]) => ({
              from: source,
              to: Array.isArray(dest) ? dest[0] : dest,
              label: symbole || 'ε',
              arrows: 'to',
            }))
          ),
        });
      }} />
      
      {automate && <GraphViewer graph={graph} />}
      
     
    </div>
  );
}