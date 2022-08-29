enum State {
  None, // Special state used to denote direction when not in other states, never set
  Resting,
  Hunting,
  Mating,
  Available,
}

export default State
