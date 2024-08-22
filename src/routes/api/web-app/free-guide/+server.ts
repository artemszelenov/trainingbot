import { dirname, join } from "node:path";

const __filename = Bun.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function GET() {
	const file = Bun.file(join(__dirname, "guide.pdf"));
	const arrbuf = await file.arrayBuffer();
	const buffer = Buffer.from(arrbuf);

	return new Response(buffer, {
		headers: {
			"Content-Type": "application/pdf",
			"Content-Length": buffer.byteLength.toString(),
		},
	});
}
