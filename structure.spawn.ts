import './defines';

enum CreepWorker {
	HARVESTER = 'harvester',
	UPGRADER = 'upgrader',
	BUILDER = 'builder',
	REPAIRER = 'repairer'
}

let self = {
	run(spawn: StructureSpawn) {
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

		if(harvesters < 3) {
			if(harvesters == 0) {
				self.createWorker(spawn, CreepWorker.HARVESTER, true);
			} else {
				self.createWorker(spawn, CreepWorker.HARVESTER);
			}
		}
		if(upgraders < 4 && harvesters > 0) {
			self.createUpgrader(spawn);
		}
		if(builders < 2 && spawn.room.controller.level >= 2) {
			self.createWorker(spawn, CreepWorker.BUILDER);
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
				roomSources[source.id] = {};
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
	},
	createStructures(spawn: StructureSpawn) {
		let spawnX = spawn.pos.x;
		let spawnY = spawn.pos.y;
		for(let i = -1; i <= 1; i++) {
			for(let j = -1; j <= 1; j++) {
				if(j != i && (j + i == -1 || j + i == 1)) {
					let pos = spawn.room.getPositionAt(i + spawnX, j + spawnY);
					pos.createConstructionSite(STRUCTURE_EXTENSION);
				}
			}
		}

		for(let source in spawn.room.memory.sources) {
			for(let spot in spawn.room.memory.sources[source]) {
				let path = Room.deserializePath(spawn.room.memory.sources[source][spot].pathTo);
				for(let posName in path) {
					spawn.room.createConstructionSite(path[posName].x, path[posName].y, STRUCTURE_ROAD);
				}
			}
		}
	},
	createWorker(spawn: StructureSpawn, role: CreepWorker, withCurrentResources: boolean = false) {
		if(withCurrentResources) {
			var capacity = spawn.room.energyAvailable;
		} else {
			var capacity = spawn.room.energyCapacityAvailable;
		}
		let parts = [];
		let cost = 0;
		for(let i = 100; i < capacity * 4 / 6; i += 100) {
			parts.push(WORK);
			cost += 100;
			if(!(i + 50 > capacity * 3 / 5)) {
				parts.push(MOVE);
				cost += 50;
				i += 50;
			}
		}
		capacity -= cost;
		for(let i = 50; i < capacity; i += 50) {
			parts.push(CARRY);
			if(i % 100 == 0) {
				parts.push(MOVE);
				i += 50;
			}
		}
		let newName = role + Game.time;
		if(spawn.spawnCreep(parts, newName, {memory: {role: role}}) == 0) {
			console.log('Spawning new ' + role + ': ' + newName);
		}
	},
	createUpgrader(spawn: StructureSpawn) {
		let capacity = spawn.room.energyCapacityAvailable;
		let role = CreepWorker.UPGRADER;
		let parts = [];
		let cost = 0;
		for(let i = 100; i < capacity * 3 / 6; i += 100) {
			parts.push(WORK);
			cost += 100;
			if(!(i + 50 > capacity * 3 / 5)) {
				parts.push(MOVE);
				cost += 50;
				i += 50;
			}
		}
		capacity -= cost;
		for(let i = 50; i < capacity; i += 50) {
			parts.push(CARRY);
			if(i % 100 == 0) {
				parts.push(MOVE);
				i += 50;
			}
		}
		let newName = role + Game.time;
		if(spawn.spawnCreep(parts, newName, {memory: {role: role}}) == 0) {
			console.log('Spawning new ' + role + ': ' + newName);
		}
	}
};
export default self;