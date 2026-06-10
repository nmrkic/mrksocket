import { Container, Divider, FormControl, Grid, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, TextField, Typography, ListItemButton } from "@mui/material";
import { Box } from "@mui/system";
import RemoveIcon from '@mui/icons-material/Remove';
import { Fragment, useEffect, useRef, useState } from "react";
import { ChatDirectMessageDto } from "../../models/messages/ChatDirectMessageDto";
import { ChatDirectMessageReceivedDto } from "../../models/messages/ChatDirectMessageReceivedDto";
import { RoomDto } from "../../models/rooms/RoomDto";
import { AddRoomDto } from "../../models/rooms/AddRoomDto";
import { RemoveRoomDto } from "../../models/rooms/RemoveRoomDto";
import './Room.css';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { notifyError } from "../../utils/Notifications";
import Chat from "../chat/Chat";

export default function Room(){

    const ENTER_KEY_CODE = 13;

    const scrollBottomRef = useRef(null);
    const webSocket = useRef(null);
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [userToken, setUserToken] = useState('');

    useEffect(() => {
        if(userToken && userToken.lenght > 4) {
            console.log('Opening WebSocket');
            webSocket.current = new WebSocket(`ws://localhost:8100/?token=${userToken}`);
            const openWebSocket = () => {
                webSocket.current.onopen = (event) => {
                    console.log('Open:', event);
                }
                webSocket.current.onclose = (event) => {
                    console.log('Close:', event);
                }
            }
            openWebSocket();
            return () => {
                console.log('Closing WebSocket');
                webSocket.current.close();
            }
        }
    }, [userToken]);

    const handleUserTokenChange = (event) => {
        setUserToken(event.target.value);
    }

    const handleRoomChange = (event) => {
        setRoom(event.target.value);
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    }

    const changeRoom = (roomId) => {
        setSelectedRoom(roomId);
    }

    const removeRoom = (event, roomId) => {
        event.stopPropagation();
        webSocket.current.send(
            JSON.stringify(new RemoveRoomDto(roomId))
        );
        setRooms((prevState) =>
          prevState.filter((prevItem) => prevItem.room !== roomId)
        );
        setSelectedRoom("");
    }

    const createRoom = () => {
        if(!userToken){
            notifyError("You need to enter token first");
        }

        if(room) {
            console.log('Send!');
            webSocket.current.send(
                JSON.stringify(new AddRoomDto(room))
            );
            setRooms([...rooms, {
                room: room
            }]);
            setRoom('');
    }
    }

    const listRooms = rooms.map(( RoomDto, index) =>
        <div key={index}>
        <ListItemButton onClick={() => changeRoom(RoomDto.room)}>
            <ListItemAvatar>
              <Avatar
               alt={RoomDto.room}
               src="/broken-image.jpg" />
             </ListItemAvatar>
            <ListItemText primary={`${RoomDto.room}`}/>
            <RemoveIcon onClick={(event) => removeRoom(event, RoomDto.room)}/>
        </ListItemButton>
         <Divider/>
        </div>
    );

    return (
        <Fragment>
            <Container>
            <Grid container spacing={1} alignItems="center">
            <Grid id="chat-window" xs={4} item>
                <Paper elevation={8}>
                <Box p={3}>
                  <Typography variant="h4" gutterBottom align="center">
                    Chats
                  </Typography>
                  <Divider variant="middle" />
                  <Grid container spacing={4} alignItems="center">
                    <Grid id="chat-window" xs={12} item>
                        <List id="chat-window-messages">
                            {listRooms}
                        </List>
                    </Grid>
                    <Grid xs={9} item>
                        <FormControl fullWidth>
                                    <TextField onChange={handleRoomChange}
                                        value={room}
                                        label="Add room"
                                        variant="outlined"/>
                        </FormControl>
                    </Grid>
                    <Grid xs={2} item>
                        <IconButton onClick={createRoom}
                            aria-label="create"
                            color="primary">
                                <AddIcon />
                        </IconButton>
                    </Grid>
                    <Grid xs={12} item>
                        <FormControl fullWidth>
                                    <TextField onChange={handleUserTokenChange}
                                        value={userToken}
                                        label="Token"
                                        variant="outlined"/>
                        </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                </Paper>
            </Grid>
            { selectedRoom && <Chat userToken={userToken} selectedRoom={selectedRoom} webSocket={webSocket}/> }
            </Grid>
            </Container>
        </Fragment>
    );
}
