#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"
_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"


NGC_BIN="${_ROOT}/node_modules/.bin/ngc"

SRC_ROOT="${_ROOT}/src"
BUILD_ROOT="${_ROOT}/build"
DEPLOY_ROOT="${_ROOT}/release"

MODULE_NAME="$(basename "${_ROOT}")"

function log () {
  printf '\x1b[1m[%s:%s]\x1b[0m %s\n' "ngModule" "${1}" "${@:2}"
}

function build() {
  cd "${_ROOT}"
  log "build" "remove ./build"
  rm -rf ./build
  log "build" "copy ./src to ./build"
  scp -r ./src ./build
  log "build" "exec '"${NGC_BIN}" -p tsconfig-ngc.json'"
  "${NGC_BIN}" -p tsconfig-ngc.json  
}

function list_ts () {
  cd "${1}"
  find . -type file | grep .ts$ | grep -v .d.ts$ 
}

function clean_build() {
  cd "${BUILD_ROOT}"
  for ts_file in `list_ts "${BUILD_ROOT}"`; do
    log "clean" "remove ${ts_file}"
    rm "${ts_file}"
  done
}


function deploy () {
  if [[ ! -d "${BUILD_ROOT}" ]]; then
    printf '%s\n' "No build to deploy."
    exit 1
  fi

  log "deploy" "remove old '$(basename "${DEPLOY_ROOT}")/*'"
  rm -rf "${DEPLOY_ROOT}"/*
  log "deploy" "move '${BUILD_ROOT}' -> '${DEPLOY_ROOT}'"
  mkdir -p "${DEPLOY_ROOT}"
  scp -r "${BUILD_ROOT}"/* "${DEPLOY_ROOT}/."
}


function copy_release () {
  if [[ ! -d "${DEPLOY_ROOT}" ]]; then
    printf '%s\n' "No release to copy."
    exit 1
  fi

  if [[ ! -d "${1}/node_modules/${MODULE_NAME}"  ]]; then
    printf '%s\n' "No valid target."
    exit 2
  fi

  log "copy_release" "remove installed release at '${1}'"
  rm -rf "${1}/node_modules/${MODULE_NAME}/release"
  log "copy_release" "copy install release to '${1}'"
  scp -r "${DEPLOY_ROOT}" "${1}/node_modules/${MODULE_NAME}/release"
}


case ${1} in
  "build" )
    build && deploy
    ;;

  "clean" )
  clean_build
    ;;

  "deploy" )
  deploy
    ;;

  "list" )
  list_ts "${BUILD_ROOT}"
    ;;

  "copy" )
  copy_release "${2}"
    ;;
esac
