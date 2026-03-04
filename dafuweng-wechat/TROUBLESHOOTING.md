# 问题排查指南

## 🚨 当前问题：首页无法选择玩家人数和切换logo

## ✅ 第一步：确认项目类型

**非常重要：您必须使用"小游戏项目"，而不是"小程序项目"**

### 如何确认项目类型

1. 打开微信开发者工具
2. 查看左上角项目名称旁边
3. 应该显示 **"小游戏"** 或 **"Game"**
4. 如果显示"小程序"，说明项目类型错误

### 如果项目类型错误

1. 关闭当前项目
2. 点击 "+" 号导入项目
3. **重要**：选择 **"小游戏项目"**（不是小程序项目）
4. 选择目录：`/Users/admin/Documents/code/github/dafuweng/dafuweng-wechat`
5. 填写 AppID
6. 点击"导入"

## 🔍 第二步：检查文件结构

### 正确的小游戏项目结构

```
dafuweng-wechat/
├── game.js                      # ✅ 必须有
├── game.json                    # ✅ 必须有
├── project.config.json          # ✅ 必须有
├── project.private.config.json  # ✅ 必须有
├── README.md
├── SETUP.md
├── QUICK_START.md
└── BUTTON_FIX.md
```

### 错误的文件（不应该存在）

- ❌ `app.js` - 小程序文件
- ❌ `app.json` - 小程序文件
- ❌ `app.wxss` - 小程序文件
- ❌ `game.wxml` - 小程序文件
- ❌ `game.wxss` - 小程序文件
- ❌ `pages/` 目录 - 小程序目录
- ❌ `sitemap.json` - 小程序文件

## 🧹 第三步：清除缓存

### 在微信开发者工具中

1. 点击顶部菜单 **"工具"**
2. 选择 **"清除缓存"**
3. 点击 **"清除文件缓存"**
4. 点击 **"清除全部缓存"**
5. 点击 **"编译"** 按钮

### 或者完全重启

1. 完全关闭微信开发者工具
2. 重新打开
3. 导入项目（确保选择"小游戏项目"）

## 📱 第四步：查看控制台

### 打开控制台

1. 点击底部 **"控制台"** 标签
2. 点击游戏界面
3. 查看是否有输出

### 预期的控制台输出

点击屏幕时应该看到：
```
Touch position: 123 456 Screen: start
```

点击玩家数量按钮时应该看到：
```
Player count 3 selected
```

点击角色卡片时应该看到：
```
Character 5 toggled
```

### 如果没有控制台输出

说明触摸事件没有触发，可能是：
1. 项目类型错误（使用了小程序而不是小游戏）
2. Canvas 没有正确初始化
3. 触摸事件没有正确注册

## 🎨 第五步：检查 Canvas 是否显示

### 小游戏应该显示

- 一个粉红色的背景
- 标题："🍭 糖果大富翁 🍬"
- 玩家数量选择按钮（2-5人）
- 角色选择卡片（20个角色）
- "开始游戏"按钮

### 如果屏幕是空白或显示错误

1. 检查控制台是否有错误信息
2. 确认 `game.js` 文件存在
3. 确认 `game.json` 文件存在

## 🔧 第六步：手动测试 Canvas

### 在控制台输入以下代码测试

```javascript
// 测试 Canvas 是否存在
console.log(canvas)

// 测试 Canvas 尺寸
console.log(canvas.width, canvas.height)

// 测试游戏状态
console.log(gameState)
```

### 预期输出

```
<Canvas>
375 667  // 或其他屏幕尺寸
{screen: "start", players: [], ...}
```

## 📊 第七步：检查触摸坐标

### 在控制台查看触摸坐标

点击屏幕时，控制台应该显示触摸坐标。

### 验证按钮区域

在控制台输入：
```javascript
const screenWidth = canvas.width
const screenHeight = canvas.height
const playerBtnWidth = 70
const playerBtnHeight = 50

// 2人按钮位置
const btn2X = screenWidth / 2 - 150
const btn2Y = screenHeight * 0.25
console.log('2人按钮区域:', btn2X, btn2Y, btn2X + playerBtnWidth, btn2Y + playerBtnHeight)
```

## 🎯 第八步：使用真机测试

1. 点击 **"预览"** 按钮
2. 用微信扫描二维码
3. 在手机上测试

真机测试可以排除开发者工具的问题。

## 🆘 如果以上都不行

### 收集以下信息

1. **项目类型**
   - 是"小游戏"还是"小程序"？

2. **控制台输出**
   - 有什么错误信息？
   - 点击屏幕时有输出吗？

3. **屏幕显示**
   - 是空白吗？
   - 有显示游戏界面吗？
   - 按钮可见吗？

4. **文件列表**
   - 项目目录中有哪些文件？
   - 有 `app.js`、`app.json` 等小程序文件吗？

### 常见错误和解决方案

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `wx.createCanvas is not a function` | 项目类型错误 | 使用"小游戏项目" |
| `canvas is not defined` | Canvas 未初始化 | 检查 game.js 第一行 |
| 屏幕空白 | Canvas 未渲染 | 检查 drawStartScreen() |
| 按钮无反应 | 触摸事件未注册 | 检查 wx.onTouchStart |

## 📞 获取帮助

如果问题仍然存在，请提供：

1. 微信开发者工具的截图
2. 控制台的完整输出
3. 项目目录的文件列表
4. 您点击屏幕时的触摸坐标

---

**最重要：确保使用"小游戏项目"而不是"小程序项目"！**
