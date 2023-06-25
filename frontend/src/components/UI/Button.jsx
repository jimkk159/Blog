import ClipLoader from "react-spinners/ClipLoader";

function Button({
  type,
  disabled,
  className,
  children,
  spinner,
  onClick,
  loading = false,
  textProps,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {loading && (
          <ClipLoader
            aria-label="Loading Spinner"
            size={20}
            color="white"
            {...spinner}
          />
        )}
        <p className="px-2" {...textProps}>
          {children}
        </p>
      </div>
    </button>
  );
}

export default Button;
