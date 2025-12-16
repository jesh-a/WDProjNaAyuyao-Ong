        // plants in an object
    const plantLibrary = {
        "strawberry": {
            name: "Strawberry",
            description: "Fruit and flower bearing plant, when grown produces a reddish, small fruit which is edible.",
            images: [
                "../seeds/strawberry-seed.png", 
                "../middle-stage/strawberry-seedling.png",
                "../plants/strawberry-plant.png"
            ]
        },
        "tomato": {
            name: "Tomato",
            description: "A vegetable or a fruit? A reddish, usually circular grown plant typically used as dressing in meals.",
            images: [
                "../seeds/tomato-seed.png", 
                "../middle-stage/tomato-seedling.png",
                "../plants/tomato-plant.png"
            ]
        },
        "sunflower": {
            name: "Sunflower",
            description: "A bright, slightly tall golden-yellow-rayed flower from the daisy family, typically symbolizing happiness.",
            images: [
                "../seeds/sunflower-seed.png", 
                "../middle-stage/sunflower-sprout.png",
                "../plants/sunflower.png"
            ]
        },
        "caladium": {
            name: "Caladium",
            description: "A green mixed with a hint of pink, overcoming the usual normalcy of leafy, green plants.",
            images: [
                "../seeds/caladium-seed.png", 
                "../middle-stage/caladium-seedling.png",
                "../plants/caladium-plant.png"
            ]
        },
    };


    // --- game system ---
    let inventory = {
        "strawberry": 3,
        "tomato": 3,
        "sunflower": 2,
        "caladium": 2
    };
    
    let gardenData = []; 
    let currentSelectedIndex = null;

    // --- func  ---
    document.addEventListener('DOMContentLoaded', () => {
        initGrid();
        updateUI();
    });

    // loops for 36 cells, checks each cell for elements
    function initGrid() {
        const container = document.getElementById('grid-container');
        for (let i = 0; i < 36; i++) {
            gardenData.push({ 
                id: i, 
                hasPlant: false, 
                plantType: null, 
                growthStage: 0,
            });
            
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            cell.id = `slot-${i}`;
            cell.onclick = () => selectPlot(i);
            container.appendChild(cell);
        }
    }

    // --- GARDEN ---
    window.selectPlot = function(index) {
        currentSelectedIndex = index;
        const data = gardenData[index];
        
        document.querySelectorAll('.grid-item').forEach(el => el.classList.remove('selected'));
        document.getElementById(`slot-${index}`).classList.add('selected');
        document.getElementById('side-panel').style.visibility = "visible";

        if (data.hasPlant) {
            // prints info
            const info = plantLibrary[data.plantType];
            document.getElementById('panel-title').innerText = info.name;
            document.getElementById('panel-desc').innerText = info.description;
            
            const badge = document.getElementById('stage-badge');
            badge.style.display = "block";
            
            // shows growth stages, from seed to plant when user waters plant
            if (data.growthStage === 2) {
                badge.innerText = "Grown!";
                badge.style.background = "#e67e22";
            } else {
                badge.innerText = "Growing...";
                badge.style.background = "#2ecc71";
            }

            document.getElementById('plant-actions').style.display = "block";
            document.getElementById('inventory-list').style.display = "none";


        } else {
            // shows inventory / panel for no seeds or plants in cell
            document.getElementById('panel-title').innerText = "Empty Plot";
            document.getElementById('panel-desc').innerText = "Select a seed.";
            document.getElementById('stage-badge').style.display = "none";
            document.getElementById('plant-actions').style.display = "none";
            document.getElementById('inventory-list').style.display = "block";

            // plant seed butn
            const invContainer = document.getElementById('inventory-buttons');
            invContainer.innerHTML = "";
            for (const [key, count] of Object.entries(inventory)) {
                if (!plantLibrary[key]) continue; // Skip fertilizers here
                
                const btn = document.createElement('button');
                btn.classList.add('seed-btn');
                btn.innerHTML = `<span>${plantLibrary[key].name}</span> <span>x${count}</span>`;
                
                if (count > 0) btn.onclick = () => plantSeed(key);
                else btn.disabled = true;
                
                invContainer.appendChild(btn);
            }
        }
    };


    window.plantSeed = function(type) {
        if (inventory[type] > 0) {
            inventory[type]--;
            gardenData[currentSelectedIndex].hasPlant = true;
            gardenData[currentSelectedIndex].plantType = type;
            gardenData[currentSelectedIndex].growthStage = 0;
            
            updateGridVisual(currentSelectedIndex);
            updateUI();
            selectPlot(currentSelectedIndex);
        }
    };

    // --- actions ---
    
    // water plant
    window.growPlant = function() {
        const data = gardenData[currentSelectedIndex];
        if (data.growthStage < 2) {
            data.growthStage++;
            updateGridVisual(currentSelectedIndex);
            selectPlot(currentSelectedIndex);
        } else {
            alert("Fully grown!");
        }
    };

    // dig up plant functions
    window.removePlant = function() {
        gardenData[currentSelectedIndex].hasPlant = false;
        gardenData[currentSelectedIndex].plantType = null;
        gardenData[currentSelectedIndex].growthStage = 0;

        const cell = document.getElementById(`slot-${currentSelectedIndex}`);
        cell.innerHTML = "";
        cell.className = "grid-item selected"; // Reset classes
        
        selectPlot(currentSelectedIndex);
    };

    // puts in a plant
    function updateGridVisual(index) {
        const data = gardenData[index];
        const cell = document.getElementById(`slot-${index}`);
        const lib = plantLibrary[data.plantType];
        
        cell.classList.add('planted');
        
        cell.innerHTML = `<img src="${lib.images[data.growthStage]}" alt="plant">`;
    }
