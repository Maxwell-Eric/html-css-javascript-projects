window.onload = function() {

    //Sorting Container and buttons
    var s = new Con();

    document.getElementById("mergeSortB").addEventListener("click", function() {
        animate(function() { s.mergeSort(); });
    });
    document.getElementById("insertSortB").addEventListener("click", function() {
        animate(function() { s.insertSort(); });
    });
    document.getElementById("selectSortB").addEventListener("click", function() {
        animate(function() { s.selectSort(); });
    });
    document.getElementById("bubbleSortB").addEventListener("click", function() {
        animate(function() { s.bubbleSort(); });
    });
    animate = function(sort) {
        s.init();
        sort();
        document.getElementById("sortHeading").innerHTML = "Number of Compares: " + s.frameSet.length;
        s.timer = setInterval(function() { s.display(); }, 50);
    }


    //Ball frame and buttons
    var bf;

    document.getElementById("ballsButt").addEventListener("click", function() {
        if (bf != null)
            clearInterval(bf.timer);
        bf = null;
        bf = new BallFrame();
        bf.timer = setInterval(function() { bf.draw(); }, 20);
    });

    //Recursive button
    document.getElementById("recursiveB").addEventListener("click", returnText);
}

//Sorting container
function Con() {
    //Get canvas and context
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");

    //Create and initialize sorting bars
    var bars = new Array(50);
    for (var i = 0; i < 50; ++i) {
        bars[i] = new Bar(20 + i * 5, 10, (i + 1) * 2);
    }

    //A frame is created for each compare in the sorting algorithms
    var frameSet = new Array(50);
    this.frameSet = frameSet;

    //Timer used with frames for animation
    this.timer = null;

    /**
     * Draws the bars for each frame in the frameset. 
     * 
     * @Param   barsAndI  an array with two items. The array of bars and the current bar being compared to color it.
     */
    drawbars = function(barsAndI) {
        if (barsAndI == null)
            barsAndI = [bars, -1];
        var frameBars = barsAndI[0];
        ctx.fillStyle = "#fff";
        ctx.clearRect(0, 0, c.width, c.height);
        for (var i = 0; i < 50; ++i) {
            frameBars[i].x = 20 + i * 5;
            if (i == barsAndI[1])
                ctx.fillStyle = "#ff9922";

            ctx.beginPath();
            ctx.rect(frameBars[i].x, frameBars[i].y, 5, frameBars[i].h);
            ctx.fill();
            ctx.fillStyle = "#fff";
        }
    }
    drawbars();

    shuffleBars = function() {
        for (var i = bars.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = bars[i];
            bars[i] = bars[j];
            bars[j] = temp;
        }
        drawbars([bars, -1]);
    }

    makeFrame = function(i) {
        var cBars = new Array(bars.length);

        for (var k = 0; k < bars.length; ++k) {
            var temp = bars[k];
            cBars[k] = temp;
        }
        frameSet.push([cBars, i]);
    }

    function Bar(x, y, h) {
        this.x = x;
        this.y = y;
        this.h = h;
    }

    this.selectSort = function() {
        var numBars = bars.length;
        for (var i = 0; i < numBars - 1; ++i) {
            var min = i;
            for (var j = i + 1; j < numBars; ++j) {

                if (bars[j].h < bars[min].h)
                    min = j;

                makeFrame(j);
            }
            var temp = bars[i];
            bars[i] = bars[min];
            bars[min] = temp;
            //makeFrame(-1);
        }
    }

    this.insertSort = function() {
        var barslen = bars.length;
        for (var i = 0; i < barslen - 1; ++i) {
            var temp = bars[i + 1];
            var j = i;
            while (j > -1 && temp.h < bars[j].h) {

                bars[j + 1] = bars[j];
                bars[j--] = temp;
                makeFrame(j + 1);
            };
            if (j != -1)
                makeFrame(-1);
            ++j;
            bars[j] = temp;
        }
    }

    this.bubbleSort = function() {
        var barslen = bars.length;
        for (var i = 0; i < barslen - 1; ++i) {
            for (var j = 0; j < barslen - 1 - i; ++j) {

                if (bars[j].h > bars[j + 1].h) {
                    var temp = bars[j];
                    bars[j] = bars[j + 1];
                    bars[j + 1] = temp;
                }
                makeFrame(j + 1);
            }
        }
    }

    this.mergeSort = function() {
        sort(0, bars.length - 1);

        function sort(low, high) {
            if (high <= low)
                return;
            var mid = parseInt((low + high) / 2);
            sort(low, mid, frameSet);
            sort(mid + 1, high);
            merge(low, mid, high);

            function merge(low, mid, high) {
                var copy = new Array(bars.length);
                for (var k = low; k <= high; ++k)
                    copy[k] = bars[k];

                var i = low;
                var j = mid + 1;
                var white;
                for (var k = low; k <= high; ++k) {
                    if (i > mid)
                        bars[k] = copy[j++];

                    else if (j > high)
                        bars[k] = copy[i++];

                    else if (copy[i].h < copy[j].h)
                        bars[k] = copy[i++];

                    else
                        bars[k] = copy[j++];

                    makeFrame(k);
                }
            }
        }
    }

    this.init = function() {
        frameSet.length = 0;
        if (this.timer != null)
            clearInterval(this.timer);
        shuffleBars();
    }

    this.display = function() {
        if (frameSet.length == 0) {
            drawbars([bars, -1]);
            clearInterval(this.timer);
            document.getElementById("sortHeading").innerHTML = "Sorting Algorithms";
            return;
        }
        drawbars(frameSet.shift());
    }
}




function BallFrame() {
    var c = document.getElementById("canvas1");
    var ctx = c.getContext("2d");
    var numberOfBalls = document.getElementById("numBalls").value;
    var radius = document.getElementById("radius").value;
    var balls = new Array(numberOfBalls);
    this.timer;

    if (numberOfBalls < 1 || numberOfBalls > 500 || radius < 1 || radius > 35) {
        numberOfBalls = 4;
        radius = 3;
        document.getElementById("ballsHeading").innerHTML = "Balls: 1  to 500   Radius: 1 to 35";
    } else
        document.getElementById("ballsHeading").innerHTML = "Bouncing Ball Animation"

    for (var i = 0; i < numberOfBalls; ++i)
        balls[i] = new Ball(2 * radius, 2 * radius, radius);

    this.draw = function() {
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#fff";

        for (var i = 0; i < numberOfBalls; ++i) {
            var ball = balls[i];
            drawBall(ball);

            if (ball.x + 2 * ball.r > c.width || ball.x - 2 * ball.r < 0)
                ball.dx = -ball.dx;

            if (ball.y + 2 * ball.r > c.height || ball.y - 2 * ball.r < 0)
                ball.dy = -ball.dy;

            ball.x += ball.dx;
            ball.y += ball.dy;
        }
    }

    drawBall = function(b) {
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 2 * b.r, 2 * b.r, 0, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    function Ball(x, y, r) {
        this.dx = 1 + 4 * Math.random();
        this.dy = 1 + 4 * Math.random();
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

function returnText() {
    var fibOut = document.getElementById("fibOut");
    var n = document.getElementById("fib").value;
    if (n < 1 || n > 100) {
        fibOut.innerHTML = "<br><br>The number must be between 1 and 100";
        n = 0;
    }
    last_digit = n % 10;
    var sub;
    switch (parseInt(last_digit)) {
        case 1:
            sub = "st";
            break;
        case 2:
            sub = "nd";
            break;
        case 3:
            sub = "rd";
            break;
        default:
            sub = "th";
    }

    var hashTable = new Array(100);
    fibOut.innerHTML = "<br>The " + n + sub + " term of the Fibonacci Sequence is " + betterFib(n) +
        "<br><br>" + n + "! = " + fact(n);

    function fact(n) {
        if (n == 1) {
            return 1;
        }
        return n * fact(n - 1);
    }

    function fib(n) {
        if (n == 1 || n == 2) {
            return 1;
        }
        return fib(n - 2) + fib(n - 1);
    }

    function betterFib(n) {
        if (n == 1 || n == 2) {
            hashTable[n] = 1;
        } else {
            if (hashTable[n - 1] != null)
                hashTable[n] = hashTable[n - 1] + hashTable[n - 2];
            else
                hashTable[n] = betterFib(n - 1) + betterFib(n - 2);
        }
        return hashTable[n];
    }

    function betterFib2(n) {
        hashTable[1] = 1;
        hashTable[2] = 1;
        for (var i = 3; i <= n; ++i)
            hashTable[i] = hashTable[i - 1] + hashTable[i - 2];

        return hashTable[n];
    }
}