import { Training, User } from "@types";

const getAllTrainings = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/training", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const getTrainingById = (trainingId: (string)) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/training/${trainingId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
};

const createTraining = (training: Training) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/training", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(training),
    });
}

const registerTraining = (trainingId: (string), user: User) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/training", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            auction: getTrainingById(trainingId),
            user: user,
        }),
    });
}

const TrainingService = {
    getAllTrainings,
    getTrainingById,
    createTraining,
    registerTraining,
};

export default TrainingService;