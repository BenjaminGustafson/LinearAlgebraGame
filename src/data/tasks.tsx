import { numericCard } from "../components/Card"
import { useGameState } from "../stores/GameState"
import { useUIState } from "../stores/UIState"

function randomNumberGenerator(seed: number): () => number {
    return () => {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export const TASK_LIST = [
    {
        title:"Simple Transformations",
        unlock: ()=>true,
        loadTask: (seed: number) =>{
            const simpleTrans = [
                numericCard([[2,0],[0,1]], "Scale x by 2"),
                numericCard([[1,0],[0,2]], "Scale y by 2"),
                numericCard([[1,1],[0,1]], "Skew x by 1 y"),
                numericCard([[1,0],[1,1]], "Skew y by 1 x")
            ]
            const generator = randomNumberGenerator(seed)
            const target = numericCard(simpleTrans[Math.floor(generator()*simpleTrans.length)].matrix)
            useGameState.getState().setTargetCard(target)
            useGameState.getState().setFixedLHS([])
            useUIState.getState().resetUIForNewTask()
            const addCardToHand = useUIState.getState().addCardToHand
            simpleTrans.forEach(card => addCardToHand(card))
            // Set the matrix hand to 4 matrices
            // Make a random transformation from the 4 matrices
            // Set the target to be hidden
        },
        checkSolution: ()=>{
            // Check that matrix product = target
        }
    },
    {
        title:"More Transformations",
        unlock: ()=>{
            
            return useGameState.getState().taskCompletion[1] >= 5
        },
        unlockText:"Complete task Simple Transformations 5 times"
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

