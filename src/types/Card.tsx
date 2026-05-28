import type { Mat2 } from '../math/Matrix.tsx'
import { ComputeEngine } from '@cortex-js/compute-engine';

const ce = new ComputeEngine();

let nextCardId = 0;
const generateCardId = () => nextCardId++;

export interface Card {
  expressionMatrix: string[][];
  simplifiedMatrix: string[][];
  matrix: Mat2;
  name: string,
  id: string,
}

interface UnidCard {
  expressionMatrix: string[][];
  simplifiedMatrix: string[][];
  matrix: Mat2;
  name?: string;
}

export function createCard({ expressionMatrix, simplifiedMatrix, matrix, name = "" }: UnidCard) {
  return { expressionMatrix, simplifiedMatrix, matrix, name, id: 'card-'+generateCardId() }
}


export function numericCard(values: number[][], name:string = "") : Card {
  const stringMat = values.map(row => row.map(String));
  return createCard({
    expressionMatrix: stringMat,
    simplifiedMatrix: stringMat,
    matrix: values as Mat2,
    name,
  })
}

export const identityCard = numericCard([[1,0],[0,1]], 'Identity')

/**
 * Create a card from an expression KNOWN TO BE VALID AND SIMPLIFIED
 */
export function cardFromSimplified(expressions: string[][], name:string = ""): Card{
  return createCard({
    expressionMatrix: expressions,
    simplifiedMatrix: expressions,
    matrix: expressions.map(row => row.map(e => ce.parse(e).numericValue)) as Mat2,
    name,
  })
}