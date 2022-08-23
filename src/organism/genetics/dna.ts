import { RandomInt } from '../../utilities'
import Prey from '../prey'
import { GeneType, GeneName } from './genes/geneType'
import Gene from './genes/gene'

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

  static Default(type: string): DNA {
    switch (type) {
      case typeof Prey:
        return new DNA(
          new Map([
            [GeneType.FoodValue, new Gene(5, 5, 5)],
            [GeneType.Full, new Gene(40, 40, 40)],
            [GeneType.HuntRange, new Gene(256, 5, 5)],
            [GeneType.MateRange, new Gene(256, 0, 0)],
            [GeneType.MateCooldown, new Gene(500, 0, 0)],
            [GeneType.MinFedToMate, new Gene(RandomInt(10, 30), 0, 0)],
            [GeneType.MinAgeToMate, new Gene(RandomInt(3, 20), 0, 0)],
            [GeneType.MaxAgeToMate, new Gene(RandomInt(20, 60), 0, 0)],
            [GeneType.MaxEnergy, new Gene(RandomInt(100, 300), 0, 0)],
            [GeneType.RestTime, new Gene(RandomInt(1, 7), 0, 0)],
            [GeneType.MaxAge, new Gene(RandomInt(70, 120), 0, 0)],
            [GeneType.MaxStarvation, new Gene(RandomInt(10, 30), 0, 0)],
          ])
        )

      default:
        throw Error(`${type} has no DNA default`)
    }
  }
}
