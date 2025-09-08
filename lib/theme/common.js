// 테마 스타일 (공통)
export const getThemeStyles = (theme) => ({
  container: theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900",
  card: theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
  input: theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900",
  button: {
    primary: theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: theme === "dark" ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700",
  },
  hover: theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
  table: {
    header: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
    row: theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50",
  },
})