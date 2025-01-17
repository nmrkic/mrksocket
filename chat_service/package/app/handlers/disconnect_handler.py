import logging
from mrkutil.base import BaseHandler

from package.app.constants.topic_statuses import DISCONNECTED
from package.app.managers.authentication.authentication_manager import AuthenticationManager
from package.app.managers.rooms.rooms_manager import rooms_manager
from package.app.managers.users.users_manager import users_manager

logger = logging.getLogger(__name__)


class DisconnectHandler(BaseHandler):

    @staticmethod
    def name():
        return 'close_connection'

    def process(self, data, corr_id):
        print(data)

        message = data.get("message", {})
        AuthenticationManager.disconnect_user(message.get("token", None))
        current_user = users_manager.get(message.get("token", None))

        for room_slug in current_user.get("rooms", []):
            room = rooms_manager.get(room_slug)

            users = set([])

            for user_id in room.get("users", []):
                if user_id == current_user.get("id"):
                    continue
                users.add(user_id)

            if not users:
                rooms_manager.delete(room_slug)
            else:
                room.update({"users": users})
                rooms_manager.update(room_slug, room)

        current_user.pop("rooms", None)

        users_manager.update(message.get("token", None), current_user)

        return {
            "method": "disconnect",
            "message": {
                "status": DISCONNECTED
            }
        }
