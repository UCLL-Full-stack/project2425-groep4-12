import { Match, User } from "@types";

const getAllMatches = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/match", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const getMatchById = (matchId: (string)) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/match/${matchId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const createMatch = (match: Match) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/match", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(match),
    });
};

const registerMatch = (matchId: (string), user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/match", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            auction: getMatchById(matchId),
            user: user,
        }),
    });
}

const MatchService = {
    getAllMatches,
    getMatchById,
    createMatch,
    registerMatch,
};

export default MatchService;