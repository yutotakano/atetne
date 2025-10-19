import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

function lerp(current: number, target: number, fraction: number) {
  return current + (target - current) * fraction;
}

function easeOutQuad(x: number): number {
  return 1 - (1 - x) * (1 - x);
}

export async function resizeButtonGrid(numX: number, numY: number) {
  const scale = await getCurrentWindow().scaleFactor();
  const currentSize = (await getCurrentWindow().innerSize()).toLogical(scale);
  const desiredSizeW = (numX + 1)*9 + numX*14;
  const desiredSizeH = (numY + 1)*9 + numY*14;
  const frames = 100;
  for (let t = 0; t <= frames; t++) {
    const fraction = (t / frames);
    const newSizeW = lerp(currentSize.width, desiredSizeW, easeOutQuad(fraction));
    const newSizeH = lerp(currentSize.height, desiredSizeH, easeOutQuad(fraction));
    await getCurrentWindow().setSize(new LogicalSize(newSizeW, newSizeH));
  }
}
