import './interfaces'

export default {
	run: function(spawn: StructureSpawn) {
		let creeps: Creep[] = spawn.room.find(FIND_MY_CREEPS);
		let harvesters = 0;
		let upgraders = 0;
		let builders = 0;
		for(let creepName in creeps) {
			let role = creeps[creepName].memory.role;
			if(role == 'harvester') {
				harvesters++;
			} else if(role == 'upgrader') {
				upgraders++;
			} else if(role == 'builder') {
				builders++;
			}
		}

		if(harvesters < 2) {
			let newName = 'Harvester' + Game.time;
			if(spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'harvester'}}) == 0) {
				console.log('Spawning new harvester: ' + newName);
			}
		}
		if(upgraders < 2 && harvesters > 0) {
			let newName = 'Upgrader' + Game.time;
			if(spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}}) == 0) {
				console.log('Spawning new upgrader: ' + newName);
			}
		}
		if(builders < 2 && spawn.room.controller.level >= 2) {
			let newName = 'Builder' + Game.time;
			if(spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'builder'}}) == 0) {
				console.log('Spawning new builder: ' + newName);
			}
		}
	
		if(spawn.spawning) {
			let spawningCreep = Game.creeps[spawn.spawning.name];
			spawn.room.visual.text(
				'🛠️' + spawningCreep.memory.role,
				spawn.pos.x + 1,
				spawn.pos.y,
				{align: 'left', opacity: 0.8});
		}
	},
	updateSources: function(spawn: StructureSpawn) {
		let room = spawn.room;
		let terrain = room.getTerrain();
		let sources = room.find(FIND_SOURCES);
		if(room.memory.sources == undefined) {
			room.memory.sources = {};
			let roomSources = room.memory.sources;
			for(let i = 0; i < sources.length; i++) {
				let source = sources[i];
				roomSources[source.id] = {}
				for(let i = -1; i <= 1; i++) {
					for(let j = -1; j <= 1; j++) {
						if(i == 0 && j == 0) {
							continue;
						}
						let x = source.pos.x + i;
						let y = source.pos.y + j;
						let position = room.getPositionAt(x, y);
						let pathTo = Room.serializePath(spawn.pos.findPathTo(position));
						let pathBack = Room.serializePath(position.findPathTo(spawn.pos));
						if(terrain.get(x, y) != TERRAIN_MASK_WALL) {
							roomSources[source.id]['' + x + ',' + y] = {
								x: x,
								y: y,
								pathTo: pathTo,
								pathBack: pathBack
							};
						}
					}
				}
			}
		}
	}
}