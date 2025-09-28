export async function getPosts() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get-all-posts", {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function sendPost(user_id: number, content: string) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/create-post?user_id=${user_id}&content=${content}`, {
            method: "POST"
        });
        if (!res.ok) {
            throw new Error("Failed to send post");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function likePost(user_id: number, post_id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/like-post?user_id=${user_id}&post_id=${post_id}`, {
            method: "POST"
        });
        if (!res.ok) {
            throw new Error("Failed to like post");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function sharePost(user_id: number, post_id: number) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/share-post?user_id=${user_id}&post_id=${post_id}`, {
            method: "POST"
        });
        if (!res.ok) {
            throw new Error("Failed to share post");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function commentOnPost(user_id: number, post_id: number, comment: string) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/comment-on-post?user_id=${user_id}&post_id=${post_id}&comment=${comment}`, {
            method: "POST"
        });
        if (!res.ok) {
            throw new Error("Failed to comment on post");
        }
    } catch (error) {
        console.log(error);
    }
}