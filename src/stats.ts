export default class Stats {
  _stats: Map<string, number>

  constructor() {
    this._stats = new Map()
  }

  increment(key: string) {
    if (!this._stats.has(key)) {
      this._stats.set(key, 1)
    } else {
      const old = this._stats.get(key) as number

      this._stats.set(key, old + 1)
    }
  }

  set(key: string, value: number) {
    this._stats.set(key, value)
  }

  get iterator(): IterableIterator<[string, number]> {
    return this._stats.entries()
  }
}
