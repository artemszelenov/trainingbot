export interface FormBodyI {
  chat_id: number;
}

export interface CallbackDataFormStartI {
  event: "form_start";
  payload: {
    service_id: number;
  };
}

export interface CallbackDataCancelAnnounceI {
  event: "cancel_announce";
  payload: Record<string, unknown>;
}

export interface CallbackDataDeleteAnnounceI {
  event: "delete_announce";
  payload: Record<string, unknown>;
}

export type CallbackDataI =
  | CallbackDataFormStartI
  | CallbackDataCancelAnnounceI
  | CallbackDataDeleteAnnounceI;
