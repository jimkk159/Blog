import { CompositeDecorator } from "draft-js";

//CSS
import classes from "./LinkDecorator.module.css";

const findLinkEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

//Link Component
function Link(props) {
  const { contentState, entityKey, children } = props;
  const { url, linkText } = contentState.getEntity(entityKey).getData();
  const clickHandler = (event) => {
    window.open(url, "_blank", "noreferrer");
  };
  const mouseDownHandler = (event) => {
    event.preventDefault();
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={classes["link"]}
      onClick={clickHandler}
      onMouseDown={mouseDownHandler}
    >
      {linkText || children}
    </a>
  );
}

export const createLinkDecorator = () =>
  new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);
