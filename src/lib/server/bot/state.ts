import { atom } from "nanostores";

export const $announce_awaited = atom(false);
export const $announce_control_msg_id = atom<number | null>(null);
export const $announce_sender_msg_id = atom<number | null>(null);
