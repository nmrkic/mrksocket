import logging
from package.app.initial_data.users import users

logger = logging.getLogger(__name__)


class AuthenticationManager:

    @classmethod
    def authenticate_user(cls, token):
        users[token]["online"] = True

        logger.info(users)

        return users.get(token, None)

    @classmethod
    def disconnect_user(cls, token):
        users[token]["online"] = False

        logger.info(users)

        return
