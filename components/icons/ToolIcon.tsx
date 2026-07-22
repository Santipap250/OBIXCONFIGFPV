import { toolIcons, type ToolIconKey } from "./ToolIcons";

export default function ToolIcon({
  tool,
  size = 40,
  glow = true,
  className = "",
}: {
  tool: ToolIconKey;
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  const Icon = toolIcons[tool];
  return (
    <Icon
      width={size}
      height={size}
      className={`${glow ? "icon-glow" : ""} ${className}`}
      style={{ color: `var(--tool-${tool})` }}
    />
  );
}
