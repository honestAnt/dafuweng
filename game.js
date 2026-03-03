// 糖果大富翁游戏 - 儿童版
class CandyMonopoly {
    constructor() {
        this.allCharacters = [
            { name: '小兔子', marker: '🐰', color: '#ff6b6b' },
            { name: '小熊', marker: '🐻', color: '#4ecdc4' },
            { name: '小猫咪', marker: '🐱', color: '#ffd93d' },
            { name: '小狗狗', marker: '🐶', color: '#6b5b95' },
            { name: '小熊猫', marker: '🐼', color: '#ff85a2' },
            { name: '小狐狸', marker: '🦊', color: '#ff6b9d' },
            { name: '小狮子', marker: '🦁', color: '#ffa502' },
            { name: '小老虎', marker: '🐯', color: '#ff7f50' },
            { name: '小青蛙', marker: '🐸', color: '#7bed9f' },
            { name: '小乌龟', marker: '🐢', color: '#2ed573' },
            { name: '小鲨鱼', marker: '🦈', color: '#1e90ff' },
            { name: '小汽车', marker: '🚗', color: '#ff4757' },
            { name: '小火箭', marker: '🚀', color: '#5352ed' },
            { name: '小星星', marker: '⭐', color: '#ffd700' },
            { name: '小月亮', marker: '🌙', color: '#70a1ff' },
            { name: '奥特曼', marker: '🦸', color: '#ff6348' },
            { name: '小机器人', marker: '🤖', color: '#747d8c' },
            { name: '独角兽', marker: '🦄', color: '#ff69b4' },
            { name: '小龙', marker: '🐲', color: '#ff4500' },
            { name: '小气球', marker: '🎈', color: '#ff1493' }
        ];
        
        this.players = [];
        this.currentPlayerIndex = 0;
        this.gameStarted = false;
        this.diceValue = 0;
        this.selectedPlayerCount = 4;
        this.selectedCharacterIndices = [];
        
        // 玩家监狱状态
        this.playerJailTurns = {}; // 记录每个玩家在监狱的剩余回合数
        this.playerBankSavings = {}; // 记录每个玩家的银行存款
        this.playerWeatherEffects = {}; // 记录每个玩家的天气效果
        
        // 糖果主题的地产 - 分布在四周和中间
        this.properties = [
            // 顶部（从左到右）
            { name: '糖果屋', price: 60, rent: 20, owner: null, color: 'property-1' },
            { name: '巧克力工厂', price: 80, rent: 30, owner: null, color: 'property-2' },
            { name: '冰淇淋店', price: 100, rent: 40, owner: null, color: 'property-3' },
            { name: '棒棒糖森林', price: 120, rent: 50, owner: null, color: 'property-4' },
            // 右侧（从上到下）
            { name: '棉花糖云', price: 140, rent: 60, owner: null, color: 'property-5' },
            { name: '果汁瀑布', price: 160, rent: 70, owner: null, color: 'property-6' },
            { name: '饼干城堡', price: 180, rent: 80, owner: null, color: 'property-1' },
            { name: '布丁乐园', price: 200, rent: 90, owner: null, color: 'property-2' },
            // 底部（从右到左）
            { name: '甜甜圈店', price: 220, rent: 100, owner: null, color: 'property-3' },
            { name: '果冻花园', price: 240, rent: 110, owner: null, color: 'property-4' },
            { name: '彩虹桥', price: 260, rent: 120, owner: null, color: 'property-5' },
            { name: '星星糖', price: 280, rent: 130, owner: null, color: 'property-6' },
            // 左侧（从下到上）
            { name: '月亮糖', price: 300, rent: 140, owner: null, color: 'property-1' },
            { name: '太阳糖', price: 320, rent: 150, owner: null, color: 'property-2' },
            { name: '云朵糖', price: 340, rent: 160, owner: null, color: 'property-3' },
            { name: '雨滴糖', price: 360, rent: 170, owner: null, color: 'property-4' },
            // 中间区域
            { name: '蜂蜜罐', price: 150, rent: 50, owner: null, color: 'property-5' },
            { name: '草莓田', price: 170, rent: 55, owner: null, color: 'property-6' },
            { name: '葡萄园', price: 190, rent: 60, owner: null, color: 'property-1' },
            { name: '橘子林', price: 210, rent: 65, owner: null, color: 'property-2' },
            { name: '苹果园', price: 230, rent: 70, owner: null, color: 'property-3' },
            { name: '香蕉岛', price: 250, rent: 75, owner: null, color: 'property-4' },
            { name: '樱桃山', price: 270, rent: 80, owner: null, color: 'property-5' },
            { name: '蓝莓湖', price: 290, rent: 85, owner: null, color: 'property-6' }
        ];
        
        // 陷阱格子 - 分布在四周和中间
        this.traps = [
            { name: '粘粘糖', penalty: 50, description: '被粘住了！失去50金币' },
            { name: '酸柠檬', penalty: 80, description: '吃到酸柠檬！失去80金币' },
            { name: '迷雾森林', penalty: 100, description: '迷路了！失去100金币' },
            { name: '坏糖果', penalty: 60, description: '吃到坏糖果！失去60金币' },
            { name: '泥坑', penalty: 70, description: '掉进泥坑！失去70金币' },
            { name: '荆棘丛', penalty: 90, description: '被荆棘扎到！失去90金币' },
            { name: '蜘蛛网', penalty: 55, description: '被蜘蛛网缠住！失去55金币' },
            { name: '沼泽地', penalty: 85, description: '陷入沼泽！失去85金币' },
            { name: '毒蘑菇', penalty: 75, description: '吃到毒蘑菇！失去75金币' },
            { name: '冰窟窿', penalty: 95, description: '掉进冰窟窿！失去95金币' }
        ];
        
        // 特殊格子
        this.specialCells = {
            jail: { name: '糖果监狱', icon: '🏢', description: '停留2回合' },
            bank: { name: '糖果银行', icon: '🏦', description: '存钱或取钱' },
            hospital: { name: '糖果医院', icon: '🏥', description: '恢复100金币' },
            casino: { name: '糖果赌场', icon: '🎰', description: '双倍或失去' },
            gift: { name: '礼物屋', icon: '🎁', description: '随机礼物' },
            teleport: { name: '传送门', icon: '🌀', description: '随机传送' },
            treasure: { name: '宝藏岛', icon: '💎', description: '发现宝藏' },
            magic: { name: '魔法屋', icon: '🧙', description: '魔法效果' }
        };
        
        // 天气格子
        this.weatherCells = [
            { name: '烈日', icon: '☀️', type: 'sunny', effect: '停留1回合，失去50金币' },
            { name: '风雪', icon: '❄️', type: 'snowy', effect: '后退3步，失去30金币' },
            { name: '暴雨', icon: '🌧️', type: 'rainy', effect: '前进2步，获得20金币' },
            { name: '彩虹', icon: '🌈', type: 'rainbow', effect: '随机传送，获得50金币' }
        ];
        
        this.setupStartScreen();
    }
    
    setupStartScreen() {
        const buttons = document.querySelectorAll('.player-count-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectedPlayerCount = parseInt(button.dataset.count);
                this.updateCharacterSelection();
            });
        });
        
        // 角色选择事件
        const characters = document.querySelectorAll('.character');
        characters.forEach(char => {
            char.addEventListener('click', () => {
                const index = parseInt(char.dataset.index);
                this.toggleCharacterSelection(index);
            });
        });
        
        // 开始游戏按钮事件
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
    }
    
    updateCharacterSelection() {
        const characters = document.querySelectorAll('.character');
        characters.forEach(char => {
            const index = parseInt(char.dataset.index);
            if (this.selectedCharacterIndices.includes(index)) {
                char.classList.add('selected');
            } else {
                char.classList.remove('selected');
            }
        });
        
        // 如果已选角色数量超过当前选择的玩家数量，移除多余的角色
        while (this.selectedCharacterIndices.length > this.selectedPlayerCount) {
            this.selectedCharacterIndices.pop();
        }
        
        this.updateSelectedCharactersDisplay();
    }
    
    toggleCharacterSelection(index) {
        const charElement = document.querySelector(`.character[data-index="${index}"]`);
        
        if (this.selectedCharacterIndices.includes(index)) {
            // 取消选择
            this.selectedCharacterIndices = this.selectedCharacterIndices.filter(i => i !== index);
            charElement.classList.remove('selected');
        } else {
            // 选择角色
            if (this.selectedCharacterIndices.length < this.selectedPlayerCount) {
                this.selectedCharacterIndices.push(index);
                charElement.classList.add('selected');
            } else {
                this.addLog(`最多只能选择${this.selectedPlayerCount}个角色！`);
                return;
            }
        }
        
        this.updateSelectedCharactersDisplay();
    }
    
    updateSelectedCharactersDisplay() {
        const display = document.getElementById('selected-characters-display');
        display.innerHTML = '';
        
        if (this.selectedCharacterIndices.length === 0) {
            display.innerHTML = '<span style="color: #999;">请选择角色...</span>';
        } else {
            this.selectedCharacterIndices.forEach(index => {
                const char = this.allCharacters[index];
                const item = document.createElement('div');
                item.className = 'selected-character';
                item.innerHTML = `${char.marker} ${char.name}`;
                display.appendChild(item);
            });
        }
        
        // 更新开始按钮状态
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            if (this.selectedCharacterIndices.length >= this.selectedPlayerCount) {
                startBtn.disabled = false;
                startBtn.textContent = `🎮 开始游戏 (${this.selectedCharacterIndices.length}/${this.selectedPlayerCount})`;
            } else {
                startBtn.disabled = true;
                startBtn.textContent = `🎮 开始游戏 (${this.selectedCharacterIndices.length}/${this.selectedPlayerCount})`;
            }
        }
    }
    
    startGame() {
        // 检查是否选择了足够的角色
        if (this.selectedCharacterIndices.length < this.selectedPlayerCount) {
            // 如果没有选择足够的角色，自动选择前N个角色
            for (let i = 0; i < this.selectedPlayerCount; i++) {
                if (!this.selectedCharacterIndices.includes(i)) {
                    this.selectedCharacterIndices.push(i);
                }
            }
        }
        
        // 根据选择的角色初始化玩家
        this.players = this.selectedCharacterIndices.map(index => {
            const char = this.allCharacters[index];
            return {
                name: char.name,
                money: 1000,
                position: 0,
                marker: char.marker,
                color: char.color
            };
        });
        
        // 初始化玩家监狱和银行状态
        this.players.forEach((player, index) => {
            this.playerJailTurns[index] = 0;
            this.playerBankSavings[index] = 0;
            this.playerWeatherEffects[index] = null;
        });
        
        // 隐藏开始界面，显示游戏界面
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        
        this.initGame();
    }
    
    initGame() {
        this.createBoard();
        this.setupEventListeners();
        this.updateGameInfo();
        this.updateAllPlayersMoney();
        this.addLog(`糖果大富翁游戏开始啦！${this.players[0].name}先行动～`);
    }
    
    createBoard() {
        const board = document.querySelector('.game-board');
        board.innerHTML = '';
        
        // 创建11x11的棋盘
        for (let i = 0; i < 121; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // 四个角落
            if (i === 0 || i === 10 || i === 110 || i === 120) {
                cell.className += ' corner';
                const cornerNames = ['起点 🏁', '糖果银行 🏦', '休息区 🛌', '机会卡 🎴'];
                cell.textContent = cornerNames[Math.floor(i / (i === 0 ? 1 : i === 10 ? 10 : i === 110 ? 110 : 120))];
            }
            // 特殊格子
            else if (this.isSpecialCell(i)) {
                const specialType = this.getSpecialCellType(i);
                if (specialType) {
                    const special = this.specialCells[specialType];
                    cell.className += ` special ${specialType}`;
                    cell.innerHTML = `
                        <div>${special.icon}</div>
                        <div>${special.name}</div>
                    `;
                    cell.dataset.specialType = specialType;
                }
            }
            // 天气格子
            else if (this.isWeatherCell(i)) {
                const weatherIndex = this.getWeatherIndex(i);
                if (weatherIndex !== -1) {
                    const weather = this.weatherCells[weatherIndex];
                    cell.className += ` weather ${weather.type}`;
                    cell.innerHTML = `
                        <div>${weather.icon}</div>
                        <div>${weather.name}</div>
                    `;
                    cell.dataset.weatherIndex = weatherIndex;
                }
            }
            // 陷阱格子
            else if (this.isTrapCell(i)) {
                const trapIndex = this.getTrapIndex(i);
                if (trapIndex !== -1) {
                    const trap = this.traps[trapIndex];
                    cell.className += ' trap';
                    cell.innerHTML = `
                        <div>${trap.name}</div>
                        <div>⚠️-${trap.penalty}</div>
                    `;
                    cell.dataset.trapIndex = trapIndex;
                }
            }
            // 地产格子
            else if (this.isPropertyCell(i)) {
                const propIndex = this.getPropertyIndex(i);
                if (propIndex !== -1) {
                    const property = this.properties[propIndex];
                    cell.className += ` property ${property.color}`;
                    cell.innerHTML = `
                        <div>${property.name}</div>
                        <div>💰${property.price}</div>
                    `;
                    cell.dataset.propertyIndex = propIndex;
                }
            }
            // 中间空白区域
            else {
                cell.className += ' empty';
            }
            
            board.appendChild(cell);
        }
        
        this.updatePlayerPositions();
    }
    
    isPropertyCell(index) {
        // 检查是否是地产格子的逻辑 - 分布在四周和中间
        const row = Math.floor(index / 11);
        const col = index % 11;
        
        // 顶部（第0行，第1-9列）
        if (row === 0 && col > 0 && col < 10) return true;
        // 右侧（第10列，第1-9行）
        if (col === 10 && row > 0 && row < 10) return true;
        // 底部（第10行，第1-9列）
        if (row === 10 && col > 0 && col < 10) return true;
        // 左侧（第0列，第1-9行）
        if (col === 0 && row > 0 && row < 10) return true;
        
        // 中间区域的地产
        const middleProperties = [13, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49, 56, 57, 58, 59, 60, 64, 65, 66, 67, 68, 72, 73, 74, 75, 76, 80, 81, 82, 83, 84, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106];
        return middleProperties.includes(index);
    }
    
    isSpecialCell(index) {
        // 特殊格子的位置
        const specialPositions = {
            jail: [55],
            hospital: [65],
            casino: [75],
            gift: [85],
            teleport: [95],
            treasure: [105],
            magic: [115]
        };
        
        for (const [type, positions] of Object.entries(specialPositions)) {
            if (positions.includes(index)) {
                return type;
            }
        }
        return null;
    }
    
    isWeatherCell(index) {
        // 天气格子的位置
        const weatherPositions = [12, 23, 34, 45, 56, 67, 78, 89, 100];
        return weatherPositions.includes(index);
    }
    
    getWeatherIndex(cellIndex) {
        const weatherPositions = [12, 23, 34, 45, 56, 67, 78, 89, 100];
        const index = weatherPositions.indexOf(cellIndex);
        return index < this.weatherCells.length ? index : -1;
    }
    
    getSpecialCellType(cellIndex) {
        const specialPositions = {
            jail: [55],
            hospital: [65],
            casino: [75],
            gift: [85],
            teleport: [95],
            treasure: [105],
            magic: [115]
        };
        
        for (const [type, positions] of Object.entries(specialPositions)) {
            if (positions.includes(cellIndex)) {
                return type;
            }
        }
        return null;
    }
    
    isTrapCell(index) {
        // 陷阱格子的位置 - 分布在四周和中间
        const trapPositions = [2, 5, 8, 22, 33, 44, 66, 77, 88, 98, 95, 92, 32, 54, 76, 23, 34, 45, 56, 67, 78, 89, 100];
        return trapPositions.includes(index);
    }
    
    getTrapIndex(cellIndex) {
        const trapPositions = [2, 5, 8, 22, 33, 44, 66, 77, 88, 98, 95, 92, 32, 54, 76, 23, 34, 45, 56, 67, 78, 89, 100];
        const index = trapPositions.indexOf(cellIndex);
        return index < this.traps.length ? index : -1;
    }
    
    getPropertyIndex(cellIndex) {
        // 将棋盘位置映射到地产索引 - 按顺时针方向
        const propertyPositions = [
            // 顶部（从左到右）
            1, 3, 4, 6, 7, 9,
            // 右侧（从上到下）
            21, 31, 41, 51, 61, 71, 81, 91,
            // 底部（从右到左）
            119, 109, 99, 89, 79, 69, 59, 49, 39, 29, 19,
            // 左侧（从下到上）
            11,
            // 中间区域
            13, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49, 56, 57, 58, 59, 60, 64, 65, 66, 67, 68, 72, 73, 74, 75, 76, 80, 81, 82, 83, 84, 91, 92, 93, 94, 95, 102, 103, 104, 105, 106
        ];
        const index = propertyPositions.indexOf(cellIndex);
        return index < this.properties.length ? index : -1;
    }
    
    updatePlayerPositions() {
        // 清除所有玩家标记
        document.querySelectorAll('.player-marker').forEach(marker => marker.remove());
        
        // 添加玩家标记（显示角色logo）
        this.players.forEach((player, index) => {
            const cell = document.querySelectorAll('.cell')[player.position];
            if (cell) {
                const marker = document.createElement('div');
                marker.className = `player-marker player-${index + 1}`;
                marker.textContent = player.marker;
                marker.title = player.name;
                
                // 根据玩家数量调整标记位置，避免重叠
                const offset = (index - Math.floor(this.players.length / 2)) * 8;
                marker.style.transform = `translate(calc(-50% + ${offset}px), -50%)`;
                
                cell.appendChild(marker);
            }
        });
    }
    
    setupEventListeners() {
        document.getElementById('roll-dice').addEventListener('click', () => this.rollDice());
        document.getElementById('buy-property').addEventListener('click', () => this.buyProperty());
        document.getElementById('end-turn').addEventListener('click', () => this.endTurn());
        
        // 地产点击事件
        document.querySelectorAll('.property').forEach(cell => {
            cell.addEventListener('click', (e) => {
                const propIndex = e.currentTarget.dataset.propertyIndex;
                if (propIndex !== undefined) {
                    this.showPropertyInfo(parseInt(propIndex));
                }
            });
        });
    }
    
    rollDice() {
        if (this.diceValue > 0) {
            this.addLog('请先完成当前行动！');
            return;
        }
        
        // 检查是否在监狱中
        if (this.playerJailTurns[this.currentPlayerIndex] > 0) {
            const currentPlayer = this.players[this.currentPlayerIndex];
            this.addLog(`${currentPlayer.name}还在监狱中，需要等待${this.playerJailTurns[this.currentPlayerIndex]}回合！`);
            this.playerJailTurns[this.currentPlayerIndex]--;
            this.endTurn();
            return;
        }
        
        this.diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice-value').textContent = this.diceValue;
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        this.addLog(`${currentPlayer.name}掷出了 ${this.diceValue} 点！`);
        
        this.movePlayer(this.diceValue);
    }
    
    movePlayer(steps) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const newPosition = (currentPlayer.position + steps) % 121;
        
        currentPlayer.position = newPosition;
        this.updatePlayerPositions();
        
        this.addLog(`${currentPlayer.name}移动到了第 ${newPosition + 1} 格`);
        
        // 检查是否到达天气格子
        const weatherIndex = this.getWeatherIndex(newPosition);
        if (weatherIndex !== -1) {
            this.handleWeatherLanding(weatherIndex);
        }
        // 检查是否到达特殊格子
        else {
            const specialType = this.getSpecialCellType(newPosition);
            if (specialType) {
                this.handleSpecialCellLanding(specialType);
            }
            // 检查是否到达陷阱
            else {
                const trapIndex = this.getTrapIndex(newPosition);
                if (trapIndex !== -1) {
                    this.handleTrapLanding(trapIndex);
                }
                // 检查是否到达地产
                else {
                    const propIndex = this.getPropertyIndex(newPosition);
                    if (propIndex !== -1) {
                        this.handlePropertyLanding(propIndex);
                    } else {
                        this.handleCornerCell(newPosition);
                    }
                }
            }
        }
    }
    
    handleWeatherLanding(weatherIndex) {
        const weather = this.weatherCells[weatherIndex];
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        switch (weather.type) {
            case 'sunny':
                // 烈日：停留1回合，失去50金币
                this.playerJailTurns[this.currentPlayerIndex] = 1;
                currentPlayer.money -= 50;
                this.addLog(`☀️ ${currentPlayer.name}遇到了烈日！太热了，需要休息1回合，失去50金币！`);
                break;
            case 'snowy':
                // 风雪：后退3步，失去30金币
                currentPlayer.money -= 30;
                const backPosition = Math.max(0, currentPlayer.position - 3);
                currentPlayer.position = backPosition;
                this.updatePlayerPositions();
                this.addLog(`❄️ ${currentPlayer.name}遇到了风雪！被吹退了3步，失去30金币！`);
                // 检查新位置
                this.checkNewPosition(backPosition);
                break;
            case 'rainy':
                // 暴雨：前进2步，获得20金币
                currentPlayer.money += 20;
                const forwardPosition = (currentPlayer.position + 2) % 121;
                currentPlayer.position = forwardPosition;
                this.updatePlayerPositions();
                this.addLog(`🌧️ ${currentPlayer.name}遇到了暴雨！被冲前了2步，获得20金币！`);
                // 检查新位置
                this.checkNewPosition(forwardPosition);
                break;
            case 'rainbow':
                // 彩虹：随机传送，获得50金币
                currentPlayer.money += 50;
                const randomPos = Math.floor(Math.random() * 121);
                currentPlayer.position = randomPos;
                this.updatePlayerPositions();
                this.addLog(`🌈 ${currentPlayer.name}遇到了彩虹！被传送到第${randomPos + 1}格，获得50金币！`);
                // 检查新位置
                this.checkNewPosition(randomPos);
                break;
        }
        
        this.updateGameInfo();
        this.updateAllPlayersMoney();
    }
    
    checkNewPosition(position) {
        // 检查新位置是否有特殊效果
        const specialType = this.getSpecialCellType(position);
        if (specialType) {
            this.handleSpecialCellLanding(specialType);
        }
        
        const weatherIndex = this.getWeatherIndex(position);
        if (weatherIndex !== -1) {
            this.handleWeatherLanding(weatherIndex);
        }
        
        const trapIndex = this.getTrapIndex(position);
        if (trapIndex !== -1) {
            this.handleTrapLanding(trapIndex);
        }
    }
    
    handleTrapLanding(trapIndex) {
        const trap = this.traps[trapIndex];
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        currentPlayer.money -= trap.penalty;
        this.addLog(`⚠️ ${trap.description}`);
        this.updateGameInfo();
        this.updateAllPlayersMoney();
    }
    
    handlePropertyLanding(propIndex) {
        const property = this.properties[propIndex];
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        if (property.owner === null) {
            this.addLog(`发现无主的${property.name}！可以购买哦～`);
            document.getElementById('buy-property').disabled = false;
        } else if (property.owner === this.currentPlayerIndex) {
            this.addLog(`这是${currentPlayer.name}的${property.name}，好好休息一下吧！`);
        } else {
            const rent = property.rent;
            currentPlayer.money -= rent;
            this.players[property.owner].money += rent;
            
            this.addLog(`${currentPlayer.name}支付了${rent}金币给${this.players[property.owner].name}作为${property.name}的租金`);
            this.updateGameInfo();
            this.updateAllPlayersMoney();
        }
    }
    
    handleSpecialCellLanding(specialType) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        switch (specialType) {
            case 'jail':
                this.playerJailTurns[this.currentPlayerIndex] = 2;
                this.addLog(`🏢 ${currentPlayer.name}被关进了糖果监狱！需要停留2回合！`);
                break;
            case 'hospital':
                currentPlayer.money += 100;
                this.addLog(`🏥 ${currentPlayer.name}在糖果医院恢复了健康，获得100金币！`);
                this.updateAllPlayersMoney();
                break;
            case 'casino':
                this.handleCasino();
                break;
            case 'gift':
                this.handleGift();
                break;
            case 'teleport':
                this.handleTeleport();
                break;
            case 'treasure':
                this.handleTreasure();
                break;
            case 'magic':
                this.handleMagic();
                break;
        }
        
        this.updateGameInfo();
    }
    
    handleCornerCell(position) {
        const currentPlayer = this.players[this.currentPlayerIndex];
        
        if (position === 10) { // 糖果银行
            this.handleBank();
        } else if (position === 110) { // 休息区
            this.addLog(`${currentPlayer.name}在休息区放松了一下～`);
        } else if (position === 120) { // 机会卡
            this.drawChanceCard();
        }
        
        this.updateGameInfo();
    }
    
    handleBank() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const savings = this.playerBankSavings[this.currentPlayerIndex];
        
        if (savings > 0) {
            // 可以取钱
            const interest = Math.floor(savings * 0.1); // 10%利息
            const total = savings + interest;
            currentPlayer.money += total;
            this.playerBankSavings[this.currentPlayerIndex] = 0;
            this.addLog(`🏦 ${currentPlayer.name}从银行取出了${total}金币（含${interest}利息）！`);
        } else {
            // 可以存钱
            const depositAmount = Math.min(200, currentPlayer.money);
            if (depositAmount > 0) {
                currentPlayer.money -= depositAmount;
                this.playerBankSavings[this.currentPlayerIndex] += depositAmount;
                this.addLog(`🏦 ${currentPlayer.name}在银行存入了${depositAmount}金币！`);
            } else {
                this.addLog(`${currentPlayer.name}没有足够的金币可以存入银行！`);
            }
        }
        
        this.updateAllPlayersMoney();
    }
    
    handleCasino() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const bet = Math.min(100, currentPlayer.money);
        
        if (bet <= 0) {
            this.addLog(`${currentPlayer.name}没有金币可以赌博！`);
            return;
        }
        
        const win = Math.random() > 0.5; // 50%几率
        if (win) {
            const winnings = bet * 2;
            currentPlayer.money += winnings;
            this.addLog(`🎰 ${currentPlayer.name}在赌场赢了！获得${winnings}金币！`);
        } else {
            currentPlayer.money -= bet;
            this.addLog(`🎰 ${currentPlayer.name}在赌场输了！失去${bet}金币！`);
        }
        
        this.updateAllPlayersMoney();
    }
    
    handleGift() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const gifts = [
            { name: '金币袋', value: 150 },
            { name: '神秘宝箱', value: 200 },
            { name: '幸运星', value: 100 },
            { name: '超级大奖', value: 300 }
        ];
        
        const gift = gifts[Math.floor(Math.random() * gifts.length)];
        currentPlayer.money += gift.value;
        this.addLog(`🎁 ${currentPlayer.name}收到了${gift.name}！获得${gift.value}金币！`);
        this.updateAllPlayersMoney();
    }
    
    handleTeleport() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const randomPosition = Math.floor(Math.random() * 121);
        
        currentPlayer.position = randomPosition;
        this.updatePlayerPositions();
        this.addLog(`🌀 ${currentPlayer.name}被传送到了第${randomPosition + 1}格！`);
        
        // 检查新位置
        const specialType = this.getSpecialCellType(randomPosition);
        if (specialType) {
            this.handleSpecialCellLanding(specialType);
        }
    }
    
    handleTreasure() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const treasureValues = [100, 150, 200, 250, 300];
        const value = treasureValues[Math.floor(Math.random() * treasureValues.length)];
        
        currentPlayer.money += value;
        this.addLog(`💎 ${currentPlayer.name}发现了宝藏！获得${value}金币！`);
        this.updateAllPlayersMoney();
    }
    
    handleMagic() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const magicEffects = [
            { name: '魔法金币', effect: () => { currentPlayer.money += 150; return '获得150金币'; } },
            { name: '魔法护盾', effect: () => { return '获得魔法保护，下次陷阱减半'; } },
            { name: '魔法传送', effect: () => { 
                const newPos = Math.floor(Math.random() * 121);
                currentPlayer.position = newPos;
                this.updatePlayerPositions();
                return `传送到第${newPos + 1}格`;
            }},
            { name: '魔法祝福', effect: () => { currentPlayer.money += 200; return '获得200金币'; } }
        ];
        
        const magic = magicEffects[Math.floor(Math.random() * magicEffects.length)];
        const result = magic.effect();
        this.addLog(`🧙 ${currentPlayer.name}遇到了${magic.name}！${result}`);
        this.updateAllPlayersMoney();
    }
    
    drawChanceCard() {
        const cards = [
            '捡到糖果！获得50金币',
            '帮助小动物！获得100金币',
            '参加派对！获得150金币',
            '生日礼物！获得200金币',
            '发现宝藏！获得300金币'
        ];
        
        const card = cards[Math.floor(Math.random() * cards.length)];
        const currentPlayer = this.players[this.currentPlayerIndex];
        const reward = parseInt(card.match(/\d+/)[0]);
        
        currentPlayer.money += reward;
        this.addLog(`🎴 机会卡：${card}`);
        this.updateGameInfo();
        this.updateAllPlayersMoney();
    }
    
    buyProperty() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const propIndex = this.getPropertyIndex(currentPlayer.position);
        
        if (propIndex === -1) {
            this.addLog('这里不能购买地产哦！');
            return;
        }
        
        const property = this.properties[propIndex];
        
        if (property.owner !== null) {
            this.addLog('这个地产已经有主人啦！');
            return;
        }
        
        if (currentPlayer.money < property.price) {
            this.addLog('金币不够购买这个地产哦！');
            return;
        }
        
        currentPlayer.money -= property.price;
        property.owner = this.currentPlayerIndex;
        
        // 更新地产显示
        const cell = document.querySelector(`[data-property-index="${propIndex}"]`);
        if (cell) {
            cell.classList.add('owned');
            cell.style.opacity = '0.8';
        }
        
        this.addLog(`${currentPlayer.name}成功购买了${property.name}！`);
        document.getElementById('buy-property').disabled = true;
        this.updateGameInfo();
        this.updateAllPlayersMoney();
    }
    
    endTurn() {
        this.diceValue = 0;
        document.getElementById('dice-value').textContent = '-';
        document.getElementById('buy-property').disabled = true;
        
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        const nextPlayer = this.players[this.currentPlayerIndex];
        
        // 检查下一个玩家是否在监狱中
        if (this.playerJailTurns[this.currentPlayerIndex] > 0) {
            this.addLog(`轮到${nextPlayer.name}行动啦！但还在监狱中...`);
        } else {
            this.addLog(`轮到${nextPlayer.name}行动啦！`);
        }
        
        this.updateGameInfo();
        this.updateAllPlayersMoney();
        
        // 检查游戏是否结束
        this.checkGameEnd();
    }
    
    checkGameEnd() {
        const bankruptPlayers = this.players.filter(player => player.money <= 0);
        if (bankruptPlayers.length >= this.players.length - 1) {
            const winner = this.players.find(player => player.money > 0);
            if (winner) {
                this.addLog(`🎉 游戏结束！${winner.name}获得了胜利！`);
                
                // 禁用所有按钮
                document.getElementById('roll-dice').disabled = true;
                document.getElementById('buy-property').disabled = true;
                document.getElementById('end-turn').disabled = true;
                
                // 更新所有玩家金币显示
                this.updateAllPlayersMoney();
            }
        }
    }
    
    updateGameInfo() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        document.getElementById('current-player').textContent = `当前玩家: ${currentPlayer.name} ${currentPlayer.marker}`;
        document.getElementById('player-money').textContent = `金币: ${currentPlayer.money}`;
    }
    
    updateAllPlayersMoney() {
        const display = document.getElementById('players-money-display');
        display.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const item = document.createElement('div');
            item.className = `player-money-item ${index === this.currentPlayerIndex ? 'current' : ''}`;
            item.innerHTML = `${player.marker} ${player.name}: 💰${player.money}`;
            item.style.borderLeft = `4px solid ${player.color}`;
            display.appendChild(item);
        });
    }
    
    addLog(message) {
        const logContent = document.getElementById('log-content');
        const logEntry = document.createElement('p');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
    }
    
    showPropertyInfo(propIndex) {
        const property = this.properties[propIndex];
        let ownerInfo = '无主';
        if (property.owner !== null) {
            ownerInfo = this.players[property.owner].name;
        }
        
        this.addLog(`🏠 ${property.name} - 价格: 💰${property.price} - 租金: 💰${property.rent} - 主人: ${ownerInfo}`);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new CandyMonopoly();
});