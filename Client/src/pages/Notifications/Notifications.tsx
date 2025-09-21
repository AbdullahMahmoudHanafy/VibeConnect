import { faArrowLeft, faMagnifyingGlass, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/user";

export default function Notifications() {
    const navigator = useNavigate();

    const notifications = useSelector((state: RootState) => state.user.notifications);
    const [notifiersNames, setNotifiersNames] = useState<Record<number, string>>({});

    useEffect(() => {
        const fetchNotifiersNames = async () => {
            const names: Record<number, string> = {};
            for (let i = 0; i < notifications.length; i++) {
                const user = await getUserById(notifications[i].id);
                names[notifications[i].id] = user[0].name;
            }
            setNotifiersNames(names);
        };

        if (notifications.length > 0) {
            fetchNotifiersNames();
        }
    }, [notifications]);
    return (
        <div className="w-screen h-full flex items-center justify-center mt-20">
            <div className="flex flex-col w-100 h-auto p-4 rounded-md">
                <div className="flex flex-col items-start justify-start h-auto gap-4 w-100">
                    <div className="flex flex-row items-center justify-between h-auto gap-4 w-full">
                        <div className="w-auto h-full flex items-center justify-center">
                            <button onClick={() => navigator("/dashboard")} className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-md hover:bg-green-500 cursor-pointer">
                                <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
                            </button>
                        </div>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="cursor-pointer" />
                    </div>
                    <p className="text-start font-bold text-xl">Notifications</p>
                    <hr className="text-gray-300 w-full"/>
                </div>
                <div className="flex flex-row items-center justify-between h-auto gap-4 w-100 pt-3 text-gray-400">
                    <p className="cursor-pointer">Show all</p>
                    <p className="cursor-pointer">Mark all as read</p>
                </div>
                <div className="flex flex-col gap-4 mt-3 w-100 max-h-[60vh] min-h-0">
                    {
                        notifications?.length === 0 && <p className="text-center text-gray-500">No notifications</p>
                    }
                    {
                        notifications?.length != 0 && notifications.map((notification, index) => 
                            <div 
                                key={index} 
                                className="relative group w-full h-20 flex-shrink-0"
                                >
                                {/* The sliding card */}
                                <div 
                                    className="absolute top-0 left-0 right-0 flex flex-row gap-2 border border-gray-300 p-4 rounded-md h-20 items-center justify-start 
                                            transition-all duration-300 bg-white group-hover:-translate-x-14"
                                >
                                    <img 
                                    className="w-16 h-16 rounded-full" 
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg/960px-Morgan_Freeman_at_The_Pentagon_on_2_August_2023_-_230802-D-PM193-3363_%28cropped%29.jpg" 
                                    alt="" 
                                    />
                                    <div>
                                    <p>{notifiersNames[notification.id] || "Unknown"} {notification.text}</p>
                                    <p className="text-gray-400">Created 8 hours ago</p>
                                    </div>
                                </div>

                                {/* Button revealed on hover */}
                                <button 
                                    className="absolute right-0 top-0 h-20 w-12 bg-green-500 flex items-center justify-center text-white 
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </div>
                        )
                    }
                </div>
           </div>
        </div>
    )
}