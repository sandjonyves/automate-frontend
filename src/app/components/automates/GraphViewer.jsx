import { useEffect, useRef } from 'react';
import { Network } from 'vis-network/standalone';

const GraphViewer = ({ graph, automate }) => {
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    if (!graph || !graph.nodes || !graph.edges || !containerRef.current) {
      return;
    }

    const nodes = graph.nodes.map((node) => ({
      id: node.id,
      label: node.label,
      shape: 'circle',
      color: {
        background: automate?.initial_state === node.id ? '#34D399' : // Green for initial state
                    automate?.final_states?.includes(node.id) ? '#F87171' : // Red for final states
                    '#60A5FA', // Blue for other states
        border: '#1F2937',
      },
    }));

    const edges = graph.edges.map((edge) => ({
      from: edge.from,
      to: edge.to,
      label: edge.label,
      arrows: 'to',
      font: { size: 12 },
      smooth: { type: 'curvedCW' },
    }));

    const data = { nodes, edges };
    const options = {
      layout: { hierarchical: { direction: 'UD', sortMethod: 'directed' } },
      edges: { font: { size: 12 }, smooth: { type: 'curvedCW' } },
      physics: { enabled: false },
    };

    // Destroy previous instance if it exists
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    // Create new Network instance
    networkRef.current = new Network(containerRef.current, data, options);

    // Cleanup on unmount
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graph, automate]);

  if (!graph || !graph.nodes || !graph.edges) {
    return <div className="text-center p-4">Aucun graphe à afficher</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Visualisation de l'Automate</h2>
      <div ref={containerRef} className="border rounded" style={{ height: '500px' }} />
    </div>
  );
};

export default GraphViewer;