all: main.js

main.js: main.ts
	tsc main.ts

clean:
	rm *.js