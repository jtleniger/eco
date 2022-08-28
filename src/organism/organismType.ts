export enum OrganismType {
  Frog,
  Bird,
}

export const OrganismName: Map<OrganismType, String> = new Map([
  [OrganismType.Frog, 'frog'],
  [OrganismType.Bird, 'bird'],
])
