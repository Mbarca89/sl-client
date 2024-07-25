import { atom, selector } from "recoil";
import { userData } from "../types";

const userState = atom({
  key: "userState",
  default: {
    id: "",
    name: "",
    area: "",
    surname: "",
    userName: "",
    role: "user",
    token: "",
  }
})

const logState = atom({
  key: "logState",
  default: false
})

const modalState = atom({
  key: "modalState",
  default: false
})

const loadingState = atom({
  key: 'loadingState',
  default: false,
})

export { userState, logState, modalState, loadingState }