import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { BusData } from '@/services/websocket.service';

interface NetworkTopologyProps {
  buses: Record<string, BusData>;
}

interface Node {
  id: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  voltage?: number;
  frequency?: number;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

const NetworkTopology = ({ buses }: NetworkTopologyProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 600;
    const height = svgRef.current.clientHeight || 450;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create nodes from buses
    const nodes: Node[] = Object.values(buses).map((bus) => ({
      id: bus.id,
      voltage: bus.voltage_magnitude,
      frequency: bus.frequency,
    }));

    // If no nodes yet, show loading message and return
    if (nodes.length === 0) {
      const svg = d3.select(svgRef.current);
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .text('Waiting for bus data...');
      return;
    }

    // Define links (connections between buses) - 5-bus system topology
    const links: Link[] = [
      { source: 'BUS-001', target: 'BUS-002' },
      { source: 'BUS-001', target: 'BUS-003' },
      { source: 'BUS-002', target: 'BUS-004' },
      { source: 'BUS-003', target: 'BUS-004' },
      { source: 'BUS-003', target: 'BUS-005' },
      { source: 'BUS-004', target: 'BUS-005' },
    ];

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create container group for zooming
    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    simulationRef.current = simulation;

    // Create links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = g
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(
        d3.drag<SVGGElement, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => getNodeColor(d.voltage || 1.0))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node
      .append('text')
      .text((d) => d.id.split('-')[1])
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px');

    // Add voltage labels below nodes
    const voltageLabel = node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.5em')
      .attr('fill', '#666')
      .attr('font-size', '10px');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x || 0)
        .attr('y1', (d) => (d.source as Node).y || 0)
        .attr('x2', (d) => (d.target as Node).x || 0)
        .attr('y2', (d) => (d.target as Node).y || 0);

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Update node colors and labels when bus data changes
    const updateNodes = () => {
      node.select('circle').attr('fill', (d) => getNodeColor(buses[d.id]?.voltage_magnitude || 1.0));

      voltageLabel.text((d) => {
        const bus = buses[d.id];
        return bus ? `${bus.voltage_magnitude.toFixed(3)} pu` : '';
      });
    };

    updateNodes();

    return () => {
      simulation.stop();
    };
  }, [buses]);

  // Update colors when bus data changes (without recreating the whole visualization)
  useEffect(() => {
    if (!svgRef.current || Object.keys(buses).length === 0) return;

    const svg = d3.select(svgRef.current);

    svg
      .selectAll('g > circle')
      .data(Object.values(buses), (d: any) => d.id)
      .attr('fill', (d: any) => getNodeColor(d.voltage_magnitude));

    svg
      .selectAll('g > text')
      .filter(function() {
        return d3.select(this).attr('dy') === '2.5em';
      })
      .data(Object.values(buses), (d: any) => d.id)
      .text((d: any) => `${d.voltage_magnitude.toFixed(3)} pu`);
  }, [buses]);

  const getNodeColor = (voltage: number): string => {
    if (voltage < 0.95) return '#f44336'; // Red - undervoltage
    if (voltage > 1.05) return '#ff9800'; // Orange - overvoltage
    return '#4caf50'; // Green - normal
  };

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fafafa',
      }}
    />
  );
};

export default NetworkTopology;
