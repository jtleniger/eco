export const enum GeneType {
  FoodValue,
  Full,
  HuntRange,
  MateRange,
  MateCooldown,
  MinFedToMate,
  MinAgeToMate,
  MaxAgeToMate,
  MaxEnergy,
  RestTime,
  MaxAge,
  MaxStarvation,
}

export const GeneName: Map<GeneType, String> = new Map([
  [GeneType.FoodValue, 'food value'],
  [GeneType.Full, 'full stomach'],
  [GeneType.HuntRange, 'hunt range'],
  [GeneType.MateRange, 'mating range'],
  [GeneType.MateCooldown, 'mating cooldown'],
  [GeneType.MinFedToMate, 'minFedToMate'],
  [GeneType.MinAgeToMate, 'minAgeToMate'],
  [GeneType.MaxAgeToMate, 'maxAgeToMate'],
  [GeneType.MaxEnergy, 'max energy'],
  [GeneType.RestTime, 'rest time'],
  [GeneType.MaxAge, 'max age'],
  [GeneType.MaxStarvation, 'max starvation'],
])
