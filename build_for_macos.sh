# 会把中间产物(*.app)和最终产物dmg都删除
rm -rf tables+_darwin_*
rm -rf bin
mkdir bin
# 用这个命令交叉编译，mac之前都是x64架构，2021年起改用arm64
# GOOS=darwin GOARCH=amd64 CGO_ENABLED=1 go build
cp crane_darwin_x64 bin/crane
# 生成可执行文件 tables+.app
npx electron-packager .  tables+ --platform=darwin --arch=x64 --overwrite --ignore crane --electron-version=17.2.0  --extra-resource=bin --icon=assets/logo.icns --electron-zip-dir=electron-zip --ignore=build.cmd
# 将tables+.app 打包成安装包
npx electron-installer-dmg tables+-darwin-x64/tables+.app tables+_darwin_x64
# GOOS=darwin GOARCH=arm64 CGO_ENABLED=1 go build
cp crane_darwin_arm64 bin/crane
npx electron-packager .  tables+ --platform=darwin --arch=arm64 --overwrite --ignore crane --electron-version=17.2.0  --extra-resource=bin --icon=assets/logo.icns --electron-zip-dir=electron-zip --ignore=build.cmd
npx electron-installer-dmg tables+-darwin-arm64/tables+.app tables+_darwin_arm64
