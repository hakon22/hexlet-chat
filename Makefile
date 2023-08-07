start:
	npx start-server -s ./frontend/build

install:
	npm i && npm -C frontend i

publish:
	npm publish --access=public

# TODO: добавить линтеры и тесты
lint:
	npx eslint .

test:
	echo no tests