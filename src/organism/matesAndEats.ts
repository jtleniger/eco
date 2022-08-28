import type Edible from '@/edible'
import type Organism from './organism'
import type Eats from './traits/eats'
import type Mates from './traits/mates'

export default interface MatesAndEats<Food extends Edible> extends Organism {
  eats: Eats<Food>
  mates: Mates<Food>
}
