import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//Redux Slice
import { toolbarActions } from "../../../../../../../store/toolbar-slice";

//Custom Component
import DropDownOption from "./DropDownOption";

//CSS
import classes from "./DropDown.module.css";

//Using ul & li for dropdwon is the editor will lose focus when choose the option
function DropDown(props) {
  const { id, title, activeStyle, config, onToggle } = props;
  const [currentOption, setCurrentOption] = useState(null);

  //Redux
  const currentTool = useSelector((state) => state.toolbar.currentTool);
  const dispatch = useDispatch();

  const isExpand = currentTool === title;

  const stopPropagationHandler = (event) => {
    event.stopPropagation();
  };

  //Expand Options
  const toggleExpandedHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (currentTool === title) {
      dispatch(toolbarActions.close());
    } else {
      dispatch(toolbarActions.choice({ tool: title }));
    }
  };

  //Select Option
  const selectOptionHandler = (option, style) => {
    if (onToggle) {
      setCurrentOption(option);
      onToggle(style);
    }
    dispatch(toolbarActions.close());
  };

  return (
    <div className={classes["block-wrapper"]}>
      <div
        className={`${props.className} ${classes["wrapper"]} ${classes["block-dropdown"]}`}
        aria-expanded={isExpand}
        aria-label={id || "dropdown"}
      >
        <div
          className={classes["dropdown-select"]}
          onMouseDown={toggleExpandedHandler}
          title={title}
        >
          {currentOption ? currentOption : config.options[0]}
          <div
            className={`${classes["dropdown-caretto"]} ${
              isExpand
                ? classes["dropdown-caretto-open"]
                : classes["dropdown-caretto-close"]
            }`}
          />
        </div>
        {isExpand && (
          <ul
            className={classes["options-wrapper"]}
            onMouseDown={stopPropagationHandler}
          >
            {config.options.map((opt, index) => {
              const choiceStyle = config.choices[opt].style;
              const isActive = activeStyle === choiceStyle;

              return (
                <DropDownOption
                  key={index}
                  option={opt}
                  style={choiceStyle}
                  active={isActive}
                  onSelect={selectOptionHandler}
                >
                  {config.choices[opt].label}
                </DropDownOption>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DropDown;
