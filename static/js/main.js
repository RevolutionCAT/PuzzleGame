// main.js runs the game. It is choosing when it controls the whole game, assembling all the functions from core.js + engine.js
import {Prepare} from "./core.js"
// if need parent folder:     from "../filename.js"


let a = 0;

function Game() {
    if (a == 0) {
        Prepare();
        a++;
    }
    requestAnimationFrame(Game)
}
Game();


// + функция самой игры, которая будет вызывать Prepare(), детектить нажатия и менять визуал. (сборник функций внутри)
    // она будет принимать всё, что Prepare() возвращает
    // + функция внутри неё, которая будет сверять шаги

