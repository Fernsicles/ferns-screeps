"use strict";
exports.__esModule = true;
require("./interfaces");
var structure_spawn_1 = require("./structure.spawn");
var role_harvester_1 = require("./role.harvester");
var role_upgrader_1 = require("./role.upgrader");
var role_builder_1 = require("./role.builder");
for (var spawnName in Game.spawns) {
    var spawn = Game.spawns[spawnName];
    structure_spawn_1["default"].updateSources(spawn);
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
            structure_spawn_1["default"].updateSources(spawn);
            for (var spot in spawn.room.memory.sourceSpots) {
                var path = Room.deserializePath(spawn.room.memory.sourceSpots[spot].pathTo);
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
