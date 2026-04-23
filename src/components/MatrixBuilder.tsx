import { useUIStore } from '../stores/UIStore';
import { useEffect, useRef } from 'react';

// import $ from 'jquery';
// (window as any).$ = (window as any).jQuery = $;

async function loadMathQuill() {
    const $ = (await import('jquery')).default;
    (window as any).$ = (window as any).jQuery = $;

    await import('mathquill/build/mathquill.js');
    await import('mathquill/build/mathquill.css');
    return window.MathQuill.getInterface(2);
}

export default function MatrixBuilder() {
    const toggleMatrixBuilder = useUIStore((state) => state.toggleMatrixBuilder);
    const matrixBuilderPanel = useUIStore((state) => state.matrixBuilderPanel);
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!matrixBuilderPanel) return;
        loadMathQuill().then((MQ) => {
            if (spanRef.current) {
                MQ.MathField(spanRef.current);
            }
        });
      }, [matrixBuilderPanel]);

    return (
        matrixBuilderPanel && (
            <div
                className='bg-gray-500' 
                style={{ position: 'absolute', left: 1920 / 2 - 500, top: 240, width: 1000, height: 600 }}>
                <p>Matrix builder
                </p>
                <span ref={spanRef} style={{ display: 'inline-block', minWidth: '200px', border: '1px solid white' }} />
            </div>
        )
    );
}