// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { getUserById, getUserFollowers, getUserFollowings, getUserPosts } from "../../services/user";

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();

  const [user, setUser] = useState<any | null>(null);
  const [followers, setFollowers] = useState<any[]>([]);
  const [followings, setFollowings] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  const currUser = useSelector((state: RootState) => state.user.user);
  const currUserFollowings = useSelector((state: RootState) => state.user.followings);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        if (!userId) {
          if (mounted) {
            setUser(null);
            setFollowers([]);
            setFollowings([]);
            setPosts([]);
          }
          return;
        }

        const id = Number(userId);

        const [u, f, fo, p] = await Promise.all([
          getUserById(id),
          getUserFollowers(id),
          getUserFollowings(id),
          getUserPosts(id)
        ]);

        if (!mounted) return;

        setUser(u?.[0] ?? null);
        setFollowers(f ?? []);
        setFollowings(fo ?? []);
        setPosts(p ?? []);
      } catch (e) {
        console.error("Profile load error:", e);
      }
    }

    fetchProfile();
    return () => { mounted = false; };
  }, [userId]);

  const profileId = Number(userId);
  const isCurrentUser = !!currUser && currUser.id === profileId;
  const isFollowingProfile = !!currUserFollowings && currUserFollowings.some((f: any) => f.following_id === profileId);

  return (
    <div className="w-screen h-full flex items-center justify-center mt-20">
      <div className="flex flex-col gap-7 w-100 h-auto p-4 rounded-md">
        <div className="flex flex-row items-center justify-between h-auto gap-4">
          <div className="w-auto h-full flex items-center justify-center">
            <button onClick={() => navigate("/dashboard")} className="h-12 w-12 flex items-center justify-center bg-green-400 rounded-md hover:bg-green-500 cursor-pointer">
              <FontAwesomeIcon icon={faArrowLeft} className="text-white" />
            </button>
          </div>

          <p className="text-center font-bold w-auto">Profile</p>

          <div className="flex flex-row items-center justify-center gap-2 min-w-[48px]">
            { !isCurrentUser && <FontAwesomeIcon icon={faHeart} /> }
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </div>
        </div>

        <hr />

        <div className="flex flex-col justify-center items-center">
          <button className="w-30 h-30 flex items-center justify-center bg-green-400 rounded-full">
            <img
              className="w-28 h-28 rounded-full border-2 border-white object-cover"
              src="https://tse3.mm.bing.net/th/id/OIP.6lqPLsvyswrvXstioi7OkQHaFj?rs=1&pid=ImgDetMain&o=7&rm=3"
              alt={user?.name ?? "avatar"}
            />
          </button>

          <p className="pt-3 font-semibold">{user?.name ?? "UserName"}</p>
          <p className="text-gray-400">@{user?.name ?? "username"}</p>
        </div>

        { !isCurrentUser && (
          <div className="flex flex-row items-center justify-center gap-2 my-5">
            <button className="h-8 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full cursor-pointer">Message</button>
            <button
              className={`h-8 px-4 rounded-full cursor-pointer ${isFollowingProfile ? "bg-gray-300 text-gray-700 hover:bg-gray-400" : "bg-green-400 text-white hover:bg-green-500"}`}
            >
              {isFollowingProfile ? "Following" : "Follow"}
            </button>
          </div>
        )}

        <div className="flex flex-row items-center justify-between">
          {Object.entries({
            Followers: followers?.length ?? 0,
            Following: followings?.length ?? 0,
            Posts: posts?.length ?? 0
          }).map(([key, value]) => (
            <button key={key} className="flex flex-col items-center justify-center w-25 h-20 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
              <p className="font-bold text-xl">{value}</p>
              <p className="text-gray-500 text-sm">{key}</p>
            </button>
          ))}
        </div>

        <hr />

        <div className="flex space-x-3 overflow-x-auto p-2 scrollbar-hide">
            <img
              src="https://flxt.tmsimg.com/assets/1366_v9_bc.jpg"
              className="w-24 h-40 rounded-lg object-cover flex-shrink-0"
            />
            <img
              src="https://flxt.tmsimg.com/assets/1366_v9_bc.jpg"
              className="w-24 h-40 rounded-lg object-cover flex-shrink-0"
            />
            <img
              src="https://flxt.tmsimg.com/assets/1366_v9_bc.jpg"
              className="w-24 h-40 rounded-lg object-cover flex-shrink-0"
            />
            <img
              src="https://flxt.tmsimg.com/assets/1366_v9_bc.jpg"
              className="w-24 h-40 rounded-lg object-cover flex-shrink-0"
            />
        </div>
      </div>
    </div>
  );
}