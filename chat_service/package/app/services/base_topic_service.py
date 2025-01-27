import abc
import logging

from package.app.constants.general_statuses import INVALID

logger = logging.getLogger(__name__)


class BaseTopicService(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def name():
        raise "Not implemented abstract method"

    @abc.abstractmethod
    def process(self, data, from_user, corr_id):
        raise "Not implemented abstract method"

    @classmethod
    def process_data(cls, data, from_user, corr_id):
        logger.info(f"process_data method: {data.get('action', None)}")
        handler = None
        for sub_cls in cls.__subclasses__():
            if data.get('action', None) == sub_cls.name():
                handler = sub_cls
                break
        logger.info(f"process_data found method {handler}")
        if handler:
            return handler().process(data, from_user, corr_id)
        logger.warning("No service covering this action, action: {}".format(data.get('action', "Empty")))

        return {
            "method": "room_handler",
            "message": {
                "action": INVALID
            }
        }
