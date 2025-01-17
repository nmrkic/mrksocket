import { toast } from "react-toastify";

export const notifySuccess = (msg = "") => {
  toast(msg, { type: "success" });
};
export const notifyError = (msg = "") => {
  toast(msg, { type: "error" });
};
