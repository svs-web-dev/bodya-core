"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDynamicModel = void 0;
// eslint-disable-next-line @typescript-eslint/ban-types
function createClassInheritor(className) {
    return new Function('BaseClass', `
    'use strict';
    return class ${className} extends BaseClass {}
  `);
}
const createDynamicModel = (proto, tableName, connection) => {
    const inheritor = createClassInheritor(proto.name);
    const model = inheritor(proto);
    model['assignedTableName'] = tableName;
    model.knex(connection);
    return model;
};
exports.createDynamicModel = createDynamicModel;
