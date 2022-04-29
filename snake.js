$(document).ready(function(){

    var canvas = $("#canvas")[0];
    var scoreText = $("#score")[0];

    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    // draw initial backgrounds

    ctx.fillStyle = "white";
    ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0,0,w,h);

    // variables

    var snake_array; // Representing our snake
    var food; // Represents the food
    var cell_width = 10; // Represents the width and height of blocks
    var direction; // Represent where the snake is headed to
    var score;

    var game_loop;

    function init()
    {
        direction = "right";
        score = 0;

        create_snake();
        create_food();

        if (typeof game_loop != "undefined")
            clearInterval(game_loop);
        game_loop = setInterval(paint,45);
    }

    function create_snake()
    {
        var length = 10; // initially 5 blocks
        snake_array = []; // initialize snake array

        for (var i = length-1;i >= 0;i--)
        {
            snake_array.push(
                {
                    x: i,
                    y: 0
                }
            );
        }
    }

    function create_food()
    {
        food = {
            x: Math.round(Math.random()*(w - cell_width) / cell_width),
            y: Math.round(Math.random()*(h - cell_width) / cell_width)
        };
    }

    function paint()
    {
        // Draw Background
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0,0,w,h);

        // Move the Snake
        var headX = snake_array[0].x;
        var headY = snake_array[0].y;

        
        if (direction == "right")
            headX++; // To the right
        else if (direction == "left")
            headX--; // To the left
        else if (direction == "up")
            headY--; // Up
        else if (direction == "down")
            headY++; // Down

        // Check if snake has collided with the borders or the body
        if (headX == -1 || headX == w/cell_width || headY == -1 || headY == h/cell_width || checkBody(headX,headY,snake_array))
        {
            init(); // reset the game

            return;
        }

        // Check if the snake has collided / eaten the food
        if (headX == food.x && headY == food.y)
        {
            // Create a new tail, place it at the head's location
            var tail = {
                x: headX,
                y: headY
            };
            create_food(); // Create a new instance of food

            score++; // Increase your score
        }
        else // Not collided with food? Move normally
        {
            var tail = snake_array.pop();
            tail.x = headX;
            tail.y = headY;
        }

        snake_array.unshift(tail);

        // Draw the Snake
        for (var i = 0;i < snake_array.length;i++)
        {
            var c = snake_array[i];
            paintSquare(c.x,c.y,"green");
        }
        
        // Draw the food
        paintSquare(food.x,food.y,"red");

        scoreText.innerHTML = "Score: "+score;
    }

    function paintSquare(x, y, color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(x*cell_width,y*cell_width,cell_width,cell_width);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cell_width,y*cell_width,cell_width,cell_width);
    }

    function checkBody(x,y,array)
    {
        // If the head's x,y coordinate is equal to any of the body's x,y coordinates, then a collision has occured
        for (var i =0;i < array.length;i++)
        {
            if (array[i].x == x && array[i].y == y)
                return true;
        }

        return false;
    }

    $(document).keydown(function(e) {
        var key = e.which;

        // up
        if (key == "38" && direction != "down")
            direction = "up";
        // down
        else if (key == "40" && direction != "up")
            direction = "down";
        // left
        else if (key == "37" && direction != "right")
            direction = "left";
        // right
        else if (key == "39" && direction != "left")
            direction = "right";
    })

    init();
});