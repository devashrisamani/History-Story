
// A constructor function for individual jigsaw puzzle pieces. 
// It holds properties for the piece number, X and Y coordinates, and 
// whether it's selected.
function imageBlock(no, x, y) {
    this.no = no; //block number
    this.x = x; //X - coordinate
    this.y = y; // Y- coordinate
    this.isSelected = false; // Tracks if the block is selcted
}

// Constructor function for the main game object
// It initializes the puzzle game, sets up the canvas, 
// and manages puzzle piece placement and interactions.
function jigsaw(canvasID, imageID, rows,columns) {

    var MAIN_IMG_WIDTH = 800; //width of the main image
    var MAIN_IMG_HEIGHT = 600; //height of the main image

    // Block piece sizes
    var BLOCK_IMG_WIDTH = 600;
    var BLOCK_IMG_HEIGHT = 450;

    // Jigsaw grid
    var TOTAL_ROWS = rows;// 4;
    var TOTAL_COLUMNS = columns;  //4;

    // Total number of puzzle pieces
    var TOTAL_PIECES = TOTAL_ROWS * TOTAL_COLUMNS;

    // Height and width of individual pieces
    var IMG_WIDTH = Math.round(MAIN_IMG_WIDTH / TOTAL_COLUMNS);
    var IMG_HEIGHT = Math.round(MAIN_IMG_HEIGHT / TOTAL_ROWS);


    var BLOCK_WIDTH = 0; // Math.round(BLOCK_IMG_WIDTH / TOTAL_COLUMNS);
    var BLOCK_HEIGHT = 0; // Math.round(BLOCK_IMG_HEIGHT / TOTAL_ROWS);

    var image1;
    var canvas;
    var ctx;

    this.canvasID = canvasID;
    this.imageID = imageID;

    this.top = 0;
    this.left = 0;

    // Arrays to hold image blocks and selected block
    this.imageBlockList = new Array();
    this.blockList = new Array();
    this.selectedBlock = null;
    this.mySelf = this;


    // Initializes the jigsaw puzzle game, sets up 
    // event listeners, and initializes a new game.
    this.initDrawing = function () {
        mySelf = this;
        selectedBlock = null;
        canvas = document.getElementById(canvasID);

        ctx = canvas.getContext('2d');

        canvas.onmousedown = handleOnMouseDown;
        canvas.onmouseup = handleOnMouseUp;
        canvas.onmouseout = handleOnMouseOut;
        canvas.onmousemove = handleOnMouseMove;

        image1 = document.getElementById(imageID);

        initializeNewGame();
    };

    // Funtion to initialise a new game
    function initializeNewGame() {

        // Set block and calculate the width and the height
        BLOCK_WIDTH = Math.round(BLOCK_IMG_WIDTH / TOTAL_COLUMNS);
        BLOCK_HEIGHT = Math.round(BLOCK_IMG_HEIGHT / TOTAL_ROWS);
        // Set up image blocks and Draw image
        SetImageBlock();
        DrawGame();
    }

    // Function to preview the image
    this.showPreview = function () {

        var x1 = 20;
        var y1 = 20;
        var width = BLOCK_IMG_WIDTH - (x1 * 2);
        var height = BLOCK_IMG_HEIGHT - (y1 * 2);

        ctx.save();

        ctx.drawImage(image1, 0, 0, MAIN_IMG_WIDTH, MAIN_IMG_HEIGHT, x1, y1, width, height);


        //Draw a rectangle around the preview
        ctx.fillStyle = '#00f'; // blue
        ctx.strokeStyle = '#f00'; // red
        ctx.lineWidth = 4;
        ctx.strokeRect(x1 - 2, y1 - 2, width + 4, height + 4);
        ctx.restore();
    };

    // This function is responsible for rendering the jigsaw 
    // puzzle game on the canvas, including both the grid and the image blocks.
    function DrawGame() {
        clear(ctx);
        drawLines();
        drawAllImages();

        if (selectedBlock) {
            drawImageBlock(selectedBlock);
        }
    }

    // This function sets the positions of the individual
    // image blocks within the puzzle grid.
    function SetImageBlock() {

        var total = TOTAL_PIECES;
        imageBlockList = new Array();
        blockList = new Array();

        var x1 = BLOCK_IMG_WIDTH - 500;
        var x2 = canvas.width - 40;
        var y2 = BLOCK_IMG_HEIGHT;
        for (var i = 0; i < total; i++) {

            var randomX = randomXtoY(x1, x2, 2);
            var randomY = randomXtoY(0, y2, 2);

            var imgBlock = new imageBlock(i, randomX, randomY);

            imageBlockList.push(imgBlock);

            var x = (i % TOTAL_COLUMNS) * BLOCK_WIDTH;
            var y = Math.floor(i / TOTAL_COLUMNS) * BLOCK_HEIGHT;

            var block = new imageBlock(i, x, y);
            blockList.push(block);
        }

    }

    // Function to draw the game grid
    function drawLines() {

       ctx.strokeStyle = "#e9e9e9";

        ctx.lineWidth = 1;
        ctx.beginPath();

        // draw verticle lines
        for (var i = 0; i <= TOTAL_COLUMNS; i++) {
            var x = BLOCK_WIDTH * i;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 450);
        }

        // draw horizontal lines
        for (var i = 0; i <= TOTAL_ROWS; i++) {
            var y = BLOCK_HEIGHT * i;
            ctx.moveTo(0, y);
            ctx.lineTo(600, y);
        }


        ctx.closePath();
        ctx.stroke();
    }

    // Draws all the image blocks on the canvas, excluding the selected one.
    function drawAllImages() {
        for (var i = 0; i < imageBlockList.length; i++) {
            var imgBlock = imageBlockList[i];
            if (imgBlock.isSelected == false) {
                drawImageBlock(imgBlock);
            }
        }
    }

    // Draws an individual image block on the canvas.
    function drawImageBlock(imgBlock) {
        drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, BLOCK_WIDTH, BLOCK_HEIGHT);
    
    }


    function drawFinalImage(index, destX, destY, destWidth, destHeight) {

        ctx.save();

        var srcX = (index % TOTAL_COLUMNS) * IMG_WIDTH;
        var srcY = Math.floor(index / TOTAL_COLUMNS) * IMG_HEIGHT;

        ctx.drawImage(image1, srcX, srcY, IMG_WIDTH, IMG_HEIGHT, destX, destY, destWidth, destHeight);

        ctx.restore();
    }

    function drawImage(image) {

        ctx.save();

        ctx.drawImage(image, 0, 0, BLOCK_WIDTH, BLOCK_WIDTH, 10, 10, BLOCK_WIDTH, BLOCK_WIDTH);

        ctx.restore();
    }

    var interval = null;
    var remove_width;
    var remove_height;

    // Initiates actions when the puzzle is completed, including playing 
    // an audio, clearing the board, and opening an information page.
    function OnFinished() {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'Audio/finish.mp3');
        audioElement.play();

        remove_width = BLOCK_WIDTH;
        remove_height = BLOCK_HEIGHT;
        // Clear Board
        interval = setInterval(function () {
            mySelf.ClearGame();
            //游戏完成，读取页面中input的name为‘obj’的值
            var name = document.getElementById("obj").value;
            console.log(name);
            //打开information_page.html页面
            window.open("information_page.html?name=" + name);
        }, 100);
    }

    // Clears the game board by shrinking the pieces when the puzzle is completed
    // which is the animation.
    this.ClearGame = function () {
        //   alert("f");
        remove_width -= 30;
        remove_height -= 20;

        if (remove_width > 0 && remove_height > 0) {

            clear(ctx);

            for (var i = 0; i < imageBlockList.length; i++) {
                var imgBlock = imageBlockList[i];

                imgBlock.x += 10;
                imgBlock.y += 10;

                drawFinalImage(imgBlock.no, imgBlock.x, imgBlock.y, remove_width, remove_height);
            }
        } else {
            clearInterval(interval);
            initializeNewGame();
        }
    };

    // Handles the mouse-out event by deselecting the current image block.
    function handleOnMouseOut(e) {

        // remove old selected
        if (selectedBlock != null) {

            imageBlockList[selectedBlock.no].isSelected = false;
            selectedBlock = null;
            DrawGame();
        }
    }

    // Handles the mouse-down event, allowing users to select an image block.
    function handleOnMouseDown(e) {

        // remove old selected
        if (selectedBlock != null) {

            imageBlockList[selectedBlock.no].isSelected = false;

        }

        selectedBlock = GetImageBlock(imageBlockList, e.pageX-200, e.pageY-200);

        if (selectedBlock) {
            imageBlockList[selectedBlock.no].isSelected = true;
        }

    }

    // Handles the mouse-up event, allowing users to drop a selected image block into the grid.
    function handleOnMouseUp(e) {

        if (selectedBlock) {
            var index = selectedBlock.no;
            var block = GetImageBlock(blockList, e.pageX -200, e.pageY-200);
            if (block) {

                var blockOldImage = GetImageBlockOnEqual(imageBlockList, block.x -200, block.y -200);
                if (blockOldImage == null) {
                    imageBlockList[index].x = block.x;
                    imageBlockList[index].y = block.y;
                }
            }
            imageBlockList[index].isSelected = false;
            selectedBlock = null;
            DrawGame();
            if (isFinished()) {
                OnFinished();
            }
        }
    }
    // Handles the mouse-move event, updating the position of the selected image block.
    function handleOnMouseMove(e) {

        if (selectedBlock) {

            selectedBlock.x = e.pageX  - 205;
            selectedBlock.y = e.pageY  - 205;

            DrawGame();
        }
    }

    function clear(c) {
        c.clearRect(0, 0, canvas.width, canvas.height);
    }

    function randomXtoY(minVal, maxVal, floatVal) {
        var randVal = minVal + (Math.random() * (maxVal - minVal));
        var val = typeof floatVal == 'undefined' ? Math.round(randVal) : randVal.toFixed(floatVal);

        return Math.round(val);
    }


    // Finds the image block based on mouse coordinates within the canvas.
    function GetImageBlock(list, x, y) {

        //for (var i = 0; i < list.length; i++) {
        for (var i = list.length - 1; i >= 0; i--) {
            var imgBlock = list[i];

            var x1 = imgBlock.x;
            var x2 = x1 + BLOCK_WIDTH;

            var y1 = imgBlock.y;
            var y2 = y1 + BLOCK_HEIGHT;

            if (
                (x >= x1 && x <= x2) &&
                (y >= y1 && y <= y2)
            ) {
                //alert("found: " + imgBlock.no);

                var img = new imageBlock(imgBlock.no, imgBlock.x, imgBlock.y);
                //drawImageBlock(img);
                return img;

            }
        }

        return null;
    }


    // Finds an image block with matching coordinates.
    function GetImageBlockOnEqual(list, x, y) {

        for (var i = 0; i < list.length; i++) {
            var imgBlock = list[i];

            var x1 = imgBlock.x;
            var y1 = imgBlock.y;

            if (
                (x == x1) &&
                (y == y1)
            ) {

                var img = new imageBlock(imgBlock.no, imgBlock.x, imgBlock.y);
                //drawImageBlock(img);
                return img;

            }
        }

        return null;
    }

    // Checks if the puzzle is completed by comparing the positions of image blocks to their target positions.
    function isFinished() {

        var total = TOTAL_PIECES;

        for (var i = 0; i < total; i++) {

            var img = imageBlockList[i];
            var block = blockList[i];

            if (
                (img.x != block.x) ||
                (img.y != block.y)
                ) {
                return false;
            }

        }
        return true;
    }

}

// This function checks if the finalImage is fully loaded, 
// and if so, it clears the canvas and draws the image on it, 
// scaling to fit the canvas size. If the image isn't ready, 
// it waits for a short time and retries the drawing operation 
// until the image is loaded.
function drawFinalImage() {
    if (finalImage && finalImage.complete) {
        var canvas = document.getElementById(canvasID);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(finalImage, 0, 0, canvas.width, canvas.height);
    } else {
        setTimeout(drawFinalImage, 100);
    }
}

