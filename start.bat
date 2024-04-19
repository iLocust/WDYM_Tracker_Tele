@echo off
echo Menjalankan Watcher WDYM

IF NOT EXIST "node_modules" (
    echo Folder node_modules tidak ditemukan. Menjalankan npm install...
    npm install
)

node .
