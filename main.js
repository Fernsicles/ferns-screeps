"use strict";
exports.__esModule = true;
require("./interfaces");
var structure_spawn_1 = require("./structure.spawn");
var role_harvester_1 = require("./role.harvester");
var role_upgrader_1 = require("./role.upgrader");
var role_builder_1 = require("./role.builder");
for (var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    var room = spawn.room;
    var terrain = room.getTerrain();
    var sources = room.find(FIND_SOURCES);
    if (room.memory.sourcePaths == undefined) {
        room.memory.sourcePaths = [];
        var sourcePaths = room.memory.sourcePaths;
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            sourcePaths.push(Room.serializePath(spawn.pos.findPathTo(source.pos, { range: 1 })));
        }
    }
    if (room.memory.sourceSpots == undefined) {
        room.memory.sourceSpots = {};
        var sourceSpots = room.memory.sourceSpots;
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            sourceSpots[source.id] = 0;
            for (var i_1 = -1; i_1 <= 1; i_1++) {
                for (var j = -1; j <= 1; j++) {
                    if (i_1 == 0 && j == 0) {
                        continue;
                    }
                    if (terrain.get(source.pos.x + i_1, source.pos.y + j) != TERRAIN_MASK_WALL) {
                        sourceSpots[source.id]++;
                    }
                }
            }
        }
    }
}
module.exports.loop = function () {
    for (var name_1 in Memory.creeps) {
        if (!Game.creeps[name_1]) {
            delete Memory.creeps[name_1];
            console.log('Clearing non-existing creep memory:', name_1);
        }
    }
    for (var name_2 in Memory.rooms) {
        if (!Game.rooms[name_2].controller.my) {
            delete Memory.rooms[name_2];
            console.log('Clearing unowned room memory:', name_2);
        }
    }
    for (var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
        structure_spawn_1["default"].run(spawn);
        if (Game.time % 100 == 0) {
            if (spawn.room.memory.sourcePaths == undefined) {
                var sourcePaths = spawn.room.memory.sourcePaths;
                var sources = spawn.room.find(FIND_SOURCES);
                for (var i = 0; i < sources.length; i++) {
                    sourcePaths.push(spawn.pos.findPathTo(sources[i].pos, { range: 1 }));
                }
            }
            for (var pathName in spawn.room.memory.sourcePaths) {
                var path = Room.deserializePath(spawn.room.memory.sourcePaths[pathName]);
                for (var posName in path) {
                    spawn.room.createConstructionSite(path[posName].x, path[posName].y, STRUCTURE_ROAD);
                }
            }
        }
    }
    for (var name_3 in Game.creeps) {
        var creep = Game.creeps[name_3];
        if (creep.memory.role == 'harvester') {
            role_harvester_1["default"].run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            role_upgrader_1["default"].run(creep);
        }
        else if (creep.memory.role == 'builder') {
            role_builder_1["default"].run(creep);
        }
    }
};
