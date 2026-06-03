"use client";

import { CircleAlert, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function Input({
  label,
  error,
  showPasswordToggle = false,
  type = "text",
  className = "",
  id,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          type={inputType}
          className={`
            w-full px-3 py-2.5 rounded-lg border text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
            ${
              error
                ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-gray-400"
            }
            ${showPasswordToggle ? "pr-10" : ""}
            ${className}
          `}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              // Eye-off icon
              <EyeOff className="h-4 w-4" strokeWidth={2} />
            ) : (
              // Eye icon
              <Eye className="h-4 w-4" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <CircleAlert className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
