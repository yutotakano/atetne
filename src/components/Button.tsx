import { useCallback, useState, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import classes from "./Button.module.css";
import { useLocalMouseCoords } from "../utils/local-mouse-coordinates";

interface WindowButtonProps {
  bg?: string;
  color?: string;
}

export const Button = ({
  className,
  children,
  bg = "#ff5c60",
  color = "#000000",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & WindowButtonProps) => {
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect>(
    new DOMRect(),
  );
  const handleRect = useCallback((node: HTMLButtonElement | null) => {
    if (node) {
      setBoundingClientRect(node.getBoundingClientRect());
    }
  }, []);

  const { x: currentMouseX, y: currentMouseY } = useLocalMouseCoords();

  const midX = boundingClientRect.left + boundingClientRect.width / 2;
  const midY = boundingClientRect.top + boundingClientRect.height / 2;
  const isMouseNear =
    Math.hypot(currentMouseX - midX, currentMouseY - midY) < 100;
  const childOpacity = isMouseNear
    ? (100 - Math.hypot(currentMouseX - midX, currentMouseY - midY)) / 80
    : 1;

  return (
    <button
      className={clsx(classes.button, className)}
      ref={handleRect}
      style={{ background: bg, color: color }}
      {...props}
    >
      {isMouseNear ? (
        <div className={clsx(classes.buttonTextOpacitySetter, classes.buttonInner)}>
          <div style={{ opacity: childOpacity }} className={classes.buttonInner}>{children}</div>
        </div>
      ) : undefined}
    </button>
  );
};
