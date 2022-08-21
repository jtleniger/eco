abstract class Optional<T> {
  abstract get HasValue(): boolean
  abstract get Value(): T
  abstract get IsEmpty(): boolean
  static None<T>(): Optional<T> {
    return new None()
  }

  static Of<T>(t: T): Optional<T> {
    return new Value<T>(t)
  }

  Map<V>(fn: (value: T) => V): Optional<V> {
    if (!this.HasValue) {
      return Optional.None()
    }

    return Optional.Of(fn(this.Value))
  }

  IfHasValue(fn: (value: T) => void): void {
    if (this.HasValue) {
      fn(this.Value)
    }
  }
}

class None<T> extends Optional<T> {
  get HasValue(): boolean {
    return false
  }

  get IsEmpty(): boolean {
    return true
  }

  get Value(): T {
    throw Error('optional has no value')
  }
}

class Value<T> extends Optional<T> {
  value: T

  constructor(value: T) {
    super()
    this.value = value
  }

  get HasValue(): boolean {
    return true
  }

  get IsEmpty(): boolean {
    return false
  }

  get Value(): T {
    return this.value
  }
}

export { Optional, Value, None }
