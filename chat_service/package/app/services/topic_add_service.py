import logging

from package.app.constants import room_constants
from package.app.constants.room_constants import TOPIC_ADD
from package.app.constants.topic_statuses import JOINED
from package.app.managers.rooms.rooms_manager import rooms_manager
from package.app.managers.users.users_manager import users_manager
from package.app.services.base_topic_service import BaseTopicService
from package.app.utils.slugify import slugify

logger = logging.getLogger(__name__)


class TopicAddService(BaseTopicService):

    @staticmethod
    def name():
        return TOPIC_ADD

    def process(self, data, corr_id):
        print(data)

        current_user = users_manager.get(data.get("token"))

        room = rooms_manager.get(slugify(data.get("room")))

        logger.info(current_user)
        logger.info(room)

        if current_user:
            if room:
                connected_room = rooms_manager.get(slugify(data.get("room")))
                current_users = connected_room.get("users")
                current_users.add(current_user.get("id"))

                connected_room.update({"users": current_users})
                rooms_manager.update(room.get("slug"), connected_room)
            else:
                new_room = {"users": {current_user.get("id")}, "name": data.get('room'),
                            "slug": slugify(data.get('room'))}

                rooms_manager.create({slugify(data.get('room')): new_room})
                room = rooms_manager.get(slugify(data.get("room")))

            if 'rooms' in current_user:
                current_user["rooms"].add(room.get("slug"))
            else:
                current_user["rooms"] = {room.get("slug")}
            users_manager.update(data.get("token"), current_user)

            print("Anes")
            print(current_user)
            print(room)
            print(rooms_manager.list())

            return {
                "method": room_constants.TOPIC_ADD,
                "room_id": room.get("slug"),
                "user_id": current_user.get("id"),
                "message": {
                    "status": JOINED,
                    "room": room.get("name"),
                    "user": current_user.get("email"),
                }
            }
