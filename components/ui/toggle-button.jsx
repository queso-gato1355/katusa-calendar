"use client"

export function ToggleButton({
  value,
  onChange,
  activeText = "Yes",
  inactiveText = "No",
  activeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactiveClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`px-3 py-1 rounded-md text-sm font-medium ${value ? activeClass : inactiveClass}`}
    >
      {value ? activeText : inactiveText}
    </button>
  )
}
