import { Container, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, TextField, Typography, ListItemButton } from "@mui/material";
import { Box } from "@mui/system";
import { Fragment, useEffect, useRef, useState } from "react";
import { SendMessageRoomDto } from "../../models/rooms/SendMessageRoomDto";
import { ReceiveMessageRoomDto } from "../../models/rooms/ReceiveMessageRoomDto";
import { RoomDto } from "../../models/rooms/RoomDto";
import { AddRoomDto } from "../../models/rooms/AddRoomDto";
import './Chat.css';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { notifyError } from "../../utils/Notifications";

export default function Chat({ userToken, selectedRoom, webSocket }){

    const ENTER_KEY_CODE = 13;

    const scrollBottomRef = useRef(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (webSocket.current){
            webSocket.current.onmessage = (event) => {
            const ReceiveMessageRoomDto = JSON.parse(event.data);

            if (ReceiveMessageRoomDto.room === selectedRoom) {
                setChatMessages([...chatMessages, {
                    user: ReceiveMessageRoomDto.user,
                    message: ReceiveMessageRoomDto.status ? ReceiveMessageRoomDto.status : ReceiveMessageRoomDto.message
                }]);
                if(scrollBottomRef.current) {
                    scrollBottomRef.current.scrollIntoView({ behavior: 'smooth'});
                }
            }
        }
        }
    }, [chatMessages]);

    useEffect(() => {
        setChatMessages([]);
    },[selectedRoom]);

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const handleEnterKey = (event) => {
        if(event.keyCode === ENTER_KEY_CODE){
            sendMessage();
        }
    }

    const sendMessage = () => {
        if(message) {
            console.log('Send!');
            webSocket.current.send(
                JSON.stringify(new SendMessageRoomDto(selectedRoom, message))
            );
            setChatMessages([...chatMessages, {
                user: "You",
                message: message
            }]);
            setMessage('');
        }
    };

    const listChatMessages = chatMessages.map(( ReceiveMessageRoomDto, index) =>
        <ListItem key={index}>
               <Avatar
                    sx={{
                          marginRight: 2
                    }}
                    alt={ReceiveMessageRoomDto.user}
                    src="/broken-image.jpg"/>
            <ListItemText primary={`${ReceiveMessageRoomDto.user}: ${ ReceiveMessageRoomDto.message}`}/>
        </ListItem>
    );

    return (
            <Grid id="chat-window" xs={8} item>
                <Paper elevation={5}>
                    <Box p={3}>
                        <Typography variant="h4" gutterBottom>
                           Channel {selectedRoom}
                        </Typography>
                        <Divider />
                        <Grid container spacing={4} alignItems="center">
                            <Grid id="chat-window" xs={12} item>
                                <List id="chat-window-messages">
                                    {listChatMessages}
                                    <ListItem ref={scrollBottomRef}></ListItem>
                                </List>
                            </Grid>
                            <Grid xs={11} item>
                                <FormControl fullWidth>
                                    <TextField onChange={handleMessageChange} onKeyDown={handleEnterKey}
                                        value={message}
                                        label="Type your message..."
                                        variant="outlined"/>
                                </FormControl>
                            </Grid>
                            <Grid xs={1} item>
                                <IconButton onClick={sendMessage}
                                    aria-label="send"
                                    color="primary">
                                        <SendIcon />
                                </IconButton>
                            </Grid>

                        </Grid>
                    </Box>
                </Paper>
                </Grid>
    );
}
