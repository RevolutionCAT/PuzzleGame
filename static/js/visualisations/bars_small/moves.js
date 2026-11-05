
// облегчить работу с ходами потом. 

// учитывает сложность, тип хода
// в зависимости от сложности, говорит какому ходу соответствует
// будет набор флагов. типо: interchangeable (s1-2 == s2-1), exist ("below/above", "medium") или level ("high/low/medium")
// эти флаги будут учитываться на сервере

class Move {
    constructor(name) {
        this.name = name;
        
    }
    GetData(name) {
        
    }

    ChangePuzzle() {

    }
}


const MoveBase = {
    "swap": {
        "symbol": '',
        "functions": [],
        "sameas": []
    }
}