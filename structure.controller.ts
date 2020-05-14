import './defines';
import designs from './designs';
// We use this for things that should only be run once per room we control
let self = {
	buildExtensions(controller: StructureController) {
		let room: Room = controller.room;
		if(room.memory.base == undefined) {
			room.memory.base = self.findBase(controller);
		}
		let base: RoomPosition = room.getPositionAt(room.memory.base.x, room.memory.base.y);
		let center = {x: base.x - 2, y: base.y - 2};
		let x = 0;
		let y = 0;
		let add = 2;
		for(let i = 0; i < 3; i++) {
			designs.place(room, center.x + x, center.y + y, designs.x);
			designs.place(room, center.x - x, center.y - y, designs.x);
			x = x + add;
			y = y - add;
		}

	},
	findBase(controller: StructureController) {

	},
	createContainers(controller: StructureController) {
		let room: Room = controller.room;
		let sources = room.memory.sources;
		for(let source in sources) {
			for(let spotName in sources[source]) {
				let spot = sources[source][spotName];
				let pos: RoomPosition = room.getPositionAt(spot.x, spot.y);
				pos.createConstructionSite(STRUCTURE_CONTAINER);
			}
		}
	}
};
export default self;