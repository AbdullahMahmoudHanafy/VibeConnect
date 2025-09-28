import { useState } from "react";
import { Heart, Share2, MessageCircle } from "lucide-react";
import { likePost, sharePost } from "../services/social";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

type User = {
  name: string;
  avatar: string;
  timeAgo: string;
};

type PostProps = {
  id: number;
  user: User;
  isFollowing: boolean;
  text: string;
  image: string;
  shares_count: number;
  likes_count: number;
  comments_count: number;
};

export default function Post({
  id,
  user,
  isFollowing,
  text,
  image,
  shares_count,
  likes_count,
  comments_count,
}: PostProps) {
  const [following, setFollowing] = useState(isFollowing);
  const currUser = useSelector((state: RootState) => state.user.user);

  async function handleLike() {
    if (!currUser) return;
    try {
      await likePost(currUser.id, id);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function handleShare() {
    if (!currUser) return;
    try {
      await sharePost(currUser.id, id);
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-transparent">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="relative">
            <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
            />
            {/* Green dot positioned at bottom-right of the avatar */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-xs text-gray-500">{user.timeAgo}</p>
            </div>
        </div>


        <button
          onClick={() => setFollowing(!following)}
          className={`px-3 py-1 text-sm rounded-full border ${
            following
              ? "bg-gray-100 text-gray-700 border-gray-300"
              : "bg-blue-500 text-white border-blue-500"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>

      {/* Post Image */}
      <div className="mt-4">
        <img
          src={image}
          alt="Post content"
          className="rounded-lg w-full object-cover"
        />
      </div>

      {/* Post Text */}
      <p className="mt-3 text-sm text-gray-600">{text}</p>

      {/* Actions */}
      <div className="flex justify-between items-center mt-4 text-gray-500">
        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500">
          <Share2 className="w-4 h-4" onClick={handleShare}/>
          <span className="text-sm">{shares_count}</span>
        </div>
        <div className="flex items-end gap-4">
            <div className="flex items-center gap-1 cursor-pointer hover:text-red-500">
                <Heart className="w-4 h-4" onClick={handleLike}/>
                <span className="text-sm">{likes_count}</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-green-500">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments_count}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
