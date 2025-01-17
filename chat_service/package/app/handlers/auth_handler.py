import logging
from mrkutil.base import BaseHandler

from package.app.constants.general_statuses import INVALID, VALID
from package.app.managers.authentication.authentication_manager import AuthenticationManager

logger = logging.getLogger(__name__)


class AuthHandler(BaseHandler):

    @staticmethod
    def name():
        return 'auth'

    def process(self, data, corr_id):
        message = data.get("message", {})

        user = AuthenticationManager.authenticate_user(message.get("token", None))

        if user is not None:
            return {
                "method": "auth",
                "status": VALID,
                "temp_user_id": message.get("temp_user_id"),
                "user_id": user.get("id")
            }
        return {
            "method": "auth",
            "status": INVALID
        }
