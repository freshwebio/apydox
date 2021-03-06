import { GlobalState } from 'appredux/reducers/global'

/**
 * Loads a portion of persisted redux state from local storage.
 */
export const loadState = (): GlobalState | undefined => {
  try {
    const serialisedState = localStorage.getItem('compendiumState')
    if (!serialisedState) {
      return
    }
    return JSON.parse(serialisedState)
  } catch (err) {
    return
  }
}

/**
 * Saves a portion of redux state to local storage.
 */
export const saveState = (stateToBePersisted: {
  global: { demoMode: boolean }
}): void => {
  try {
    const serialisedState = JSON.stringify(stateToBePersisted)
    localStorage.setItem('compendiumState', serialisedState)
  } catch (err) {
    // Ignore errors when writing to local storage.
  }
}
