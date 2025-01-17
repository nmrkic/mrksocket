export class AddRoomDto {
    constructor(room){
        this.method = "topic_exchange",
        this.message = {
            "room": room,
            "action": "topic_add"
        };
    }
}