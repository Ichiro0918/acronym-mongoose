"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _compression = _interopRequireDefault(require("compression"));
const _cookieParser = _interopRequireDefault(require("cookie-parser"));
const _cors = _interopRequireDefault(require("cors"));
const _express = _interopRequireDefault(require("express"));
const _helmet = _interopRequireDefault(require("helmet"));
const _hpp = _interopRequireDefault(require("hpp"));
const _morgan = _interopRequireDefault(require("morgan"));
const _mongoose = require("mongoose");
const _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
const _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
const _config = require("./config");
const _databases = require("databases");
const _errorMiddleware = _interopRequireDefault(require("./middlewares/error.middleware"));
const _logger = require("./utils/logger");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const swaggerJSON = require('../swagger.json');
let App = class App {
    listen() {
        this.app.listen(this.port, ()=>{
            _logger.logger.info(`=================================`);
            _logger.logger.info(`======= ENV: ${this.env} =======`);
            _logger.logger.info(`🚀 App listening on the port ${this.port}`);
            _logger.logger.info(`=================================`);
        });
    }
    getServer() {
        return this.app;
    }
    connectToDatabase() {
        if (this.env !== 'production') {
            (0, _mongoose.set)('debug', true);
        }
        (0, _mongoose.connect)(_databases.dbConnection.url, _databases.dbConnection.options).then(()=>{
            console.log('Connected to the database ');
        }).catch((err)=>{
            console.error(`Error connecting to the database. n${err}`);
        });
    }
    initializeMiddlewares() {
        this.app.use((0, _morgan.default)(_config.LOG_FORMAT, {
            stream: _logger.stream
        }));
        this.app.use((0, _cors.default)({
            origin: _config.ORIGIN,
            credentials: _config.CREDENTIALS
        }));
        this.app.use((0, _hpp.default)());
        this.app.use((0, _helmet.default)());
        this.app.use((0, _compression.default)());
        this.app.use(_express.default.json());
        this.app.use(_express.default.urlencoded({
            extended: true
        }));
        this.app.use((0, _cookieParser.default)());
    }
    initializeRoutes(routes) {
        routes.forEach((route)=>{
            this.app.use('/', route.router);
        });
    }
    initializeSwagger() {
        const options = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Acronym API',
                    version: '1.0.0',
                    description: 'Build a REST API for the World Texting Foundation, also known as WTF'
                },
                servers: [
                    {
                        url: 'http://localhost:3000',
                        description: 'My API Documentation'
                    }, 
                ]
            },
            apis: [
                'swagger.json'
            ]
        };
        const specs = (0, _swaggerJsdoc.default)(options);
        this.app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swaggerJSON));
    }
    initializeErrorHandling() {
        this.app.use(_errorMiddleware.default);
    }
    constructor(routes){
        this.app = (0, _express.default)();
        this.env = _config.NODE_ENV || 'development';
        this.port = _config.PORT || 3000;
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }
};
const _default = App;

//# sourceMappingURL=app.js.map