import React, { useReducer } from 'react'
import { View, ViewProps } from 'react-native/types'
import { createContext, useContextSelector } from './context'

const DEFAULT_PORTAL_NAME = 'default'

interface WithPortalNameProps<PortalName> {
  name: PortalName
}

interface GateProps {
  children: React.ReactNode
}

interface HostProps extends ViewProps {
  children?: React.ReactNode
}

interface ProviderProps {
  children?: React.ReactNode
}

export function portal<PortalName extends string>(
  portal: PortalName,
  ...portals: Array<PortalName>
): {
  Provider: React.FC<ProviderProps>
  Gate: React.FC<GateProps & WithPortalNameProps<PortalName>>
  Host: React.FC<HostProps & WithPortalNameProps<PortalName>>
}

export function portal(): {
  Provider: React.FC<ProviderProps>
  Gate: React.FC<GateProps>
  Host: React.FC<HostProps>
}

export function portal(portals = [DEFAULT_PORTAL_NAME]) {
  type PortalName = typeof portals[number]

  type Portals<PortalName extends string> = {
    [key in PortalName]?: React.ReactNode[]
  }

  type PortalRecord = {
    name: string
    children: React.ReactNode
  }

  type DispatcherAction = {
    type: 'add' | 'remove'
    payload: PortalRecord
  }

  type PortalState = {
    portals: Portals<PortalName>
    dispatch: React.Dispatch<DispatcherAction>
  }

  const context = createContext<PortalState>({} as PortalState)

  const Provider: React.FC<ProviderProps> = ({ children }) => {
    const [portals, dispatch] = useReducer(
      (portals: Portals<PortalName>, action: DispatcherAction) => {
        switch (action.type) {
          case 'add':
            return {
              ...portals,
              // Add the new portal to the beginning of the array
              [action.payload.name]: [
                action.payload.children,
                ...(portals[action.payload.name] ?? [])
              ]
            }
          case 'remove': {
            const newPortals = {
              ...portals,
              [action.payload.name]: portals[action.payload.name]?.filter(
                (value) => value !== action.payload.children
              )
            }

            // Remove the portal name if there are no more portals (edge case)
            if (newPortals[action.payload.name]?.length === 0) {
              delete newPortals[action.payload.name]
            }

            return newPortals
          }
          default:
            return portals
        }
      },
      {} as Portals<PortalName>
    )

    return React.createElement(
      context.Provider,
      { value: { portals, dispatch } },
      children
    )
  }

  const Gate: React.FC<
    GateProps & Partial<WithPortalNameProps<PortalName>>
  > = ({ name = DEFAULT_PORTAL_NAME, children }) => {
    const dispatch = useContextSelector(context, (state) => state.dispatch)

    React.useEffect(() => {
      dispatch({
        type: 'add',
        payload: {
          name,
          children
        }
      })

      return () => {
        dispatch({
          type: 'remove',
          payload: {
            name,
            children
          }
        })
      }
    }, [name, children, dispatch])

    return null
  }

  const Host: React.FC<
    HostProps & Partial<WithPortalNameProps<PortalName>>
  > = ({ name = DEFAULT_PORTAL_NAME, children, ...props }) => {
    const portal = useContextSelector(
      context,
      (state) => state.portals[name]?.[0]
    )

    return React.createElement(View, props, portal ?? children)
  }

  Provider.displayName = 'BitAboutNativePortal.Provider'
  Gate.displayName = 'BitAboutNativePortal.Gate'
  Host.displayName = 'BitAboutNativePortal.Host'

  return { Provider, Gate, Host }
}
