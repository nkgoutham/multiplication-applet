document.addEventListener('DOMContentLoaded', function() {
    const squares = document.querySelectorAll('.unit-square');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const characterImg = document.querySelector('.character img');

    let gameState = {
        stage: 'initial', // 'initial', 'first-clicked', 'second-clicked', 'completed'
        clickedSquares: [],
        currentHighlight: 0,
        level: 1 // Track current level
    };

    // Character images
    const characterImages = {
        initial: 'attached_assets/Male_1751955196191.png',
        pointing: 'attached_assets/Male pointing_1751955610300.png',
        searching: 'attached_assets/searching_1751955622193.png'
    };

    // Initialize game
    function initGame() {
        // Highlight first square
        squares[0].classList.add('highlight');
        characterImg.src = characterImages.initial;
        gameState.stage = 'initial';
        gameState.clickedSquares = [];
        gameState.currentHighlight = 0;

        // Disable previous button initially
        prevBtn.disabled = true;
        prevBtn.classList.remove('highlighted');

        // Reset instruction text
        const instructionText = document.getElementById('instructionText');
        instructionText.innerHTML = '<p>TAP on the UNIT SQUARES to bring them together.</p><p>What would this make?</p>';

        // Remove success state
        document.body.classList.remove('success-state');

        // Hide equation
        document.getElementById('equationDisplay').style.display = 'none';
    }

    // Add click functionality to squares
    squares.forEach((square, index) => {
        square.addEventListener('click', function() {
            if (this.classList.contains('combined')) {
                return; // Don't allow interaction with already combined squares
            }

            handleSquareClick(this, index);
        });
    });

    function handleSquareClick(square, index) {
        if (gameState.stage === 'initial' && index === 0) {
            // First square clicked
            square.classList.remove('highlight');
            square.classList.add('clicked');
            gameState.clickedSquares.push(square);
            gameState.stage = 'first-clicked';
            gameState.currentHighlight = 1;

            // Change character to pointing
            characterImg.src = characterImages.pointing;

            // Highlight second square
            squares[1].classList.add('highlight');

        } else if (gameState.stage === 'first-clicked' && index === 1) {
            // Second square clicked
            square.classList.remove('highlight');
            square.classList.add('clicked');
            gameState.clickedSquares.push(square);
            gameState.stage = 'second-clicked';

            // Change character to searching
            characterImg.src = characterImages.searching;

            // Animate squares coming together
            setTimeout(() => {
                combineSquares();
            }, 500);
        }
    }

    function combineSquares() {
        const square1 = gameState.clickedSquares[0];
        const square2 = gameState.clickedSquares[1];

        // Calculate center position for side-by-side placement with gap
        const gameAreaRect = document.querySelector('.game-area').getBoundingClientRect();
        const centerX = '50%';
        const centerY = '50%';

        // Animate squares moving to center side by side with gap
        square1.style.transition = 'all 0.8s ease';
        square2.style.transition = 'all 0.8s ease';

        square1.style.left = centerX;
        square1.style.top = centerY;
        square1.style.transform = 'translate(-90px, -50%)';

        square2.style.left = centerX;
        square2.style.top = centerY;
        square2.style.transform = 'translate(10px, -50%)';

        setTimeout(() => {
            // Mark squares as combined but keep them visible
            square1.classList.add('combined');
            square2.classList.add('combined');

            // Add "2" label above the combined squares
            const label = document.createElement('div');
            label.textContent = '2';
            label.style.position = 'absolute';
            label.style.left = '50%';
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -120px)';
            label.style.fontSize = '32px';
            label.style.fontWeight = 'bold';
            label.style.color = 'white';
            label.style.fontFamily = 'Baloo 2, cursive';
            label.style.textAlign = 'center';
            document.querySelector('.game-area').appendChild(label);

            gameState.stage = 'completed';

            // Show success state
            showSuccessState();

        }, 800);
    }

    function showSuccessState() {
        // Update instruction text
        const instructionText = document.getElementById('instructionText');
        instructionText.innerHTML = '<p><strong>Good job!</strong></p><p>Now each rod is a count of \'2\'. This is a 2-unit rod.</p><p>Click NEXT to build further...</p>';

        // Add success state styling
        document.body.classList.add('success-state');

        // Show equation
        const equationDisplay = document.getElementById('equationDisplay');
        equationDisplay.style.display = 'block';

        // Highlight and enable next button
        nextBtn.classList.add('highlighted');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';

        // Keep previous button disabled
        prevBtn.disabled = true;
    }

    // Navigation functionality
    prevBtn.addEventListener('click', function() {
        if (!this.disabled) {
            console.log('Previous clicked');
            if (gameState.level === 2) {
                resetToLevel1();
            } else if (gameState.level === 3) {
                startLevel2();
            } else if (gameState.level === 4) {
                startLevel3();
            } else if (gameState.level === 5) {
                startLevel4();
            } else if (gameState.level === 6) {
                startLevel5();
            } else {
                // Reset current level
                initGame();
                // Reset squares
                squares.forEach(square => {
                    square.style.display = 'block';
                    square.style.left = '';
                    square.style.top = '';
                    square.style.transition = '';
                    square.textContent = '1';
                    square.classList.remove('combined', 'clicked', 'highlight');
                });

                // Remove any added labels
                const labels = document.querySelectorAll('.game-area > div:not(.unit-square):not(.equation-display)');
                labels.forEach(label => label.remove());

                nextBtn.classList.remove('highlighted');
                nextBtn.disabled = true;
                nextBtn.style.opacity = '0.5';
                nextBtn.style.pointerEvents = 'none';
            }
        }
    });

    nextBtn.addEventListener('click', function() {
        if (gameState.stage === 'completed' && !this.disabled) {
            console.log('Next clicked - proceeding to next level');
            if (gameState.level === 1) {
                startLevel2();
            } else if (gameState.level === 2) {
                startLevel3();
            } else if (gameState.level === 3) {
                startLevel4();
            } else if (gameState.level === 4) {
                startLevel5();
            } else if (gameState.level === 5) {
                startLevel6();
            }
            // No more levels after Level 6
        }
    });

    // Progress dots functionality
    const dots = document.querySelectorAll('.dot');

    function updateProgressDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index + 1 === gameState.level) {
                dot.classList.add('active');
            }
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            // Clean up any existing level navigation before switching
            const existingLevelNav = document.querySelector('.level3-navigation');
            if (existingLevelNav) {
                existingLevelNav.remove();
            }

            const existingSlider = document.querySelector('.level3-slider-container');
            if (existingSlider) {
                existingSlider.remove();
            }

            const targetLevel = index + 1;
            if (targetLevel === 1) resetToLevel1();
            else if (targetLevel === 2) startLevel2();
            else if (targetLevel === 3) startLevel3();
            else if (targetLevel === 4) startLevel4();
            else if (targetLevel === 5) startLevel5();
            else if (targetLevel === 6) startLevel6();
        });
    });

    function startLevel2() {
        gameState.level = 2;
        gameState.stage = 'initial';
        gameState.clickedSquares = [];
        gameState.currentHighlight = 0;

        // Update progress dots
        updateProgressDots();

        // Remove slider layout and restore original layout
        document.body.classList.remove('slider-layout');

        // Remove any level navigation elements
        const levelNav = document.querySelector('.level3-navigation');
        if (levelNav) {
            levelNav.remove();
        }

        const level3Slider = document.querySelector('.level3-slider-container');
        if (level3Slider) {
            level3Slider.remove();
        }

        // Reset navigation to original state and show it
        const externalNav = document.querySelector('.external-nav');
        externalNav.style.display = 'flex';
        externalNav.style.marginLeft = 'calc(35% + 2%)';
        externalNav.style.marginRight = '2%';

        // Show and reset next button
        nextBtn.style.display = 'block';

        // Clear previous level content
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Update instruction text
        const instructionText = document.getElementById('instructionText');
        instructionText.innerHTML = '<p>TAP on the 2-unit rods to bring them together.</p><p>What would this make?</p>';

        // Change character to pointing
        characterImg.src = characterImages.pointing;

        // Remove success state
        document.body.classList.remove('success-state');

        // Create two 2-unit rods positioned diagonally
        createTwoUnitRod('rod1', 25, 25);
        createTwoUnitRod('rod2', 55, 55);

        // Highlight first rod
        document.getElementById('rod1').classList.add('highlight');

        // Enable previous button
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';

        // Disable and reset next button
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.pointerEvents = 'none';
        nextBtn.classList.remove('highlighted');
    }

    function createTwoUnitRod(id, topPercent, leftPercent) {
        const gameArea = document.querySelector('.game-area');

        // Create container for the 2-unit rod
        const rodContainer = document.createElement('div');
        rodContainer.id = id;
        rodContainer.className = 'two-unit-rod';
        rodContainer.style.position = 'absolute';
        rodContainer.style.top = topPercent + '%';
        rodContainer.style.left = leftPercent + '%';
        rodContainer.style.cursor = 'pointer';
        rodContainer.dataset.value = '2';

        // Create two unit squares side by side
        const square1 = document.createElement('div');
        square1.className = 'unit-square rod-square';
        square1.style.position = 'relative';
        square1.style.display = 'inline-block';
        square1.style.margin = '0';
        square1.textContent = '';

        const square2 = document.createElement('div');
        square2.className = 'unit-square rod-square';
        square2.style.position = 'relative';
        square2.style.display = 'inline-block';
        square2.style.margin = '0 0 0 10px';
        square2.textContent = '';

        // Add label "2" above the rod
        const label = document.createElement('div');
        label.textContent = '2';
        label.className = 'rod-label';
        label.style.position = 'absolute';
        label.style.top = '-40px';
        label.style.left = '50%';
        label.style.transform = 'translateX(-50%)';
        label.style.fontSize = '32px';
        label.style.fontWeight = 'bold';
        label.style.color = 'white';
        label.style.fontFamily = 'Baloo 2, cursive';

        rodContainer.appendChild(label);
        rodContainer.appendChild(square1);
        rodContainer.appendChild(square2);

        // Add click handler
        rodContainer.addEventListener('click', function() {
            if (this.classList.contains('combined')) return;
            handleRodClick(this);
        });

        gameArea.appendChild(rodContainer);
    }

    function handleRodClick(rod) {
        const rodId = rod.id;

        if (gameState.stage === 'initial' && rodId === 'rod1') {
            // First rod clicked
            rod.classList.remove('highlight');
            rod.classList.add('clicked');
            gameState.clickedSquares.push(rod);
            gameState.stage = 'first-clicked';
            gameState.currentHighlight = 1;

            // Highlight second rod
            document.getElementById('rod2').classList.add('highlight');

        } else if (gameState.stage === 'first-clicked' && rodId === 'rod2') {
            // Second rod clicked
            rod.classList.remove('highlight');
            rod.classList.add('clicked');
            gameState.clickedSquares.push(rod);
            gameState.stage = 'second-clicked';

            // Change character to searching
            characterImg.src = characterImages.searching;

            // Animate rods coming together
            setTimeout(() => {
                combineRods();
            }, 500);
        }
    }

    function combineRods() {
        const rod1 = gameState.clickedSquares[0];
        const rod2 = gameState.clickedSquares[1];

        // Calculate center position for side-by-side placement
        const centerX = '50%';
        const centerY = '50%';

        // Animate rods moving to center
        rod1.style.transition = 'all 0.8s ease';
        rod2.style.transition = 'all 0.8s ease';

        rod1.style.left = centerX;
        rod1.style.top = centerY;
        rod1.style.transform = 'translate(-190px, -50%)';

        rod2.style.left = centerX;
        rod2.style.top = centerY;
        rod2.style.transform = 'translate(0px, -50%)';

        setTimeout(() => {
            // Mark rods as combined
            rod1.classList.add('combined');
            rod2.classList.add('combined');

            // Keep rod labels showing "2" for both rods
            rod1.querySelector('.rod-label').textContent = '2';
            rod2.querySelector('.rod-label').textContent = '2';

            gameState.stage = 'completed';
            showLevel2Success();

        }, 800);
    }

    function showLevel2Success() {
        // Update instruction text
        const instructionText = document.getElementById('instructionText');
        instructionText.innerHTML = '<p><strong>Good job!</strong></p><p>That\'s 2 × 2 = 4</p><p>Click NEXT to explore how many rods of different lengths can be made by joining MULTIPLE 2-unit rods.</p>';

        // Add success state styling
        document.body.classList.add('success-state');

        // Show equation
        const equationDisplay = document.createElement('div');
        equationDisplay.className = 'equation-display';
        equationDisplay.innerHTML = '2 × <span class="yellow-bold">2</span> = 4';
        equationDisplay.style.display = 'block';
        document.querySelector('.game-area').appendChild(equationDisplay);

        // Highlight and enable next button
        nextBtn.classList.add('highlighted');
        nextBtn.disabled = false;
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
    }

    // Update previous button handler to handle both levels
    function resetToLevel1() {
        gameState.level = 1;
        gameState.stage = 'initial';
        gameState.clickedSquares = [];
        gameState.currentHighlight = 0;

        // Update progress dots
        updateProgressDots();

        // Remove slider layout and restore original layout
        document.body.classList.remove('slider-layout');

        // Remove any level navigation elements
        const levelNav = document.querySelector('.level3-navigation');
        if (levelNav) {
            levelNav.remove();
        }

        const level3Slider = document.querySelector('.level3-slider-container');
        if (level3Slider) {
            level3Slider.remove();
        }

        // Reset navigation to original state and show it
        const externalNav = document.querySelector('.external-nav');
        externalNav.style.display = 'flex';
        externalNav.style.marginLeft = 'calc(35% + 2%)';
        externalNav.style.marginRight = '2%';

        // Clear game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Recreate original squares
        const square1 = document.createElement('div');
        square1.className = 'unit-square';
        square1.id = 'square1';
        square1.dataset.value = '1';
        square1.textContent = '1';
        gameArea.appendChild(square1);

        const square2 = document.createElement('div');
        square2.className = 'unit-square';
        square2.id = 'square2';
        square2.dataset.value = '1';
        square2.textContent = '1';
        gameArea.appendChild(square2);

        // Recreate original equation display
        const equationDisplay = document.createElement('div');
        equationDisplay.className = 'equation-display';
        equationDisplay.id = 'equationDisplay';
        equationDisplay.style.display = 'none';
        equationDisplay.innerHTML = '2 × <span class="yellow-bold">1</span> = 2';
        gameArea.appendChild(equationDisplay);

        // Re-add click handlers
        document.querySelectorAll('.unit-square').forEach((square, index) => {
            square.addEventListener('click', function() {
                if (this.classList.contains('combined')) return;
                handleSquareClick(this, index);
            });
        });

        // Reset instruction text
        const instructionText = document.getElementById('instructionText');
        instructionText.innerHTML = '<p>TAP on the UNIT SQUARES to bring them together.</p><p>What would this make?</p>';

        // Reset character image
        characterImg.src = characterImages.initial;

        // Remove any success state
        document.body.classList.remove('success-state');

        // Reset game state
        gameState.stage = 'initial';
        gameState.clickedSquares = [];
        gameState.currentHighlight = 0;

        // Add highlight to first square
        const firstSquare = document.getElementById('square1');
        if (firstSquare) {
            firstSquare.classList.add('highlight');
        }

        // Disable previous button since we're back to level 1
        prevBtn.disabled = true;
        prevBtn.style.opacity = '0.5';
        prevBtn.style.pointerEvents = 'none';

        // Reset and disable next button
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.pointerEvents = 'none';
        nextBtn.classList.remove('highlighted');
    }

    // Level 3: Interactive slider (2×2=4)
    function startLevel3() {
        gameState.level = 3;
        gameState.stage = 'completed'; // Slider levels are automatically completed

        // Update progress dots
        updateProgressDots();

        // Clear and setup new layout
        setupLevel3Layout();

        // Enable navigation
        enableLevel3Navigation();
    }

    // Level 4: Static display of multiples of 2
    function startLevel4() {
        gameState.level = 4;
        gameState.stage = 'completed';

        // Update progress dots
        updateProgressDots();

        // Clear and setup Level 4 layout
        setupLevel4Layout();

        // Enable navigation
        enableLevel4Navigation();
    }

    function setupLevel3Layout() {
        // Clear game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Remove character and instruction text from left panel for slider levels
        document.body.classList.add('slider-layout');

        // Remove success state
        document.body.classList.remove('success-state');

        // Create main container with proper layout
        const mainContainer = document.createElement('div');
        mainContainer.className = 'level3-main-container';

        // First row: equation centered
        const equationRow = document.createElement('div');
        equationRow.className = 'level3-equation-row';

        const equation = document.createElement('div');
        equation.className = 'level3-equation';
        equation.id = 'level3-equation';
        equation.textContent = '2 × 2 = 4';
        equationRow.appendChild(equation);

        // Second row: boxes aligned to left
        const boxesRow = document.createElement('div');
        boxesRow.className = 'level3-boxes-row';
        boxesRow.id = 'level3-boxes-row';

        mainContainer.appendChild(equationRow);
        mainContainer.appendChild(boxesRow);
        gameArea.appendChild(mainContainer);

        // Initialize with 2 rod sets
        updateLevel3Display(2);
    }

    function setupSliderLevel() {
        // Clear game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Remove character and instruction text from left panel for slider levels
        document.body.classList.add('slider-layout');

        // Remove success state
        document.body.classList.remove('success-state');
    }

    function createRodsDisplay(maxRods, title) {
        const gameArea = document.querySelector('.game-area');

        // Add title
        const titleEl = document.createElement('div');
        titleEl.className = 'level-title';
        titleEl.textContent = title;
        gameArea.appendChild(titleEl);

        // Create rods container
        const rodsContainer = document.createElement('div');
        rodsContainer.className = 'rods-display';

        for (let i = 1; i <= maxRods; i++) {
            const rodGroup = document.createElement('div');
            rodGroup.className = 'rod-group';

            // Create squares for this rod
            for (let j = 0; j < i; j++) {
                const square = document.createElement('div');
                square.className = 'display-square';
                rodGroup.appendChild(square);
            }

            // Add number label above
            const numberLabel = document.createElement('div');
            numberLabel.className = 'number-label';
            numberLabel.textContent = i * 2;
            rodGroup.appendChild(numberLabel);

            // Add equation label below
            const equationLabel = document.createElement('div');
            equationLabel.className = 'equation-label';
            equationLabel.textContent = `2 × ${i}`;
            rodGroup.appendChild(equationLabel);

            rodsContainer.appendChild(rodGroup);
        }

        gameArea.appendChild(rodsContainer);
    }

    // Level 4+ display functions removed

    function setupSlider(position, interactive = true) {
        const gameArea = document.querySelector('.game-area');

        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        const sliderText = document.createElement('div');
        sliderText.className = 'slider-text';
        sliderText.textContent = 'Drag the slider to join more 2-unit Rods';

        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'slider-track';

        // Create slider dots
        for (let i = 0; i <= 10; i++) {
            const dot = document.createElement('div');
            dot.className = 'slider-dot';
            if (i === position) {
                dot.classList.add('active');
            }
            sliderTrack.appendChild(dot);
        }

        const sliderNumbers = document.createElement('div');
        sliderNumbers.className = 'slider-numbers';
        for (let i = 0; i <= 10; i++) {
            const number = document.createElement('span');
            number.textContent = i;
            sliderNumbers.appendChild(number);
        }

        sliderContainer.appendChild(sliderText);
        sliderContainer.appendChild(sliderTrack);
        sliderContainer.appendChild(sliderNumbers);

        gameArea.appendChild(sliderContainer);

        // Add interaction if needed
        if (interactive) {
            const dots = sliderTrack.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    dots.forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');
                    // Could update rods display here if needed
                });
            });
        }
    }

    function enableLevel3Navigation() {
        // Hide original navigation
        const externalNav = document.querySelector('.external-nav');
        externalNav.style.display = 'none';

        // Create and add slider above navigation
        createLevel3Slider();
    }

    function setupLevel4Layout() {
        // Clear game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Keep slider layout active
        document.body.classList.add('slider-layout');

        // Remove success state
        document.body.classList.remove('success-state');

        // Remove any existing level navigation elements
        const levelNav = document.querySelector('.level3-navigation');
        if (levelNav) {
            levelNav.remove();
        }

        const level3Slider = document.querySelector('.level3-slider-container');
        if (level3Slider) {
            level3Slider.remove();
        }

        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'level4-main-container';

        // Create title at the top
        const titleEl = document.createElement('div');
        titleEl.className = 'level4-title';
        titleEl.textContent = 'These lengths are all formed by joining rods of 2...';
        mainContainer.appendChild(titleEl);

        // Create display container for boxes
        const displayContainer = document.createElement('div');
        displayContainer.className = 'level4-display-container';
        displayContainer.id = 'level4-display-container';

        // Create container for all box pairs
        const allPairsContainer = document.createElement('div');
        allPairsContainer.className = 'level4-all-pairs-container';

        // Create 10 pairs of boxes
        for (let i = 1; i <= 10; i++) {
            const pairContainer = document.createElement('div');
            pairContainer.className = 'level4-pair-container';

            const boxPair = document.createElement('div');
            boxPair.className = 'level4-box-pair';

            // First box
            const box1 = document.createElement('div');
            box1.className = 'level4-box';

            // Second box with result on top
            const box2Container = document.createElement('div');
            box2Container.className = 'level4-box2-container';

            const result = document.createElement('div');
            result.className = 'level4-result';
            result.textContent = i * 2;

            const box2 = document.createElement('div');
            box2.className = 'level4-box';

            box2Container.appendChild(result);
            box2Container.appendChild(box2);

            // Add boxes to pair
            boxPair.appendChild(box1);
            boxPair.appendChild(box2Container);

            // Create equation below boxes
            const equation = document.createElement('div');
            equation.className = 'level4-equation';
            equation.textContent = `2 × ${i} = ${i * 2}`;

            pairContainer.appendChild(boxPair);
            pairContainer.appendChild(equation);
            allPairsContainer.appendChild(pairContainer);
        }

        displayContainer.appendChild(allPairsContainer);
        mainContainer.appendChild(displayContainer);
        gameArea.appendChild(mainContainer);
    }

    function enableLevel4Navigation() {
        // Hide original navigation
        const externalNav = document.querySelector('.external-nav');
        externalNav.style.display = 'none';

        // Create Level 4 navigation panel
        createLevelNavigation(4, 'Next');
    }

    function enableNavigation() {
        // Enable previous button
        prevBtn.disabled = false;
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';

        // Level 3 is now the last level - disable next button
        nextBtn.disabled = true;
        nextBtn.style.opacity = '0.5';
        nextBtn.style.pointerEvents = 'none';
        nextBtn.classList.remove('highlighted');
    }



    function updateLevel3Display(sliderValue) {
        const equation = document.getElementById('level3-equation');
        const boxesRow = document.getElementById('level3-boxes-row');

        if (!equation || !boxesRow) return;

        // Update equation
        const result = sliderValue * 2;
        equation.textContent = `2 × ${sliderValue} = ${result}`;

        // Clear existing rod sets
        boxesRow.innerHTML = '';

        // Create rod sets based on slider value
        for (let i = 1; i <= sliderValue; i++) {
            const rod = document.createElement('div');
            rod.className = 'level3-rod';

            // Number label above (cumulative total)
            const numberLabel = document.createElement('div');
            numberLabel.className = 'level3-number';
            numberLabel.textContent = i * 2;

            // Squares container
            const squaresContainer = document.createElement('div');
            squaresContainer.className = 'level3-squares';

            // Create 2 squares for each rod set
            for (let j = 0; j < 2; j++) {
                const square = document.createElement('div');
                square.className = 'level3-square';
                squaresContainer.appendChild(square);
            }

            // Equation label below
            const equationLabel = document.createElement('div');
            equationLabel.className = 'level3-rod-equation';
            equationLabel.textContent = `2 × ${i}`;

            rod.appendChild(numberLabel);
            rod.appendChild(squaresContainer);
            rod.appendChild(equationLabel);
            boxesRow.appendChild(rod);
        }
    }

    function createLevelNavigation(level, nextButtonText) {
        // Remove any existing level navigation
        const existingNav = document.querySelector('.level3-navigation');
        if (existingNav) {
            existingNav.remove();
        }

        // Create level navigation panel
        const levelNav = document.createElement('div');
        levelNav.className = 'level3-navigation';

        // For Level 6, center the dots and add dummy next button
        if (level === 6) {
            levelNav.className = 'level3-navigation level6-navigation';
        }

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'nav-btn level3-nav-btn';
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', function() {
            // Clean up any existing level navigation before switching
            const existingLevelNav = document.querySelector('.level3-navigation');
            if (existingLevelNav) {
                existingLevelNav.remove();
            }

            const existingSlider = document.querySelector('.level3-slider-container');
            if (existingSlider) {
                existingSlider.remove();
            }

            if (level === 3) startLevel2();
            else if (level === 4) startLevel3();
            else if (level === 5) startLevel4();
            else if (level === 6) startLevel5();
        });

        // Progress dots
        const progressDots = document.createElement('div');
        progressDots.className = 'progress-dots level3-progress-dots';
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === level - 1) {
                dot.classList.add('active');
            }
            progressDots.appendChild(dot);

                        // Add click functionality to dots
            dot.addEventListener('click', function() {
                // Clean up any existing level navigation before switching
                const existingLevelNav = document.querySelector('.level3-navigation');
                if (existingLevelNav) {
                    existingLevelNav.remove();
                }

                const existingSlider = document.querySelector('.level3-slider-container');
                if (existingSlider) {
                    existingSlider.remove();
                }

                const targetLevel = i + 1;
                if (targetLevel === 1) resetToLevel1();
                else if (targetLevel === 2) startLevel2();
                else if (targetLevel === 3) startLevel3();
                else if (targetLevel === 4) startLevel4();
                else if (targetLevel === 5) startLevel5();
                else if (targetLevel === 6) startLevel6();
            });
        }

        levelNav.appendChild(prevButton);levelNav.appendChild(progressDots);

        // Add next button if specified or if Level 6 (dummy button)
        if (nextButtonText || level === 6) {
            const nextButton = document.createElement('button');
            nextButton.className = 'nav-btn level3-nav-btn';
            nextButton.textContent = level === 6 ? 'Next' : nextButtonText;

            // For Level 6, make it disabled (dummy button)
            if (level === 6) {
                nextButton.disabled = true;
                nextButton.style.opacity = '0.5';
                nextButton.style.cursor = 'not-allowed';
            } else {
                nextButton.classList.add('highlighted');
                nextButton.addEventListener('click', function() {
                    if (level === 4) startLevel5();
                    else if (level === 5) startLevel6();
                });
            }

            levelNav.appendChild(nextButton);
        }

        // Insert navigation at the bottom
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(levelNav);
    }

    function createLevel3Slider() {
        // Create slider container above navigation
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'level3-slider-container';

        const sliderText = document.createElement('div');
        sliderText.className = 'level3-slider-text';
        sliderText.textContent = 'Drag the slider to join more 2-unit Rods';

        const sliderTrack = document.createElement('div');
        sliderTrack.className = 'level3-slider-track';
        sliderTrack.style.position = 'relative';

        // Create slider dots
        const numDots = 11;
        const dots = [];
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('div');
            dot.className = 'level3-slider-dot';
            if (i === 2) {
                dot.classList.add('active');
            }
            sliderTrack.appendChild(dot);
            dots.push(dot);
        }

        // Create draggable thumb
        const thumb = document.createElement('div');
        thumb.className = 'level3-slider-thumb';
        thumb.style.position = 'absolute';
        thumb.style.top = '50%';
        thumb.style.transform = 'translate(-50%, -50%)';
        thumb.style.zIndex = '3';
        sliderTrack.appendChild(thumb);

        // Position thumb at initial value (0)
        function setThumbPosition(index) {
            const trackRect = sliderTrack.getBoundingClientRect();
            const dotRects = dots.map(dot => dot.getBoundingClientRect());
            // Calculate relative left position of the dot within the track
            const left = dots[index].offsetLeft + dots[index].offsetWidth / 2;
            thumb.style.left = `${left}px`;
        }
        // Initial position
        setTimeout(() => setThumbPosition(0), 0);

        // Numbers below slider
        const sliderNumbers = document.createElement('div');
        sliderNumbers.className = 'level3-slider-numbers';
        for (let i = 0; i < numDots; i++) {
            const number = document.createElement('span');
            number.textContent = i;
            sliderNumbers.appendChild(number);
        }

        sliderContainer.appendChild(sliderText);
        sliderContainer.appendChild(sliderTrack);
        sliderContainer.appendChild(sliderNumbers);

        // Insert before external nav
        const externalNav = document.querySelector('.external-nav');
        externalNav.parentNode.insertBefore(sliderContainer, externalNav);

        // Create Level 3 specific navigation panel
        const level3Nav = document.createElement('div');
        level3Nav.className = 'level3-navigation';

        // Previous button
        const level3PrevBtn = document.createElement('button');
        level3PrevBtn.className = 'nav-btn level3-nav-btn';
        level3PrevBtn.textContent = 'Previous';
        level3PrevBtn.addEventListener('click', function() {
            startLevel2();
        });

        // Progress dots
        const level3ProgressDots = document.createElement('div');
        level3ProgressDots.className = 'progress-dots level3-progress-dots';
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === 2) { // Level 3 is index 2
                dot.classList.add('active');
            }
            level3ProgressDots.appendChild(dot);
        }

        // Instruction text
        const level3InstructionText = document.createElement('div');
        level3InstructionText.className = 'level3-nav-instruction';
        level3InstructionText.textContent = 'move slider to right-most position';

        level3Nav.appendChild(level3PrevBtn);
        level3Nav.appendChild(level3ProgressDots);
        level3Nav.appendChild(level3InstructionText);

        // Insert the Level 3 navigation at the bottom
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(level3Nav);

        // --- Drag functionality ---
        let isDragging = false;
        let currentIndex = 2;

        function updateSlider(index) {
            dots.forEach((d, i) => d.classList.toggle('active', i === index));
            setThumbPosition(index);
            updateLevel3Display(index);
            currentIndex = index;
            // Show/hide nav instructions and next button
            if (index === 10) {
                if (level3InstructionText) level3InstructionText.style.display = 'none';
                let level3NextBtn = document.querySelector('.level3-next-btn');
                if (!level3NextBtn) {
                    level3NextBtn = document.createElement('button');
                    level3NextBtn.className = 'nav-btn level3-nav-btn level3-next-btn highlighted';
                    level3NextBtn.textContent = 'Next';
                    level3NextBtn.addEventListener('click', function() {
                        startLevel4();
                    });
                    level3Nav.appendChild(level3NextBtn);
                }
                level3NextBtn.style.display = 'block';
            } else {
                if (level3InstructionText) level3InstructionText.style.display = 'block';
                const level3NextBtn = document.querySelector('.level3-next-btn');
                if (level3NextBtn) level3NextBtn.style.display = 'none';
            }
        }

        // Click on dots

        // Drag events
        function getClosestDotIndex(x) {
            const trackRect = sliderTrack.getBoundingClientRect();
            let minDist = Infinity;
            let closest = 0;
            dots.forEach((dot, i) => {
                const dotRect = dot.getBoundingClientRect();
                const dotCenter = dotRect.left + dotRect.width / 2;
                const dist = Math.abs(x - dotCenter);
                if (dist < minDist) {
                    minDist = dist;
                    closest = i;
                }
            });
            return closest;
        }

        function onDrag(e) {
            let clientX;
            if (e.touches) {
                clientX = e.touches[0].clientX;
            } else {
                clientX = e.clientX;
            }
            const index = getClosestDotIndex(clientX);
            updateSlider(index);
        }

        thumb.addEventListener('mousedown', (e) => {
            isDragging = true;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                onDrag(e);
            }
        });
        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });
        // Touch events
        thumb.addEventListener('touchstart', (e) => {
            isDragging = true;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                onDrag(e);
            }
        });
        document.addEventListener('touchend', (e) => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });

        // Initial update
        setTimeout(() => updateSlider(0), 0);
    }

    // Level 5: Final display with "These numbers are called MULTIPLES of 2..."
    function startLevel5() {
        gameState.level = 5;
        gameState.stage = 'completed';

        // Update progress dots
        updateProgressDots();

        // Clear and setup Level 5 layout
        setupLevel5Layout();

        // Enable navigation
        enableLevel5Navigation();
    }

    function setupLevel5Layout() {
        // Clear game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Keep slider layout active
        document.body.classList.add('slider-layout');

        // Remove success state
        document.body.classList.remove('success-state');

        // Create main container using Level 4 structure
        const mainContainer = document.createElement('div');
        mainContainer.className = 'level4-main-container';

        // Create first title (existing sentence, no bold)
        const title1 = document.createElement('div');
        title1.className = 'level4-title';
        title1.textContent = 'These lengths are all formed by joining rods of 2...';
        mainContainer.appendChild(title1);

        // Create second title (new sentence, no bold)
        const title2 = document.createElement('div');
        title2.className = 'level4-title level4-title-multiples';
        title2.textContent = 'These numbers are called MULTIPLES of 2...';
        mainContainer.appendChild(title2);

        // Create display container for boxes using Level 4 structure
        const displayContainer = document.createElement('div');
        displayContainer.className = 'level4-display-container';
        displayContainer.id = 'level4-display-container';

        // Create container for all box pairs using Level 4 structure
        const allPairsContainer = document.createElement('div');
        allPairsContainer.className = 'level4-all-pairs-container';

        // Create 10 pairs of boxes using Level 4 structure
        for (let i = 1; i <= 10; i++) {
            const pairContainer = document.createElement('div');
            pairContainer.className = 'level4-pair-container';

            const boxPair = document.createElement('div');
            boxPair.className = 'level4-box-pair';

            // First box
            const box1 = document.createElement('div');
            box1.className = 'level4-box';

            // Second box with result on top
            const box2Container = document.createElement('div');
            box2Container.className = 'level4-box2-container';

            const result = document.createElement('div');
            result.className = 'level4-result';
            result.textContent = i * 2;

            const box2 = document.createElement('div');
            box2.className = 'level4-box';

            box2Container.appendChild(result);
            box2Container.appendChild(box2);

            // Add boxes to pair
            boxPair.appendChild(box1);
            boxPair.appendChild(box2Container);

            // Create equation below boxes
            const equation = document.createElement('div');
            equation.className = 'level4-equation';
            equation.textContent = `2 × ${i} = ${i * 2}`;

            pairContainer.appendChild(boxPair);
            pairContainer.appendChild(equation);
            allPairsContainer.appendChild(pairContainer);
        }

        displayContainer.appendChild(allPairsContainer);
        mainContainer.appendChild(displayContainer);
        gameArea.appendChild(mainContainer);
    }

    function enableLevel5Navigation() {
        // Hide original navigation
        const externalNav = document.querySelector('.external-nav');
        externalNav.style.display = 'none';

        // Create Level 5 navigation panel
        createLevelNavigation(5, 'Next');
    }

    // Level 6: Final multiples definition display
    function startLevel6() {
        gameState.level = 6;
        gameState.stage = 'completed';

        // Update progress dots
        updateProgressDots();

        // Clear and setup Level 6 layout
        setupLevel6Layout();

        // Enable navigation
        enableLevel6Navigation();
    }

    function setupLevel6Layout() {
        // Clear game area
        const gameArea = document.querySelector('.game-area');
        gameArea.innerHTML = '';

        // Keep slider layout active
        document.body.classList.add('slider-layout');

        // Remove success state
        document.body.classList.remove('success-state');

        // Create main container
        const mainContainer = document.createElement('div');
        mainContainer.className = 'level6-main-container';

        // Create main title
        const mainTitle = document.createElement('div');
        mainTitle.className = 'level6-main-title';
        mainTitle.textContent = 'MULTIPLES of 2';
        mainContainer.appendChild(mainTitle);

        // Create definition text
        const definitionText = document.createElement('div');
        definitionText.className = 'level6-definition';
        definitionText.innerHTML = '<em>are all numbers that can be made up of 2<br>multiplied by a natural number</em>';
        mainContainer.appendChild(definitionText);

        // Create numbers row
        const numbersRow = document.createElement('div');
        numbersRow.className = 'level6-numbers-row';

        for (let i = 1; i <= 10; i++) {
            const number = document.createElement('div');
            number.className = 'level6-number';
            number.textContent = i * 2;
            numbersRow.appendChild(number);
        }

        mainContainer.appendChild(numbersRow);

        // Create equations row
        const equationsRow = document.createElement('div');
        equationsRow.className = 'level6-equations-row';

        for (let i = 1; i <= 10; i++) {
            const equation = document.createElement('div');
            equation.className = 'level6-equation';
            equation.textContent = `2 × ${i}`;
            equationsRow.appendChild(equation);
        }

        mainContainer.appendChild(equationsRow);

        gameArea.appendChild(mainContainer);
    }

    function enableLevel6Navigation() {
        // Hide original navigation
        const externalNav = document.querySelector('.external-nav');
        externalNav.style.display = 'none';

        // Create Level 6 navigation panel with character image
        createLevel6NavigationWithCharacter();
    }

    function createLevel6NavigationWithCharacter() {
        // Remove any existing level navigation
        const existingNav = document.querySelector('.level3-navigation');
        if (existingNav) {
            existingNav.remove();
        }

        // Create level navigation panel
        const levelNav = document.createElement('div');
        levelNav.className = 'level3-navigation level6-navigation';

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'nav-btn level3-nav-btn';
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', function() {
            // Clean up any existing level navigation before switching
            const existingLevelNav = document.querySelector('.level3-navigation');
            if (existingLevelNav) {
                existingLevelNav.remove();
            }

            const existingSlider = document.querySelector('.level3-slider-container');
            if (existingSlider) {
                existingSlider.remove();
            }

            startLevel5();
        });

        // Progress dots
        const progressDots = document.createElement('div');
        progressDots.className = 'progress-dots level3-progress-dots';
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (i === 5) { // Level 6 is index 5
                dot.classList.add('active');
            }
            progressDots.appendChild(dot);

            // Add click functionality to dots
            dot.addEventListener('click', function() {
                // Clean up any existing level navigation before switching
                const existingLevelNav = document.querySelector('.level3-navigation');
                if (existingLevelNav) {
                    existingLevelNav.remove();
                }

                const existingSlider = document.querySelector('.level3-slider-container');
                if (existingSlider) {
                    existingSlider.remove();
                }

                const targetLevel = i + 1;
                if (targetLevel === 1) resetToLevel1();
                else if (targetLevel === 2) startLevel2();
                else if (targetLevel === 3) startLevel3();
                else if (targetLevel === 4) startLevel4();
                else if (targetLevel === 5) startLevel5();
                else if (targetLevel === 6) startLevel6();
            });
        }

        // Create container for character image only
        const rightSection = document.createElement('div');
        rightSection.className = 'level6-right-section';

        // Add character image
        const characterImg = document.createElement('img');
        characterImg.src = 'attached_assets/Male_1751955196191.png';
        characterImg.className = 'level6-character-img';
        characterImg.alt = 'Character';

        rightSection.appendChild(characterImg);

        levelNav.appendChild(prevButton);
        levelNav.appendChild(progressDots);
        levelNav.appendChild(rightSection);

        // Insert navigation at the bottom
        const gameContainer = document.querySelector('.game-container');
        gameContainer.appendChild(levelNav);
    }

    // Initialize the game
    initGame();

    // Initialize progress dots
    updateProgressDots();

    // Initially disable next button
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    nextBtn.style.pointerEvents = 'none';
    nextBtn.classList.remove('highlighted');
});