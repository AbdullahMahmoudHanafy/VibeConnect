import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Post from "../../components/postComponent";
import { getPosts, sendPost } from "../../services/social";
import { getUserById } from "../../services/user";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

type ApiPost = {
  id: number;
  text: string;
  created_at: string;
  likes_count: number;
  shares_count: number;
  comments_count: number;
  user_id: number;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type CombinedPost = ApiPost & { user: User };

export default function Timeline() {
  const [postsData, setPostsData] = useState<CombinedPost[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newPost, setNewPost] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const posts: ApiPost[] = await getPosts();

    const postsWithUsers: CombinedPost[] = await Promise.all(
      posts.map(async (post) => {
        const res: User[] = await getUserById(post.user_id);
        const user = res[0];
        return { ...post, user };
      })
    );

    setPostsData(postsWithUsers);
  }

  const handleSendPost = async () => {
    if (!newPost.trim() || !user) return;

    try {
      await sendPost(user.id, newPost);
      setNewPost("");
      setShowInput(false);

      // refresh posts
      fetchData();
    } catch (error) {
      console.error("Error sending post:", error);
    }
  };

  const dummyImages = [
    {
      id: 1,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      image:
        "https://www.codingem.com/wp-content/uploads/2021/10/juanjo-jaramillo-mZnx9429i94-unsplash-1024x683.jpg",
    },
    {
      id: 2,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      image:
        "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/primary/ngdjbafv3twathukjbq2",
    },
  ];

  return (
    <div className="w-screen h-full flex flex-col items-center mt-2">
      <div className="flex flex-col gap-4 w-full max-w-lg h-auto p-4 rounded-md">
        {/* Header */}
        <div className="flex flex-row items-center justify-between h-auto gap-4">
          <FontAwesomeIcon
            icon={faCamera}
            className="cursor-pointer text-2xl"
            onClick={() => {
              setShowInput(!showInput);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="cursor-pointer text-2xl"
          />
        </div>

        {/* Input for new post */}
        {showInput && (
          <div className="flex flex-row gap-2 items-center mt-2">
            <input
              ref={inputRef}
              type="text"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2"
            />
            <button
              onClick={handleSendPost}
              className="bg-green-400 text-white px-4 py-2 rounded-md hover:bg-green-500"
            >
              Post
            </button>
          </div>
        )}

        <p className="text-start font-bold text-xl">Timeline</p>
        <hr />

        {/* Posts */}
        <div className="flex flex-col gap-6 mt-4">
          {postsData.map((post, index) => {
            const dummy = dummyImages[index % dummyImages.length];
            return (
              <div key={post.id}>
                <Post
                  user={{
                    name: post.user.name,
                    avatar: dummy.avatar,
                    timeAgo: new Date(post.created_at).toLocaleString(),
                  }}
                  isFollowing={false}
                  id={post.id}
                  text={post.text}
                  image={dummy.image}
                  shares_count={post.shares_count}
                  likes_count={post.likes_count}
                  comments_count={post.comments_count}
                />
                <hr className="mt-4" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
