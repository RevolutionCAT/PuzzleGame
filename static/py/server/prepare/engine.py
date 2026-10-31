import os, importlib
from . import generators


def ListAlgorithms(algo_dir):
    result = {}

    for algoType in sorted(os.listdir(algo_dir)):
        algoType_path = os.path.join(algo_dir, algoType)
        if not os.path.isdir(algoType_path):
            continue

        variations_of = {}

        for algoName in sorted(os.listdir(algoType_path)):
            algoName_path = os.path.join(algoType_path, algoName)
            if not os.path.isdir(algoName_path):
                continue

            algoVariations = []
            for filename in sorted(os.listdir(algoName_path)):
                if not filename.endswith(".py"):
                    continue
                algoVariations.append(filename[:-3])

            if algoVariations:
                variations_of[algoName] = algoVariations

        result[algoType] = variations_of

  #  print("\nRESULT OF ListAlgorithms: ", result)

    return result




def ChooseDetails(difficulty):
    if difficulty == "easy":
        return {
            "difficulty": difficulty,
            "attempts": 8,
            "puzzle_length": [6, 8],
            "minDifficulty": 2.5
        }
    elif difficulty == "medium":
        return {
            "difficulty": difficulty,
            "attempts": 8,
            "puzzle_length": [6, 8],
            "minDifficulty": 4
        }
    elif difficulty == "hard":
        return {
            "difficulty": difficulty,
            "attempts": 8,
            "puzzle_length": [6, 8],
            "minDifficulty": 6
        }
    elif difficulty == "insane":
        return {
            "difficulty": difficulty,
            "attempts": 8,
            "puzzle_length": [6, 8],
            "minDifficulty": 10
        }
    elif difficulty == "fun":
        return {
            "difficulty": difficulty,
            "attempts": 8,
            "puzzle_length": [6, 8],
            "minDifficulty": -1
        }
    else:
        return "Difficulty not chosen"
    








def SelectAlgorithm(algorithms, seed):
    print("\nON ENTER to SelectAlgorithm: ", algorithms, "\nSEED: ", seed)

    all_algorithms = []
    local_seed = generators.GenerateSeed(f"{seed}-SelectAlgorithm")

    for current_algo_type, bases in algorithms.items():
        for base, variations in bases.items():
            for current_variation in variations:
                all_algorithms.append({"base": base, "variation": current_variation, "type": current_algo_type})

    if len(all_algorithms) == 0:
        raise ValueError("No algorithms are available. SelectAlgorithm failed.")

    index = (local_seed & 0xFFFFFFFF) % len(all_algorithms)
    selected = all_algorithms[index]
    print("selected: ", selected)

#    return {
 #       "type": selected["type"],
  #      "name": selected["name"]
   #     "variation": selected["variation"]
    #}
    return { #for debug
        "type": "sorting",
        "name": "BubbleSort",
        "variation": "optimized"
    }






def GeneratePuzzleData(algorithm, difficulty, localSeed):
    generator = generators.generators.get(algorithm["type"])
    if generator is None:
        raise ValueError(f"No generator registered for algorithm type: {algorithm['type']}")

    details = ChooseDetails(difficulty)
    RNG = generators.mulberry32(localSeed)

    lowest, highest = details["puzzle_length"]
    details["puzzle_length"] = generators.Sim_Randint(RNG, lowest, highest) #update puzzle length
    
    response = generator(algorithm, details, localSeed) # {puzzle: {bar1: x, bar2: y, bar3: z}, ?target: X, ...}
    return response 




def RunSimulation(response, algorithm):
    print("ON ENTER TO RunSimulation: ", algorithm, response)
    puzzle_values = [bar["value"] for bar in response["puzzle"]]
    module_path = f"static.py.algorithms.{algorithm['type']}.{algorithm['name']}.{algorithm['variation']}"
    module = importlib.import_module(module_path)

    if not hasattr(module, "Simulate"):
        raise AttributeError(f"Module 'Simulate' in '{module_path}' was not found!")

    return module.Simulate(puzzle_values)




def CheckIfValid(simulationResult, difficulty):
    minDifficulty = ChooseDetails(difficulty)["minDifficulty"]

    if simulationResult["puzzleDifficulty"] >= minDifficulty:
        return True
    return False



def GenerateValidPuzzle(algorithm, difficulty, localSeed):
    for count in range(200):
        puzzleData = GeneratePuzzleData(algorithm, difficulty, localSeed)
        simulationResult = RunSimulation(puzzleData, algorithm)
        if CheckIfValid(simulationResult, difficulty):
            return puzzleData, simulationResult, localSeed, ChooseDetails(difficulty)["attempts"]
        localSeed = generators.GenerateSeed(f"{localSeed}_{count}")
    raise TimeoutError(f"No valid puzzle after {200} attempts")




def SelectMode(availableModes, localSeed):
    RNG = generators.mulberry32(localSeed)
    selected = availableModes[int(RNG() * len(availableModes))]

   # return selected
    return "bars_small" #for debug