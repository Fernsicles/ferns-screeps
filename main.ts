import './interfaces';
import structure_spawn from './structure.spawn'
import role_harvester from './role.harvester';
import role_upgrader from './role.upgrader';
import role_builder from './role.builder';

for(const spawnName in Game.spawns) {
	let spawn = Game.spawns[spawnName];
	structure_spawn.updateSources(spawn);
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
			structure_spawn.updateSources(spawn);
			for(let spot in spawn.room.memory.sourceSpots) {
				let path = Room.deserializePath(spawn.room.memory.sourceSpots[spot].pathTo);
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