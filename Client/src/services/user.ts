export async function getUserById(userId: number) {
    const res = await fetch(`http://127.0.0.1:8000/get-user_data?user_id=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json(); // { id, name, email, ... }
}

export async function getUserFollowers(userId: number) {
    const res = await fetch(`http://127.0.0.1:8000/get-followers?user_id=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch followers");
    return res.json();
}

export async function getUserFollowings(userId: number) {
    const res = await fetch(`http://127.0.0.1:8000/get-followings?user_id=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch followings");
    return res.json();
}

export async function getUserPosts(userId: number) {
    const res = await fetch(`http://127.0.0.1:8000/get-user-posts?user_id=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

export async function getUserNotifications(userId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/get-notifications?user_id=${userId}`);
    
    if (!res.ok) {
      // interpret 400/500 as "no notifications"
      console.warn("No notifications found");
      return [];
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return []; // fallback to empty
  }
}