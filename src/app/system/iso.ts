// Géométrie de l'architecture, sans dépendance à Three.js : partagée par la scène WebGL et le repli SVG.
import { SceneConfig, SceneLink, SceneNode, Vec3 } from '../core/models';

/** Hauteur des liens au-dessus du sol (au-dessus de la grille, sous les volumes). */
export const LINK_Y = 0.04;

/** Cadre à afficher (unités monde, projetées) : la scène entière tient dans ce rectangle. */
export const FIT = { halfW: 6.7, halfH: 3.9 };

/** Projection isométrique vraie (caméra dans la direction (1, 1, 1)) → écran, y vers le bas. */
export function isoProject([x, y, z]: Vec3): [number, number] {
  return [(x - z) / Math.SQRT2, (x + z - 2 * y) / Math.sqrt(6)];
}

/** Tracé « circuit imprimé » d'un lien : segments orthogonaux au sol, d'un centre de nœud à l'autre. */
export function linkRoute(link: SceneLink, nodes: Map<string, SceneNode>): Vec3[] {
  const a = nodes.get(link.from);
  const b = nodes.get(link.to);
  if (!a || !b) return [];
  const pts: [number, number][] = [a.position, ...(link.via ?? [])];
  const [lx, lz] = pts[pts.length - 1];
  const [bx, bz] = b.position;
  pts.push(link.route === 'xz' ? [bx, lz] : [lx, bz], [bx, bz]);
  const unique = pts.filter(
    (p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-6,
  );
  return unique.map(([x, z]) => [x, LINK_Y, z]);
}

export function nodeMap(config: SceneConfig): Map<string, SceneNode> {
  return new Map(config.nodes.map((n) => [n.id, n]));
}

/** Point d'ancrage de l'étiquette d'un nœud (au-dessus du volume). */
export function labelAnchor(node: SceneNode): Vec3 {
  const [dx, dz] = node.labelOffset ?? [0, 0];
  return [node.position[0] + dx, node.size[1] + 0.28, node.position[1] + dz];
}
