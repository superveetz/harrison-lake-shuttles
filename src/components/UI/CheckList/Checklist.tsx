import React from "react";

interface CheckListProps {
  items: Array<{ text: string }>;
  centered?: boolean;
}
const checkList = (props: CheckListProps) => {
  const items = props.items.map((item, index) => {
    return (
      <li key={index}>
        <i className="fa fa-check-circle text-success" /> {item.text}
      </li>
    );
  });

  const centerClass = props.centered ? "mx-auto" : "";

  return <ul className={["lead", "fa-ul", "pl-5", "pr-2", centerClass].join(" ")}>{items}</ul>;
};

export default checkList;
