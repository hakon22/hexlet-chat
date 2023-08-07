lint-frontend:
	make -C frontend lint

install:
	npm i && npm -C frontend i

start-frontend:
	npm -C frontend start

start-backend:
	npx start-server -s ./frontend/build

deploy:
	git push heroku main

start:
	make start-backend & make start-frontend
