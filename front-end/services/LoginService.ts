import { User } from "@types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const logInUser = (user: User) => {

    return fetch (baseUrl + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(user)
    });
};

const LoginService = {
    logInUser,
}

export default LoginService;