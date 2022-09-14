"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: ()=>_default
});
const _httpException = require("../exceptions/HttpException");
const _acronymModel = _interopRequireDefault(require("../models/acronym.model"));
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === 'function') {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
let AcronymService = class AcronymService {
    async findDataByFilter(from, limit, search) {
        if (from < 0 || limit < 0) {
            throw new _httpException.HttpException(409, 'Params invalid');
        }
        if (search === 'undefined') {
            search = '';
        }
        const findAcronym = await this.acronym.find({
            acronym: {
                $regex: search
            }
        }).skip(from).limit(limit);
        if (!findAcronym) throw new _httpException.HttpException(409, "Acronym doesn't exist");
        return findAcronym;
    }
    async createData(data) {
        const findAcronym = await this.acronym.findOne({
            acronym: data.acronym
        });
        if (findAcronym) throw new _httpException.HttpException(409, `This acronym ${data.acronym} already exists`);
        const createData = await this.acronym.create(_objectSpread({}, data));
        return createData;
    }
    async updateData(acronym, definition) {
        if (acronym) {
            const findData = await this.acronym.findOne({
                acronym: acronym
            });
            if (findData && findData.acronym != acronym) throw new _httpException.HttpException(409, `This acronym ${acronym} already exists`);
        }
        const updateDataByAcronym = await this.acronym.update({
            acronym: acronym
        }, {
            definition: definition
        });
        if (!updateDataByAcronym) throw new _httpException.HttpException(409, "Acronym doesn't exist");
        return updateDataByAcronym;
    }
    async deleteData(acronym) {
        const deleteDataByAcronym = await this.acronym.remove({
            acronym: acronym
        });
        if (!deleteDataByAcronym) throw new _httpException.HttpException(409, "Acronym doesn't exist");
        return deleteDataByAcronym;
    }
    constructor(){
        this.acronym = _acronymModel.default;
    }
};
const _default = AcronymService;

//# sourceMappingURL=acronym.service.js.map