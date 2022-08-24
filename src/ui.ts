import World from './world'

export default class UI {
  world: World
  stats: HTMLElement

  constructor(world: World) {
    this.world = world
    const speed = document.getElementById('speed') as HTMLInputElement
    speed.oninput = () => {
      world.speed.set(parseInt(speed.value) / 100)
    }
    this.stats = document.getElementById('stats') as HTMLElement
  }

  update(): void {
    let statsString = ''

    this.world.stats.forEach((v, k) => {
      statsString += `${k}: ${v}\n`
    })

    this.stats.innerText = statsString
  }
}
