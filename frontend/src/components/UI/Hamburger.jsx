function Hamburger2({
  className,
  onClick,
  lineWidth = "2px",
  lineLength = "10px",
}) {
  return (
    <button
      type="button"
      className={`relative h-10 w-8 cursor-pointer bg-white ${className}`}
      onClick={onClick}
    >
      <span
        className={`absolute left-0 block h-[${lineWidth}] w-8 rounded bg-pink-500 transition-all duration-500 before:absolute
  before:-top-[${lineLength}] before:left-0 before:block before:h-[${lineWidth}] before:w-3/4 before:rounded before:bg-pink-500 before:transition-all before:duration-500 after:absolute
  after:left-0 after:top-[${lineLength}] after:block after:h-[${lineWidth}] after:w-3/4 after:rounded after:bg-pink-500 after:transition-all after:duration-500`}
      />
    </button>
  );
}

export default Hamburger2;
