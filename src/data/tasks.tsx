import { numericCard, createCard } from "../types/Card"
import { useGameState } from "../state/game/GameState"
import { getStackProduct, useStackProduct, useUIState } from "../state/ui/UIState"
import { spawnCardEntity } from "../components/CardComponent"

/**
 * 
 * @param seed float [0,1]
 * @returns () => float [0,1]
 */
function randomNumberGenerator(seed: number): () => number {
    var intSeed = Math.floor(seed * 0xFFFFFFFF)
    //console.log(seed, intSeed)
    return () => {
        intSeed |= 0; intSeed = intSeed + 0x6D2B79F5 | 0;
        let t = Math.imul(intSeed ^ intSeed >>> 15, 1 | intSeed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}



/**
 * Helper needed for newTaskSeed.
 * Checks if two arrays have the same values.
 */
function arraysEqual(a: number[], b: number[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i])
}

/**
 * Sets a new seed so that the puzzle will not be the same as the previous.
 * Use this function rather than calling gameState.newSeed() directly.
 */
export function newPuzzle () {
    const task = currentTask()
    const old = task.useRNG()
    var current
    do {
        useGameState.getState().newSeed()
        current = task.useRNG()
    } while (arraysEqual(old, current))
}

/**
 * Shorthand function to get the current task
 */
export function currentTask() {
    if (!TASK_LIST[useGameState.getState().currentTask])
        return TASK_LIST[0]
    return TASK_LIST[useGameState.getState().currentTask]
}

/**
 * A task is a category of puzzle
 */
interface Task {
    title:String,
    unlock: () => boolean,
    useRNG: () => number[],
    loadTask: () => void,
    checkSolution: () => boolean,
    unlockText: string,
}

function resultEqualsTarget() {
    const result = useUIState.getState().stackProduct.matrix
    const target = useGameState.getState().targetCard.matrix
    let equal = true
    for (let i = 0; i < result.length; i++){
        for(let j = 0; j < result[i].length; j++){
            if (Math.abs(result[i][j]-target[i][j]) > 0.00001){
                equal = false
            }
        }
    }
    return equal
}

/**
 * TODO: just put these in separate files?
 */
export const TASK_LIST : Task[] = [
    {
        title:"Simple Transformations",
        unlock: ()=>true,
        useRNG: () => {
            const rng = randomNumberGenerator(useGameState.getState().seed)
            return [Math.floor(rng()*4)]
        },
        loadTask: function () {
            const simpleTrans = [
                numericCard([[2,0],[0,1]], "Scale x by 2"),
                numericCard([[1,0],[0,2]], "Scale y by 2"),
                numericCard([[1,1],[0,1]], "Skew x by 1 y"),
                numericCard([[1,0],[1,1]], "Skew y by 1 x"),
                numericCard([[1/2,0],[0,1]], "Scale x by 1/2"),
                numericCard([[1,0],[0,1/2]], "Scale y by 1/2"),
                numericCard([[1,-1],[0,1]], "Skew x by -1 y"),
                numericCard([[1,0],[-1,1]], "Skew y by -1 x"),
            ]
            const i = this.useRNG()[0] 
            const target = createCard({
                matrix: simpleTrans[i].matrix,
                expressionMatrix: [['?','?'],['?','?']],
                simplifiedMatrix: [['?','?'],['?','?']],
                name:'Target'
            })

            useUIState.getState().resetUIForNewTask()
            spawnCardEntity(target, 0,0)
            useGameState.getState().setTargetCard(target)
            useGameState.getState().setFixedLHS([])
            getStackProduct()
            simpleTrans.forEach(card => {
                spawnCardEntity(card, 0,0)
                useUIState.getState().addCardToHand(card);
            });
            // Set the matrix hand to 4 matrices
            // Make a random transformation from the 4 matrices
            // Set the target to be hidden
        },
        checkSolution: ()=>{
            return resultEqualsTarget()
        },
        unlockText: "",
    },
    {
        title:"More Transformations",
        unlock: ()=>{
            return useGameState.getState().taskCompletion[1] >= 5
        },
        unlockText:"Complete task Simple Transformations 5 times",
        useRNG: () => {
            const rng = randomNumberGenerator(useGameState.getState().seed)
            return [Math.floor(rng()*8)]
        },
        loadTask: function () {
            const cards = [
                numericCard([[2,0],[0,1]], "Scale x by 2"),
                numericCard([[1,0],[0,2]], "Scale y by 2"),
                numericCard([[1,1],[0,1]], "Skew x by 1 y"),
                numericCard([[1,0],[1,1]], "Skew y by 1 x"),
                numericCard([[1/2,0],[0,1]], "Scale x by 1/2"),
                numericCard([[1,0],[0,1/2]], "Scale y by 1/2"),
                numericCard([[1,-1],[0,1]], "Skew x by -1 y"),
                numericCard([[1,0],[-1,1]], "Skew y by -1 x"),
            ]
            const i = this.useRNG()[0] 
            const target = {
                matrix: cards[i].matrix,
                expressionMatrix: [['?','?'],['?','?']],
                simplifiedMatrix: [['?','?'],['?','?']],
                name:'Target'
            }
            useGameState.getState().setTargetCard(target)
            useGameState.getState().setFixedLHS([])
            useUIState.getState().resetUIForNewTask()
            const addCardToHand = useUIState.getState().addCardToHand
            cards.forEach(card => addCardToHand(card))
        },
        checkSolution: ()=>{
            return resultEqualsTarget()
        },
    },
    {
        title:"Build a Matrix",
        unlock: ()=>true,
        unlockText:"Complete task 2 (More transformations) 5 times"
    },
    {
        title:"Hole in one",
        unlockText:"Complete task 3 (Build a matrix) 1 time"
    },
    {
        title:"Simple inverses",
        unlockText:"Complete task 4 (Build a matrix) 5 times",
    },
    {
        title:"Destruction",
        unlockText:"Create a matrix of all zeros"
    },
    {
        title: "Area 1",
        unlockText: "Create a scalar matrix"
    },
    {
        title:"Rotation",
        unlockText:"Create a 90 degree rotation matrix"
    },
   {
        title:"Reflection",
        unlockText: "Complete task 8 (Rotation) 5 times"
    },
   {
        title:"Elementary Inverse",
        unlockText:"Create all 5 elementary row operations"
    },
    {
        title: "The Holy Grail",
        unlockText: "Complete task 10 (Elementary Inverse) 10 times",
    },
    {
        title:"Rotate Scale Rotate",
        unlockTest: "Complete tasks 7 (Area 1) and 9 (Reflection) 5 times each"
    }
]

