import React, { FormEvent, FunctionComponent, useState } from "react";
import { SendMessageActionDto } from "../../core/dtos/SendMessageActionDto";
import { useStore } from "../../hooks/stores";
import "./MessageComposer.scss";

export const MessageComposer: FunctionComponent = props => {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const pixlyStore = useStore("pixlyStore");

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMessage("");

    const sendMessageDto: SendMessageActionDto = {
      text,
    };

    const validationErrors = pixlyStore.validateSendMessageActionDto(sendMessageDto);

    if (validationErrors.length > 0) {
      const firstValidationErrorConstraints = validationErrors[0].constraints;

      const firstErrorMessage = Object.values(firstValidationErrorConstraints as Record<string, string>)[0];

      setErrorMessage(firstErrorMessage);
    } else {
      setText("");
      pixlyStore.sendMessage(sendMessageDto);
    }
  };

  return (
    <form className="nes-container with-title " onSubmit={handleSubmit}>
      <label htmlFor="message_field" className="title">
        New message
      </label>
      <div className="MessageComposer">
        <input type="text" id="message_field" className="nes-textarea" value={text} onChange={e => setText(e.target.value)}></input>
        <div className="MessageComposerButton">
          <button type="submit" className="nes-btn is-primary">
            Send
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="AuthSplashFormErrors">
          <p className="nes-text is-error">{errorMessage}</p>
        </div>
      )}
    </form>
  );
};
