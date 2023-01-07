import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { checkActive } from "../checkActive";

//Redux Slice
import { toolbarActions } from "../../../../../../../store/toolbar-slice";

//Custom Component
import DropDownOption from "./DropDownOption";

//CSS
import classes from "./DropDown.module.css";

//The Reason for using ul & li for dropdwon is that draft.js editor will lose focus when choose the option on <Select>
function DropDown(props) {
  const { id, title, choicesCreator, activeStyle, config, onChange } = props;
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
    let onChangeFn;
    switch (typeof onChange) {
      case "function":
        onChangeFn = onChange;
        onChangeFn(style);
        setCurrentOption(option);
        break
      case "object":
        onChangeFn = onChange[option];
        onChangeFn();
        setCurrentOption(option);
        break
      default:
        break
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
              
              let choice;
              if(choicesCreator){
                choice = choicesCreator(opt)
              } else{
                choice = config?.choices[opt];
              }
              
              const choiceLabel = choice?.label;
              const choiceStyle = choice?.style;
              const isActive = checkActive(choiceStyle, activeStyle)
              return (
                <DropDownOption
                  key={index}
                  option={opt}
                  style={choiceStyle}
                  active={isActive}
                  onSelect={selectOptionHandler}
                >
                  {choiceLabel}
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
