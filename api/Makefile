start:
	uvicorn main:app --reload

build:
	docker build . -t joram87/polyglot-api

run:
	docker run --env-file .env -it -p 8000:8000 joram87/polyglot-api

push:
	docker push joram87/polyglot-api