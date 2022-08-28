import { OrganismType } from '@/organism/organismType'
import { GeneType } from './geneType'

export default class Metadata {
  readonly type: GeneType
  readonly min: number
  readonly max: number
  readonly spawnMin: number
  readonly spawnMax: number

  constructor(type: GeneType, min: number, max: number, spawnMin: number, spawnMax: number) {
    this.type = type
    this.min = min
    this.max = max
    this.spawnMin = spawnMin
    this.spawnMax = spawnMax
  }
}

export function forOrganism(type: OrganismType): Map<GeneType, Metadata> {
  switch (type) {
    case OrganismType.Frog:
      return new Map([
        [GeneType.FoodValue, new Metadata(GeneType.FoodValue, 1, 20, 5, 15)],
        [GeneType.Full, new Metadata(GeneType.Full, 20, 200, 30, 90)],
        [GeneType.HuntRange, new Metadata(GeneType.HuntRange, 128, 1024, 200, 400)],
        [GeneType.MateRange, new Metadata(GeneType.MateRange, 128, 512, 100, 400)],
        [GeneType.MateCooldown, new Metadata(GeneType.MateCooldown, 100, 1000, 50, 700)],
        [
          GeneType.MinFedPercentageToMate,
          new Metadata(GeneType.MinFedPercentageToMate, 55, 100, 60, 90),
        ],
        [GeneType.MinAgeToMate, new Metadata(GeneType.MinAgeToMate, 5, 100, 10, 35)],
        [GeneType.MaxAgeToMate, new Metadata(GeneType.MaxAgeToMate, 20, 300, 50, 200)],
        [GeneType.MaxEnergy, new Metadata(GeneType.MaxEnergy, 1, 32, 4, 16)],
        [GeneType.RestTime, new Metadata(GeneType.RestTime, 1, 7, 1, 7)],
        [GeneType.MaxAge, new Metadata(GeneType.MaxAge, 50, 300, 70, 150)],
        [GeneType.MaxStarvation, new Metadata(GeneType.MaxStarvation, 5, 50, 10, 30)],
      ])

    case OrganismType.Bird:
      return new Map([
        [GeneType.FoodValue, new Metadata(GeneType.FoodValue, 0, 0, 0, 0)],
        [GeneType.Full, new Metadata(GeneType.Full, 0, 0, 0, 0)],
        [GeneType.HuntRange, new Metadata(GeneType.HuntRange, 0, 0, 0, 0)],
        [GeneType.MateRange, new Metadata(GeneType.MateRange, 0, 0, 0, 0)],
        [GeneType.MateCooldown, new Metadata(GeneType.MateCooldown, 0, 0, 0, 0)],
        [
          GeneType.MinFedPercentageToMate,
          new Metadata(GeneType.MinFedPercentageToMate, 0, 0, 0, 0),
        ],
        [GeneType.MinAgeToMate, new Metadata(GeneType.MinAgeToMate, 0, 0, 0, 0)],
        [GeneType.MaxAgeToMate, new Metadata(GeneType.MaxAgeToMate, 0, 0, 0, 0)],
        [GeneType.MaxEnergy, new Metadata(GeneType.MaxEnergy, 0, 0, 0, 0)],
        [GeneType.RestTime, new Metadata(GeneType.RestTime, 0, 0, 0, 0)],
        [GeneType.MaxAge, new Metadata(GeneType.MaxAge, 0, 0, 0, 0)],
        [GeneType.MaxStarvation, new Metadata(GeneType.MaxStarvation, 0, 0, 0, 0)],
      ])
    default:
      throw Error(`${type} has no DNA metadata defined`)
  }
}
