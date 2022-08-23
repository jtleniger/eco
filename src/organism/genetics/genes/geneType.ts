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
  [GeneType.FoodValue, 'Food Value'],
  [GeneType.Full, 'Full Stomach'],
  [GeneType.HuntRange, 'Hunt Range'],
  [GeneType.MateRange, 'Mating Range'],
  [GeneType.MateCooldown, 'Mating Cooldown'],
  [GeneType.MinFedToMate, 'MinFedToMate'],
  [GeneType.MinAgeToMate, 'MinAgeToMate'],
  [GeneType.MaxAgeToMate, 'MaxAgeToMate'],
  [GeneType.MaxEnergy, 'MaxEnergy'],
  [GeneType.RestTime, 'RestTime'],
  [GeneType.MaxAge, 'MaxAge'],
  [GeneType.MaxStarvation, 'MaxStarvation'],
])
