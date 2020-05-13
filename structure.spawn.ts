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
		if(upgraders < 2) {
			let newName = 'Upgrader' + Game.time;
			if(spawn.spawnCreep([WORK,CARRY,MOVE], newName, {memory: {role: 'upgrader'}}) == 0) {
				console.log('Spawning new upgrader: ' + newName);
			}
		}
		if(builders < 2) {
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
	}
}