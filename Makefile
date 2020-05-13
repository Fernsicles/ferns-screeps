all: main.js role.harvester.js role.upgrader.js role.builder.js structure.spawn.js

main.js: main.ts
	tsc main.ts

role.harvester.js: role.harvester.ts
	tsc role.harvester.ts

role.upgrader.js: role.upgrader.ts
	tsc role.upgrader.ts

role.builder.js: role.builder.ts
	tsc role.builder.ts

structure.spawn.js: structure.spawn.ts
	tsc structure.spawn.ts

clean:
	rm *.js