import { AwaitWrapper } from "../Wrapper/AwaitWrapper";

function SelectCategory({ className, id, name, relation, value, onChange }) {
  return (
    <AwaitWrapper resolve={relation}>
      {(response) => {
        const data = response?.data?.categories?.data ?? [];
        return (
          <select
            id={id}
            name={name}
            className={`${className} truncate rounded-sm border border-black outline-none`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {data
              .filter((el) => el.name !== "root")
              .map((el, index) => (
                <option key={index} value={el.id}>
                  {el.name}
                </option>
              ))}
          </select>
        );
      }}
    </AwaitWrapper>
  );
}

export default SelectCategory;
