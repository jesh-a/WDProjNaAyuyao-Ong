// Shop system logic for inventory and coins
// Uses tulip.png as coin image

// Inventory and coin state
let coins = 0;
let inventory = {
    seeds: 0,
    fertilizer: 0,
    plants: 0
};

function updateDisplay() {
    document.getElementById('coin-count').innerHTML = `${coins} <img src='../plants/tulip.png' alt='coin' style='width:24px;height:24px;vertical-align:middle;'>`;
    document.getElementById('seed-count').textContent = inventory.seeds;
    document.getElementById('fertilizer-count').textContent = inventory.fertilizer;
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
