import { KioPublicationModel } from 'kio-ng2-data';
function describeNode(node) {
    return {
        type: node.type,
        cuid: node.cuid,
        parent: node.parent ? describeNode(node.parent) : undefined
    };
}
function getRootNode(node) {
    if (node instanceof KioPublicationModel) {
        return node;
    }
    else if (!node.parent) {
        return undefined;
    }
    else {
        return getRootNode(node.parent);
    }
}
var CtnErrorLogEntry = (function () {
    function CtnErrorLogEntry(error, node) {
        this.error = error;
        this.node = node;
    }
    CtnErrorLogEntry.prototype.getPublication = function () {
        return getRootNode(this.node);
    };
    CtnErrorLogEntry.prototype.toObject = function () {
        return {
            error: this.error,
            node: describeNode(this.node),
            publication: describeNode(this.getPublication())
        };
    };
    return CtnErrorLogEntry;
}());
export { CtnErrorLogEntry };
var CtnLogger = (function () {
    function CtnLogger() {
        this._logs = [];
        if (!window.ctn_error_logger) {
            window.ctn_error_logger = this;
        }
    }
    Object.defineProperty(CtnLogger.prototype, "logs", {
        get: function () {
            return this._logs.map(function (e) { return e.toObject(); });
        },
        enumerable: true,
        configurable: true
    });
    CtnLogger.prototype.logError = function (error, node) {
        var log = new CtnErrorLogEntry(error, node);
        this._logs.push(log);
    };
    CtnLogger.prototype.logsByPublication = function () {
        var publicationMap = {};
        this.logs.forEach(function (l) {
            if (!(l.publication.cuid in l)) {
                publicationMap[l.publication.cuid] = [];
            }
            publicationMap[l.publication.cuid].push(l);
        });
        return publicationMap;
    };
    return CtnLogger;
}());
export { CtnLogger };
//# sourceMappingURL=Logger.class.js.map