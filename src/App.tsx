import Main from './components/Main'
import {DisplayContextProvider} from './contexts/DisplayContext'
import {GameContextProvider} from './contexts/GameContext'
import {LogContextProvider} from './contexts/LogContext'
import {ThemeContextProvider} from './contexts/ThemeContext'

function App() {
  return (
    <LogContextProvider>
      <DisplayContextProvider>
        <GameContextProvider>
          <ThemeContextProvider>
            <Main />
          </ThemeContextProvider>
        </GameContextProvider>
      </DisplayContextProvider>
    </LogContextProvider>
  )
}

export default App
