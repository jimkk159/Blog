function PinkButton({ text }) {
  return (
    <div className="flex items-center justify-center">
      <button className="whitespace-nowrap rounded-3xl bg-self-pink-500 px-6 py-3 text-sm text-white md:text-base md:px-8 md:py-3.5">
        {text}
      </button>
    </div>
  );
}

export default PinkButton;
