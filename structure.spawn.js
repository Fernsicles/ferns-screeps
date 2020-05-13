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
        if (upgraders < 2) {
            var newName = 'Upgrader' + Game.time;
            if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } }) == 0) {
                console.log('Spawning new upgrader: ' + newName);
            }
        }
        if (builders < 2) {
            var newName = 'Builder' + Game.time;
            if (spawn.spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'builder' } }) == 0) {
                console.log('Spawning new builder: ' + newName);
            }
        }
        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text('🛠️' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, { align: 'left', opacity: 0.8 });
        }
    }
};
