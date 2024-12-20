
const loginUser = async ({ firstName, lastName, password }: { firstName: string, lastName: string, password: string }) => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, password }),
    });
    return response;
};

const UserService = {
    loginUser,
};

export default UserService;
