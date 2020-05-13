"use strict";
exports.__esModule = true;
require("./interfaces");
exports["default"] = {
    run: function (spawn) {
        var creeps = spawn.room.find(FIND_MY_CREEPS);
        var harvesters = 0;
        var upgraders = 0;
        var builders = 0;
        for (var creepName in creeps) {
            var role = creeps[creepName].memory.role;
            if (role == 'harvester') {
                harvesters++;
            }
            else if (role == 'upgrader') {
                upgraders++;
            }
            else if (role == 'builder') {
                builders++;
            }
        }
        if (harvesters < 2) {
            var newName = 'Harvester' + Game.time;
            if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } }) == 0) {
                console.log('Spawning new harvester: ' + newName);
            }
        }
        if (upgraders < 2 && harvesters > 0) {
            var newName = 'Upgrader' + Game.time;
            if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } }) == 0) {
                console.log('Spawning new upgrader: ' + newName);
            }
        }
        if (builders < 2 && spawn.room.controller.level >= 2) {
            var newName = 'Builder' + Game.time;
            if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'builder' } }) == 0) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text('🛠️' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, { align: 'left', opacity: 0.8 });
        }
    },
    updateSources: function (spawn) {
        var room = spawn.room;
        var terrain = room.getTerrain();
        var sources = room.find(FIND_SOURCES);
        if (room.memory.sources == undefined) {
            room.memory.sources = {};
            var roomSources = room.memory.sources;
            for (var i = 0; i < sources.length; i++) {
                var source = sources[i];
                roomSources[source.id] = {};
                for (var i_1 = -1; i_1 <= 1; i_1++) {
                    for (var j = -1; j <= 1; j++) {
                        if (i_1 == 0 && j == 0) {
                            continue;
                        }
                        var x = source.pos.x + i_1;
                        var y = source.pos.y + j;
                        var position = room.getPositionAt(x, y);
                        var pathTo = Room.serializePath(spawn.pos.findPathTo(position));
                        var pathBack = Room.serializePath(position.findPathTo(spawn.pos));
                        if (terrain.get(x, y) != TERRAIN_MASK_WALL) {
                            roomSources[source.id]['' + x + ',' + y] = {
                                x: x,
                                y: y,
                                pathTo: pathTo,
                                pathBack: pathBack
                            };
                        }
                    }
                }
            }
        }
    }
};
