import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
export default function Chatting() {
    const currUser = useSelector((state: RootState) => state.user.user);
    const navigator = useNavigate();
    const messages = [
        { id: 1, text: "Hey, how are you?", sender: "other" },
        { id: 2, text: "I'm good! Working on the project.", sender: "me" },
        { id: 3, text: "Nice! Let’s finish it today.", sender: "other" },
        { id: 4, text: "Sure, I’ll push my code soon.", sender: "me" },
    ];
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
                <hr className="mt-5"/>
                <div className="min-h-[600px] bg-gray-50 p-4 flex flex-col gap-4 overflow-y-auto">
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
                </div>
                <hr className="mb-5"/>
                <div className="flex flex-row items-center justify-between gap-4">
                    <input type="text" placeholder="Say Something" className="h-12 w-80 border border-gray-300 rounded-md pl-4"/>
                    <button className="bg-green-400 h-12 w-12 flex items-center justify-center rounded-full hover:bg-green-300 cursor-pointer"><FontAwesomeIcon icon={faPaperPlane} className="text-white"/></button>
                </div>
            </div>
        </div>
    )
}