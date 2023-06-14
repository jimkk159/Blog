function SectionTitle({ first, second }) {
  return (
    <h1 className="text-xl font-bold text-self-pink-500 md:text-3xl">
      <span className="text-white underline">{first}</span> {second}
    </h1>
  );
}

export default SectionTitle;
