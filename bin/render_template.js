#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const hb = require('handlebars')

const SRC_ROOT = path.resolve('./src')
const WORKER_TEMPLATE = path.join(SRC_ROOT,'worker/source.tmpl.ts')
const WORKER_TEMPLATE_TARGET = path.join(SRC_ROOT,'worker/source.ts')

const WORKER_SOURCE = path.resolve('./node_modules/kio-ng2-worker/browser/worker.umd.js')


function readFile ( filepath, format ) {
  return new Promise((resolve,reject)=>{

    fs.readFile(filepath, format, (error, result) => {

      if ( error ) {

        reject(error)

      } else {

        resolve(result)
        
      }

    })

  })
}


function writeFile ( filepath, data, format ) {
  return new Promise((resolve,reject)=>{

    fs.writeFile(filepath, data, format, (error) => {

      if ( error ) {

        reject(error)

      } else {

        resolve(data)
        
      }

    })

  })
}

function renderTemplate ( templateSource, workerSource ) {
  
  //const escapedWorkerSource = hb.Utils.escapeExpression(workerSource)
  const template = hb.compile(templateSource)

  return new Promise((resolve,reject)=>{

    let renderedSource
    let error
    try{
      renderedSource = template({source: workerSource})
    }catch(e){
      error = e
    }

    if ( error ) {
      reject(error)
    } else {
      resolve(renderedSource)
    }

  })

}

readFile ( WORKER_TEMPLATE, 'utf8' )
  .then ( templateSource => {
    return readFile ( WORKER_SOURCE, 'utf8' )
      .then ( source => (new Buffer(source)).toString('base64') )
      .then ( workerSource => {
        console.log('worker source', workerSource)
        return renderTemplate ( templateSource, workerSource )
      } )
  } )
  .then ( source => writeFile(WORKER_TEMPLATE_TARGET, source, 'binary') )
  .then ( source => {
    console.log('Wrote template file at "%s"', WORKER_TEMPLATE_TARGET)
  } )
  .catch ( error => {
    console.error(error)
  } )
