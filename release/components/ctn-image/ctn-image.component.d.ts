import { EventEmitter } from '@angular/core';
export declare class CtnImageComponent {
    loadStart: EventEmitter<null>;
    load: EventEmitter<null>;
    error: EventEmitter<null>;
    src: string;
    elementClass: string[];
    loaded: boolean;
    elementStartsToLoad(): void;
    elementLoadProgress(event: ProgressEvent): void;
    elementDidLoad(event: any): void;
    elementFailed(event: any): void;
}
