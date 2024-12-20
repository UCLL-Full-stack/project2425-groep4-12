import { User } from "../../model/User";
import { Team } from "../../model/Team";
import { Event } from "../../model/Event";
import { Player } from "../../model/Player";
import { Coach } from "../../model/Coach";

test('given a valid team, when a team is requested, it returns the team with the correct values', () => {
    //given
    const validName = "Team 1";

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const event1 = new Event({
        id: 1,
        name: "Training",
        description: "In testing!",
        location: "Hall 1",
        start: today,
        end: tomorrow,
    })

    const user1 = new User({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "john123",
        role: "PLAYER",
    })

    const player1 = new Player({
        id: 1,
        user: user1,
        playernumber: "1",
    })

    const user2 = new User({
        id: 2,
        firstName: "George",
        lastName: "Doe",
        email: "georgedoe@gmail.com",
        password: "george123",
        role: "COACH",
    })

    const validCoach = new Coach({
        id: 1,
        user: user2,
        rank: "Test",
        schedule: [event1],
    });

    const validPlayers = [player1]
    const validSchedule = [event1]

    //when
    const team = new Team({
        id: 1,
        name: validName,
        coach: validCoach,
        players: validPlayers,
        schedule: validSchedule,
    })

    //then
    expect(team).toBeInstanceOf(Team);
    expect(Number(team.getId())).toBe(1);
    expect(team.getName()).toBe("Team 1");
    expect(team.getCoach().getUser().getFirstName()).toBe("George");
    expect(team.getPlayers()).toBe([player1]);
    expect(team.getSchedule()).toBe([event1]);
})