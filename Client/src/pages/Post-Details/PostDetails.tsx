import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/user";
import { getPosts } from "../../services/social";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisV,
  faShareAlt,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

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

type Comment = {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
  avatar: string;
};

// Dummy comments
const dummyComments: Comment[] = [
  {
    id: 1,
    author: "Morsalin Nur",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    timeAgo: "52 minutes ago",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    author: "Arthur Aguilar",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    timeAgo: "52 minutes ago",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    author: "Brenden Ramirez",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    timeAgo: "52 minutes ago",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState<ApiPost | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      const posts: ApiPost[] = await getPosts();
      const found = posts.find((p) => p.id === Number(id));
      if (found) {
        setPost(found);
        const res: User[] = await getUserById(found.user_id);
        setUser(res[0]);
      }
    }
    fetchData();
  }, [id]);

  if (!post || !user) return <p>Loading...</p>;

  return (
    <div className="w-screen h-full flex flex-col mt-10 items-center">
      <div className="w-100 max-w-lg">
        {/* Image with overlay */}
        <div className="relative">
          <img
            src="https://www.codingem.com/wp-content/uploads/2021/10/juanjo-jaramillo-mZnx9429i94-unsplash-1024x683.jpg"
            alt="post cover"
            className="w-full h-64 object-cover"
          />

          {/* Top buttons */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 w-12 h-12 bg-transparent hover:bg-gray-500 bg-opacity-40 text-white p-2 rounded-md cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button className="absolute top-3 right-3 bg-black bg-opacity-40 text-white p-2 rounded-full">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>

          {/* Bottom stats */}
          <div className="absolute bottom-0 w-full flex justify-between items-center px-4 py-2 bg-gradient-to-t from-black/60 to-transparent text-white">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShareAlt} />
              <span>{post.shares_count}</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faHeart} />
                <span>{post.likes_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faCommentDots} />
                <span>{post.comments_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="pt-4">
          {dummyComments.map((c) => (
            <div key={c.id} className="flex gap-3 py-3 items-start">
              {/* Avatar */}
              <img
                src={c.avatar}
                alt={c.author}
                className="w-10 h-10 rounded-full"
              />

              {/* Comment content */}
              <div className="flex-1">
                {/* Top row: name + date + heart */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{c.author}</p>
                    <p className="text-xs text-gray-500">{c.timeAgo}</p>
                  </div>
                  <button className="text-gray-400 hover:text-red-500">
                    <FontAwesomeIcon icon={faHeart} />
                  </button>
                </div>

                {/* Text */}
                <p className="text-sm mt-1 text-gray-700">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
