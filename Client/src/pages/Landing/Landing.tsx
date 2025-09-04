import { useNavigate } from "react-router-dom"

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-10 w-screen">
            <img className="w-80 sm:w-1/2 md:w-1/3" src="https://static.vecteezy.com/system/resources/previews/009/992/540/original/speech-bubble-chat-icon-sign-design-free-png.png" alt="" />
            <h1 className="text-3xl sm:text-4xl">Let's connect with each other</h1>
            <p className="text-1xl sm:text-2xl">A place where you can connect with your friends</p>
            <button className="w-1/3 bg-green-400 h-12 text-white rounded-md hover:bg-green-500 cursor-pointer sm:w-60" onClick={() => navigate("/login")}>Get Started</button>
        </div>
    )
}