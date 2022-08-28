export enum OrganismType {
  Prey,
  Bird,
}

export const OrganismName: Map<OrganismType, String> = new Map([
  [OrganismType.Prey, 'frog'],
  [OrganismType.Bird, 'bird'],
])
