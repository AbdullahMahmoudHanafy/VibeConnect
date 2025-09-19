export async function login(email: string, password: string) {
    try {
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

export async function signUp(name: string, email: string, password: string) {
    console.log(name, email, password);
    try {
        const res = await fetch(`http://127.0.0.1:8000/sign-up?name=${name}&email=${email}&password=${password}`, {
            method: "POST"
        })
        if (!res.ok) {
            throw new Error("Sign up failed");
        }
        console.log("Done");
        return
    } catch (error) {
        console.log(error);
    }
}