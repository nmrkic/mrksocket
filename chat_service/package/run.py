from mrkutil.communication import listen
from mrkutil.logging import get_logging_config
from package.app import handlers  # noqa importing handlers

import os
import signal
import sys
import logging
import logging.config

pid = str(os.getpid())
if not os.path.isdir("/tmp/service"):
    os.makedirs("/tmp/service")
pidfile = "/tmp/service/example_chat.pid"


def cleanup_and_exit(signum, frame):
    if os.path.exists(pidfile):
        os.unlink(pidfile)
    print("Process terminated, PID file removed.")
    sys.exit(0)


# Set up signal handlers
signal.signal(signal.SIGINT, cleanup_and_exit)
signal.signal(signal.SIGTERM, cleanup_and_exit)


log_level = os.getenv("LOG_LEVEL", "DEBUG")
json_format = bool('true' == str(os.getenv("JSON_FORMAT", 'false')).lower())

logging.config.dictConfig(get_logging_config(log_level, json_format, False))

logger = logging.getLogger("main")


def main():
    """
    App starting point
    """
    try:
        if os.path.isfile(pidfile):
            logger.warning("Service is already running")
            sys.exit(1)
        with open(pidfile, 'w') as file:
            file.write(pid)
            file.write("\n")
        try:
            logger.info(f"Starting ...{os.getenv('EXCHANGE_EXAMPLE_CHAT')}")
            listen(
                exchange=os.getenv("EXCHANGE_NOTIFICATION_RECIEVED"),
                exchange_type=os.getenv("EXCHANGE_NOTIFICATION_RECIEVED_TYPE"),
                queue=os.getenv("QUEUE_EXAMPLE_CHAT"),
            )
            sys.exit(0)
        finally:
            print("Calling finally")
            cleanup_and_exit(None, None)
    except KeyboardInterrupt:
        print("Watchfiles detected changes ... reloading now")


if __name__ == "__main__":
    main()
