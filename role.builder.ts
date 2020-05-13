import './interfaces'
export default {
	run: function(creep: Creep) {
		if(creep.memory.build == undefined) {
			creep.memory.build = false;
		}
		if(creep.memory.build) {
			let targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
			let error = creep.build(targets[0]);
			if(error == ERR_NOT_ENOUGH_RESOURCES) {
				creep.memory.build = false;
			} else if(error == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}, range: 3});
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