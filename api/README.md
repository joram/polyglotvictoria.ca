# API

## Migrations
### Initialize the migrations
```shell
alembic init migrations
```

### Create a new migration
```shell
alembic revision --autogenerate -m "create database and tables"
```

### Migrate to the latest revision
```shell
alembic upgrade head
```

### Downgrade to previous revision
```shell
alembic downgrade -1
```
