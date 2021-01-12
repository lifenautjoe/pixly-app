import { FormEvent, FunctionComponent, useState } from "react";
import React from "react";
import "./AuthSplash.scss";
import { useStore } from "../../hooks/stores";
import { AvatarPicker } from "../AvatarPicker/AvatarPicker";

interface AuthSplashProps {
  roomName: string;
}

export const AuthSplash: FunctionComponent<AuthSplashProps> = ({ roomName }: AuthSplashProps) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const appStore = useStore("pixlyStore");

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setErrorMessage("");

    const authenticateDto = {
      name,
      avatar,
    };

    const validationErrors = appStore.validateUserAuthenticationDto(authenticateDto);

    if (validationErrors.length > 0) {
      const firstValidationErrorConstraints = validationErrors[0].constraints;

      const firstErrorMessage = Object.values(firstValidationErrorConstraints as Record<string, string>)[0];

      setErrorMessage(firstErrorMessage);
    } else {
      appStore.authenticate(authenticateDto);
    }
  };

  return (
    <div
      className={"AuthSplash"}
      style={
        {
          //backgroundImage: `url(${Background})`,
        }
      }
    >
      <form className="AuthSplashForm" onSubmit={handleSubmit}>
        <div className="nes-container with-title is-centered">
          <p className="title">Welcome to Pixly!</p>
          <p>{`So you'd like to join room ${roomName} huh?`}</p>
          <div className="nes-field">
            <label htmlFor="name_field">{"What's your name?"}</label>
            <input type="text" id="name_field" className="nes-input" value={name} onChange={e => setName(e.target.value)}></input>
          </div>
          <div className="AuthSplashFormAvatars">
            <span className="nes-text">{"Pick an avatar"}</span>
            <AvatarPicker onPickedAvatar={avatar => setAvatar(avatar)} pickedAvatar={avatar} />
          </div>
          {errorMessage && (
            <div className="AuthSplashFormErrors">
              <p className="nes-text is-error">{errorMessage}</p>
            </div>
          )}

          <div className="AuthSplashFormButton">
            <button type="submit" className="nes-btn is-primary">
              Join room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
