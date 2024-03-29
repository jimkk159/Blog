function Selection({ className, onClick, children, text }) {
  return (
    <li className={className} onClick={onClick}>
      {children}
      <p className="text-sm md:text-lg lg:text-2xl">{text}</p>
    </li>
  );
}

export default Selection;
