// game.js
const canvas = wx.createCanvas()
const ctx = canvas.getContext('2d')

// 设置 Canvas 尺寸
const systemInfo = wx.getSystemInfoSync()
canvas.width = systemInfo.windowWidth
canvas.height = systemInfo.windowHeight

// 屏幕适配参数
const scale = Math.min(canvas.width / 375, canvas.height / 667) // 基于 iPhone 6/7/8 的尺寸
const baseWidth = 375
const baseHeight = 667

// 游戏状态
let gameState = {
  screen: 'start', // start, game
  players: [],
  currentIndex: 0,
  diceValue: '-',
  canBuy: false,
  gameLog: [],
  boardCells: [],
  playerJailTurns: {},
  playerBankSavings: {},
  selectedCount: 4,
  selectedCharacters: [],
  characters: [
    { name: '小兔子', icon: '🐰', color: '#ff6b6b' },
    { name: '小熊', icon: '🐻', color: '#4ecdc4' },
    { name: '小猫咪', icon: '🐱', color: '#ffd93d' },
    { name: '小狗狗', icon: '🐶', color: '#6b5b95' },
    { name: '小熊猫', icon: '🐼', color: '#ff85a2' },
    { name: '小狐狸', icon: '🦊', color: '#ff6b9d' },
    { name: '小狮子', icon: '🦁', color: '#ffa502' },
    { name: '小老虎', icon: '🐯', color: '#ff7f50' },
    { name: '小青蛙', icon: '🐸', color: '#7bed9f' },
    { name: '小乌龟', icon: '🐢', color: '#2ed573' },
    { name: '小鲨鱼', icon: '🦈', color: '#1e90ff' },
    { name: '小汽车', icon: '🚗', color: '#ff4757' },
    { name: '小火箭', icon: '🚀', color: '#5352ed' },
    { name: '小星星', icon: '⭐', color: '#ffd700' },
    { name: '小月亮', icon: '🌙', color: '#70a1ff' },
    { name: '奥特曼', icon: '🦸', color: '#ff6348' },
    { name: '小机器人', icon: '🤖', color: '#747d8c' },
    { name: '独角兽', icon: '🦄', color: '#ff69b4' },
    { name: '小龙', icon: '🐲', color: '#ff4500' },
    { name: '小气球', icon: '🎈', color: '#ff1493' }
  ]
}

// 触摸事件处理
wx.onTouchStart(handleTouchStart)

function handleTouchStart(e) {
  console.log('Touch event:', e)
  console.log('Touches:', e.touches)
  
  if (!e.touches || e.touches.length === 0) {
    console.log('No touches found!')
    return
  }
  
  const touch = e.touches[0]
  console.log('Touch object:', touch)
  
  // 尝试多种坐标获取方式
  const x = touch.x || touch.clientX || 0
  const y = touch.y || touch.clientY || 0
  
  console.log('Touch position:', x, y, 'Screen:', gameState.screen, 'Canvas size:', canvas.width, canvas.height)
  
  if (gameState.screen === 'start') {
    handleStartScreenTouch(x, y)
  } else if (gameState.screen === 'game') {
    handleGameScreenTouch(x, y)
  }
}

function handleStartScreenTouch(x, y) {
  const screenWidth = canvas.width
  const screenHeight = canvas.height
  
  // 玩家数量选择按钮 - 自适应布局
  const playerBtnWidth = Math.floor(60 * scale)
  const playerBtnHeight = Math.floor(40 * scale)
  const playerBtnSpacing = Math.floor(15 * scale)
  const playerBtnStartX = Math.floor(screenWidth / 2 - (4 * playerBtnWidth + 3 * playerBtnSpacing) / 2)
  const playerBtnY = Math.floor(screenHeight * 0.18)
  
  for (let i = 2; i <= 5; i++) {
    const btnX = playerBtnStartX + (i - 2) * (playerBtnWidth + playerBtnSpacing)
    if (x >= btnX && x <= btnX + playerBtnWidth && y >= playerBtnY && y <= playerBtnY + playerBtnHeight) {
      console.log(`Player count ${i} selected`)
      gameState.selectedCount = i
      gameState.selectedCharacters = gameState.selectedCharacters.slice(0, i)
      drawStartScreen()
      return
    }
  }
  
  // 角色选择 - 自适应布局
  const charPadding = Math.floor(10 * scale)
  const charWidth = Math.floor((screenWidth - charPadding * 5) / 4)
  const charHeight = Math.floor(charWidth * 1.2)
  const charStartX = charPadding
  const charStartY = Math.floor(screenHeight * 0.28)
  const cols = 4
  
  for (let i = 0; i < gameState.characters.length; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const charX = charStartX + col * (charWidth + charPadding)
    const charY = charStartY + row * (charHeight + charPadding)
    
    if (x >= charX && x <= charX + charWidth && y >= charY && y <= charY + charHeight) {
      console.log(`Character ${i} toggled`)
      toggleCharacter(i)
      drawStartScreen()
      return
    }
  }
  
  // 开始游戏按钮 - 自适应布局
  const startBtnWidth = Math.floor(200 * scale)
  const startBtnHeight = Math.floor(60 * scale)
  const startBtnX = Math.floor(screenWidth / 2 - startBtnWidth / 2)
  const startBtnY = Math.floor(screenHeight * 0.85)
  
  if (x >= startBtnX && x <= startBtnX + startBtnWidth && y >= startBtnY && y <= startBtnY + startBtnHeight) {
    if (gameState.selectedCharacters.length === gameState.selectedCount) {
      console.log('Start game button clicked!')
      startGame()
    } else {
      console.log('Please select more characters')
    }
  }
}

function toggleCharacter(index) {
  let selected = [...gameState.selectedCharacters]
  
  if (selected.includes(index)) {
    selected = selected.filter(i => i !== index)
  } else {
    if (selected.length < gameState.selectedCount) {
      selected.push(index)
    }
  }
  
  gameState.selectedCharacters = selected
}

function startGame() {
  const players = gameState.selectedCharacters.map(index => ({
    ...gameState.characters[index],
    money: 1500,
    position: 0
  }))
  
  gameState.players = players
  gameState.currentIndex = 0
  gameState.diceValue = '-'
  gameState.canBuy = false
  gameState.gameLog = []
  
  const jailTurns = {}
  const bankSavings = {}
  players.forEach((player, index) => {
    jailTurns[index] = 0
    bankSavings[index] = 0
  })
  
  gameState.playerJailTurns = jailTurns
  gameState.playerBankSavings = bankSavings
  
  initBoard()
  addLog(`糖果大富翁游戏开始啦！${players[0].name}先行动～`)
  
  gameState.screen = 'game'
  drawGameScreen()
}

function initBoard() {
  const cells = []
  for (let i = 0; i < 121; i++) {
    cells.push(createCell(i))
  }
  gameState.boardCells = cells
  updatePlayerPositions()
}

function createCell(index) {
  const row = Math.floor(index / 11)
  const col = index % 11
  
  // 四个角落
  if (index === 0) {
    return { type: 'corner', name: '起点', icon: '🏁', hasPlayer: false, players: [] }
  }
  if (index === 10) {
    return { type: 'corner', name: '糖果银行', icon: '🏦', hasPlayer: false, players: [] }
  }
  if (index === 110) {
    return { type: 'corner', name: '休息区', icon: '🛌', hasPlayer: false, players: [] }
  }
  if (index === 120) {
    return { type: 'corner', name: '机会卡', icon: '🎴', hasPlayer: false, players: [] }
  }
  
  // 地产格子
  if (isPropertyCell(index)) {
    const properties = [
      { name: '糖果屋', price: 60, color: 'property-1' },
      { name: '巧克力工厂', price: 80, color: 'property-2' },
      { name: '冰淇淋店', price: 100, color: 'property-3' },
      { name: '棒棒糖森林', price: 120, color: 'property-4' },
      { name: '棉花糖云', price: 140, color: 'property-5' },
      { name: '果汁瀑布', price: 160, color: 'property-6' },
      { name: '饼干城堡', price: 180, color: 'property-1' },
      { name: '布丁乐园', price: 200, color: 'property-2' }
    ]
    const propIndex = getPropertyIndex(index)
    if (propIndex !== -1 && propIndex < properties.length) {
      return {
        type: 'property',
        ...properties[propIndex],
        icon: '🏠',
        hasPlayer: false,
        players: [],
        owner: null
      }
    }
  }
  
  // 陷阱格子
  if (isTrapCell(index)) {
    const traps = [
      { name: '粘粘糖', penalty: 50 },
      { name: '酸柠檬', penalty: 80 },
      { name: '迷雾森林', penalty: 100 },
      { name: '坏糖果', penalty: 60 }
    ]
    const trapIndex = getTrapIndex(index)
    if (trapIndex !== -1 && trapIndex < traps.length) {
      return {
        type: 'trap',
        ...traps[trapIndex],
        icon: '⚠️',
        hasPlayer: false,
        players: []
      }
    }
  }
  
  // 天气格子
  if (isWeatherCell(index)) {
    const weathers = [
      { name: '烈日', icon: '☀️', type: 'sunny' },
      { name: '风雪', icon: '❄️', type: 'snowy' },
      { name: '暴雨', icon: '🌧️', type: 'rainy' },
      { name: '彩虹', icon: '🌈', type: 'rainbow' }
    ]
    const weatherIndex = getWeatherIndex(index)
    if (weatherIndex !== -1 && weatherIndex < weathers.length) {
      return {
        type: 'weather',
        ...weathers[weatherIndex],
        hasPlayer: false,
        players: []
      }
    }
  }
  
  return { type: 'empty', hasPlayer: false, players: [] }
}

function isPropertyCell(index) {
  const row = Math.floor(index / 11)
  const col = index % 11
  return (row === 0 && col > 0 && col < 10) ||
         (row === 10 && col > 0 && col < 10) ||
         (col === 0 && row > 0 && row < 10) ||
         (col === 10 && row > 0 && row < 10)
}

function getPropertyIndex(cellIndex) {
  const propertyPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 21, 31, 41, 51, 61, 71, 81, 91, 101, 119, 109, 99, 89, 79, 69, 59, 49, 39, 29, 19, 11]
  return propertyPositions.indexOf(cellIndex)
}

function isTrapCell(index) {
  const trapPositions = [2, 5, 8, 22, 33, 44, 66, 77, 88, 98]
  return trapPositions.includes(index)
}

function getTrapIndex(cellIndex) {
  const trapPositions = [2, 5, 8, 22, 33, 44, 66, 77, 88, 98]
  return trapPositions.indexOf(cellIndex)
}

function isWeatherCell(index) {
  const weatherPositions = [12, 23, 34, 45, 56, 67, 78, 89, 100]
  return weatherPositions.includes(index)
}

function getWeatherIndex(cellIndex) {
  const weatherPositions = [12, 23, 34, 45, 56, 67, 78, 89, 100]
  return weatherPositions.indexOf(cellIndex)
}

function updatePlayerPositions() {
  const cells = [...gameState.boardCells]
  
  cells.forEach(cell => {
    cell.hasPlayer = false
    cell.players = []
  })
  
  gameState.players.forEach((player, index) => {
    const cell = cells[player.position]
    if (cell) {
      cell.hasPlayer = true
      cell.players.push(player)
    }
  })
  
  gameState.boardCells = cells
}

function rollDice() {
  if (gameState.diceValue !== '-') {
    return
  }
  
  if (gameState.playerJailTurns[gameState.currentIndex] > 0) {
    const currentPlayer = gameState.players[gameState.currentIndex]
    addLog(`${currentPlayer.name}还在监狱中，需要等待${gameState.playerJailTurns[gameState.currentIndex]}回合！`)
    
    gameState.playerJailTurns[gameState.currentIndex]--
    endTurn()
    return
  }
  
  const diceValue = Math.floor(Math.random() * 6) + 1
  gameState.diceValue = diceValue
  
  const currentPlayer = gameState.players[gameState.currentIndex]
  addLog(`${currentPlayer.name}掷出了 ${diceValue} 点！`)
  
  movePlayer(diceValue)
}

function movePlayer(steps) {
  const currentPlayer = gameState.players[gameState.currentIndex]
  const newPosition = (currentPlayer.position + steps) % 121
  
  currentPlayer.position = newPosition
  updatePlayerPositions()
  
  addLog(`${currentPlayer.name}移动到了第 ${newPosition + 1} 格`)
  
  const cell = gameState.boardCells[newPosition]
  if (cell.type === 'property') {
    handlePropertyLanding(newPosition)
  } else if (cell.type === 'trap') {
    handleTrapLanding(newPosition)
  } else if (cell.type === 'weather') {
    handleWeatherLanding(newPosition)
  } else if (cell.type === 'corner') {
    handleCornerLanding(newPosition)
  }
}

function handlePropertyLanding(position) {
  const cell = gameState.boardCells[position]
  const currentPlayer = gameState.players[gameState.currentIndex]
  
  if (cell.owner === null) {
    addLog(`发现无主的${cell.name}！可以购买哦～`)
    gameState.canBuy = true
  } else if (cell.owner === gameState.currentIndex) {
    addLog(`这是${currentPlayer.name}的${cell.name}，好好休息一下吧！`)
  } else {
    const rent = Math.floor(cell.price * 0.3)
    gameState.players[gameState.currentIndex].money -= rent
    gameState.players[cell.owner].money += rent
    addLog(`${currentPlayer.name}支付了${rent}金币给${gameState.players[cell.owner].name}作为${cell.name}的租金`)
  }
}

function handleTrapLanding(position) {
  const cell = gameState.boardCells[position]
  gameState.players[gameState.currentIndex].money -= cell.penalty
  addLog(`⚠️ ${cell.name}！失去${cell.penalty}金币`)
}

function handleWeatherLanding(position) {
  const cell = gameState.boardCells[position]
  const currentPlayer = gameState.players[gameState.currentIndex]
  
  switch (cell.type) {
    case 'sunny':
      gameState.playerJailTurns[gameState.currentIndex] = 1
      gameState.players[gameState.currentIndex].money -= 50
      addLog(`☀️ ${currentPlayer.name}遇到了烈日！太热了，需要休息1回合，失去50金币！`)
      break
    case 'snowy':
      gameState.players[gameState.currentIndex].money -= 30
      const backPosition = Math.max(0, currentPlayer.position - 3)
      gameState.players[gameState.currentIndex].position = backPosition
      updatePlayerPositions()
      addLog(`❄️ ${currentPlayer.name}遇到了风雪！被吹退了3步，失去30金币！`)
      break
    case 'rainy':
      gameState.players[gameState.currentIndex].money += 20
      const forwardPosition = (currentPlayer.position + 2) % 121
      gameState.players[gameState.currentIndex].position = forwardPosition
      updatePlayerPositions()
      addLog(`🌧️ ${currentPlayer.name}遇到了暴雨！被冲前了2步，获得20金币！`)
      break
    case 'rainbow':
      gameState.players[gameState.currentIndex].money += 50
      const randomPos = Math.floor(Math.random() * 121)
      gameState.players[gameState.currentIndex].position = randomPos
      updatePlayerPositions()
      addLog(`🌈 ${currentPlayer.name}遇到了彩虹！被传送到第${randomPos + 1}格，获得50金币！`)
      break
  }
}

function handleCornerLanding(position) {
  const currentPlayer = gameState.players[gameState.currentIndex]
  
  if (position === 10) {
    gameState.players[gameState.currentIndex].money += 200
    addLog(`${currentPlayer.name}经过糖果银行，获得200金币奖励！`)
  } else if (position === 110) {
    addLog(`${currentPlayer.name}在休息区放松了一下～`)
  } else if (position === 120) {
    drawChanceCard()
  }
}

function drawChanceCard() {
  const cards = [
    '捡到糖果！获得50金币',
    '帮助小动物！获得100金币',
    '参加派对！获得150金币',
    '生日礼物！获得200金币',
    '发现宝藏！获得300金币'
  ]
  
  const card = cards[Math.floor(Math.random() * cards.length)]
  const currentPlayer = gameState.players[gameState.currentIndex]
  const reward = parseInt(card.match(/\d+/)[0])
  
  gameState.players[gameState.currentIndex].money += reward
  addLog(`🎴 机会卡：${card}`)
}

function buyProperty() {
  const currentPlayer = gameState.players[gameState.currentIndex]
  const cell = gameState.boardCells[currentPlayer.position]
  
  if (cell.type !== 'property' || cell.owner !== null) {
    return
  }
  
  if (currentPlayer.money < cell.price) {
    return
  }
  
  gameState.players[gameState.currentIndex].money -= cell.price
  gameState.boardCells[currentPlayer.position].owner = gameState.currentIndex
  gameState.canBuy = false
  
  addLog(`${currentPlayer.name}成功购买了${cell.name}！`)
}

function endTurn() {
  gameState.diceValue = '-'
  gameState.canBuy = false
  
  gameState.currentIndex = (gameState.currentIndex + 1) % gameState.players.length
  
  const nextPlayer = gameState.players[gameState.currentIndex]
  addLog(`轮到${nextPlayer.name}行动啦！`)
  
  checkGameEnd()
}

function checkGameEnd() {
  const bankruptPlayers = gameState.players.filter(player => player.money <= 0)
  if (bankruptPlayers.length >= gameState.players.length - 1) {
    const winner = gameState.players.find(player => player.money > 0)
    if (winner) {
      addLog(`🎉 游戏结束！${winner.name}获得了胜利！`)
    }
  }
}

function addLog(message) {
  const log = [...gameState.gameLog]
  const time = new Date().toLocaleTimeString()
  log.push(`[${time}] ${message}`)
  gameState.gameLog = log
}

function handleCellClick(index) {
  const cell = gameState.boardCells[index]
  
  if (cell.type === 'property') {
    let ownerInfo = '无主'
    if (cell.owner !== null) {
      ownerInfo = gameState.players[cell.owner].name
    }
    addLog(`🏠 ${cell.name} - 价格: 💰${cell.price} - 主人: ${ownerInfo}`)
  }
}

function handleGameScreenTouch(x, y) {
  const screenWidth = canvas.width
  const screenHeight = canvas.height
  const centerY = screenHeight * 0.7
  const buttonWidth = Math.floor(160 * scale) // 与绘制一致
  const buttonHeight = Math.floor(70 * scale) // 与绘制一致
  
  console.log('Game screen touch:', x, y, 'Screen size:', screenWidth, screenHeight, 'Scale:', scale)
  
  // 掷骰子按钮 - 增大点击区域
  const diceBtnX = Math.floor(screenWidth / 2 - buttonWidth / 2)
  const diceBtnY = Math.floor(centerY - 50 * scale) // 与绘制一致
  const diceBtnPadding = Math.floor(30 * scale) // 增加点击区域
  console.log('Dice button area:', diceBtnX - diceBtnPadding, diceBtnY - diceBtnPadding, diceBtnX + buttonWidth + diceBtnPadding, diceBtnY + buttonHeight + diceBtnPadding)
  if (x >= diceBtnX - diceBtnPadding && x <= diceBtnX + buttonWidth + diceBtnPadding && 
      y >= diceBtnY - diceBtnPadding && y <= diceBtnY + buttonHeight + diceBtnPadding) {
    console.log('Dice button clicked!')
    rollDice()
    return
  }
  
  // 购买按钮 - 增大点击区域
  if (gameState.canBuy) {
    const buyBtnX = Math.floor(screenWidth / 2 - buttonWidth / 2)
    const buyBtnY = Math.floor(centerY + 50 * scale) // 与绘制一致
    if (x >= buyBtnX - diceBtnPadding && x <= buyBtnX + buttonWidth + diceBtnPadding && 
        y >= buyBtnY - diceBtnPadding && y <= buyBtnY + buttonHeight + diceBtnPadding) {
      console.log('Buy button clicked!')
      buyProperty()
      return
    }
  }
  
  // 结束回合按钮 - 增大点击区域
  const endBtnX = Math.floor(screenWidth / 2 - buttonWidth / 2)
  const endBtnY = Math.floor(centerY + 140 * scale) // 与绘制一致
  console.log('End turn button area:', endBtnX - diceBtnPadding, endBtnY - diceBtnPadding, endBtnX + buttonWidth + diceBtnPadding, endBtnY + buttonHeight + diceBtnPadding)
  if (x >= endBtnX - diceBtnPadding && x <= endBtnX + buttonWidth + diceBtnPadding && 
      y >= endBtnY - diceBtnPadding && y <= endBtnY + buttonHeight + diceBtnPadding) {
    console.log('End turn button clicked!')
    endTurn()
    return
  }
  
  // 棋盘格子点击
  const boardStartX = Math.floor(20 * scale)
  const boardStartY = Math.floor(screenHeight * 0.15)
  const cellSize = Math.floor(Math.min((screenWidth - 40 * scale) / 11, (screenHeight * 0.5) / 11))
  const cols = 11
  
  for (let i = 0; i < 121; i++) {
    const row = Math.floor(i / 11)
    const col = i % cols
    const cellX = boardStartX + col * cellSize
    const cellY = boardStartY + row * cellSize
    
    if (x >= cellX && x <= cellX + cellSize && y >= cellY && y <= cellY + cellSize) {
      handleCellClick(i)
      return
    }
  }
  
  console.log('Touch not in any button area')
}

// 绘制函数
function drawStartScreen() {
  const screenWidth = canvas.width
  const screenHeight = canvas.height
  
  // 背景
  ctx.fillStyle = '#ffccd5'
  ctx.fillRect(0, 0, screenWidth, screenHeight)
  
  // 标题
  ctx.fillStyle = '#ff6b6b'
  ctx.font = `bold ${Math.floor(36 * scale)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('🍭 糖果大富翁 🍬', screenWidth / 2, Math.floor(screenHeight * 0.1))
  
  // 玩家数量选择
  ctx.fillStyle = '#333'
  ctx.font = `${Math.floor(24 * scale)}px sans-serif`
  ctx.fillText('选择玩家数量', screenWidth / 2, Math.floor(screenHeight * 0.15))
  
  const playerBtnWidth = Math.floor(60 * scale)
  const playerBtnHeight = Math.floor(40 * scale)
  const playerBtnSpacing = Math.floor(15 * scale)
  const playerBtnStartX = Math.floor(screenWidth / 2 - (4 * playerBtnWidth + 3 * playerBtnSpacing) / 2)
  const playerBtnY = Math.floor(screenHeight * 0.18)
  
  for (let i = 2; i <= 5; i++) {
    const btnX = playerBtnStartX + (i - 2) * (playerBtnWidth + playerBtnSpacing)
    
    ctx.fillStyle = gameState.selectedCount === i ? '#ff6b6b' : '#fff'
    ctx.fillRect(btnX, playerBtnY, playerBtnWidth, playerBtnHeight)
    
    ctx.fillStyle = gameState.selectedCount === i ? '#fff' : '#333'
    ctx.font = `${Math.floor(20 * scale)}px sans-serif`
    ctx.fillText(`${i}人`, btnX + playerBtnWidth / 2, playerBtnY + Math.floor(28 * scale))
  }
  
  // 角色选择
  ctx.fillStyle = '#333'
  ctx.font = `${Math.floor(20 * scale)}px sans-serif`
  ctx.fillText(`选择角色 (${gameState.selectedCharacters.length}/${gameState.selectedCount})`, screenWidth / 2, Math.floor(screenHeight * 0.25))
  
  const charPadding = Math.floor(10 * scale)
  const charWidth = Math.floor((screenWidth - charPadding * 5) / 4)
  const charHeight = Math.floor(charWidth * 1.2)
  const charStartX = charPadding
  const charStartY = Math.floor(screenHeight * 0.28)
  const cols = 4
  
  for (let i = 0; i < gameState.characters.length; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    const charX = charStartX + col * (charWidth + charPadding)
    const charY = charStartY + row * (charHeight + charPadding)
    
    const isSelected = gameState.selectedCharacters.includes(i)
    
    ctx.fillStyle = isSelected ? '#ff6b6b' : '#fff'
    ctx.fillRect(charX, charY, charWidth, charHeight)
    
    ctx.font = `${Math.floor(charWidth * 0.5)}px sans-serif`
    ctx.fillText(gameState.characters[i].icon, charX + charWidth / 2, charY + Math.floor(charHeight * 0.45))
    
    ctx.font = `${Math.floor(charWidth * 0.18)}px sans-serif`
    ctx.fillText(gameState.characters[i].name, charX + charWidth / 2, charY + Math.floor(charHeight * 0.75))
  }
  
  // 开始游戏按钮
  const startBtnWidth = Math.floor(200 * scale)
  const startBtnHeight = Math.floor(60 * scale)
  const startBtnX = Math.floor(screenWidth / 2 - startBtnWidth / 2)
  const startBtnY = Math.floor(screenHeight * 0.85)
  
  const canStart = gameState.selectedCharacters.length === gameState.selectedCount
  ctx.fillStyle = canStart ? '#4ecdc4' : '#ccc'
  ctx.fillRect(startBtnX, startBtnY, startBtnWidth, startBtnHeight)
  
  ctx.fillStyle = '#fff'
  ctx.font = `${Math.floor(28 * scale)}px sans-serif`
  ctx.fillText('开始游戏', screenWidth / 2, startBtnY + Math.floor(40 * scale))
}

function drawGameScreen() {
  const screenWidth = canvas.width
  const screenHeight = canvas.height
  
  // 背景
  ctx.fillStyle = '#ffccd5'
  ctx.fillRect(0, 0, screenWidth, screenHeight)
  
  // 顶部玩家信息
  drawPlayerInfo(screenWidth, screenHeight)
  
  // 棋盘
  drawBoard(screenWidth, screenHeight)
  
  // 中间控制区
  drawControls(screenWidth, screenHeight)
  
  // 底部日志
  drawLog(screenWidth, screenHeight)
}

function drawPlayerInfo(screenWidth, screenHeight) {
  ctx.fillStyle = '#ff6b6b'
  ctx.fillRect(0, 0, screenWidth, Math.floor(screenHeight * 0.12))
  
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${Math.floor(18 * scale)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.fillText('所有玩家金币', screenWidth / 2, Math.floor(screenHeight * 0.04))
  
  const playerWidth = screenWidth / gameState.players.length
  gameState.players.forEach((player, index) => {
    const x = index * playerWidth
    const isCurrent = index === gameState.currentIndex
    
    ctx.fillStyle = isCurrent ? '#ffd93d' : '#fff'
    ctx.fillRect(x + Math.floor(5 * scale), Math.floor(screenHeight * 0.05), playerWidth - Math.floor(10 * scale), Math.floor(screenHeight * 0.05))
    
    ctx.fillStyle = '#333'
    ctx.font = `${Math.floor(12 * scale)}px sans-serif`
    ctx.fillText(`${player.icon} ${player.name}`, x + playerWidth / 2, Math.floor(screenHeight * 0.075))
    ctx.fillText(`💰${player.money}`, x + playerWidth / 2, Math.floor(screenHeight * 0.095))
  })
}

function drawBoard(screenWidth, screenHeight) {
  const boardStartX = Math.floor(20 * scale)
  const boardStartY = Math.floor(screenHeight * 0.15)
  const cellSize = Math.floor(Math.min((screenWidth - 40 * scale) / 11, (screenHeight * 0.5) / 11))
  
  for (let i = 0; i < 121; i++) {
    const row = Math.floor(i / 11)
    const col = i % 11
    const cellX = boardStartX + col * cellSize
    const cellY = boardStartY + row * cellSize
    const cell = gameState.boardCells[i]
    
    // 格子背景
    if (cell.type === 'property') {
      ctx.fillStyle = '#fff'
    } else if (cell.type === 'trap') {
      ctx.fillStyle = '#ffcccc'
    } else if (cell.type === 'weather') {
      ctx.fillStyle = '#cce5ff'
    } else if (cell.type === 'corner') {
      ctx.fillStyle = '#ffd93d'
    } else {
      ctx.fillStyle = '#f5f5f5'
    }
    
    ctx.fillRect(cellX, cellY, cellSize - 2, cellSize - 2)
    
    // 格子图标
    if (cell.icon) {
      ctx.font = `${Math.floor(cellSize * 0.4)}px sans-serif`
      ctx.fillText(cell.icon, cellX + cellSize / 2, cellY + Math.floor(cellSize * 0.5))
    }
    
    // 玩家标记
    if (cell.hasPlayer && cell.players.length > 0) {
      cell.players.forEach((player, pIndex) => {
        const markerX = cellX + Math.floor(5 * scale) + pIndex * Math.floor(12 * scale)
        const markerY = cellY + Math.floor(5 * scale) + pIndex * Math.floor(12 * scale)
        ctx.font = `${Math.floor(14 * scale)}px sans-serif`
        ctx.fillText(player.icon, markerX, markerY)
      })
    }
  }
}

function drawControls(screenWidth, screenHeight) {
  const centerY = screenHeight * 0.7
  const buttonWidth = Math.floor(160 * scale) // 增大按钮宽度
  const buttonHeight = Math.floor(70 * scale) // 增大按钮高度
  
  // 掷骰子按钮
  const diceBtnX = Math.floor(screenWidth / 2 - buttonWidth / 2)
  const diceBtnY = Math.floor(centerY - 50 * scale) // 调整位置
  
  ctx.fillStyle = gameState.diceValue === '-' ? '#4ecdc4' : '#ccc'
  ctx.fillRect(diceBtnX, diceBtnY, buttonWidth, buttonHeight)
  
  ctx.fillStyle = '#fff'
  ctx.font = `${Math.floor(28 * scale)}px sans-serif` // 增大字体
  ctx.fillText(`🎲 ${gameState.diceValue === '-' ? '掷骰子' : gameState.diceValue}`, screenWidth / 2, diceBtnY + Math.floor(48 * scale))
  
  // 购买按钮
  if (gameState.canBuy) {
    const buyBtnX = Math.floor(screenWidth / 2 - buttonWidth / 2)
    const buyBtnY = Math.floor(centerY + 50 * scale) // 调整位置
    
    ctx.fillStyle = '#ff6b6b'
    ctx.fillRect(buyBtnX, buyBtnY, buttonWidth, buttonHeight)
    
    ctx.fillStyle = '#fff'
    ctx.fillText('购买地产', screenWidth / 2, buyBtnY + Math.floor(48 * scale))
  }
  
  // 结束回合按钮
  const endBtnX = Math.floor(screenWidth / 2 - buttonWidth / 2)
  const endBtnY = Math.floor(centerY + 140 * scale) // 调整位置
  
  ctx.fillStyle = '#6b5b95'
  ctx.fillRect(endBtnX, endBtnY, buttonWidth, buttonHeight)
  
  ctx.fillStyle = '#fff'
  ctx.fillText('结束回合', screenWidth / 2, endBtnY + Math.floor(48 * scale))
}

function drawLog(screenWidth, screenHeight) {
  const logY = Math.floor(screenHeight * 0.85)
  const logHeight = Math.floor(screenHeight * 0.15)
  
  ctx.fillStyle = '#fff'
  ctx.fillRect(Math.floor(10 * scale), logY, screenWidth - Math.floor(20 * scale), logHeight - Math.floor(10 * scale))
  
  ctx.fillStyle = '#333'
  ctx.font = `${Math.floor(12 * scale)}px sans-serif`
  ctx.textAlign = 'left'
  
  const recentLogs = gameState.gameLog.slice(-5)
  recentLogs.forEach((log, index) => {
    ctx.fillText(log, Math.floor(20 * scale), logY + Math.floor(20 * scale) + index * Math.floor(18 * scale))
  })
}

// 初始化
drawStartScreen()

// 添加触摸测试 - 在屏幕上显示触摸位置
let lastTouchX = -1
let lastTouchY = -1

// 修改 handleTouchStart 函数来记录触摸位置
const originalHandleTouchStart = handleTouchStart
handleTouchStart = function(e) {
  if (!e.touches || e.touches.length === 0) {
    console.log('No touches found!')
    return
  }
  
  const touch = e.touches[0]
  lastTouchX = touch.x || touch.clientX || 0
  lastTouchY = touch.y || touch.clientY || 0
  
  console.log('Touch recorded:', lastTouchX, lastTouchY)
  
  // 在屏幕上绘制触摸位置
  drawTouchIndicator(lastTouchX, lastTouchY)
  
  // 调用原始处理函数
  originalHandleTouchStart(e)
}

function drawTouchIndicator(x, y) {
  // 重新绘制当前屏幕
  if (gameState.screen === 'start') {
    drawStartScreen()
  } else if (gameState.screen === 'game') {
    drawGameScreen()
  }
  
  // 绘制触摸指示器
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
  ctx.beginPath()
  ctx.arc(x, y, 20, 0, Math.PI * 2)
  ctx.fill()
  
  ctx.fillStyle = 'rgba(255, 0, 0, 1)'
  ctx.beginPath()
  ctx.arc(x, y, 5, 0, Math.PI * 2)
  ctx.fill()
  
  // 显示坐标
  ctx.fillStyle = '#000'
  ctx.font = '14px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`(${Math.floor(x)}, ${Math.floor(y)})`, x + 25, y)
}
