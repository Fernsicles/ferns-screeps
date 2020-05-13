import './interfaces'
export default {
	run: function(creep: Creep) {
		if(creep.memory.build == undefined) {
			creep.memory.build = false;
		}
		if(creep.memory.build) {
			let target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
			if(target == null) {
				let damaged = creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (structure: OwnedStructure | StructureRoad) => {
						return (structure.structureType == STRUCTURE_ROAD ||structure.my) && structure.hits < structure.hitsMax;
					}
				});
				let error = creep.repair(damaged);
				if(error == ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.build = false;
				} else if(error == ERR_NOT_IN_RANGE) {
					creep.moveTo(damaged, {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
				}
			} else {
				let error = creep.build(target[0]);
				if(error == ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.build = false;
				} else if(error == ERR_NOT_IN_RANGE) {
					creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
				}
			}
		} else {
			let sources = creep.room.find(FIND_SOURCES);
			if(creep.store.getFreeCapacity() == 0) {
				creep.memory.build = true;
			} else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}, range: 1});
			}
		}
	}
}