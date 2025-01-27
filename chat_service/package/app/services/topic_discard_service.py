import logging

from package.app.constants import room_constants
from package.app.constants.room_constants import TOPIC_DISCARD
from package.app.constants.topic_statuses import LEFT
from package.app.managers.rooms.rooms_manager import rooms_manager
from package.app.managers.users.users_manager import users_manager
from package.app.services.base_topic_service import BaseTopicService

from package.app.utils.slugify import slugify

logger = logging.getLogger(__name__)


class TopicDiscardService(BaseTopicService):

    @staticmethod
    def name():
        return TOPIC_DISCARD

    def process(self, data, from_user, corr_id):
        current_user = users_manager.get(from_user)
        room = rooms_manager.get(slugify(data.get("room")))

        logger.info(current_user)
        logger.info(room)

        if current_user:
            if room:

                room["users"].remove(current_user.get("id"))
                current_user["rooms"].remove(room.get("slug"))

                rooms_manager.update(room.get("slug"), room)
                users_manager.update(data.get("from"), current_user)

                if not room["users"]:
                    rooms_manager.delete(room.get("slug"))

                return {
                    "method": room_constants.TOPIC_DISCARD,
                    "room_id": room.get("slug"),
                    "user_id": current_user.get("id"),
                    "message": {
                        "status": LEFT,
                        "room": room.get("name"),
                        "user": current_user.get("email"),
                    }
                }
