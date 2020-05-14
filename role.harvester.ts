import './defines';
import actions from './creepActions';
let self = {
	run(creep: Creep) {
		if(creep.memory.harvesting == undefined) {
			creep.memory.harvesting = true;
		}
		if(creep.memory.harvesting) {
			if(creep.store.getFreeCapacity() == 0) {
				creep.memory.harvesting = false;
				actions.deposit(creep);
			} else {
				actions.harvest(creep);
			}
		} else {
			if(creep.store.getUsedCapacity() == 0) {
				creep.memory.harvesting = true;
				actions.harvest(creep);
			} else {
				actions.deposit(creep);
			}
		}
	}
};
export default self;