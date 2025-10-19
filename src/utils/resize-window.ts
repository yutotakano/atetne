import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

function lerp(current: number, target: number, fraction: number) {
  return current + (target - current) * fraction;
}

function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

export async function resizeButtonGrid(numX: number, numY: number, resizable: boolean = false, keepCurrent: boolean = false) {
  await getCurrentWindow().setResizable(resizable);
  const scale = await getCurrentWindow().scaleFactor();
  const currentSize = (await getCurrentWindow().innerSize()).toLogical(scale);
  const desiredSizeW = (numX + 1)*9 + numX*14;
  const desiredSizeH = (numY + 1)*9 + numY*14;

  // Asynchronously set min/max size while we start animating
  const smaller = new LogicalSize(Math.min(desiredSizeW, currentSize.width), Math.min(desiredSizeH, currentSize.height));
  const larger = new LogicalSize(Math.max(desiredSizeW, currentSize.width), Math.max(desiredSizeH, currentSize.height));
  getCurrentWindow().setMinSize(smaller);
  getCurrentWindow().setMaxSize(larger);

  // If we are animating, lerp the sizes and then set the min/max afterwards.
  // If we aren't animating, allow free resizing even after the function exits.
  if (!keepCurrent) {
    const frames = 100;
    let newSize = new LogicalSize(0, 0);
    for (let t = 0; t <= frames; t++) {
      const fraction = (t / frames);
      newSize.width = lerp(currentSize.width, desiredSizeW, easeOutQuad(fraction));
      newSize.height = lerp(currentSize.height, desiredSizeH, easeOutQuad(fraction));
      await getCurrentWindow().setSize(newSize);
    }

    // Prevent any further size tampering now that all animation is finished
    getCurrentWindow().setMinSize(new LogicalSize(desiredSizeW, desiredSizeH));
    getCurrentWindow().setMaxSize(new LogicalSize(desiredSizeW, desiredSizeH));
  }
}
