import { useUIState } from '../state/ui/UIState.tsx';
import { useEffect, useRef } from 'react';
import type { Card } from '../types/Card.tsx'
import { createCard } from '../types/Card.tsx';
import { ComputeEngine } from '@cortex-js/compute-engine';
import type { Mat2 } from '../math/Matrix';
import { mathQuillPromise } from '../external/MathQuillLoader';
import { spawnCardEntity } from './CardComponent.tsx';


const ce = new ComputeEngine();

function evaluateLatex(latex: string, variables: Record<string, number>): 
    | { isValid: false, error: string } 
    | { isValid: true; value: number, simplified: string} {
    try {
        Object.entries(variables).forEach(([name, value]) => {
            ce.assign(name, value);
        });
        const expr = ce.parse(latex);
        const result = expr.numericValue;

        if (result === null) return {  isValid: false, error: 'null parse' };
        if (!isFinite(Number(result))) return { isValid: false, error: `bad value ${result}`};

        return { isValid: true, value: Number(result), simplified: expr.simplify().latex};
    } catch (e) {
        return { isValid: false, error: e instanceof Error ? e.message : String(e)};
    }
}


export default function MatrixBuilder() {
    const toggleMatrixBuilder = useUIState((state) => state.toggleMatrixBuilder);
    const addCardToHand = useUIState((state) => state.addCardToHand);
    const matrixBuilderPanel = useUIState((state) => state.matrixBuilderPanel);
    const inputRefs = useRef<HTMLSpanElement[]>([]);
    const mqFields = useRef<MathField[]>([]);

    const MAX_FONT_SIZE = 56;
    const MIN_FONT_SIZE = 18;

    useEffect(() => {
        if (!matrixBuilderPanel) return;
        mathQuillPromise.then((MQ) => {
            inputRefs.current.forEach((el, i) => {
                if (!el) return;
    
                // Set initial font size
                el.style.fontSize = `${MAX_FONT_SIZE}px`;
    
                const mq = MQ.MathField(el, {
                    spaceBehavesLikeTab: false,
                });
                mqFields.current[i] = mq;
    
                // Shrink font size if content overflows
                const shrinkToFit = () => {
                    let size = MAX_FONT_SIZE;
                    el.style.fontSize = `${size}px`;
    
                    // The inner mathquill element that actually renders
                    const inner = el.querySelector('.mq-root-block') as HTMLElement | null;
                    if (!inner) return;
    
                    while (
                        (inner.scrollWidth > el.clientWidth || inner.scrollHeight > el.clientHeight)
                        && size > MIN_FONT_SIZE
                    ) {
                        size -= 1;
                        el.style.fontSize = `${size}px`;
                    }
                };
    
                // Watch for any DOM changes inside the mathquill field
                const observer = new MutationObserver(shrinkToFit);
                observer.observe(el, { childList: true, subtree: true, characterData: true });
            });
        });
    }, [matrixBuilderPanel]);

    return (
        matrixBuilderPanel && (
            <div
                className='bg-gray-400' 
                style={{ position: 'absolute', left: 1920 / 2 - 500, top: 240, width: 1000, height: 600, zIndex: 2000 }}>
                <p
                style={{ position: 'absolute', left: 1920 / 2 - 500, top: 0, zIndex: 2000,
                     fontSize: 24  }}
                >Matrix builder
                </p>
                <div style={{
                      position: 'absolute',
                      left: 50,
                      top: 50,
                      width: 500,
                      height: 500,
                      border: '1px solid #334155',
                      borderRadius: 12,
                      backgroundColor: '#1e293b', 
                    }}>
                    {[[0,0,0], [1,0,1], [0,1,2], [1,1,3]].map(([i,j,k]) => (
                        <span
                            key={k}
                            ref={(el) => { if (el) inputRefs.current[k] = el; }}
                            style={{ position: 'absolute', left: i*225+50,top:j*225+50, width: 175, height: 175,
                                 border: '1px solid white', color: 'white', caretColor: 'white',
                                }}

                        />
                    ))}
                </div>
                <button
                    className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                    style={{ left: 600, top: 400, width: 150, height: 150, fontSize: 24 }}
                    onClick={() => { 
                        const expressionMatrix = [
                            [mqFields.current[0].latex(), mqFields.current[1].latex()],
                            [mqFields.current[2].latex(), mqFields.current[3].latex()],
                        ]

                        const evaluated = expressionMatrix.map(row =>
                            row.map(cell => evaluateLatex(cell, {}))
                        );

                        const allValid = evaluated.every(row => row.every(cell => cell.isValid));

                        if (!allValid) {
                            console.log('INVALID')
                            return;
                        }

                        const matrix = evaluated.map(row =>
                            row.map(cell => cell.value)
                        ) as Mat2;

                        const simplifiedMatrix = evaluated.map(row =>
                            row.map(cell => cell.simplified)
                        );

                        const card = createCard({expressionMatrix, simplifiedMatrix, matrix})
                        spawnCardEntity(card, 1800,1000)
                        addCardToHand(card);
                        toggleMatrixBuilder()
                    }}
                >Create</button>
            </div>
        )
    );
}