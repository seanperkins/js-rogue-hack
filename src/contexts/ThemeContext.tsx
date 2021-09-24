import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import {BLACK, LIGHT_GREEN} from '../constants'

interface IThemeContext {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
  getFG: (fg?: string) => string
  getBG: (bg?: string) => string
}

interface Theme {
  fg: string
  bg: string
  overrides: boolean
}

const ThemeContext = createContext<IThemeContext>({} as IThemeContext)

export default ThemeContext

export function ThemeContextProvider({children}) {
  const [theme, setTheme] = useState<Theme>({
    fg: LIGHT_GREEN,
    bg: BLACK,
    overrides: true,
  } as Theme)

  function getFG(fg?: string) {
    return theme.overrides ? theme.fg : fg
  }

  function getBG(bg?: string) {
    return theme.overrides ? theme.bg : bg
  }

  return (
    <ThemeContext.Provider value={{theme, setTheme, getFG, getBG}}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const {theme, setTheme, getFG, getBG} = useContext(ThemeContext)
  return {theme, setTheme, getFG, getBG}
}
