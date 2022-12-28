import { useReducer, useCallback } from "react";

const initialState = {
  isMouseDown: false,
  prevOffset: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  mouseDownLoc: { x: 0, y: 0 },
};

const dragReducer = (state, action) => {
  switch (action.type) {
    case "UP":
      return {
        ...state,
        isMouseDown: false,
        prevOffset: { x: state.offset.x, y: state.offset.y },
      };
    case "DOWN":
      return {
        ...state,
        isMouseDown: true,
        mouseDownLoc: { x: action.loc.x, y: action.loc.y },
      };
    case "LEAVE":
      return {
        ...state,
        isMouseDown: false,
        prevOffset: { x: state.offset.x, y: state.offset.y },
      };
    case "MOVE":
      if (!state.isMouseDown) return state;
      return {
        ...state,
        offset: {
          x: state.prevOffset.x + action.loc.x - state.mouseDownLoc.x,
          y: state.prevOffset.y + action.loc.y - state.mouseDownLoc.y,
        },
      };
    case "RESET":
      return initialState;
    default:
      throw new Error();
  }
};

function useDrag() {
  const [dragState, dispatch] = useReducer(dragReducer, initialState);
  const mouseUpHandler = useCallback(() => {
    dispatch({
      type: "UP",
    });
  }, []);
  const mouseDownHandler = useCallback((event) => {
    dispatch({
      type: "DOWN",
      loc: { x: event.pageX, y: event.pageY },
    });
  }, []);
  const mouseLeaveHandler = useCallback(() => {
    dispatch({
      type: "LEAVE",
    });
  }, []);
  const mouseMoveHandler = useCallback((event) => {
    dispatch({
      type: "MOVE",
      loc: { x: event.pageX, y: event.pageY },
    });
  }, []);
  const resetHandler = useCallback(() => {
    dispatch({
      type: "RESET",
    });
  }, []);

  return {
    dragState,
    resetHandler,
    mouseUpHandler,
    mouseDownHandler,
    mouseLeaveHandler,
    mouseMoveHandler,
  };
}

export default useDrag;
