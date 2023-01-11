interface ClientOptions {
  port: number;
  token: string;
  publicKey: string;
}

interface ReplyOptions {
  content?: string;
  embeds?: any;
  components?: any;
  ephemeral?: Boolean;
  supressEmbeds?: Boolean;
}

interface EditOptions {
  content?: string;
  embeds?: any;
  components?: any;
}
