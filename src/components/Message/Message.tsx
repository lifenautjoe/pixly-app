import React, { FunctionComponent } from "react";
import { IMessageData } from "../../core/interfaces/model-data/IMessageData";
import "./Message.scss";

interface IMessageProps {
  message: IMessageData;
}

export const Message: FunctionComponent<IMessageProps> = ({ message }: IMessageProps) => {
  return (
    <section className="message -left">
      <div className="nes-balloon from-left">
        <p>{message.text}</p>
      </div>
    </section>
  );
};
