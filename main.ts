import './interfaces';
import structure_spawn from './structure.spawn'
import role_harvester from './role.harvester';
import role_upgrader from './role.upgrader';
import role_builder from './role.builder';

for(const spawnName in Game.spawns) {
	let spawn = Game.spawns[spawnName];
	let room = spawn.room;
	let terrain = room.getTerrain();
	let sources = room.find(FIND_SOURCES);
	if(room.memory.sourcePaths == undefined) {
		room.memory.sourcePaths = [];
		let sourcePaths = room.memory.sourcePaths;
		for(let i = 0; i < sources.length; i++) {
			let source = sources[i];
			sourcePaths.push(Room.serializePath(spawn.pos.findPathTo(source.pos, {range: 1})));
		}
	}
	if(room.memory.sourceSpots == undefined) {
		room.memory.sourceSpots = {};
		let sourceSpots = room.memory.sourceSpots;
		for(let i = 0; i < sources.length; i++) {
			let source = sources[i];
			sourceSpots[source.id] = 0;
			for(let i = -1; i <= 1; i++) {
				for(let j = -1; j <= 1; j++) {
					if(i == 0 && j == 0) {
						continue;
					}
					if(terrain.get(source.pos.x + i, source.pos.y + j) != TERRAIN_MASK_WALL) {
						sourceSpots[source.id]++;
					}
				}
			}
		}
	}
}

module.exports.loop = function () {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
	}
	for(let name in Memory.rooms) {
		if(!Game.rooms[name].controller.my) {
			delete Memory.rooms[name];
			console.log('Clearing unowned room memory:', name);
		}
	}

	for(const spawnName in Game.spawns) {
		let spawn = Game.spawns[spawnName];
		structure_spawn.run(spawn);

		if(Game.time % 100 == 0) {
			if(spawn.room.memory.sourcePaths == undefined) {
				let sourcePaths = spawn.room.memory.sourcePaths;
				let sources = spawn.room.find(FIND_SOURCES);
				for(let i = 0; i < sources.length; i++) {
					sourcePaths.push(spawn.pos.findPathTo(sources[i].pos, {range: 1}));
				}
			}
			for(let pathName in spawn.room.memory.sourcePaths) {
				let path = Room.deserializePath(spawn.room.memory.sourcePaths[pathName]);
				for(let posName in path) {
					spawn.room.createConstructionSite(path[posName].x, path[posName].y, STRUCTURE_ROAD);
				}
			}
		}
	}
    

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            role_harvester.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            role_upgrader.run(creep);
		} else if(creep.memory.role == 'builder') {
			role_builder.run(creep);
		}
	}
}