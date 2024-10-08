"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKnexConnection = exports.getShardedConnection = void 0;
const knex_1 = __importDefault(require("knex"));
const config_1 = __importDefault(require("config"));
/*
* 1. define sharding property inside connection config
* 2. function will return suitable config
* 3. shardedConnection is locally cached.
* */
const shardingMap = new Map();
const shardingKnexMap = new Map();
const getShardedConnection = (config, shard) => {
    if (shardingMap.has(shard)) {
        return shardingMap.get(shard);
    }
    const shardedConnection = config_1.default.util.cloneDeep(config.shardedConnections.find(connection => {
        if (!connection.sharding) {
            return;
        }
        const [from, to] = connection.sharding.split('-');
        return +shard >= +from && +shard <= +to;
    }));
    let shardedKnex;
    if (shardingKnexMap.has(shardedConnection.sharding)) {
        shardedKnex = shardingKnexMap.get(shardedConnection.sharding);
    }
    else {
        shardedKnex = (0, knex_1.default)(shardedConnection);
        shardingKnexMap.set(shardedConnection.sharding, shardedKnex);
    }
    if (!shardedConnection) {
        throw new Error(`Missing config for requested shard: ${shard}`);
    }
    shardingMap.set(shard, shardedKnex);
    return shardedKnex;
};
exports.getShardedConnection = getShardedConnection;
const connectionMap = new Map();
const getKnexConnection = (name, config) => {
    if (connectionMap.get(name)) {
        return connectionMap.get(name);
    }
    const connection = config_1.default.util.cloneDeep(config.connections.find(c => c.name === name));
    const knexConnection = (0, knex_1.default)(connection);
    connectionMap.set(name, knexConnection);
    return knexConnection;
};
exports.getKnexConnection = getKnexConnection;
