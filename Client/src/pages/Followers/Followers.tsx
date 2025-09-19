import type { RootState } from "../../store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
export default function FollowersPage() {
    const [followers, setFollowers] = useState<any[]>([]);
    const navigate = useNavigate();

    const followersIds = useSelector((state: RootState) => state.user.followers);

    useEffect(() => {
        async function fetchFollowers() {
            const followersData = await Promise.all(followersIds.map(async (followerId) => {
                const response = await fetch(`http://127.0.0.1:8000/get-user_data?user_id=${followerId.follower_id}`);
                const data = await response.json();
                return data;
            }));
            console.log(followersData);
            setFollowers(followersData);
        }
        fetchFollowers();
    }, [followersIds])
    const followings = useSelector((state: RootState) => state.user.followings);
    console.log("Followings: ", followings)
    return (
        <div className="w-screen h-full flex items-center justify-center mt-20">
            <div className="flex flex-col gap-4 w-100 h-auto p-4 rounded-md">
                <div className="flex flex-row items-center justify-start h-auto gap-4">
                    <div className="w-auto h-full flex items-center justify-center" onClick={() => navigate("/dashboard")}><button className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-md hover:bg-green-500 cursor-pointer"><FontAwesomeIcon icon={faArrowLeft} className="text-white"/></button></div>
                    <p className="text-start">Followers {followersIds?.length}</p>
                </div>
                <hr />
                {
                    followers?.length != 0 && <div className="flex flex-col gap-4">
                        {followers?.map((follower) => {
                            return (
                                <div className="flex flex-row items-center justify-start h-auto gap-4">
                                    <div className="w-30 h-full flex items-center justify-center"><img className="w-12 h-12 rounded-full" src="https://tse2.mm.bing.net/th/id/OIP.QcK8C3zq-RxHOZqTqxGD6wHaFj?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" /></div>
                                    <div className="w-full flex flex-col items-start justify-center">
                                        <p>{follower[0].name}</p>
                                        <p className="text-gray-500">@{follower[0].name}</p>
                                    </div>
                                    <button className={`h-8 w-50 rounded-md cursor-pointer ${followings?.some(f => f.following_id === follower[0].id)? "bg-gray-100 text-gray-700 hover:bg-gray-200": "bg-green-400 text-white hover:bg-green-500"}`}>{followings?.some(f => f.following_id === follower[0].id) ? "Following" : "Follow"}</button>
                                </div>
                            )
                        })}
                    </div>
                }

            </div>
        </div>
    )
}