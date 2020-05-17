import { act } from 'react-test-renderer'

import useCollapsibleView, {
  CollapsibleViewElements,
} from './useCollapsibleView'
import { testHookWithRef } from 'testUtils/testHook'
import delay from 'utils/delay'

describe('useCollapsibleView', (): void => {
  let collapsibleView: CollapsibleViewElements<HTMLDivElement>
  beforeEach((): void => {
    const targetClickElement = document.createElement('div')
    targetClickElement.id = 'clickTargetElement'
    const root = document.getElementById('root')
    if (root) {
      root.appendChild(targetClickElement)
    }
    testHookWithRef((): CollapsibleViewElements<HTMLDivElement> => {
      collapsibleView = useCollapsibleView<HTMLDivElement>()
      return collapsibleView
    }, 'viewRef')
  })

  it('should expose the correct initial showView state', (): void => {
    expect(collapsibleView.showView).toBeFalse()
  })

  it('should expose a callback to set the whether or not to show the view', (): void => {
    expect(collapsibleView.setShowView).toBeFunction()
  })

  it('should expose a ref that can be attached to an element', (): void => {
    expect(collapsibleView.viewRef).toBeDefined()
  })

  it('should update the show view state correctly', (): void => {
    act((): void => {
      collapsibleView.setShowView(true)
    })
    expect(collapsibleView.showView).toBeTrue()
  })

  it('should update the show view state correctly on document click when an element ref is provided', async (): Promise<
    void
  > => {
    act((): void => {
      collapsibleView.setShowView(true)
    })
    expect(collapsibleView.showView).toBeTrue()

    // Wait for the last cycle to complete in updating state and ensuring the latest values are exposed
    // from the custom hook so we don't trigger a document click handler with stale data.
    await act(
      async (): Promise<void> => {
        await delay(200)
      }
    )

    act((): void => {
      const event = new Event('mousedown', { bubbles: true })
      const clickTargetElement = document.getElementById('clickTargetElement')
      if (clickTargetElement) {
        clickTargetElement.dispatchEvent(event)
      }
    })
    expect(collapsibleView.showView).toBeFalse()
  })

  it('should not hide the view on document click when in a blocking state', async (): Promise<
    void
  > => {
    act((): void => {
      collapsibleView.setShowView(true)
      collapsibleView.setBlockingState(true)
    })
    expect(collapsibleView.showView).toBeTrue()
    expect(collapsibleView.blockingState).toBeTrue()

    // Wait for the last cycle to complete in updating state and ensuring the latest values are exposed
    // from the custom hook so we don't trigger a document click handler with stale data.
    await act(
      async (): Promise<void> => {
        await delay(200)
      }
    )

    act((): void => {
      const event = new Event('mousedown', { bubbles: true })
      const clickTargetElement = document.getElementById('clickTargetElement')
      if (clickTargetElement) {
        clickTargetElement.dispatchEvent(event)
      }
    })
    expect(collapsibleView.showView).toBeTrue()
  })

  it('should not update the show view state if the view is already hidden without any problems', async (): Promise<
    void
  > => {
    act((): void => {
      const event = new Event('mousedown', { bubbles: true })
      const clickTargetElement = document.getElementById('clickTargetElement')
      if (clickTargetElement) {
        clickTargetElement.dispatchEvent(event)
      }
    })
    expect(collapsibleView.showView).toBeFalse()
  })
})
