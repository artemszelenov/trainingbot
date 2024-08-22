const ADMIN_CHAT_ID = Bun.env.ADMIN_CHAT_ID;

// maybe rewrite this to redirect on the server
export function load() {
	return {
		admin_chat_id: ADMIN_CHAT_ID,
	};
}
