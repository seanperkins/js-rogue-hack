import { createContext, useState } from "react";
import { Message, MessageType } from "../types";

const LogContext = createContext({})

export default LogContext;

export function LogContextProvider({children}) {
  const [messages, setMessages] = useState([]);

  function add(text: string, type: MessageType = 'into') {
    const msgs = messages.slice();
    const lastMessage = msgs[msgs.length - 1] || ({} as Message)
    // If the previous message is the same, increase the count
    if (lastMessage.text === text) {
      lastMessage.count++
    } else {
      msgs.push({
        text,
        type,
        count: 1,
      })
    }
    setMessages(msgs)
  }

  return (
    <LogContext.Provider value={{messages, add}}>
      {children}
    </LogContext.Provider>
  )
}