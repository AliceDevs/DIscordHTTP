import { Client, getClient } from "..";
import Message from "./Message";

export default class followUp {
  constructor(options: any) {
    this.token = options.token;
    this.applicationId = options.applicationId;
    this.client = getClient();
    this.message = undefined;

    this.replied = false;
  }

  public token: string;
  public applicationId: string;
  public client: Client;
  public message: Message | undefined;

  private replied: Boolean;

  public async create(content: ReplyOptions | string) {
    if (this.replied)
      throw new Error("You can only reply once to an interaction");

    if (typeof content === "string") {
      this.message = new Message(
        await this.client.sendRequest(
          `/webhooks/${this.applicationId}/${this.token}`,
          "POST",
          { content }
        )
      );
      return;
    }

    if (!content?.content && !content?.embeds && !content?.components)
      throw new Error(
        "You must provide at least one of these: content, embeds, components"
      );

    content["flags"] = 0;
    if (content?.ephemeral) content["flags"] += 64;
    if (content?.supressEmbeds) content["flags"] += 4;

    delete content?.ephemeral;
    delete content?.supressEmbeds;

    this.message = new Message(
      await this.client.sendRequest(
        `/webhooks/${this.applicationId}/${this.token}`,
        "POST",
        content
      )
    );
    return this.message;
  }

  public async get() {
    if (!this.message) throw new Error("You must create a follow up first");
    this.message = new Message(
      await this.client.sendRequest(
        `/webhooks/${this.applicationId}/${this.token}/messages/${this.message?.id}`,
        "GET"
      )
    );
  }

  public async edit(content: EditOptions | string) {
    if (!this.message) throw new Error("You must create a follow up first");

    if (typeof content === "string") {
      this.message = new Message(
        await this.client.sendRequest(
          `/webhooks/${this.applicationId}/${this.token}/messages/${this.message?.id}`,
          "PATCH",
          { content }
        )
      );
      return this.message;
    }

    this.message = new Message(
      await this.client.sendRequest(
        `/webhooks/${this.applicationId}/${this.token}/messages/${this.message?.id}`,
        "PATCH",
        content
      )
    );
    return this.message;
  }
}
