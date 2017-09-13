import { EventEmitter, OnChanges, SimpleChanges, AfterContentInit, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { KioContentModel, KioFragmentModel, KioTxtData, KioSrcData } from 'kio-ng2-data';
export declare class DataDirective<T extends KioTxtData | KioSrcData> implements OnInit, OnDestroy, OnChanges, AfterContentInit, AfterViewInit {
    protected backend: BackendService;
    constructor(backend: BackendService);
    contentNode: KioContentModel | KioFragmentModel;
    nodeContentData: EventEmitter<KioTxtData | KioSrcData>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
}
