export type Mat2 = [[number, number], [number, number]];


export function multiplyMat2(a: Mat2, b: Mat2): Mat2 {
  return [
    [a[0][0]*b[0][0] + a[0][1]*b[1][0],  a[0][0]*b[0][1] + a[0][1]*b[1][1]],
    [a[1][0]*b[0][0] + a[1][1]*b[1][0],  a[1][0]*b[0][1] + a[1][1]*b[1][1]],
  ];
}

export const id2: Mat2 = [[1,0],[0,1]];


