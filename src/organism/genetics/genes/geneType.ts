export enum GeneType {
  FoodValue,
  Full,
  HuntRange,
  MateRange,
  MateCooldown,
  MinFedPercentageToMate,
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
  [GeneType.MinFedPercentageToMate, 'min fed to mate'],
  [GeneType.MinAgeToMate, 'min age to mate'],
  [GeneType.MaxAgeToMate, 'max age to mate'],
  [GeneType.MaxEnergy, 'max energy'],
  [GeneType.RestTime, 'rest time'],
  [GeneType.MaxAge, 'max age'],
  [GeneType.MaxStarvation, 'max starvation'],
])
