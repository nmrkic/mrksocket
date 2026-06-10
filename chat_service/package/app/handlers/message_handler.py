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
        from_user = data.get("from", None)
        user = users_manager.get(data.get("to", None))

        if user is None or from_user is None:
            return {
                "method": "message_handler",
                "message": {
                    "action": INVALID
                }
            }
        else:
            del data["message"]["token"]
            data["message"]["from"] = from_user.get("id")
            data["send_to"] = user.get("id")

            data['method'] = "direct_message"

            return data
