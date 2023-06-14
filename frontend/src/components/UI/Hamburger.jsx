function Hamburger2({
  className,
  onClick,
  lineWidth = "2px",
  lineLength = "20px",
}) {
  return (
    <button
      type="button"
      className={`flex flex-col h-10 w-8 cursor-pointer ${className} space-y-1.5`}
      onClick={onClick}
    >
      <span
        className={`h-[${lineWidth}] w-6 rounded bg-self-pink transition-all duration-500 `}
      />
      <span
        className={`h-[${lineWidth}] w-8 rounded bg-self-pink transition-all duration-500 `}
      />
      <span
        className={`h-[${lineWidth}] w-6 rounded bg-self-pink transition-all duration-500 `}
      />
    </button>
  );
}

export default Hamburger2;
