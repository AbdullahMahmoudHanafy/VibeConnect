import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { logOut } from "../../store/Slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const followers = useSelector((state: RootState) => state.user.followers);
    const followings = useSelector((state: RootState) => state.user.followings);
    const posts = useSelector((state: RootState) => state.user.posts);
    const notifications = useSelector((state: RootState) => state.user.notifications);

    const personalCommunicationDetails = {
        "Followers": followers?.length ?? 0,
        "Following": followings?.length ?? 0,
        "Posts": posts?.length ?? 0
    };

    const NavigationList = [
        {title: "Notifications",subTitle: "See your recent activity",value: notifications?.length ?? 0, link: "/notifications"},
        {title: "Messages",subTitle: "Message your friends",value: 20, link: "/messages"},
        {title: "Timeline",subTitle: "See your friends",value: 0, link: "/timeline"},
        {title: "Albums",subTitle: "Save or post your albums",value: 0, link: "/albums"},
        {title: "Favorites",subTitle: "Your favorite friends",value: 0, link: "/favorites"},
        {title: "Privacy Policy", subTitle: "Protect your privacy", value: 0, link: "/privacy"},
    ]
    function handleLogOut() {
        dispatch(logOut());
        navigate("/");
    }
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="flex flex-col gap-4 w-100 h-auto p-4 rounded-md">
                <div className="flex flex-row items-center justify-between w-full">
                    <button className="h-14 w-14 rounded-full"><img className="h-full w-full rounded-full" src="https://th.bing.com/th/id/R.7758e170f89da780877fc5225f816925?rik=yIu8z%2bhf5A46mA&riu=http%3a%2f%2fcelebrityinsider.org%2fwp-content%2fuploads%2f2019%2f04%2ftom-cruise.jpg&ehk=p0qLC3YZvXfJ3Ky6ljm%2f0ltpasGMFAbOHF7e2Uf%2fiRw%3d&risl=&pid=ImgRaw&r=0" alt="" /></button>
                    <div className="flex flex-col w-8/12">
                        <p className="font-bold">{user?.name ?? "Jhon Doe"}</p>
                        <p className="text-gray-500 text-sm">@{user?.name ?? "jhondoe"}</p>
                    </div>
                    <button onClick={() => (navigate(`/profile/${user?.id}`))} className="h-8 w-8 rounded-full border border-gray-300 hover:bg-gray-100 cursor-pointer"><FontAwesomeIcon icon={faAngleRight} /></button>
                </div>
                <hr className="text-gray-300"/>
                <div className="flex flex-row items-center justify-between">
                    {
                        Object.entries(personalCommunicationDetails).map(([key, value]) => (
                            <button key={key} onClick={() => navigate(`/${key.toLowerCase()}`)} className="flex flex-col items-center justify-center w-25 h-20 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
                                <p className="font-bold text-xl">{value}</p>
                                <p className="text-gray-500 text-sm">{key}</p>
                            </button>
                        ))
                    }
                </div>
                <div className="flex flex-col gap-2 w-full">
                    {
                        NavigationList.map((item, index) => { 
                            const isLastItem = index === NavigationList.length - 1;
                            return (
                                <div key={item.title} className="w-full">
                                    {isLastItem && <hr className="mb-4 text-gray-300"/>}
                                    <div onClick={() => navigate(item.link)} key={item.title} className={`flex flex-row items-center justify-between w-full py-3 rounded-md ${!isLastItem && "cursor-pointer"}`}>
                                        <div className="w-9/12">
                                            <p className="font-bold text-lg">{item.title}</p>
                                            <p className="text-gray-500 text-sm">{item.subTitle}</p>
                                        </div>
                                        {item.value != 0 && <div className="h-6 w-6 text-center flex items-center justify-center text-white rounded-full bg-green-400">{item.value}</div>}
                                        <button disabled={isLastItem} className={`h-8 w-8 rounded-full border border-gray-300 ${!isLastItem && "hover:bg-gray-100 cursor-pointer"}`}><FontAwesomeIcon className={`${isLastItem && "text-gray-300"}`} icon={faAngleRight} /></button>
                                    </div>
                                </div>
                            )}
                        )
                    }
                </div>
                <button className="w-full bg-green-100 h-14 text-green-500 rounded-md hover:bg-green-200 cursor-pointer" onClick={handleLogOut}>Log Out</button>
            </div>
        </div>
    )
}