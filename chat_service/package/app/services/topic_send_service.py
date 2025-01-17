import logging

from package.app.constants import room_constants
from package.app.constants.room_constants import TOPIC_SEND
from package.app.managers.rooms.rooms_manager import rooms_manager
from package.app.managers.users.users_manager import users_manager
from package.app.services.base_topic_service import BaseTopicService

from package.app.utils.slugify import slugify

logger = logging.getLogger(__name__)


class TopicSendService(BaseTopicService):

    @staticmethod
    def name():
        return TOPIC_SEND

    def process(self, data, corr_id):
        print(data)

        current_user = users_manager.get(data.get("token"))

        room = rooms_manager.get(slugify(data.get("room")))

        logger.info(current_user)
        logger.info(room)

        if current_user:
            if room and room.get("slug") in current_user.get("rooms", []):
                room_users_without_current_user = []

                for user in room.get("users", []):
                    if user == current_user:
                        continue
                    room_users_without_current_user.append(user)

                return {
                    "method": room_constants.TOPIC_SEND,
                    "room_id": room.get("slug"),
                    "user_id": current_user.get("id"),
                    "message": {
                        "message": data.get("message"),
                        "room": room.get("name"),
                        "user": current_user.get("email"),
                    }
                }
