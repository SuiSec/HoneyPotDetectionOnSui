#!/bin/bash

# 停止脚本如果有错误
set -e

# 检查npm是否已登录
if ! npm whoami > /dev/null 2>&1; then
  echo "You are not logged in to npm. Please run 'npm login' first."
  exit 1
fi

# 构建TypeScript项目
echo "Building the project..."
npm run build

# 获取当前版本号
CURRENT_VERSION=$(node -p "require('./package.json').version")

# 提示用户输入新的版本号
read -p "Enter the new version (current version is $CURRENT_VERSION): " NEW_VERSION

# 如果用户没有输入新版本号，保持当前版本号
if [ -z "$NEW_VERSION" ]; then
  NEW_VERSION=$CURRENT_VERSION
fi

# 更新版本号
echo "Updating version to $NEW_VERSION..."
npm version $NEW_VERSION --no-git-tag-version

# 发布到NPM
echo "Publishing to npm..."
npm publish

# 提交更改并推送到git仓库（如果需要）
# git add .
# git commit -m "Release version $NEW_VERSION"
# git push origin main

echo "Published version $NEW_VERSION to npm."

# 确保脚本有可执行权限
# chmod +x publish.sh
