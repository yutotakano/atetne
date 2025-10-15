import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import classes from "./Button.module.css"

export const Button = ({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(classes.button, className)}
      {...props}
    >
      {children}
    </button>
  )
}
