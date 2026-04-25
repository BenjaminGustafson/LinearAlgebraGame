import { useState } from "react";

interface ToggleButtonProps {
  defaultEnabled?: boolean;
  label?: string;
  onChange?: (enabled: boolean) => void;
}

export function ToggleButton({
  defaultEnabled = false,
  label = "Toggle",
  onChange,
}: ToggleButtonProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    onChange?.(next);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        role="switch"
        aria-checked={enabled}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2
          focus-visible:ring-blue-500 focus-visible:ring-offset-2
          ${enabled ? "bg-blue-600" : "bg-gray-300"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md
            transform transition duration-200 ease-in-out
            ${enabled ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>

      {label && (
        <span className="text-sm font-medium text-gray-700 select-none">
          {label}
        </span>
      )}
    </div>
  );
}