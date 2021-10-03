import {createContext, useState} from 'react'

interface IConversationContext {}

interface Conversation {}

const ConversationContext = createContext<IConversationContext>(
  {} as IConversationContext,
)

export default ConversationContext

export function ConversationContextProvider({children}) {
  const [currentConversation, setCurrentConversation] = useState<Conversation>()
  const [conversationFunctions, setConversationFunctions] = useState<{
    [funcName: string]: () => void
  }>({})

  function getConversation() {
    // TODO: get conversation from server
    // Parse converation markdown
    // Set current conversation
  }

  function handleChoice() {
    // If a choice modifies game state, make the change here
  }

  function addConversationFunction(funcName, func) {
    setConversationFunctions({
      ...conversationFunctions,
      [funcName]: func,
    })
  }

  function execConversationFunction(funcName) {
    // Will execute the function based on the key given
  }

  return (
    <ConversationContext.Provider value={{}}>
      {children}
    </ConversationContext.Provider>
  )
}
