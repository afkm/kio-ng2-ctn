import { KioPublicationModel, KioNode } from 'kio-ng2-data';
export interface NodeDescription {
    type: string;
    cuid: string;
    parent?: NodeDescription;
}
export interface ErrorLogEntry {
    node: NodeDescription;
    publication: NodeDescription;
    error: any;
}
export declare class CtnErrorLogEntry {
    readonly error: any;
    readonly node: KioNode;
    constructor(error: any, node: KioNode);
    getPublication(): KioPublicationModel;
    toObject(): ErrorLogEntry;
}
export declare class CtnLogger {
    constructor();
    readonly logs: ErrorLogEntry[];
    private _logs;
    logError(error: any, node: KioNode): void;
    logsByPublication(): {
        [key: string]: ErrorLogEntry[];
    };
}
