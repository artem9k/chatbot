import "react-chat-elements/dist/main.css"
import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import TopMenu from './TopMenu'
import SideMenu from './SideMenu'
import axios from 'axios'
import {ChatWindow, Message, MessageRow} from './ChatWindow'

import { physics_prompt_1, 
    physics_prompt_2, 
    math_prompt_1, 
    math_prompt_2,
    physics_hints,
    math_hints
 } from "./media";

import YouTube from "react-youtube";

import {
    Grid, Input, InputBase
}

from '@mui/material';

import {
    Button,
    Layout,
} from 'antd';
import { InputUnstyled } from "@mui/base";
import { YoutubeSearchedFor } from "@mui/icons-material";
/*
const mathMessages = [
    new Message({id: 1, message: math_prompt_1}),
    new Message({id: 1, message: math_prompt_2})
]

const physicsMessages = [
    new Message({id: 1, message: physics_prompt_1}),
    new Message({id: 1, message: physics_prompt_2})
]
*/

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
    //const [messageList, setMessageList]= useState(physicsMessages);
    const [typing, setTyping] = useState(false)
    const scrollRef = useRef(null)
    const buttonRef = useRef(null)
    const [mode, setMode] = useState("math")
    const [modeChange, setModeChange] = useState(false)
    const [titleColor, setTitleColor] = useState('blue')
    const [handleMessage, setHandleMessage] = useState(true)
    const [hints, setHints] = useState(physics_hints)

    // video player
    const [videoId, setVideoId] = useState("")
    const videoInputRef = useRef(null)
    const [playerHidden, setPlayerHidden] = useState(true)

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
        /*
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
        */

        // show video input or youtube window
        if (videoId == "") {
            setPlayerHidden(true)
        }
        else {
            setPlayerHidden(false)
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

    const handleVideoReturn = () => {
        setVideoId("")
        setPlayerHidden(true)
    }

    const handleVideoSubmit = () => {
        const videoUrl = videoInputRef.current.value
        const video_id = videoUrl.split('v=')[1]
        setVideoId(video_id)
        setPlayerHidden(false)
    }

    const handleKeyDown = (e) => {
        if (e.key == 'Enter') {
            handleVideoSubmit()
        }
    }

    return (
        <Box>
        
        <div style={{float: 'right', width: 'calc(100vw - 50px)', height:'100vh'}}>
            <TopMenu />
            <Content>
                <Grid container>
                <Grid item xs={6} md={6} height='calc((100vh - 50px) / 2)' borderRight='1px solid grey' borderBottom='1px solid grey' backgroundColor='#2C2C2C'>
                </Grid>
                <Grid class="video-player" item xs={6} md={6} borderBottom='1px solid grey' backgroundColor='#2C2C2C'>
                    <Grid container justifyItems='center' justifyContent='center' height='100%'>
                        <Grid item margin='auto'>
                            <Input inputRef={videoInputRef} hidden={playerHidden} style={{color: 'lightgrey', display: playerHidden ? "block" : "none"}} placeholder="Enter a video URL" ref={videoInputRef} onKeyDown={handleKeyDown} />
                            <Button style={{display: playerHidden ? "none" : "block"}} onClick={handleVideoReturn}>Return</Button>
                            <YouTube style={{display: playerHidden ? "none" : "block"}} videoId={videoId} opts={opts}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} md={6} height='calc((100vh - 50px) / 2)' borderRight='1px solid grey' backgroundColor='#2C2C2C'>
                </Grid>
                <Grid class="assistant" item xs={6} md={6} backgroundColor='#2C2C2C'>
                <div style={{overflowY:"auto", height:"50px", width:'400px'}} ref={scrollRef}>
                    <MessageRow user={true} text={'Hello world'} id={1}/>
                    <MessageRow user={false} text={'deez world'} id={2}/>
                </div>
                </Grid>
                </Grid>
            </Content>
        </div>
    </Box>
    )
}

/*
 <Card width={100} style={{textAlign:"center"}}>
            <h1 color={{titleColor}}>Educational Chatbot </h1>
        </Card>
        <Card size="large" width={100}>
            <Row width={100} >
                <Button onClick={() => handlePicker("math")} type="primary" color="blue" width='400px' ghost >Mathematics</Button>
                <Button onClick={() => handlePicker("physics")} type="primary" color="yellow" width='400px' ghost>Physics</Button>
            </Row>
        </Card>
        <Card>
        <div className="body" style={{width: '700px', margin: 'auto' }}>
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



*/