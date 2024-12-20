import { User } from "../../model/User";
import { Team } from "../../model/Team";
import { Event } from "../../model/Event";

test('given a valid event, when an event is requested, it returns the event with the correct values', () => {
    //given
    const validName = "Training";
    const validDescription = "In testing!";
    const validLocation = "Hall 1";

    const validStart = new Date();
    const validEnd = new Date(validStart);
    validEnd.setDate(validStart.getDate() + 1);

    //when
    const event = new Event({
        id: 1,
        name: validName,
        description: validDescription,
        location: validLocation,
        start: validStart,
        end: validEnd,
    })
    
    //then
    expect(event).toBeInstanceOf(Event);
    expect(Number(event.getId())).toBe(1);
    expect(event.getName()).toBe("Training");
    expect(event.getDescription()).toBe("In testing!");
    expect(event.getLocation()).toBe("Hall 1");

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    expect(event.getStart()).toBe(today);
    expect(event.getEnd()).toBe(tomorrow);
})