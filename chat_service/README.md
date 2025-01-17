# example_chat service

---

## Setup service

- create virtualenv with virtualenv wrapper

Install virtualenvwrapper via pip
```
pip install virtualenvwrapper
```

```
cd example_chat
mkvirtualenv <env name> --python=/path/to/python/executable/python3.10.*
```

- install packages needed for the project
```
make env
```
---

## Start service

- Before start of this application RabbitMQ must be running
```
cd <root project>
docker-compose -f docker-compose-rmq.yml up
```

- start service from virtual environment
```
cd example_chat
workon <env name>
make run
```

**_NOTE:_** When running this way use example.env by renaming it to .env

---
## Start all services together

-  To start all services together as Docker containers
internally connected with docker network and with hot-reload enabled

```
docker-compose up --build
```

**_NOTE:_** All applications this way would be running in the hot-reload mode
and use example.docker.env by renaming it to .env
---

## Run tests

- tests are run on virtual environment
```
cd example_chat
workon <env name>
```

- run all tests
```
make test
```

- run all tests in single file
```
make test module="--addopts package/tests/test_health.py"
```

- run single test in specific file
```
make test module="--addopts package/tests/test_health.py::HealthTest::test_health"
```
---

