# Structure of certain important variables
- markedMoves/markedObjects: 
    [
        {"move": "str", "mark": "str"}, 
        {"move": "str", "mark": "str"}, . . .
    ]

- playerMoves/correctMoves:
    [
        {
            "move": "str", 
            "objects": {
                        "main": "str", 
                        "additional": ["str", "str"]
                        }
        },
        {
            "move": "str", 
            "objects": {
                        "main": "str", 
                        "additional": ["str", "str"]
                        }
        }, . . .
    ]

