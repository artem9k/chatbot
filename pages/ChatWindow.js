import { useState } from 'react'

// implements the message component, which is a single chat message with text
const ai_messageStyle = {
    borderRadius: '10px',
    backgroundColor: '#3d3d3d',
}

const user_messageStyle = {
    borderRadius: '15px',
    backgroundColor: '#1a7ce5',
}

const textStyle = {
    color: 'white',
    fontFamily: 'Roboto, Helvetica, sans-serif',
    fontWeight: '300',
    margin: 0,
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '3px',
    paddingBottom: '3px',
    padding: 0,
}

const Message = (props) => {
    return(
        <div style={props.user ? user_messageStyle : ai_messageStyle}>
        <p style={textStyle} size={'8px'}>{props.text}</p>
        </div>
    )
}

const MessageRow = (props) => {
    return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: props.user ? 'flex-end' : 'flex-start'}}>
            <Message user={props.user} text={props.text} style={{float: props.user ? 'right' : 'left'}}/>
        </div>
    )
}

const Messageinput = () => {
    return (
        <div>
            <input />
        </div>
    )
}

// implements a scrollable chat window with a text input field in React. Keeps track of the scroll position and scrolls to the bottom when new messages arrive.
// The chat window is implemented as a list of messages. Each message is a div with a class name that is either "message" or "message self". The "self" class is used for messages sent by the user.

const ChatWindow = ({ messages, onSendMessage, isTyping }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [clientHeight, setClientHeight] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(scrollToBottom, [messages]);
    
    const handleScroll = (event) => {
        setScrollPosition(event.target.scrollTop);
        setScrollHeight(event.target.scrollHeight);
        setClientHeight(event.target.clientHeight);
        setIsAtBottom(
        event.target.scrollTop + event.target.clientHeight ===
            event.target.scrollHeight
        );
    };
    
    const handleSendMessage = (message) => {
        onSendMessage(message);
        if (isAtBottom) {
        scrollToBottom();
        }
    };
    
    return (
        <div className="chat-window">
            <div className="messages" onScroll={handleScroll}>
                {messages.map((message, index) => (
                <div
                    key={index}
                    className={
                    message.ownedByCurrentUser ? "message self" : "message"
                    }
                >
                    {message.body}
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}

export {ChatWindow, Message, MessageRow}
