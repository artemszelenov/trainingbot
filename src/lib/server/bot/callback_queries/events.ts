import { CallbackData } from "@gramio/core";

export const event_cancel_announce = new CallbackData("cancel_announce");

export const event_delete_announce = new CallbackData("delete_announce");

export const event_start_form = new CallbackData("start_form")
	.number("service_id")
	.number("form_id");
