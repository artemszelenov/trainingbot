export interface FormBodyI {
  chat_id: number;
}

export interface CallbackDataI {
  event: "form_start" | "cancel_announce" | "delete_announce";
  payload: Record<string, unknown>;
}
