import logging
from mrkutil.base import BaseHandler

from package.app.constants.general_statuses import INVALID
from package.app.managers.users.users_manager import users_manager

logger = logging.getLogger(__name__)


class MessageHandler(BaseHandler):

    @staticmethod
    def name():
        return 'direct_message'

    def process(self, data, corr_id):
        message = data.get("message", {})
        user = users_manager.get(message.get("token"))

        if user is None:
            return {
                "method": "message_handler",
                "message": {
                    "action": INVALID
                }
            }
        else:
            del data["message"]["token"]
            data["message"]["user_id"] = user.get("id")

            data['method'] = "direct_message"

            return data
