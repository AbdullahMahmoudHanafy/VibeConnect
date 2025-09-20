import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { sendMessage } from "../../services/user";
import { useState, useEffect, useRef } from "react";

type Message = {
  id: number;
  text: string;
  sender: "me" | "other";
};

export default function Chatting() {
    const currUser = useSelector((state: RootState) => state.user.user);
    const navigator = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hey, how are you?", sender: "other" },
        { id: 2, text: "I'm good! Working on the project.", sender: "me" },
    ]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSendMessage = async () => {
        if (message.trim() !== "" && currUser) {
            console.log(message);
            const myMessage: Message = {
                id: Date.now(),
                text: message,
                sender: "me",
            };
            setMessage("");
            setMessages((prev) => [...prev, myMessage]);

            try {
                console.log(currUser.id, message);
                const reply = await sendMessage(currUser.id, message);

                if (reply) {
                        setMessages((prev) => [
                        ...prev,
                        { id: Date.now() + 1, text: reply, sender: "other" },
                    ]); 
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }

            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        e.preventDefault();
        handleSendMessage();
        }
    };

    return (
        <div className="w-screen h-full flex items-center justify-center mt-20">
            <div className="flex flex-col w-100 h-auto p-4 rounded-md">
                <div className="flex flex-row items-center justify-between h-auto gap-4">
                    <div className="w-auto h-full flex items-center justify-center">
                        <button onClick={() => navigator("/dashboard")} className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-md hover:bg-green-500 cursor-pointer">
                        <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                        </button>
                    </div>
                    <div className="w-60 text-start">
                        <p>@UserName</p>
                        <p className="text-gray-400">Last active 10 secs ago</p>
                    </div>
                    <button className="bg-green-100 h-12 w-12 flex items-center justify-center rounded-full hover:bg-green-300 cursor-pointer">
                        <FontAwesomeIcon icon={faPhone} className="text-green-500"/>
                    </button>
                </div>
                <hr className="mt-5 text-gray-300"/>
                <div className="h-[600px] bg-gray-50 p-4 flex flex-col gap-4 overflow-y-auto scrollbar-hide">
                    {messages.map((msg) => (
                        <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${
                            msg.sender === "me" ? "justify-end" : "justify-start"
                        }`}
                        >
                        {msg.sender === "other" && (
                            <img
                            src="https://i.pravatar.cc/40?img=1"
                            alt="other"
                            className="w-10 h-10 rounded-full"
                            />
                        )}
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                            msg.sender === "me"
                                ? "bg-green-400 text-white rounded-br-none"
                                : "bg-gray-200 text-black rounded-bl-none"
                            }`}
                        >
                            {msg.text}
                        </div>
                        {msg.sender === "me" && (
                            <img
                            src="https://i.pravatar.cc/40?img=2"
                            alt="me"
                            className="w-10 h-10 rounded-full"
                            />
                        )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                    </div>

                <hr className="mb-5 text-gray-300"/>
                <div className="flex flex-row items-center justify-between gap-4">
                    <input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        type="text"
                        placeholder="Say Something"
                        className="h-12 w-80 border border-gray-300 rounded-md pl-4"
                    />
          <button onClick={handleSendMessage} className="bg-green-400 h-12 w-12 flex items-center justify-center rounded-full hover:bg-green-300 cursor-pointer"><FontAwesomeIcon icon={faPaperPlane} className="text-white"/></button>
                </div>
            </div>
        </div>
    )
}