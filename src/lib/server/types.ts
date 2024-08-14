export interface FormBody {
	chat_id: number;
}

export interface CallbackDataFormStart {
	event: "form_start";
	payload: {
		service_id: number;
		form_id: number;
	};
}

export interface CallbackDataCancelAnnounce {
	event: "cancel_announce";
	payload: Record<string, unknown>;
}

export interface CallbackDataDeleteAnnounce {
	event: "delete_announce";
	payload: Record<string, unknown>;
}

export type CallbackData =
	| CallbackDataFormStart
	| CallbackDataCancelAnnounce
	| CallbackDataDeleteAnnounce;
