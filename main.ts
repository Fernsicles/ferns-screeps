import './defines';
import structure_spawn from './structure.spawn';
import structure_controller from './structure.controller';
import role_harvester from './role.harvester';
import role_upgrader from './role.upgrader';
import role_builder from './role.builder';

for(const spawnName in Game.spawns) {
	let spawn = Game.spawns[spawnName];
	structure_spawn.updateSources(spawn);
}

module.exports.loop = function() {
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

		if(Game.time % 10 == 0) {
			structure_spawn.updateSources(spawn);
			if(spawn.room.controller.level >= 2) {
				structure_spawn.createStructures(spawn);
				structure_controller.buildExtensions(spawn.room.controller);
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
};