declare const Desmos: any; 
import { useEffect, useRef } from 'react';
import type { Mat2 } from '../types/Matrix';
import { useStackProduct } from '../stores/UIState';



export function DesmosGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const calculatorRef = useRef<Desmos.Calculator | null>(null);
    const transform: Mat2 = useStackProduct()
  
    useEffect(() => {
      if (!containerRef.current) return;
      calculatorRef.current = Desmos.GraphingCalculator(containerRef.current, {
        keypad: false,
        expressions: false,
        showGrid:false,
      });
      const calculator = calculatorRef.current!;
      // Based on https://www.desmos.com/calculator/yfeeqwkrhd
      //calculator.setExpression({ id: 'graph1', latex: 'y = x^2' });
      calculator.setExpression({ latex: 'n = 10' });
      calculator.setExpression({ id:'a', latex: 'a=1' });
      calculator.setExpression({ id:'b', latex: 'b=0' });
      calculator.setExpression({ id:'c', latex: 'c=0' });
      calculator.setExpression({ id:'d', latex: 'd=1' });
      calculator.setExpression({ latex: 'L=[-n...n]' });
      calculator.setExpression({ latex: 'i=(a,c)', hidden: 'true'});
      calculator.setExpression({ latex: 'j=(b,d)', hidden:'true'});
      calculator.setExpression({ latex: 'Lj+t(a,c)', parametricDomain: { min: '-n', max: 'n'}, color:'blue'});
      calculator.setExpression({ latex: 'Li+t(b,d)', parametricDomain: { min: '-n', max: 'n'}, color:'blue' });
      calculator.setExpression({ latex: '\\Delta=ad-bc'});
      calculator.setExpression({ latex: '\\operatorname{polygon}((0,0),(a,c),(a+b,c+d),(b,d)) \\{\\Delta>0\\}',color:'purple'})
      calculator.setExpression({ latex: '\\operatorname{polygon}((0,0),(a,c),(a+b,c+d),(b,d)) \\{\\Delta<0\\}',color:'orange'})
  
      return () => calculator.destroy();
    }, []);
  
    // Update transform
    useEffect(() => {
      if (!containerRef.current) return;
      const calculator = calculatorRef.current!;
      calculator.setExpression({ id:'a', latex: `a=${transform[0][0]}` });
      calculator.setExpression({ id:'b', latex: `b=${transform[0][1]}` });
      calculator.setExpression({ id:'c', latex: `c=${transform[1][0]}` });
      calculator.setExpression({ id:'d', latex: `d=${transform[1][1]}` });
  
  
    }, [transform]);
  
    return (
      <div
        ref={containerRef}
        style={{ position: 'absolute', left: 1920/2-500, top: 240, width: 1000, height: 600 }}
      />
    );
  }
  