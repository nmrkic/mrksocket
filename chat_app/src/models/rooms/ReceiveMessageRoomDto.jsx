export class ReceiveMessageRoomDto {
    constructor(room, user, message, status){
        this.room = room;
        this.user = user;
        this.message = message;
        this.status = status;
    }
}