import { KioContentType, KioContentModel, KioFragmentModel, KioPublicationModel, KioContent, KioNode, KioFragment } from 'kio-ng2-data'

export interface NodeDescription {
  type: string
  cuid: string
  parent?: NodeDescription
}

export interface ErrorLogEntry {
  node: NodeDescription,
  publication: NodeDescription,
  error: any
}

function describeNode ( node:KioNode ):NodeDescription {
  return {
    type: node.type,
    cuid: node.cuid,
    parent: node.parent ? describeNode ( node.parent ) : undefined
  }
}

function getRootNode ( node:KioNode ):KioPublicationModel {
  if ( node instanceof KioPublicationModel ) {
    return node
  } else if ( !node.parent ) {
    return undefined
  } else {
    return getRootNode ( node.parent )
  }
}

export class CtnErrorLogEntry {

  constructor ( readonly error:any, readonly node:KioNode ) {
  }

  getPublication ( ):KioPublicationModel {
    return getRootNode ( this.node )
  }

  toObject():ErrorLogEntry {
    return {
      error: this.error,
      node: describeNode ( this.node ),
      publication: describeNode ( this.getPublication() )
    }
  }

}

export class CtnLogger {

  constructor(){
    if ( !(<any>window).ctn_error_logger ) {
      (<any>window).ctn_error_logger = this
    }
  }

  get logs ():ErrorLogEntry[] {
    return this._logs.map ( e => e.toObject() )
  }

  private _logs:CtnErrorLogEntry[]=[]

  logError ( error:any, node:KioNode ) {
    const log = new CtnErrorLogEntry(error,node)
    this._logs.push ( log )
  }

  logsByPublication () {
    const publicationMap:{[key: string]:ErrorLogEntry[]} = {}
    this.logs.forEach ( l => {
      if ( ! (l.publication.cuid in l ) ) {
        publicationMap [ l.publication.cuid ] = []
      }
      publicationMap [ l.publication.cuid ].push ( l )
    } )
    return publicationMap
  }

}