"use strict";
exports.__esModule = true;
require("./interfaces");
exports["default"] = {
    run: function (creep) {
        if (creep.memory.build == undefined) {
            creep.memory.build = false;
        }
        if (creep.memory.build) {
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            var error = creep.build(targets[0]);
            if (error == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.build = false;
            }
            else if (error == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' }, range: 3 });
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.store.getFreeCapacity() == 0) {
                creep.memory.build = true;
            }
            else if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' }, range: 1 });
            }
        }
    }
};