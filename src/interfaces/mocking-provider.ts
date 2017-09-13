import { KioContentModel, KioFragmentModel } from 'kio-ng2-data'

export interface MockedData {
  [key:string]: any;
}

export interface MockingProvider {
  
  getFixtureForComponent <T extends KioContentModel|KioFragmentModel> ( componentName:string ):T

  fillContent <T extends KioContentModel|KioFragmentModel> ( node:T ):void

  mockLoadNodeContent <T extends KioContentModel|KioFragmentModel> ( node:T, params?:any ):void

  mockContentData <T extends KioContentModel|KioFragmentModel> ( node:T, params?:MockedData ):MockedData


}