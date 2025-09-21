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

export async function followUser(sender_id: number, receiver_id: number) {
  try {
      const res = await fetch(`http://127.0.0.1:8000/follow?sender_id=${sender_id}&receiver_id=${receiver_id}`, {
      method: "POST"
    })
    if (!res.ok) {
      throw new Error("Failed to follow user");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function unFollowUser(sender_id: number, receiver_id: number) {
  try {
      const res = await fetch(`http://127.0.0.1:8000/unfollow?sender_id=${sender_id}&receiver_id=${receiver_id}`, {
      method: "DELETE"
    })
    if (!res.ok) {
      throw new Error("Failed to follow user");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessage(user_id : number, content: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/send-prompt?user_id=${user_id}&content=${content}`, {
      method: "POST"
    })
    if (!res.ok) {
      throw new Error("Failed to send message");
    }
    const data = await res.json();
    console.log(data["response"]);
    return data["response"];
  } catch (error) {
    console.log(error);
  }
}

export async function deleteNotification(notification_id: number) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/delete-notification?notification_id=${notification_id}`, {
      method: "DELETE"
    })
    if (!res.ok) {
      throw new Error("Failed to delete notification");
    }
  } catch (error) {
    console.log(error);
  }
}