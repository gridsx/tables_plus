@echo off
rm -rf output
electron-packager  .  tables+ --platform=win32 --arch=x64 --overwrite --ignore crane.exe --electron-version=17.2.0 --icon=assets/logo.ico --electron-zip-dir=electron-zip --ignore=electron-zip/* --ignore=build.cmd --asar  && move tables+-win32-x64 output