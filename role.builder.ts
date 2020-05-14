import './defines'
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
				let error = creep.build(target);
				if(error == ERR_NOT_ENOUGH_RESOURCES) {
					creep.memory.build = false;
				} else if(error == ERR_NOT_IN_RANGE) {
					creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
				}
			}
		} else {
			let source = creep.pos.findClosestByPath(FIND_SOURCES);
			if(creep.store.getFreeCapacity() == 0) {
				creep.memory.build = true;
			} else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, range: 1});
			}
		}
	}
}