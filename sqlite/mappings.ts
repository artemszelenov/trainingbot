export class Migration {
  id: string;
  timestamp: string;
}

export class Service {
  id: string;
  service_name: string;
  service_slug: string;
}

export class Client {
  id: number;
  chat_id: number;
  first_name: string | null;
  last_name: string | null;
  username: string;
}

export class AnnouncesToDelete {
  client_message_id: number;
  client_chat_id: number;
}

export class AnnouncesToUpdate {
  client_message_id: number;
  chat_id: number;
}
