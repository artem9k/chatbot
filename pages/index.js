import "react-chat-elements/dist/main.css"
import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import axios from 'axios'

import { physics_prompt_1, 
    physics_prompt_2, 
    math_prompt_1, 
    math_prompt_2,
    physics_hints,
    math_hints
 } from "../public/media";

const resizeableStyle = {
    resize: 'both',
    border: '1px solid black'
}

import {
    Button,
    Layout,
} from 'antd';

const BouncingDotsLoader = (props) => {
    return (
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
    );
  };

const AIMsg = (props) => {
    return(
    <div class="flex flex-col items-start transition-all ">
    <div class="flex flex-row items-end pt-1 ">
    <img alt="robot" src="/robot.png" width="75" height="75" decoding="async" data-nimg="1" class="block pr-2 animate-pop animate-fade-in-down
   w-[35px] sm:w-[40px] 
   " loading="lazy" />
   <div class="bg-[#F2F2F2] rounded-3xl px-5 py-2 flex flex-col gap-1 font-SF max-w-[80%]
 ">
    <p class="text-sm md:text-md lg:text-lg leading-tight">
        <span>{props.message}</span>
    </p>
    </div>
    </div>
    </div>
    )
}

const TypingMsg = (props) => {
    return(
    <div class="flex flex-col items-start transition-all ">
    <div class="flex flex-row items-end pt-1 ">
    <img alt="robot" src="/robot.png" width="75" height="75" decoding="async" data-nimg="1" class="block pr-2 animate-pop animate-fade-in-down
   w-[35px] sm:w-[40px]
   " loading="lazy" />
   <div class="bg-[#F2F2F2] rounded-3xl px-5 py-2 flex flex-col gap-1 font-SF max-w-[80%]
 animate-pop">

    <p class="text-sm md:text-md lg:text-lg leading-tight pt-1 pb-1 animate-pop">
        <span>
            <BouncingDotsLoader/>
        </span>
    </p>
    </div>
    </div>
    </div>
    )
}

const UserMsg = (props) => {
    return (
    <div class="bg-[#067EFE] text-white self-end rounded-3xl px-5 py-2 flex flex-col gap-1 font-SF max-w-[80%]
         animate-pop"><p class="text-sm md:text-md lg:text-lg leading-tight">{props.message}</p></div>
    )
}

const mathMessages = [
    <AIMsg message={math_prompt_1} key={0}/>,
    <AIMsg message={math_prompt_2} key={1}/>
]

const physicsMessages = [
    <AIMsg message={physics_prompt_1} key={0}/>,
    <AIMsg message={physics_prompt_2} key={1}/>
]

const opts = {
width: '300',
height: '200',
playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
}
}

var prompt = math_prompt_1 + "\n" + math_prompt_2 
const { Header, Footer, Content }  = Layout;

export default function Home() {
    // chat
    const inputReference = useRef(null);
    const [messageList, setMessageList]= useState(physicsMessages);
    const [typing, setTyping] = useState(false)
    const [mode, setMode] = useState("physics")
    const [modeChange, setModeChange] = useState(false)
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
        // set math or physics messages
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
        
        // update messages
        var last = messageList[messageList.length - 1]
        const text = last.props.message
        if (!handleMessage) {
        if (last.props.id == 0) {
            setHandleMessage(true)
            setTyping(true)
            replyMessage(text).then(
                () => {
                    setTyping(false)
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
        const new_message = < AIMsg id={1} message={openai_completion} key={messageList.length}/>
        const new_list = [...messageList, new_message]
        setMessageList(new_list)
    }

    const handleSubmit = async () => {
        const input = inputReference.current.value;
        const new_message = < UserMsg id={0} message={input} key={messageList.length}/>
        const new_message_list = [...messageList, new_message]
        setMessageList(new_message_list);
        inputReference.current.value = "";
        setHandleMessage(false)
    }

    const handleKeyDown = (e) => {
        if (e.key == 'Enter') {
            handleSubmit()
        }
    }

    const selectChange = (e) => {
        const new_mode = e.target.value
        if (new_mode == 'Mathematics') {
            setMode("math")
            setModeChange(true)
        }
        else if (new_mode == 'Physics') {
            setMode("physics")
            setModeChange(true)
        }
    }

    const clear = () => {
        if (mode == 'math') {
            setMessageList(mathMessages)
        }
        else if (mode == "physics") {
            setMessageList(physicsMessages)
        }
    }

    return (
        <Box>
        <div>
            <div class="Home_container__bCOhY">
            <main class="flex flex-col justify-center items-center">
            <h1 id="title" class="font-SF text-4xl mb-3 mt-6 transform transition duration-200 ease-in-out cursor-pointer text-gradient-to-left font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-red-600"><img src="/robot.png" alt="Robot" width="50" height="50" id="ada-image" class="inline cursor-pointer mb-2 " />tutor.ai</h1>
                    <h3 class="text-center text-[#4F4F4F] font-SF text-sm sm:text-lg mb-3 text-black">A tutor for math, physics, and everything in between
                    </h3>
                    <div class="flex flex-row items-center justify-center gap-3 lg:w-2/6 sm:w-6/12 w-12/12">
                        <select onChange={selectChange}  name="language" id="language" class="mb-3 font-SF rounded-full text-sm sm:text-lg important:rounded-xl focus:outline-none bg-[#F2F2F2] px-3 py-2">
                            <option value="Physics">Physics</option>
                            <option value="Mathematics">Mathematics</option>
                        </select>
                        <div class="absolute z-10 rounded-xl p-3 text-[#4F4F4F] text-sm sm:text-base font-SF 
                        transform md:translate-x-[95%] translate-x-[20%] 
                        translate-y-16
                        w-64  flex flex-col justify-center items-center
                        transition duration-200 ease-in-out shadow-xl
                        opacity-0">
                </div>
                </div>
                <div class="h-5/6 lg:w-3/6 sm:w-6/12 w-12/12 border-2 rounded-3xl px-3 pb-3 flex flex-col justify-between gap-2 h-[calc(100vh-232px)] overflow-scroll ">
                <div class="flex flex-col h-full gap-2 overflow-y-auto no-scrollbar" id="messageScreen">
                    {messageList}
                    {typing ? <TypingMsg /> : null}
                </div>
            <div class="rounded-3xl border-2 flex p-1 justify-between">

    <textarea ref={inputReference} class="font-SF text-sm md:text-md lg:text-lg self-center px-2 w-full rounded-2xl  outline-none resize-none transition-all animate-grow" 
    id="textarea" 
    placeholder={hints[Math.floor(Math.random() * hints.length)]}
    rows="1" 
    style={{height: '20px', overflowY: 'hidden'}}
    onKeyDown={handleKeyDown}
    >
    </textarea>
    <a onClick={handleSubmit}>
    <svg width="33" 
    height="33" 
    viewBox="0 0 33 33"
    fill="none" class="transform hover:scale-110 transition duration-300 glow ease-in-out self-end cursor-pointer z-1" xmlns="http://www.w3.org/2000/svg">
<circle cx="16.5" cy="16.5" r="16.5" fill="#067EFE"/>
<path d="M17 25.5V8M17 8L10 14M17 8L23.5 14" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>
    </a>
    </div>
    </div>
    <h3 onClick={clear} class="font-SF my-2 text-[#067EFE] cursor-pointer">clear chat</h3>
    </main>
    </div>
    </div>
    </Box>
    )
}