

# Global purpose generators
def GenerateSeed(date):
    hash = 0

    for char in date:
        character = ord(char)
        hash = (hash << 5) - hash + character
        # keep it a 32 bit signed integer
        hash &= 0xFFFFFFFF
        if hash >= 0x80000000:
            hash -= 0x100000000

    hash = abs(hash)
    hash &= 0xFFFFFFFF  # work in unsigned 32 bit

    # MurmurHash (v3) part
    hash ^= hash >> 16
    hash = (hash * 0x85ebca6b) & 0xFFFFFFFF
    hash ^= hash >> 13
    hash = (hash * 0xc2b2ae35) & 0xFFFFFFFF
    hash ^= hash >> 16
    return hash




def js_math_imul(a, b):
    return (a * b) & 0xFFFFFFFF
def mulberry32(seed):
    seed = seed & 0xFFFFFFFF  # keep as unsigned 32-bit

    def rng():
        nonlocal seed
        seed = (seed + 0x6D2B79F5) & 0xFFFFFFFF
        t = js_math_imul(seed ^ (seed >> 15), 1 | seed)
        t = ((t + js_math_imul(t ^ (t >> 7), 61 | t)) & 0xFFFFFFFF) ^ t
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return rng

def Sim_Randint(RNG, lowest, highest): 
    return lowest + int(RNG() * (highest - lowest + 1))






# Puzzle generators
generators = {}

def IdentifyGen(algo_type):
    def decorator(func):
        generators[algo_type] = func
        return func
    return decorator




@IdentifyGen("sorting")
def sorting(algorithm, details, localSeed):
    name = algorithm["name"] #example of the structure of algorithm argument
    RNG = mulberry32(localSeed+1)

    puzzle = []     # [{"index": "bar1", "value": 6}, {"index": "bar2", "value": 8}]
    for i in range(details["puzzle_length"]):
        bar = "bar"+f"{i}" #bar1, bar2, bar3. . .
        value = Sim_Randint(RNG, 1, 10)
        puzzle.append({"index": bar, "value": value})

    return {
        "puzzle": puzzle,
    }




@IdentifyGen("searching")
def searching(algorithm, details, localSeed):
    RNG = mulberry32(localSeed+2)


    puzzle = {}
    
    for i in range(0, details["puzzle_length"]):
        bar = "bar"+f"{i}"
        puzzle[bar] = Sim_Randint(RNG, 0, 10)

    target = Sim_Randint(RNG, 0, details["puzzle_length"]) #this is wrong since i changed what <puzzle> is
    return {
        "puzzle": puzzle,
        "target": target
    }
    