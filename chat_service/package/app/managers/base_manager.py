import abc
import logging

logger = logging.getLogger(__name__)


class BaseManager(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def get(self, id):
        raise "Not implemented abstract method"

    @abc.abstractmethod
    def list(self):
        raise "Not implemented abstract method"

    @abc.abstractmethod
    def create(self, data):
        raise "Not implemented abstract method"

    @abc.abstractmethod
    def update(self, key, data):
        raise "Not implemented abstract method"

    @abc.abstractmethod
    def delete(self, data):
        raise "Not implemented abstract method"
