import logging

from package.app.managers.base_manager import BaseManager
from package.app.initial_data.rooms import rooms

logger = logging.getLogger(__name__)


class RoomsManager(BaseManager):

    def get(self, id):
        return rooms.get(id, {})

    def list(self):
        return rooms

    def create(self, data):
        rooms.update(data)

    def update(self, key, data):
        rooms.update({key: data})

    def delete(self, key):
        del rooms[key]

    def exists(self, id):
        return True if id in rooms.keys() else False


rooms_manager = RoomsManager()
