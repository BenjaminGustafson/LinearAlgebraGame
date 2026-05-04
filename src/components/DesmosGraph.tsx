declare const Desmos: any; 
import { useEffect, useRef } from 'react';
import type { Mat2 } from '../math/Matrix';
import { useStackProduct } from '../stores/UIState';
import { useGameState } from '../stores/GameState';



export function DesmosGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<Desmos.Calculator | null>(null);
  const transform: Mat2 = useStackProduct().matrix
  const prevTransformRef = useRef(transform);
  const targetMatrix = useGameState(state => state.targetCard).matrix
  
    useEffect(() => {
      if (!containerRef.current) return;
      calculatorRef.current = Desmos.GraphingCalculator(containerRef.current, {
        keypad: false,
        expressions: false,
        showGrid:false
      });
      const calculator = calculatorRef.current!;

      calculator.setMathBounds({
        left: -3,
        right: 3,
        bottom: -3,
        top: 3
      })
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
      calculator.setExpression({ latex: 'Lj+t(a,c)', parametricDomain: { min: '-n', max: 'n'}, color:'blue', lineWidth: 1});
      calculator.setExpression({ latex: 'Li+t(b,d)', parametricDomain: { min: '-n', max: 'n'}, color:'blue', lineWidth: 1});
      calculator.setExpression({ latex: '\\Delta=ad-bc'});
      calculator.setExpression({ latex: '\\operatorname{polygon}((0,0),(a,c),(a+b,c+d),(b,d)) \\{\\Delta>0\\}',color:'blue'})
      calculator.setExpression({ latex: '\\operatorname{polygon}((0,0),(a,c),(a+b,c+d),(b,d)) \\{\\Delta<0\\}',color:'orange'})

      // The target
      calculator.setExpression({ id:'a_2', latex: 'a_2=1' });
      calculator.setExpression({ id:'b_2', latex: 'b_2=0' });
      calculator.setExpression({ id:'c_2', latex: 'c_2=0' });
      calculator.setExpression({ id:'d_2', latex: 'd_2=1' });
      calculator.setExpression({ latex: 'i_2=(a_2,c_2)', hidden: 'true'});
      calculator.setExpression({ latex: 'j_2=(b_2,d_2)', hidden:'true'});
      calculator.setExpression({ latex: 'L{j_2}+t(a_2,c_2)', parametricDomain: { min: '-n', max: 'n'}, color:'red', lineStyle: Desmos.Styles.DASHED, lineWidth: 1});
      calculator.setExpression({ latex: 'L{i_2}+t(b_2,d_2)', parametricDomain: { min: '-n', max: 'n'}, color:'red', lineStyle: Desmos.Styles.DASHED, lineWidth: 1});
      calculator.setExpression({ latex: '\\Delta_2=a_2d_2-b_2c_2'});
      calculator.setExpression({ latex: '\\operatorname{polygon}((0,0),(a_2,c_2),(a_2+b_2,c_2+d_2),(b_2,d_2)) \\{\\Delta>0\\}',color:'red'})
      calculator.setExpression({ latex: '\\operatorname{polygon}((0,0),(a_2,c_2),(a_2+b_2,c_2+d_2),(b_2,d_2)) \\{\\Delta<0\\}',color:'red'})
  
      return () => calculator.destroy();
    }, []);

  

  // Update transform
  useEffect(() => {
    if (!containerRef.current) return;
    const calculator = calculatorRef.current!;

    const oldTransform = prevTransformRef.current;
    const newTransform = transform;

    const duration = 500; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);

      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const lerp = (a: number, b: number) => a + (b - a) * eased;

      calculator.setExpression({ id: 'a', latex: `a=${lerp(oldTransform[0][0], newTransform[0][0])}` });
      calculator.setExpression({ id: 'b', latex: `b=${lerp(oldTransform[0][1], newTransform[0][1])}` });
      calculator.setExpression({ id: 'c', latex: `c=${lerp(oldTransform[1][0], newTransform[1][0])}` });
      calculator.setExpression({ id: 'd', latex: `d=${lerp(oldTransform[1][1], newTransform[1][1])}` });


      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        prevTransformRef.current = newTransform;
      }
    };
  const frameId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(frameId);
    }, [transform]);

  useEffect(() => {
    if (!containerRef.current) return;
    const calculator = calculatorRef.current!;
    calculator.setExpression({ id: 'a_2', latex: `a_2=${targetMatrix[0][0]}` });
    calculator.setExpression({ id: 'b_2', latex: `b_2=${targetMatrix[0][1]}` });
    calculator.setExpression({ id: 'c_2', latex: `c_2=${targetMatrix[1][0]}` });
    calculator.setExpression({ id: 'd_2', latex: `d_2=${targetMatrix[1][1]}` });
  }, [targetMatrix])
  
    return (
      <div
        ref={containerRef}
        style={{position: 'absolute', left: 1920/2+40, top: 120, width: 1920/2-80, height: 700 }}
      />
    );
  }
  