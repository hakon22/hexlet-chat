start:
	node bin/index.js

install:
	npm i && npm -C frontend i

build:
	npm run build --prefix frontend

lint-frontend:
	cd frontend && npx eslint .

publish:
	npm publish --access=public

test:
	echo no tests