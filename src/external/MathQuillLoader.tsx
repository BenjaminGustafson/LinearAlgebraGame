async function initMathQuill() {
    const $ = (await import('jquery')).default;
    (window as any).$ = (window as any).jQuery = $;
    await import('mathquill/build/mathquill.css');
    await import('mathquill/build/mathquill.js');
    return window.MathQuill.getInterface(2);
}

export const mathQuillPromise = initMathQuill();