import World from '../../../world'

export default class Gene {
  value: number
  minValue: number
  maxValue: number
  private readonly world: World

  constructor(value: number, minValue: number, maxValue: number, world: World) {
    this.value = value
    this.minValue = minValue
    this.maxValue = maxValue
    this.world = world
  }

  mix(other: Gene): Gene {
    const useThis = Math.random() > 0.5
    const mutate = Math.random() > 0.9

    let newValue = useThis ? this.value : other.value

    if (mutate) {
      if (!this.world.stats.has('mutations')) {
        this.world.stats.set('mutations', 1)
      } else {
        const old = this.world.stats.get('mutations') as number

        this.world.stats.set('mutations', old + 1)
      }

      const positive = Math.random() > 0.5
      const magnitude = Math.pow(Math.random(), 2)

      const range = this.maxValue - this.minValue

      const delta = range * magnitude * (positive ? 1 : -1)

      newValue += delta
    }

    if (newValue > this.maxValue) {
      newValue = this.maxValue
    }

    if (newValue < this.minValue) {
      newValue = this.minValue
    }

    return new Gene(this.minValue, this.maxValue, newValue, this.world)
  }
}
