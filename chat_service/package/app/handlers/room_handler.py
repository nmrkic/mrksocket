import logging
from mrkutil.base import BaseHandler

from package.app.services.base_topic_service import BaseTopicService

logger = logging.getLogger(__name__)


class RoomHandler(BaseHandler):

    @staticmethod
    def name():
        return 'topic_exchange'

    def process(self, data, corr_id):
        return BaseTopicService.process_data(data.get("message"), data.get("from"), corr_id)
