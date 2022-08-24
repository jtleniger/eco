import { RandomInt } from '../../utilities'
import Prey from '../prey'
import { GeneType, GeneName } from './genes/geneType'
import Gene from './genes/gene'
import World from '../../world'

export class DNA {
  genes: Map<GeneType, Gene>

  constructor(genes: Map<GeneType, Gene>) {
    this.genes = genes
  }

  getValue(geneType: GeneType): number {
    if (!this.genes.has(geneType)) {
      throw Error(`attempted to get non-existent gene ${geneType}`)
    }

    const g = this.genes.get(geneType) as Gene

    return g.value
  }

  mix(other: DNA): DNA {
    const newGenes = new Map()

    this.genes.forEach((gene, type) => {
      const otherGene = other.genes.get(type) as Gene

      newGenes.set(type, gene.mix(otherGene))
    })

    return new DNA(newGenes)
  }

  toString(): string {
    let res = ''

    this.genes.forEach((v, k) => {
      const name = GeneName.get(k) as string
      res += `${name}: ${v.value}\n`
    })

    return res
  }

  static Default(type: string, world: World): DNA {
    switch (type) {
      case typeof Prey:
        return new DNA(
          new Map([
            [GeneType.FoodValue, new Gene(RandomInt(5, 15), 1, 20, world)],
            [GeneType.Full, new Gene(RandomInt(30, 90), 20, 200, world)],
            [GeneType.HuntRange, new Gene(RandomInt(200, 400), 128, 1024, world)],
            [GeneType.MateRange, new Gene(RandomInt(100, 400), 128, 512, world)],
            [GeneType.MateCooldown, new Gene(RandomInt(50, 700), 100, 1000, world)],
            [GeneType.MinFedPercentageToMate, new Gene(RandomInt(60, 90), 55, 100, world)],
            [GeneType.MinAgeToMate, new Gene(RandomInt(10, 35), 5, 100, world)],
            [GeneType.MaxAgeToMate, new Gene(RandomInt(50, 200), 20, 300, world)],
            [GeneType.MaxEnergy, new Gene(RandomInt(4, 16), 1, 32, world)],
            [GeneType.RestTime, new Gene(RandomInt(1, 7), 1, 7, world)],
            [GeneType.MaxAge, new Gene(RandomInt(70, 150), 50, 300, world)],
            [GeneType.MaxStarvation, new Gene(RandomInt(10, 30), 5, 50, world)],
          ])
        )

      default:
        throw Error(`${type} has no DNA default`)
    }
  }
}
