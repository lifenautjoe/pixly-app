import { FormEvent, FunctionComponent, useState } from "react";
import React from "react";
import "./AuthModal.scss";
import { useStore } from "../../hooks/stores";
import { AvatarPicker } from "../AvatarPicker/AvatarPicker";
//import { useStore } from "../../hooks/stores";

interface AuthModalProps {
  roomName: string;
}

export const AuthModal: FunctionComponent<AuthModalProps> = ({ roomName }: AuthModalProps) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const appStore = useStore("appStore");

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const validationErrors = appStore.validateUserAuthenticationData(name, avatar);
    if (validationErrors.length > 0) {
      console.log(validationErrors);
    } else {
      console.log("Good name");
    }
  };

  const onPickedAvatar = (avatar: string) => {
    setAvatar(avatar);
  };

  return (
    <div
      className={"AuthModal"}
      style={
        {
          //backgroundImage: `url(${Background})`,
        }
      }
    >
      <form className="AuthModalForm" onSubmit={handleSubmit}>
        <div className="nes-container with-title is-centered">
          <p className="title">Welcome to Pixly!</p>
          <p>{`So you'd like to join room ${roomName} huh?`}</p>
          <div className="nes-field">
            <label htmlFor="name_field">{"What's your name?"}</label>
            <input
              type="text"
              id="name_field"
              className={`nes-input ${errorMessage ? "is-error" : ""}`}
              value={name}
              onChange={e => setName(e.target.value)}
            ></input>
          </div>
          <div className="AuthModalFormAvatars">
            <span className="nes-text">{"Pick an avatar"}</span>
            <AvatarPicker onPickedAvatar={onPickedAvatar} pickedAvatar={avatar} />
          </div>
          {errorMessage && (
            <div className="AuthModalFormErrors">
              <span className="nes-text is-error">{errorMessage}</span>
            </div>
          )}

          <div className="AuthModalFormButton">
            <button type="submit" className="nes-btn is-primary">
              Join room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
