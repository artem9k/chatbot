import "react-chat-elements/dist/main.css"
import React, { useState, useEffect, useRef } from 'react'
import { ChatFeed, Message } from "react-chat-ui";
import axios from 'axios'

const physics_prompt_1="AI: Hey! I'm Feynman, a super intelligent AI designed to help humans with physics!\n"
const physics_prompt_2="AI: Go ahead! Ask me anything!\n"

const math_prompt_1 ="AI: Hey! I'm Leibniz, a super intelligent AI designed to help humans with mathematics!\n"
const math_prompt_2 ="AI: Go ahead! Ask me anything!\n"

import {
    Layout,
    Row,
    Col,
    InputNumber,
    Button, 
    DatePicker,
    Slider,
    Divider,
    Card,
    Menu,
    Dropdown,
    Space
} from 'antd';


const mathMessages = [
    new Message({id: 1, message: math_prompt_1}),
    new Message({id: 1, message: math_prompt_2})
]

const physicsMessages = [
    new Message({id: 1, message: physics_prompt_1}),
    new Message({id: 1, message: physics_prompt_2})
]

var prompt = math_prompt_1 + "\n" + math_prompt_2 
const { Header, Footer, Content }  = Layout;

const physics_hints = [
    'Do heavier objects fall more slowly than lighter objects?',
    'Why do objects float in liquids denser than themselves?',
    'What is the difference between centripetal acceleration and centrifugal force?',
    'What is the difference between energy and power?',
    'Can light bend around corners?',
    'Can gold be created from other elements?',
    'Can sounds waves generate heat',
    'Can the decay half-life of a material be changed?',
    'Can radio antennas emit visible light?',
    'Do atoms ever actually touch each other?'
]

const math_hints = [ 
    'What is a monad?',
    'What is the Fundamental Theorem of Calculus?',
    'What is the Collatz conjecture?',
    'How can you derive an NP-Complete problem from a NP problem?',
    'What is an infinite Group?',
    'What is a Hamiltonian Circuit?',
    'What is a basis?'
]

export default function Home() {
    const inputReference = useRef(null);
    const [messageList, setMessageList]= useState(physicsMessages);
    const [typing, setTyping] = useState(false)
    const scrollRef = useRef(null)
    const buttonRef = useRef(null)
    const [mode, setMode] = useState("math")
    const [modeChange, setModeChange] = useState(false)
    const [titleColor, setTitleColor] = useState('blue')
    const [handleMessage, setHandleMessage] = useState(true)
    const [hints, setHints] = useState(physics_hints)
    const runApiRequest = async (prompt) => {
        var res = "";
        try {
            console.log(prompt)
            res = await axios.post('/api/gpt', {
                prompt: prompt,
                model: "text-davinci-002"
            })
        }
        catch (error) {
            console.log(error)
        }
        if (res == null) {
            console.log("`res` is null")
            return "null"
        }
        console.log("res is ")
        console.log(res)

        return res.data.choices[0].text
    }

    useEffect(() => {
        if (modeChange) {
            if (mode == "math") {
                setHints(math_hints)
                setMessageList(mathMessages)
            }
            else if(mode=="physics") {
                setHints(physics_hints)
                setMessageList(physicsMessages)
            }
            setModeChange(false)
        }

        var last = messageList[messageList.length - 1]
        const text = last.message
        if (!handleMessage) {
        if (last.id == 0) {
            setHandleMessage(true)
            setTyping(true)
            replyMessage(text).then(
                () => {
                    setTyping(false)
                }
            ).then(
                () => {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 20
                }
            )
        }
    }
    })

    const process_input = (input) => {
        // assume that the input is a single line (for now)
        return 'USER: ' + input
    }

    // current prompt + '\n' + process_input() + '\n'
    const push_to_prompt = (prompt, input) => {
        return prompt + '\n' + process_input(input) + '\n' 
    }

    const replyMessage = async (input) => {
        prompt = push_to_prompt(prompt, input)
        const openai_completion = await runApiRequest(prompt)
        prompt = prompt + openai_completion + '\n'
        const new_message = new Message({ id: 1, message: openai_completion})
        const new_list = [...messageList, new_message]
        setMessageList(new_list)
    }

    const handleInput = async () => {
        const input = inputReference.current.value;
        const new_message = new Message({id: 0, message: input})
        const new_message_list = [...messageList, new_message]
        setMessageList(new_message_list);
        inputReference.current.value = "";
        setHandleMessage(false)
    }

    const handlePicker = (subject) => {
        setMode(subject)
        setModeChange(true)
    }

    const button = <a href="#" onClick={handleInput} ref={buttonRef} style={{padding: '8px', borderRadius: '30px', backgroundColor: '#0084FF', color: 'white', fontFamily: 'Roboto, Helvetica, sans-serif', textDecoration: "none", border:'2px solid black'}} >Send</a>

    const handleKeyPress = (event) => {
        console.log("key press recorded")
        if(event.key === 'Enter'){
            console.log("enter pressed")
        }
      }

    return (
        <div style={{padding:0, margin:0, border: 0, height:'100%', width: "100%"}}>
        <Content className="App" style={{paddingBottom: '50px', width:"650px", margin: "auto"}}>
        <Col>
        <Card width={100 } style={{textAlign:"center"}}>
            <h1 color={{titleColor}}>Educational Chatbot </h1>
        </Card>
        <Card size="large" width={100}>
            <Row width={100} >
                <Button onClick={() => handlePicker("math")} type="primary" color="blue" width='400px' ghost >Mathematics</Button>
                <Button onClick={() => handlePicker("physics")} type="primary" color="yellow" width='400px' ghost>Physics</Button>
            </Row>
        </Card>
    
        <Card>
        <div className="body" style={{width: '600px', margin: 'auto' }}>
        <div style={{overflowY:"auto", height:"250px"}} ref={scrollRef}>
            <ChatFeed
            messages={messageList} // Boolean: list of message objects
            isTyping={typing} // Boolean: is the recipient typing
            hasInputField={false} // Boolean: use our input, or use your own
            showSenderName // show the name of the user who sent the message
            bubblesCentered={false} //Boolean should the bubbles be centered in the feed?
            bubbleStyles={{
            text: {
                fontSize: 15,
                fontFamily: 'Roboto, Helvetica, sans-serif',
                fontWeight: 500
            },
            chatbubble: {
                borderRadius: 15,
                paddingRight: 15,
                paddingLeft: 15,
                paddingTop: 5,
                paddingBottom: 5,
            }
            }}
            />
        </div>
        <Divider/>
        <div style={{alignContent: 'center', paddingTop:'10px'}}>
            <div style={{display: 'inline-block', paddingRight: '2px'}}>
                <input
                    ref={inputReference}
                    placeholder={hints[Math.floor(Math.random() * hints.length)]}
                    onChange={() => {console.log("changed")}}
                    style={{
                        borderRadius: 15,
                        padding: 9,
                        width: 500
                    }}
                />
            </div>
            <div style={{display: 'inline-block', paddingleft: '2px', float:'right', paddingTop:"5px"}}>
                {button}
            </div>
        </div>
        </div>
        </Card>
        <Card size="large" width={100} style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <a href='https://github.com/artem9k'>@artem_9k</a>
        </Card>
        </Col>
        </Content>
        </div>
    )
}
