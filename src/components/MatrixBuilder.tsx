import { useUIState } from '../stores/UIState';
import { useEffect, useRef } from 'react';
import { numericCard } from '../components/Card';
import type { Card} from '../components/Card';
import { ComputeEngine } from '@cortex-js/compute-engine';
import type { Mat2 } from '../types/Matrix';


// import $ from 'jquery';
// (window as any).$ = (window as any).jQuery = $;

async function loadMathQuill() {
    const $ = (await import('jquery')).default;
    (window as any).$ = (window as any).jQuery = $;

    await import('mathquill/build/mathquill.js');
    await import('mathquill/build/mathquill.css');
    return window.MathQuill.getInterface(2);
}

const ce = new ComputeEngine();

function evaluateLatex(latex: string, variables: Record<string, number>): 
    | { isValid: false, error: string } 
    | { isValid: true; value: number } {
    try {
        Object.entries(variables).forEach(([name, value]) => {
            ce.assign(name, value);
        });
        const expr = ce.parse(latex).N();
        const result = expr.numericValue;

        if (result === null) return {  isValid: false, error: 'null parse' };
        if (!isFinite(Number(result))) return { isValid: false, error: `bad value ${result}`};

        return { isValid: true, value: Number(result) };
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

    useEffect(() => {
        if (!matrixBuilderPanel) return;
        loadMathQuill().then((MQ) => {
            inputRefs.current.forEach((el, i) => {
                if (el) mqFields.current[i] = MQ.MathField(el);
            });
        });
      }, [matrixBuilderPanel]);

    return (
        matrixBuilderPanel && (
            <div
                className='bg-gray-500' 
                style={{ position: 'absolute', left: 1920 / 2 - 500, top: 240, width: 1000, height: 600 }}>
                <p>Matrix builder
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: 'fit-content' }}>
                    {[0, 1, 2, 3].map((i) => (
                        <span
                            key={i}
                            ref={(el) => { if (el) inputRefs.current[i] = el; }}
                            style={{ display: 'inline-block', minWidth: '200px', border: '1px solid white' }}
                        />
                    ))}
                </div>
                <button
                    className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                    style={{ left: 200, top: 200, width: 150, height: 150, fontSize: 24 }}
                    onClick={() => { 
                        const expressionMatrix = [
                            [mqFields.current[0].latex(), mqFields.current[1].latex()],
                            [mqFields.current[2].latex(), mqFields.current[3].latex()],
                        ]

                        const evaluated = expressionMatrix.map(row =>
                            row.map(cell => evaluateLatex(cell, {}))
                        );
                        console.log(evaluated)

                        const allValid = evaluated.every(row => row.every(cell => cell.isValid));

                        if (!allValid) {
                            // show some error UI
                            console.log('INVALID')
                            return;
                        }

                        const matrix = evaluated.map(row =>
                            row.map(cell => (cell as { isValid: true; value: number }).value)
                        ) as Mat2;

                        addCardToHand({expressionMatrix, matrix});
                        toggleMatrixBuilder()
                    }}
                >Create</button>
            </div>
        )
    );
}