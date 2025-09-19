import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../services/auth";

export default function SignUp() {
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await signUp(name, email, password);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center h-auto gap-4 w-120 px-16">
                <div className="w-full flex items-center justify-start mb-6" onClick={() => navigate("/")}><button className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-md hover:bg-green-500 cursor-pointer"><FontAwesomeIcon icon={faArrowLeft} className="text-white"/></button></div>
                <h1 className="text-5xl">VibeConnect</h1>
                <p className="text-gray-500 mb-6">Sign up to get started</p>
                <input type="text" value={name} onChange={(e) => setname(e.target.value)} placeholder="Enter your name" className="w-full rounded-md border border-gray-300 h-12 px-2 hover:border-green-400 focus:border-green-500"/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full rounded-md border border-gray-300 h-12 px-2 hover:border-green-400 focus:border-green-500"/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-md border border-gray-300 h-12 px-2 hover:border-green-400 focus:border-green-500"/>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" className="w-full rounded-md border border-gray-300 h-12 px-2 hover:border-green-400 focus:border-green-500"/>
                <button className="w-full bg-green-400 h-12 text-white rounded-md hover:bg-green-500 cursor-pointer" onClick={handleSignUp}>Sign Up</button>
                <p className="text-gray-500">Or with</p>
                <button className="w-full rounded-md border border-gray-300 h-12 hover:border-gray-500 hover:bg-gray-50 cursor-pointer">Sign up with google</button>
                <button className="w-full rounded-md border border-gray-300 h-12 hover:border-gray-500 hover:bg-gray-50 cursor-pointer">Sign up with tweeter</button>
                <p className="text-gray-500 mt-6">Already have an account?, let's <a href="http://localhost:5173/login" className="text-green-500">Sign In</a></p>
            </div>
        </div>
    )    
}