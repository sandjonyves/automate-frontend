'use client';
import { useEffect, useRef, useState } from 'react';

const GraphViewer = ({ graph, automate }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

useEffect(() => {
  if (!graph || !graph.nodes || !graph.edges || !containerRef.current) return;

  import('vis-network/standalone').then((vis) => {
    const { Network } = vis;

    const nodes = graph.nodes.map((node) => {
      const isInitial = automate?.initial_state === node.id;
      const isFinal = automate?.final_states?.includes(node.id);

      return {
        id: node.id,
        label: node.label,
        shape: 'circle',
        size: 50,
        font: {
          size: 18,
          color: '#FFFFFF',
          face: 'Inter, sans-serif',
          bold: true
        },
        color: {
          background: 'rgba(6,4,0,1)',
          border: isInitial && isFinal
            ? 'white'
            : isInitial
            ? '#10B981'
            : isFinal
            ? '#EF4444'
            : '#1E40AF'
        },
        borderWidth: 3,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.3)',
          size: 10,
          x: 2,
          y: 2
        },
        margin: 20
      };
    });

    // ➕ Ajout du comptage pour éviter chevauchement
    const edgeCountMap = {};
    graph.edges.forEach((edge) => {
      const key = `${edge.from}->${edge.to}`;
      edgeCountMap[key] = (edgeCountMap[key] || 0) + 1;
    });

    const seen = {};

    const edges = graph.edges.map((edge, index) => {
      const key = `${edge.from}->${edge.to}`;
      const count = edgeCountMap[key];
      seen[key] = (seen[key] || 0) + 1;

      const curveTypes = ['curvedCW', 'curvedCCW', 'discrete'];
      const curveType = curveTypes[(seen[key] - 1) % curveTypes.length];
      const roundness = 0.2 + ((seen[key] - 1) * 0.2);

      return {
        id: `edge_${index}`,
        from: edge.from,
        to: edge.to,
        label: edge.label,
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1.2,
            type: 'arrow'
          }
        },
        font: {
          size: 20,
          color: '#FFFFFF',
          strokeWidth: 0,
          face: 'Inter, sans-serif',
          bold: true,
          align: 'middle'
        },
        color: {
          color: '#A855F7'
        },
        width: 2,
        smooth: {
          type: curveType,
          roundness: roundness
        },
        shadow: {
          enabled: true,
          color: 'rgba(168, 85, 247, 0.3)',
          size: 5,
          x: 1,
          y: 1
        }
      };
    });

    const data = { nodes, edges };

    const options = {
      layout: { hierarchical: { enabled: false } },
      edges: {
        font: { size: 12 },
        smooth: { type: 'curvedCW', roundness: 0.3 },
        chosen: false
      },
      nodes: {
        chosen: false
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200,
          fit: true
        },
        barnesHut: {
          gravitationalConstant: -4000,
          centralGravity: 0.1,
          springLength: 300,
          springConstant: 0.02,
          damping: 0.15,
          avoidOverlap: 1
        },
        solver: 'barnesHut',
        timestep: 0.35,
        adaptiveTimestep: true
      },
      interaction: {
        hover: false,
        tooltipDelay: 0,
        selectable: false,
        dragNodes: false,
        dragView: true,
        zoomView: true
      },
      configure: {
        enabled: false
      }
    };

    if (networkRef.current) networkRef.current.destroy();

    networkRef.current = new Network(containerRef.current, data, options);

    networkRef.current.once('stabilizationIterationsDone', () => {
      setTimeout(() => {
        networkRef.current?.fit({
          animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
        });
      }, 100);
    });
  });

  return () => {
    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }
  };
}, [graph, automate]);



  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      networkRef.current?.fit();
    }, 100);
  };

  const resetView = () => {
    networkRef.current?.fit({
      animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
    });
  };

  // 🆕 Fonction pour redistribuer les nœuds
  const redistributeNodes = () => {
    if (networkRef.current) {
      // Réinitialise la physique pour redistribuer
      networkRef.current.setOptions({
        physics: {
          enabled: true,
          stabilization: { iterations: 100 }
        }
      });
      
      // Secoue légèrement les positions
      const nodeIds = networkRef.current.getNodeIds();
      const updates = nodeIds.map(id => {
        const pos = networkRef.current.getPosition(id);
        return {
          id: id,
          x: pos.x + (Math.random() - 0.5) * 100,
          y: pos.y + (Math.random() - 0.5) * 100
        };
      });
      
      networkRef.current.moveNode(updates);
      
      setTimeout(() => {
        networkRef.current?.fit({
          animation: { duration: 1500, easingFunction: 'easeInOutQuad' }
        });
      }, 500);
    }
  };

const exportGraph = () => {
  if (!networkRef.current) {
    console.error('networkRef is not available');
    return;
  }

  try {
    // Accéder directement au canvas de vis.js
    const canvas = networkRef.current.canvas.frame.canvas; // Structure courante pour vis.js
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error('Canvas element is not valid');
      return;
    }

    const link = document.createElement('a');
    link.download = `automate_${automate?.name || 'graph'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    link.remove(); // Nettoyage
  } catch (error) {
    console.error('Error exporting graph:', error);
  }
};

  if (!graph || !graph.nodes || !graph.edges) {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 border border-white/20 backdrop-blur-lg">
        <div className="text-center p-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-2xl font-bold text-white mb-2">Aucun automate à visualiser</h3>
          <p className="text-gray-300">Créez votre premier automate pour voir sa représentation graphique !</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl border border-white/20 backdrop-blur-lg transition-all duration-500 ${isFullscreen ? 'fixed inset-4 z-50' : 'relative'}`}>
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">🎯</div>
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Visualisation de l'automate</h2>
              <p className="text-gray-300">
                {automate?.name || 'Automate'} • {graph.nodes.length} états • {graph.edges.length} transitions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={resetView} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:scale-105 transition-transform">
              🎯 Centrer
            </button>
            {/* <button onClick={redistributeNodes} className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:scale-105 transition-transform">
              🔄 Redistribuer
            </button> */}
            <button onClick={exportGraph} className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:scale-105 transition-transform">
              📸 Exporter
            </button>
            <button onClick={toggleFullscreen} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:scale-105 transition-transform">
              {isFullscreen ? '📱 Réduire' : '🖥️ Agrandir'}
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div 
          ref={containerRef}
          className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-b-3xl border-t border-white/10"
          style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '700px' }} // 🔄 Augmenté de 600px à 700px
        />

        {/* Légende */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <h4 className="text-white font-bold mb-3 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-2 flex items-center justify-center text-xs">ℹ️</span>
            Légende
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-green-600"></div>
              <span className="text-gray-200">État initial</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-red-600"></div>
              <span className="text-gray-200">État final</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-blue-600"></div>
              <span className="text-gray-200">État normal</span>
            </div>
             <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white rounded-full border-2 border-white"></div>
              <span className="text-gray-200">État initial et final</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded"></div>
              <span className="text-gray-200">Transition</span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <h4 className="text-white font-bold mb-3 flex items-center">
            <span className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mr-2 flex items-center justify-center text-xs">📈</span>
            Statistiques
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{graph.nodes.length}</div>
              <div className="text-gray-300">États</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{graph.edges.length}</div>
              <div className="text-gray-300">Transitions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{automate?.final_states?.length || 0}</div>
              <div className="text-gray-300">Finaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{automate?.alphabet?.length || 0}</div>
              <div className="text-gray-300">Symboles</div>
            </div>
          </div>
        </div>


        
      </div>
    </div>
  );
};

export default GraphViewer;