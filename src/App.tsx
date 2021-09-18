import Main from './components/Main'
import {DisplayContextProvider} from './contexts/DisplayContext'
import {GameContextProvider} from './contexts/GameContext'
import {LogContextProvider} from './contexts/LogContext'

function App() {
  return (
    <LogContextProvider>
      <DisplayContextProvider>
        <GameContextProvider>
          <Main />
        </GameContextProvider>
      </DisplayContextProvider>
    </LogContextProvider>
  )
}

export default App
