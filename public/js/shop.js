// Shopkeeper Dialogue Logic
const dialogueLines = [
    "Welcome to the shop! What would you like to buy today?",
    "We have seeds, fertilizer, and more. Feel free to ask!",
    "Would you like to browse seeds or fertilizer?"
];

let currentLine = 0;
let dialogueActive = true;

function showDialogue(line) {
    const textElem = document.getElementById('shopkeeper-dialogue-text');
    if (textElem) textElem.textContent = line;
}

function showOptions() {
    const textElem = document.getElementById('shopkeeper-dialogue-text');
        if (textElem) {
            textElem.innerHTML = `
                <div style="margin-top:8px;">
                    <button class="dialogue-btn" onclick="answerDialogue('seeds')">Seeds</button>
                    <button class="dialogue-btn" onclick="answerDialogue('fertilizer')">Fertilizers</button>
                    <button class="dialogue-btn" onclick="answerDialogue('sell')">Sell Plants</button>
                    <button class="dialogue-btn" onclick="answerDialogue('browse')">Just Browsing</button>
                </div>
            `;
        }
}

window.answerDialogue = function(answer) {
    if (answer === 'seeds') {
        showDialogue("Here are our seeds!");
        renderShopItems('seeds');
    } else if (answer === 'fertilizer') {
        showDialogue("Here are our fertilizers!");
        renderShopItems('fertilizer');
    } else if (answer === 'sell') {
        showSellPopup();
    } else if (answer === 'browse') {
        showDialogue("Browse everything we offer!");
        renderShopItems('all');
    }
}

function showSellPopup() {
    // Create popup
    let popup = document.createElement('div');
    popup.id = 'sell-popup';
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#fff';
    popup.style.borderRadius = '18px';
    popup.style.boxShadow = '0 4px 16px rgba(108,138,94,0.12)';
    popup.style.padding = '24px 32px';
    popup.style.zIndex = '200';
    popup.style.fontFamily = "Comic Sans MS, cursive, sans-serif";
    popup.style.textAlign = 'center';
    popup.style.minWidth = '220px';
    popup.style.color = '#6c8a5e';

    // Check inventory
    if (inventory.plants > 0) {
        popup.innerHTML = `<div style='margin-bottom:12px;'>Select a plant to sell:</div>
            <button class='dialogue-btn' onclick='sellPlantFromPopup()'>Sell Plant (${inventory.plants})</button>
            <br><br><button class='dialogue-btn' onclick='closeSellPopup()'>Cancel</button>`;
    } else {
        popup.innerHTML = `<div style='margin-bottom:12px;'>No plants to sell</div>
            <button class='dialogue-btn' onclick='closeSellPopup()'>OK</button>`;
    }
    document.body.appendChild(popup);
}

window.sellPlantFromPopup = function() {
    sellPlant();
    closeSellPopup();
    showDialogue("Plant sold!");
    setTimeout(endDialogue, 1500);
}

window.closeSellPopup = function() {
    let popup = document.getElementById('sell-popup');
    if (popup) popup.remove();
}


function endDialogue() {
    const container = document.getElementById('shopkeeper-dialogue-container');
    if (container) container.style.display = 'none';
    dialogueActive = false;
}

function nextDialogue() {
    if (!dialogueActive) return;
    currentLine++;
    if (currentLine < dialogueLines.length - 1) {
        showDialogue(dialogueLines[currentLine]);
    } else if (currentLine === dialogueLines.length - 1) {
        showDialogue(dialogueLines[currentLine]);
        showOptions();
    } else {
        endDialogue();
    }
}

document.addEventListener('click', function(e) {
    const container = document.getElementById('shopkeeper-dialogue-container');
    if (!container || !dialogueActive) return;
    // Only skip if not clicking a button
    if (!e.target.classList.contains('dialogue-btn')) {
        nextDialogue();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    showDialogue(dialogueLines[0]);
});
// Shop system logic for inventory and coins
// Seed and fertilizer data
const seedData = [
    { name: 'Caladium', img: '../seeds/caladium-seed.png', desc: 'Colorful foliage plant.', price: 3, key: 'caladium' },
    { name: 'Fern', img: '../seeds/fern-seed.png', desc: 'Lush green fronds.', price: 3, key: 'fern' },
    { name: 'Lettuce', img: '../seeds/lettuce-seed.png', desc: 'Fresh salad leaves.', price: 3, key: 'lettuce' },
    { name: 'Pothos', img: '../seeds/pothos-seed.png', desc: 'Trailing houseplant.', price: 3, key: 'pothos' },
    { name: 'Strawberry', img: '../seeds/strawberry-seed.png', desc: 'Sweet red berries.', price: 3, key: 'strawberry' },
    { name: 'Sunflower', img: '../seeds/sunflower-seed.png', desc: 'Tall, bright flowers.', price: 3, key: 'sunflower' },
    { name: 'Tomato', img: '../seeds/tomato-seed.png', desc: 'Juicy garden fruit.', price: 3, key: 'tomato' },
    { name: 'Rose', img: '../seeds/rose-seed.png', desc: 'Fragrant flowering plant.', price: 3, key: 'rose' },
    {name: 'Tulip', img: '../seeds/tulip-seed.png', desc: 'Classic spring flower.', price: 3, key: 'tulip' },
    {name: 'Blackberry', img: '../seeds/blackberry-seed.png', desc: 'Sweet and tart berries.', price: 3, key: 'blackberry' }
];

const fertilizerData = [
    { name: 'Fertilizer N', img: '../tools/fertilizer-n.png', desc: 'Nitrogen boost.', price: 4, key: 'fertilizer-n' },
    { name: 'Fertilizer P', img: '../tools/fertilizer-p.png', desc: 'Phosphorus boost.', price: 4, key: 'fertilizer-p' },
    { name: 'Fertilizer K', img: '../tools/fertilizer-k.png', desc: 'Potassium boost.', price: 4, key: 'fertilizer-k' }
];

function renderShopItems(type) {
    const container = document.getElementById('shop-items-scroll');
    if (!container) return;
    container.innerHTML = '';
    let items = [];
    if (type === 'seeds') {
        items = seedData;
    } else if (type === 'fertilizer') {
        items = fertilizerData;
    } else if (type === 'all') {
        items = [...seedData, ...fertilizerData];
    }
    items.forEach(item => {
        const box = document.createElement('div');
        box.className = 'shop-item-box';
        box.innerHTML = `
            <img class='shop-item-img' src='${item.img}' alt='${item.name}'>
            <div class='shop-item-info'>
                <div class='shop-item-title'>${item.name}</div>
                <div class='shop-item-desc'>${item.desc}</div>
                <div class='shop-item-price'>Price: ${item.price} <img src='../assets/coin.png' alt='coin' style='width:18px;height:18px;vertical-align:middle;'></div>
            </div>
            <button class='dialogue-btn shop-buy-btn' onclick='buyShopItem("${item.key}")'>Buy</button>
        `;
        container.appendChild(box);
    });
}

window.buyShopItem = function(key) {
    // Find item
    let item = seedData.find(s => s.key === key) || fertilizerData.find(f => f.key === key);
    if (!item) return;
    if (coins < item.price) {
        alert('Not enough coins!');
        return;
    }
    coins -= item.price;
    // Add to inventory
    if (seedData.find(s => s.key === key)) {
        inventory.seeds++;
    } else if (fertilizerData.find(f => f.key === key)) {
        inventory.fertilizer++;
    }
    updateDisplay();
    showDialogue(`Bought ${item.name}!`);
}

window.addEventListener('DOMContentLoaded', () => {
    showDialogue(dialogueLines[0]);
    renderShopItems('seeds'); // Default: show seeds
    const refreshBtn = document.getElementById('shop-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
});

// Inventory and coin state
let coins = 10;
let inventory = {
    seeds: 0,
    fertilizer: 0,
    plants: 0
};

function updateDisplay() {
    // Update coin display above product column
    const coinDisplay = document.getElementById('shop-coin-display');
    if (coinDisplay) {
        coinDisplay.innerHTML = `${coins} <img src='../assets/coin.png' alt='coin' style='width:30px;height:30px;vertical-align:middle;'>`;
    }
    // ...existing code for garden.html inventory (if present)
    if (document.getElementById('coin-count'))
        document.getElementById('coin-count').innerHTML = `${coins} <img src='../assets/coin.png' alt='coin' style='width:30px;height:30px;vertical-align:middle;'>`;
    if (document.getElementById('seed-count'))
        document.getElementById('seed-count').textContent = inventory.seeds;
    if (document.getElementById('fertilizer-count'))
        document.getElementById('fertilizer-count').textContent = inventory.fertilizer;
    if (document.getElementById('plant-count'))
        document.getElementById('plant-count').textContent = inventory.plants;
}

function buySeed() {
    if (coins >= 3) {
        coins -= 3;
        inventory.seeds++;
        updateDisplay();
    } else {
        alert('Not enough coins!');
    }
}

function buyFertilizer() {
    if (coins >= 4) {
        coins -= 4;
        inventory.fertilizer++;
        updateDisplay();
    } else {
        alert('Not enough coins!');
    }
}

function sellPlant() {
    if (inventory.plants > 0) {
        inventory.plants--;
        coins += 12;
        updateDisplay();
    } else {
        alert('No grown plants to sell!');
    }
}

window.onload = updateDisplay;
