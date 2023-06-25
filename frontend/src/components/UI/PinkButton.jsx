function PinkButton({
  text,
  onClick,
  children,
  className = "px-6 py-3 text-sm md:px-8 md:py-3.5 md:text-base",
}) {
  return (
    <div className="flex items-center justify-center">
      <button
        className={`whitespace-nowrap rounded-3xl bg-self-pink-500 capitalize text-white hover:bg-self-pink-600 ${className}`}
        onClick={onClick}
      >
        {text}
        {children}
      </button>
    </div>
  );
}

export default PinkButton;
