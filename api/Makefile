start:
	uvicorn main:app --reload

build:
	docker build . -t joram87/polyglot-api

run:
	docker run --env-file .env -it -v data:/code/data/ -p 8000:8000 joram87/polyglot-api

push:
	docker push joram87/polyglot-api

pull_on_server:
	ssh 192.168.1.222 "cd projects/nas; docker-compose pull polyglot"

update_on_server:
	ssh 192.168.1.222 "cd projects/nas; docker-compose up -d polyglot"

tail_logs_on_server:
	ssh 192.168.1.222 "cd projects/nas; docker-compose logs -f polyglot"

deploy: build push pull_on_server update_on_server tail_logs_on_server