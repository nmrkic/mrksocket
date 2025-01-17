export class SendMessageRoomDto {
    constructor(room, message){
        this.method = "topic_exchange",
        this.message = {
            "room": room,
            "action": "topic_send",
            "message": message
        };
    }
}