const choiceMatch = /\*choice/
const responseMatch = /#(.*):?(.*)/
const speakingMatch = /([A-z]*):(.*)/ // speaker, text
const finishMatch = /\*finish(?: (start) (mission|conversation) (.*))?/

// Helper matchers
const indentationMatch = / {2}/g // Matches two spaces
const funcMatch = /\(func (\w*)\)/ // just the name
const modifierMatch = /\[(\+|-)(\d*) (\w*)\]/g // sign, number, name
const glitchMatch = /\[glitch\]/
// Here is the object I want to create

interface TextConvo {
  speaker: string
  text: string
  glitch?: boolean
  type: 'conversation'
}

interface Modifier {
  attribute: string
  value: number
}

interface Response {
  option: string
  text: string
  func?: string
  glitch?: boolean
  conversation: Conversation
  modifiers?: Modifier[]
  type: 'response'
}

type Choices = {
  options: Response[]
  type: 'choices'
}

interface StartMission {
  mission: string
}

interface StartConversation {
  conversation: string
}

interface Finish {
  type: 'finish'
  start?: StartConversation | StartMission
  func?: string
}

type Conversation = (TextConvo | Choices | Finish)[]

export default class parseConversationMarkdown {
  mdString: string
  variables: {[key: string]: string | number}
  lines: string[]
  indendations: number[]

  constructor(mdString, variables?) {
    this.mdString = mdString
    this.variables = variables
    this.lines = mdString.split('\n')
    this.indendations = this.lines.map((line) => this.getIndentation(line))

    this.processLines(this.finalArray)
    console.log(this.finalArray)
  }
  // Create an array of conversation line objects
  finalArray: Conversation = []
  currentLineNumber = 0

  // The cache works based on indentation level
  // We won't need to cache the old item that has the same indentation
  // Example, we have a conversation line, indented 1, we cache it, the next line is indented 1, we overwrite the first line with the new line
  prevObjectCache = []

  // Gets current line
  getLine() {
    const line = this.lines[this.currentLineNumber]
    return line
  }

  getNextLine() {
    const line = this.lines[this.currentLineNumber + 1]
    return line
  }

  getIndentation(string) {
    const match = string.match(indentationMatch)
    return match ? match.length : 0
  }

  processLines(convoArray) {
    while (this.currentLineNumber <= this.lines.length) {
      // This should not return a response line
      const obj = this.parseLine()
      const objIndentation = this.indendations[this.currentLineNumber - 1]

      if (typeof obj === 'undefined') {
        break // Should maybe do some error handling here
      }

      // Cache this object at indendation level
      this.prevObjectCache[objIndentation] = obj
      // Always grab the parent, sometimes its the top level array
      const parentObj = this.prevObjectCache[objIndentation - 1]

      if (parentObj && parentObj.type === 'choices') {
        parentObj.options.push(obj)
      } else if (parentObj && parentObj.type === 'response') {
        parentObj.conversation.push(obj)
      } else {
        convoArray.push(obj)
      }
    }
  }

  parseLine() {
    const line = this.getLine()
    if (typeof line === 'undefined') {
      return
    }
    if (line.match(choiceMatch)) {
      // This is a choice line
      const choiceObject = this.parseChoice()
      this.currentLineNumber++
      return choiceObject
    } else if (line.match(responseMatch)) {
      // This is a response line
      const responseObject = this.parseResponse()
      this.currentLineNumber++
      return responseObject
    } else if (line.match(speakingMatch)) {
      // This is a conversation line
      const convoObject = this.parseConvoLine()
      this.currentLineNumber++
      return convoObject
    } else if (line.match(finishMatch)) {
      // This is a finish line
      const finishObject = this.parseFinish()
      this.currentLineNumber++
      return finishObject
    }
  }

  // This matched the choices line *choice
  parseChoice(): Choices {
    // Create a choices object to hold our choices
    const choicesObject = {options: [], type: 'choices'} as Choices
    return choicesObject
  }
  // This matched the individual choice #option:text
  parseResponse(): Response {
    // Is it a response line?
    const line = this.getLine()
    const match = line.match(responseMatch)

    // If so, make a choice object
    const response: Response = {
      option: match[1],
      text: match[2],
      conversation: [],
      type: 'response',
    }

    const glitch = line.match(glitchMatch)
    if (glitch) {
      response.glitch = true
    }
    const func = line.match(funcMatch)
    if (func) {
      response.func = func[0]
    }
    const modifiers = line.match(modifierMatch)
    if (modifiers) {
      console.log(modifiers)
    }
    return response
  }

  parseConvoLine(): TextConvo {
    const line = this.lines[this.currentLineNumber]
    const match = line.match(speakingMatch)
    const convoObj: TextConvo = {
      speaker: match[1],
      text: match[2],
      type: 'conversation',
    }
    const glitch = line.match(glitchMatch)
    if (glitch) {
      convoObj.glitch = true
    }
    return convoObj
  }

  parseFinish(): Finish {
    const line = this.getLine()
    const match = line.match(finishMatch)

    const finishObj: Finish = {
      type: 'finish',
    }

    if (match[1]) {
      const startType = match[2]
      const id = match[3]
      if (startType === 'mission' || startType === 'conversation') {
        // @ts-ignore This should be valid but I need to properly type it
        finishObj.start = {
          [startType]: id,
        }
      }
    }
    return finishObj
  }

  replaceVariables(line) {
    // Replace variables in the line
    if (!this.variables) return line
    let newLine = line
    Object.keys(this.variables).forEach((key) => {
      newLine = newLine.replace(`{{${key}}}`, this.variables[key])
    })
    return newLine
  }
}

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

const parser = new parseConversationMarkdown(text)
// console.log(parser.finalArray)
