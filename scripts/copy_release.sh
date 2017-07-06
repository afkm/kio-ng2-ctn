#!/usr/bin/env bash

SCRIPT_PATH="$(dirname "${0}")"
SCRIPT_FILE="$(basename "${0}")"
_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"

function print_error () {
  local message="${1:-Error}"
  printf '\x1b[31m%s\x1b[0m\n' "${message}"
}

if [[ -z "${KIO_RELEASES}" ]]; then
  print_error "Missing kio releases provided by global \$KIO_RELEASES" 
  exit 1
fi


function npmPackageProp() {
  local package_prop="${1:-name}"
  cd "${_ROOT}"
  node -p "require('./package.json').${package_prop}"
}

TARGET_DIR="${1}"
if [[ ! -d "${TARGET_DIR}" ]]; then
  print_error "Please provide a valid target directory. '${TARGET_DIR}' is none."
  exit 4
fi

MODULE_NAME=`npmPackageProp name`
MODULE_RELEASE_TARGET="${TARGET_DIR}"
if [[ -d "${TARGET_DIR}/${MODULE_NAME}" ]]; then
  MODULE_RELEASE_TARGET="${TARGET_DIR}/${MODULE_NAME}"
fi
MODULE_RELEASE_SRC="${_ROOT}/release"
MODULE_RELEASE_TARGET_DIR="${MODULE_RELEASE_TARGET}/release"

if [[ ! -d "${MODULE_RELEASE_TARGET_DIR}" ]]; then
  print_error "MODULE_RELEASE_TARGET_DIR: '${MODULE_RELEASE_TARGET_DIR}' is not a directory."
  exit 2
fi

if [[ "${MODULE_RELEASE_TARGET_DIR}" == "${MODULE_RELEASE_SRC}" ]]; then
  print_error "Same modules"
  exit 3
fi

scp -r "${MODULE_RELEASE_SRC}"/* "${MODULE_RELEASE_TARGET_DIR}/."