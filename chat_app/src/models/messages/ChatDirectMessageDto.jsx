export class ChatDirectMessageDto {
    constructor(send_to, text){
        this.method = "direct_message";
        this.message = {
            "send_to": send_to,
            "text": text
        };
    }
}