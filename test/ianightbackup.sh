#!/bin/sh
DIR=`date +%m%d%y`
DEST=/home/backup/$DIR
mkdir $DEST
mongodump -d iasystem -o $DEST