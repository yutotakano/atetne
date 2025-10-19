import { useCallback, useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import classes from "./Button.module.css"

interface WindowButtonProps {
  currentMouseX: number,
  currentMouseY: number,
}

export const Button = ({
  className,
  currentMouseX,
  currentMouseY,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & WindowButtonProps) => {
  const [boundingClientRect, setBoundingClientRect] = useState<DOMRect>(new DOMRect());
  const handleRect = useCallback((node: HTMLButtonElement | null) => {
    if (node) {
      setBoundingClientRect(node.getBoundingClientRect());
    }
  }, []);

  const midX = boundingClientRect.left + boundingClientRect.width / 2;
  const midY = boundingClientRect.top + boundingClientRect.height / 2;
  const isMouseNear = Math.hypot(currentMouseX - midX, currentMouseY - midY) < 100

  return (
    <button
      className={clsx(classes.button, className)}
      ref={handleRect}
      {...props}
    >
      {isMouseNear ? <div style={{ opacity: isMouseNear ? (100 - Math.hypot(currentMouseX - midX, currentMouseY - midY)) / 80 : 1}}>{children}</div> : undefined}
    </button>
  )
}
