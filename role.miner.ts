import './defines';

let self = {
	run(creep: Creep) {
		let container: Structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
			filter: (structure: Structure) => {
				return structure.structureType == STRUCTURE_CONTAINER;
			}
		});
		if(creep.pos.lookFor(LOOK_STRUCTURES).filter((structure: Structure) => {return structure.structureType == STRUCTURE_CONTAINER;}).length == 0) {
			creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
		let source = creep.pos.findClosestByPath(FIND_SOURCES);
		creep.harvest(source);
	}
};

export default self;