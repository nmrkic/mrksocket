import logging

from package.app.initial_data.users import users
from package.app.managers.base_manager import BaseManager

logger = logging.getLogger(__name__)


class UsersManager(BaseManager):

    def get(self, token):
        return users.get(token, None)

    def list(self):
        return users

    def create(self, data):
        pass

    def update(self, key, data):
        users.update({key: data})

    def delete(self, data):
        pass


users_manager = UsersManager()
