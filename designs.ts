let s = STRUCTURE_SPAWN;
let r = STRUCTURE_ROAD;
let e = STRUCTURE_EXTENSION;
let z = null;
export default {
	x: [
		[z, z, r, z, z],
		[z, r, e, r, z],
		[r, e, e, e, r],
		[z, r, e, r, z],
		[z, z, r, z, z]
	],
	place(room: Room, x: number, y: number, design: Array<Array<BuildableStructureConstant | null>>) {
		for(let i = 0; i < design.length; i++) {
			for(let j = 0; j < design[i].length; j++) {
				let pos: RoomPosition = room.getPositionAt(x + i, y + j);
				let structure: BuildableStructureConstant | null = design[i][j];
				if(structure != null && pos.lookFor(LOOK_FLAGS).length == 0) {
					let error = pos.createConstructionSite(structure);
					if(error == ERR_RCL_NOT_ENOUGH && pos.lookFor(LOOK_STRUCTURES).length == 0 && pos.lookFor(LOOK_CONSTRUCTION_SITES).length == 0) {
						let flagError = pos.createFlag('build;' + structure + ';' + Game.time);
					}
				}
			}
		}
		return OK;
	}
};