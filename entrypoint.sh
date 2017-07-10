#!/bin/bash

product="$PROJECT_NAME"
echo $product

mkdir -p /logs/$product/
#mkdir -p /data/${project.artifactId}/

if [ "$1" = 'npm' ]; then
 mv /logs/$product/$product.log /logs/$product/$product.`date +%Y-%m-%d-%H-%M-%S`.log
 exec gosu root "$@" run start 2>&1 | tee -a /logs/$product/$product.log
fi

exec "$@"

