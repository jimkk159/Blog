import CloneComponents from "../helper/CloneComponent";

function ChoiceChild({
  className,
  children,
  current,
  choices,
  onClick,
  defaultName = "",
}) {
  let output = choices;
  if (!choices) return;
  if (!choices.length) return;

  if (current) output = choices.filter((el) => current.id !== el.id);

  return output.map((el, index) => {
    const name = el.name === "root" ? defaultName : el.name;
    return (
      <CloneComponents
        key={index}
        className={className}
        components={children}
        value={el.value}
        onClick={(e) => onClick(e, name)}
      >
        {name}
      </CloneComponents>
    );
  });
}

export default ChoiceChild;
