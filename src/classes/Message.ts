import { Client, getClient } from "..";
import User from "./User";

export default class Message {
  constructor(options: any) {
    this.id = options.id;
    this.type = options.type;
    this.content = options.content;
    this.channelId = options.channel_id;
    this.author = new User(options.author);
    this.attachments = options.attachments;
    this.embeds = options.embeds;
    this.mentions = options.mentions.map((m: any) => new User(m));
    this.mentionRoles = options.mention_roles;
    this.pinned = options.pinned;
    this.mentionEveryone = options.mention_everyone;
    this.tts = options.tts;
    this.timestamp = new Date(options.timestamp);
    this.editedTimestamp = options.edited_timestamp
      ? new Date(options.edited_timestamp)
      : undefined;
    this.flags = options.flags;
    this.components = options.components;
    this.messageReference = options.message_reference;
    this.client = getClient();
  }

  public id: string;
  public type: number;
  public content: string | undefined;
  public channelId: string;
  public author: User;
  public attachments?: Array<any> | undefined;
  public embeds?: Array<any> | undefined;
  public mentions: Array<User>;
  public mentionRoles: Array<string>;
  public pinned: Boolean;
  public mentionEveryone: Boolean;
  public tts: Boolean;
  public timestamp: Date;
  public editedTimestamp: Date | undefined;
  public flags: number;
  public components?: Array<any> | undefined;
  public messageReference?:
    | {
        channelId: string;
        guildId: string;
        messageId: string;
      }
    | undefined;

  public client: Client;

  public async get() {
    return new Message(
      await this.client.sendRequest(
        `/channels/${this.channelId}/messages/${this.id}`,
        "GET"
      )
    );
  }
}
