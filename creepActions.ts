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
	},
	containerWithdraw(creep: Creep) {
		let container: Structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {filter: (structure: StructureContainer) => {
			return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity() > 0;
		}});
		if(container == null) {
			return false;
		}
		if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
		}
		return true;
	}
};
export default self;