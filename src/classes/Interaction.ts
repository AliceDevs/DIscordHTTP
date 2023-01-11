import { InteractionResponseType } from "discord-interactions";
import { FastifyReply } from "fastify";
import { Client, getClient } from "..";
import followUp from "./followUp";
import Member from "./Member";
import User from "./User";

export default class Interaction {
  // Lazy to make interface for this
  constructor(options: any, res: FastifyReply) {
    this.res = res;

    this.appPermissions = options.app_permissions;
    this.applicationId = options.application_id;
    this.channelId = options.channel_id;
    this.guildId = options.guild_id;
    this.guildLocale = options.guild_locale;
    this.id = options.id;
    options.member["guildId"] = this.guildId;
    this.member = new Member(options.member);
    this.user = new User(options.member.user);

    this.replied = false;

    this.client = getClient();
    this.token = options.token;
    this.type = options.type;
    this.version = options.version;

    this.followUp = new followUp({
      token: this.token,
      applicationId: this.applicationId,
    });
  }

  public res: FastifyReply;

  public appPermissions: string;
  public applicationId: string;
  public channelId: string;
  public guildId: string;
  public guildLocale: string;
  public id: string;
  public member: Member;
  public user: any;

  public replied: Boolean;

  private client: Client;
  private token: string;
  private type: number;
  private version: number;

  public followUp: followUp;

  public reply(content: ReplyOptions | string) {
    // If we have only content
    if (typeof content === "string") {
      this.replied = true;
      return this.res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content },
      });
    }

    // If we have whole object
    if (!content.content && !content.embeds && !content.components) {
      throw new TypeError(
        "You must provide at least one of these: content, embeds, components"
      );
    }

    content["flags"] = 0;
    if (content?.ephemeral) content["flags"] += 64;
    if (content?.supressEmbeds) content["flags"] += 4;

    this.replied = true;

    return this.res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: content,
    });
  }

  public async edit(content: EditOptions | string) {
    if (!this.replied)
      throw new TypeError("You must reply first before editing");

    if (typeof content === "string") {
      return await this.client.sendRequest(
        `/webhooks/${this.applicationId}/${this.token}/messages/@original`,
        "PATCH",
        { content }
      );
    }

    // If we have whole object
    if (!content.content && !content.embeds && !content.components) {
      throw new Error(
        "You must provide at least one of these: content, embeds, components"
      );
    }

    return await this.client.sendRequest(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`,
      "PATCH",
      content
    );
  }

  public async getMessage() {
    if (!this.replied)
      throw new TypeError("You must reply first before getting message");

    return await this.client.sendRequest(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`,
      "GET"
    );
  }

  public async delete() {
    if (!this.replied)
      throw new TypeError("You must reply first before deleting message");

    return await this.client.sendRequest(
      `/webhooks/${this.applicationId}/${this.token}/messages/@original`,
      "DELETE"
    );
  }
}
