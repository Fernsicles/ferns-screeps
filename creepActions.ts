import './defines';
let self = {
	harvest(creep: Creep) {
		let source = creep.pos.findClosestByPath(FIND_SOURCES);
		if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
			creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, range: 1});
		}
	},
	deposit(creep: Creep) {
		let target: Structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (structure: StructureSpawn | StructureExtension) => {
				if(structure.store == undefined) {
					return false;
				}
				let x: number | null = structure.store.getFreeCapacity(RESOURCE_ENERGY);
				return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && x > 0;
			}
		});
		if(target != null) {
			if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
	}
};
export default self;