import hoistStatics from 'hoist-non-react-statics'
import invariant from 'tiny-invariant'

import DisplayContext from '../contexts/DisplayContext'

/**
 * A public higher-order component to access the imperative API
 */
function withDisplay(Component) {
  const displayName = `withRouter(${Component.displayName || Component.name})`
  const C = (props) => {
    const {wrappedComponentRef, ...remainingProps} = props

    return (
      <DisplayContext.Consumer>
        {(context) => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Router>`,
          )
          return (
            <Component
              {...remainingProps}
              {...context}
              ref={wrappedComponentRef}
            />
          )
        }}
      </DisplayContext.Consumer>
    )
  }

  C.displayName = displayName
  C.WrappedComponent = Component

  return hoistStatics(C, Component)
}

export default withDisplay
