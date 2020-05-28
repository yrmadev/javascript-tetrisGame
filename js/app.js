document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const buttomPlay = document.querySelector('#play')
    const width = 10;
    let nextRandom = 0
    let timerId
    let score = 0
    let keyoff = true
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
      ]


    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    const tetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    // ramdon number (0-4)
    function randomNumber() {
        return Math.floor(Math.random() * tetrominoes.length)
    }

    let random = randomNumber()

    let currentPosition = 4;
    let currentRotation = 0;
    
    // show tetromino middle position
    let current = tetrominoes[random][currentRotation];

    // draw the tetromino
    function draw() {

        current.forEach(element => {
            squares[currentPosition + element].classList.add(colors[random])
        });

    }

    // undraw the tetromino
    function undraw() {

        current.forEach(element => {
            squares[currentPosition + element].classList.remove(colors[random])
            
        });
    }

    //assign functions to keycodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()

        }
        else if (e.keyCode === 38) {
            rotate()
        }
        else if (e.keyCode === 39) {
            moveRight()
        }
        else if (e.keyCode === 40) {
            moveDown()
        }
    }

    document.addEventListener('keyup', control)

    function moveDown() {
        if(keyoff){
            undraw()
            currentPosition += width
            draw()
            freeze()
        }
        
    }

    //freeze function
    function freeze() {

        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new tetromino falling
            random = nextRandom
            nextRandom = randomNumber()
            current = tetrominoes[random][currentRotation]

            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move the tetromino left, unless is at the edge
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()

    }

    // move the tetromino right, unless is at the edge
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    // rotate the tetromino
    function rotate() {
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === (width - 1));
        if (!(isAtLeftEdge | isAtRightEdge)) {
            undraw()
            currentRotation++
            if (currentRotation === current.length) {
                currentRotation = 0
            }

            current = tetrominoes[random][currentRotation]
            draw()
        }
    }

    //show up next tetromino in mini grid
    const displaySquares = document.querySelectorAll('.mini-grid div')

    const displayWidth = 4
    let displayIndex = 0

    // the tetromino without rotation
    const nextTetromino = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]

    //display the shape on mini grid
    function displayShape() {
        if(keyoff){
            displaySquares.forEach(square => {
                // square.classList.remove('tetromino')
                square.classList.remove(colors[random])
            })
            nextTetromino[nextRandom].forEach(index => {
                // displaySquares[displayIndex + index].classList.add('tetromino')
                displaySquares[displayIndex + index].classList.add(colors[nextRandom])
            })
        }
        
    }

    //time 1000 is 1 second

    buttomPlay.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            // make the tetromino move down every second
            timerId = setInterval(moveDown, 1000)
            nextRandom = randomNumber()
            displayShape()
        }
    })


    //add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    //squares[index].classList.remove('tetromino')
                    
                    colors.forEach(element => {
                        squares[index].classList.remove(element) 
                    });
                    //squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game over'
            clearInterval(timerId)
            keyoff = false
        }
    }
})

