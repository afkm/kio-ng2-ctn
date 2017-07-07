#!/usr/bin/env bash

MODULE_ROOT="$(cd "$(dirname "${0}")/.."; pwd)"

cd $MODULE_ROOT

git checkout master
git merge development

npm version ${1:-patch}

git push && git push --tags

git checkout development

git merge master
