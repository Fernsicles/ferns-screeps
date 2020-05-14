import './defines'
import actions from './creepActions';

let self = {
	run(creep: Creep) {
		if(creep.memory.haul == undefined) {
			creep.memory.haul = false;
		}
		if(creep.memory.haul) {
			if(creep.store.getUsedCapacity() == 0) {
				creep.memory.haul = false;
				actions.containerWithdraw(creep);
			}
			actions.deposit(creep);
		} else {
			if(!actions.containerWithdraw(creep) || creep.store.getFreeCapacity() == 0) {
				creep.memory.haul = true;
				actions.deposit(creep);
			}
		}
	}
}
export default self;