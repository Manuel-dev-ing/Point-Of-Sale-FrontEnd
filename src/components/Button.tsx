import type { LucideIcon } from "lucide-react";


type ButtonProps = {
    text: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    variant?: string;
    disabled?: boolean;
    icon: LucideIcon
    iconColor?: string;
}

export default function Button({text, onClick, type, variant, disabled, icon: Icon, iconColor} : ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={variant}
      disabled={disabled}
    >
      <Icon color={iconColor || '#ffffff'} size={19} /> 
      
      {text}
    </button>
  )
}
