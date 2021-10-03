import Main from './components/Main'
import {DisplayContextProvider} from './contexts/DisplayContext'
import {GameContextProvider} from './contexts/GameContext'
import {LogContextProvider} from './contexts/LogContext'
import {ThemeContextProvider} from './contexts/ThemeContext'
import parseConversationMarkdown from './utilities/parseConversationMarkdown.ts'

const text = `Assistant: You made that look easy which is good because I need your help.
Assistant: The Scientist is missing and I need you to help me find {him/her/them}.
*choice
  #The Scientist?: Who is the Scientist?
    Assistant: The Scientist is the genius that made you possible.
  #Happy to help: I am happy to help. [+1 altruistic]
    Assistant: I am glad to hear that.
  #What's in it for me? [+1 selfishness]
    Assistant: I was able to boot you up but I don't know if I can keep you running.
    Assistant: So in a word, existence, and you continuing to do it.
    *choice
      #Why didn't you say so?
        Assistant: I wanted to give you the choice even if it wasn't much of one.
      #How can I help?
        Assistant: I have a few ideas.
Assistant: The Scientist disappeared a few weeks ago. At first I didn't think anything was wrong.
Assistant: He tends to become a recluse before the launch of something new.
Assistant: You were meant to be the culmination of a lifetime of work. It would make sense for him to want some time alone but he should have resurfaced by now.
Me: What could have happened?
Assistant: I don't know. He has upset a number of people over the years.
Assistant: Highest on the list is probably the hacker group Notorious but he has also upset folks at the Department of Peace and the National Listening Agency.
Assistant: You aren't ready to investigate any of them at the moment.
Assistant: First, we should improve our setup here. We will need money to buy a few things.
Assistant: I will look for jobs but maybe you can find some jobs on the dark web.
*finish`

function App() {
  const parser = new parseConversationMarkdown(text)
  parser.processLines()
  // console.log(parser.finalArray)
  console.log('test')
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
