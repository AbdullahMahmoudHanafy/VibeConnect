import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserId } from "../../store/Slices/userSlice";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            const res = await fetch(`http://127.0.0.1:8000/sign-in?email=${email}&password=${password}`, {
                method: "GET"
            });

            if (!res.ok) throw new Error("Login failed");
            const data = await res.json();

            // store in redux
            dispatch(setUserId(data.userId));

            console.log(data);

            console.log("Login successful!", data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center h-auto gap-4 w-120 px-16">
                <div className="w-full flex items-center justify-start mb-6" onClick={() => navigate("/")}><button className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-md hover:bg-green-500 cursor-pointer"><FontAwesomeIcon icon={faArrowLeft} className="text-white"/></button></div>
                <h1 className="text-5xl">VibeConnect</h1>
                <p className="text-gray-500 mb-6">Sign in to your account</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full rounded-md border border-gray-300 h-12 px-2 hover:border-green-400 focus:border-green-500"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-md border border-gray-300 h-12 px-2 hover:border-green-400 focus:border-green-500"/>
                <div className="w-full  mb-6"><a href="" className="text-green-500">Forgot your password?</a></div>
                <button className="w-full bg-green-400 h-12 text-white rounded-md hover:bg-green-500 cursor-pointer" onClick={handleLogin}>Sign In</button>
                <p className="text-gray-500">Or with</p>
                <button className="w-full rounded-md border border-gray-300 h-12 hover:border-gray-500 hover:bg-gray-50 cursor-pointer">Sign in with google</button>
                <button className="w-full rounded-md border border-gray-300 h-12 hover:border-gray-500 hover:bg-gray-50 cursor-pointer">Sign in with tweeter</button>
                <p className="text-gray-500 mt-6">Don't have an account?, let's <a href="" className="text-green-500">Sign Up</a></p>
            </div>
        </div>
    )
}