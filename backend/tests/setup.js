"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../src/config/database");
const logger_1 = __importDefault(require("../src/utils/logger"));
beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    try {
        await (0, database_1.initializeDatabase)();
        logger_1.default.info('Test database initialized');
    }
    catch (error) {
        logger_1.default.error('Failed to initialize test database:', error);
        process.exit(1);
    }
});
afterAll(async () => {
    try {
        await (0, database_1.closeDatabase)();
        logger_1.default.info('Test database connections closed');
    }
    catch (error) {
        logger_1.default.error('Failed to close test database connections:', error);
    }
});
if (process.env.NODE_ENV === 'test') {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
}
//# sourceMappingURL=setup.js.map