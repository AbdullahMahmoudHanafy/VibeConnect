export async function getUserById(userId: number) {
  const res = await fetch(`http://127.0.0.1:8000/get-user_data?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json(); // { id, name, email, ... }
}