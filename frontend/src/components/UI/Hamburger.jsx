function Hamburger({ className, onClick }) {
  return (
    <button
      type="button"
      className={`mx-1 flex h-12 w-12 cursor-pointer flex-col items-center justify-around rounded-sm border-none bg-black px-2 shadow-lg ${className}`}
      onClick={onClick}
    >
      <span className="block h-[3px] w-full rounded-sm bg-white" />
      <span className="block h-[3px] w-full rounded-sm bg-white" />
      <span className="block h-[3px] w-full rounded-sm bg-white" />
    </button>
  );
}

export default Hamburger;
