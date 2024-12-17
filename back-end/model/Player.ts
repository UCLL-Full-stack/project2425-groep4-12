import { User } from './User';
import { Player as PlayerPrisma, User as UserPrisma } from '@prisma/client';

export class Player {
    private id?: number;
    private user: User;
    private playernumber: string;

    constructor(player: { id?: number; user: User; playernumber: string }) {
        this.id = player.id;
        this.user = player.user;
        this.playernumber = player.playernumber;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getPlayernumber(): string {
        return this.playernumber;
    }

    equals(player: Player): boolean {
        return (
            this.id === player.getId() &&
            this.user.equals(player.getUser()) &&
            this.playernumber === player.getPlayernumber()
        );
    }

    static from({ id, user, playernumber }: PlayerPrisma & { user: UserPrisma }) {
        return new Player({
            id,
            user: User.from(user),
            playernumber,
        });
    }
}
