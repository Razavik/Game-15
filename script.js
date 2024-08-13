class Game{
    constructor(){
        this.size = 4;

        this.dir = [
            {x : 1, y : 0}, 
            {x : -1, y : 0}, 
            {x : 0, y : 1}, 
            {x : 0, y : -1}
        ];

        this.table = document.getElementById('game');

        this.createField();
    }

    changeSize(size){
        this.size = size;

        this.createField();
    }

    createField() {
        this.field = Array.from({ length: this.size }, () => Array(this.size).fill(0));

        for(let i = 0; i < this.size**2; i++){
            this.field[Math.floor(i / this.size)][i % this.size] = i + 1;
        }

        this.x = this.size - 1;
        this.y = this.size - 1;
        
        let x = this.x;
        let y = this.y;
        
        const dir = this.dir;

        this.field[y][x] = 0;

        for(let i = 0; i < this.size * 50 * (this.size - 3); i++){
            const rand = Math.floor(Math.random() * 10 % 4);

            let newX = dir[rand].x + x;
            let newY = dir[rand].y + y;

            if(newX >= 0 && newX < this.size && newY >= 0 && newY < this.size){
                this.field[y][x] = this.field[newY][newX];
                this.field[newY][newX] = 0;

                x += dir[rand].x;
                y += dir[rand].y;
            }
        }

        while(y < this.size - 1){
            this.field[y][x] = this.field[y + 1][x];
            this.field[y + 1][x] = 0;
            y += 1;
        }

        while(x < this.size - 1){
            this.field[y][x] = this.field[y][x + 1];
            this.field[y][x + 1] = 0;
            x += 1;
        }

        document.querySelector('h1').innerHTML = 'Игра Пятнашки';
        this.printField();
    }

    printField() {
        this.table.innerHTML = this.field.map(row =>
            `<tr>${row.map(cell => `<td ${cell == 0 ? 'class="active"' : ''}>${cell || ''}</td>`).join('')}</tr>`
        ).join('');
    }

    move(indexY, indexX){
        let isMove = false;

        for (const item of this.dir) {
            if(indexY + item.y == this.y && indexX + item.x == this.x){
                isMove = true;
                break;
            }
        }

        if(isMove == false) return;

        this.field[this.y][this.x] = this.field[indexY][indexX];
        this.field[indexY][indexX] = 0;

        this.x = indexX;
        this.y = indexY;

        this.printField();

        this.isGameOver();
    }

    isGameOver(){
        for(let i = 1; i < this.size**2; i++){
            if(i != this.field.flat()[i - 1]) return;
        }

        document.querySelector('h1').innerHTML = 'Вы победил!';

        document.querySelector('table').removeEventListener('click', handleClick);
    }
}

const game = new Game();

function handleClick(event) {
    let cell = event.target;

    if (cell.tagName.toLowerCase() == 'td') {
        let indexY = cell.parentNode.rowIndex;
        let indexX = cell.cellIndex;

        game.move(indexY, indexX);
    }
}

document.querySelector('table').addEventListener('click', handleClick);

document.getElementById('restart').addEventListener('click', function(){
    game.createField();
});

for(let i = 4; i <= 6; i++){
    document.getElementById('size-' + i).addEventListener('click', function(){
        game.changeSize(i);
    });
}