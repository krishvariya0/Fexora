
const Button = ({ type = "button", variant = "primary", children, onClick, disabled = false, className = "" }) => {
    const getVariantClasses = () => {
        switch (variant) {
            case "secondary":
                return "bg-gray-800 hover:bg-gray-600 text-white";
            case "google":
                return "bg-white hover:bg-gray-100 text-gray-700 border border-gray-400";
            case "danger":
                return "bg-red-100 hover:bg-red-200 text-red-600";
            case "icon":
                return "bg-indigo-100 hover:bg-indigo-200 text-indigo-600";
            default:
                return "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white";
        }
    };

    const baseClasses = "font-semibold rounded-md transition shadow-sm text-sm sm:text-base flex items-center justify-center gap-2";
    const sizeClasses = variant === "icon" ? "" : "w-full py-2 sm:py-3";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses} ${getVariantClasses()} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
