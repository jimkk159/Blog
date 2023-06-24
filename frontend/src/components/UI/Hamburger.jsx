function Hamburger2({
  className,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`flex flex-col h-10 w-8 cursor-pointer ${className} space-y-1.5`}
      onClick={onClick}
    >
      <span
        className={`h-0.5 w-6 rounded bg-self-pink-500 transition-all duration-500 `}
      />
      <span
        className={`h-0.5 w-8 rounded bg-self-pink-500 transition-all duration-500 `}
      />
      <span
        className={`h-0.5 w-6 rounded bg-self-pink-500 transition-all duration-500 `}
      />
    </button>
  );
}

export default Hamburger2;
