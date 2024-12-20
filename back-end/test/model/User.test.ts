import { User } from "../../model/User";
import { Team } from "../../model/Team";
import { Event } from "../../model/Event";

test('given a user, when creating a user object, then it should return a user with correct values', () => {
    //given
    const validFirstName = "John";
    const validLastName = "Doe";
    const validEmail = "johndoe@gmail.com";
    const validPassword = "john123";
    const validRole = "PLAYER";

    //when
    const user = new User({
        id: 1,
        firstName: validFirstName,
        lastName: validLastName,
        email: validEmail,
        password: validPassword,
        role: validRole,
    })
    
    //then
    expect(user).toBeInstanceOf(User);
    expect(Number(user.getid())).toBe(1);
    expect(user.getFirstName()).toBe("John");
    expect(user.getLastName()).toBe("Doe");
    expect(user.getEmail()).toBe("johndoe@gmail.com");
    expect(user.getPassword()).toBe("john123");
    expect(user.getRole()).toBe("PLAYER");
})