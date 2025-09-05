export async function login(email: string, password: string) {
    try {
        console.log(email, password);
        const res = await fetch(`http://127.0.0.1:8000/sign-in?email=${email}&password=${password}`, {
            method: "GET"
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }
        const data = await res.json();
        return data; // { userId: ... }
    } catch (error) {
        console.log(error);
    }

}