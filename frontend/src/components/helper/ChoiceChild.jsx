import CloneComponents from "../helper/CloneComponent";

function ChoiceChild({ className, children, choices, onClick }) {
  if (!choices) return;
  if (!choices.length) return;

  return choices.map((el, index) => {
    const name = el.name === "root" ? "Top" : el.name;
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
