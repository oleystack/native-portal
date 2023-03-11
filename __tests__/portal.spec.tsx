import * as React from 'react'
import '@testing-library/jest-native/extend-expect';

import { act, render } from '@testing-library/react-native'
import { portal } from '../src/portal'
import { Text } from 'react-native'

test('Basic usage', async () => {
  const Portal = portal()

  const Host = () => {
    return <>
      <Portal.Target testID='target' />
    </>
  }

  const Component = () => {
    return <>
      <Portal.Injector>
        <Text testID='traveler'>Hello!</Text>
      </Portal.Injector>
    </>
  }

  const App = () => (
    <Portal.Provider>
      <Host />
      <Component />
    </Portal.Provider>
  )

  const { findByTestId } = render(<App />)
  
  const target = await findByTestId('target');
  const traveler = await findByTestId('traveler');

  expect(target).toContainElement(traveler)
})
 
test('Dynamic usage', async () => {
  const Portal = portal()

  const Host = () => {
    return <>
      <Portal.Target testID='target' />
    </>
  }

  const Component = () => {
    return <>
      <Portal.Injector>
        <Text testID='traveler'>Hello!</Text>
      </Portal.Injector>
    </>
  }

  let toggle: (host: boolean, component: boolean) => void;

  const App = () => {
    const [hasHost, setHasHost] = React.useState(false)
    const [hasComponent, setHasComponent] = React.useState(false)

    toggle = React.useCallback((host: boolean, component: boolean) => {
      setHasHost(host)
      setHasComponent(component)
    }, [])

    return (
      <Portal.Provider>
        {hasHost && <Host />}
        {hasComponent && <Component />}
      </Portal.Provider>
    )
  }

  const { queryByTestId } = render(<App />)

  expect(await queryByTestId('target')).toBeNull()
  expect(await queryByTestId('traveler')).toBeNull()

  act(() => {
    toggle!(true, false)
  })

  expect(await queryByTestId('target')).toBeEmptyElement()
  expect(await queryByTestId('traveler')).toBeNull()

  act(() => {
    toggle!(true, true)
  })

  expect(await queryByTestId('target')).toContainElement(await queryByTestId('traveler'))

  act(() => {
    toggle!(false, true)
  })

  expect(await queryByTestId('target')).toBeNull()
  expect(await queryByTestId('traveler')).toBeNull()

  act(() => {
    toggle!(true, true)
  })

  expect(await queryByTestId('target')).toContainElement(await queryByTestId('traveler'))

  act(() => {
    toggle!(true, false)
  })

  expect(await queryByTestId('target')).toBeEmptyElement()
  expect(await queryByTestId('traveler')).toBeNull()
})
 
test('Basic usage with names', async () => {
  const Portal = portal('toHeader', 'toFooter')

  const Host = () => {
    return <>
      <Portal.Target testID='target_1' name='toHeader' />
      <Portal.Target testID='target_2' name='toFooter' />
    </>
  }

  const Component = () => {
    return <>
      <Portal.Injector name='toHeader'>
        <Text testID='traveler'>Hello!</Text>
      </Portal.Injector>
    </>
  }

  const App = () => (
    <Portal.Provider>
      <Host />
      <Component />
    </Portal.Provider>
  )

  const { queryByTestId } = render(<App />)
  
  expect(await queryByTestId('target_1')).toContainElement(await queryByTestId('traveler'))
  expect(await queryByTestId('target_2')).toBeEmptyElement()

})