import { Team, User } from "@types";

const getAllTeams = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const token = loggedInUser ? JSON.parse(loggedInUser).token : null;
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/teams", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
};

const getTeamById = (teamId: (string)) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/teams/${teamId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const TeamService = {
    getAllTeams,
    getTeamById,
};

export default TeamService;