import './defines';
import actions from './creepActions';
export default {
	run(creep: Creep) {
		if(creep.memory.upgrading == undefined) {
			creep.memory.upgrading == false;
		}
		if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.upgrading = false;
			creep.say('🔄 harvest');
		}
		if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
			creep.memory.upgrading = true;
			creep.say('⚡ upgrade');
		}

		if(creep.memory.upgrading) {
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
			}
		}
		else {
			actions.harvest(creep);
		}
	}
};