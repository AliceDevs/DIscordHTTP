import User from "./User";

export default class Member {
  constructor(options: any) {
    this.user = new User(options.user);
    this.guildId = options.guildId;
    this.avatar = `https://cdn.discordapp.com/guilds/${this.guildId}/users/${this.user.id}/${this.user.avatar}.png`;
    this.nick = options.nick;
    this.roles = options.roles;
    this.timedOut = options?.communication_disabled_until
      ? new Date(options.communication_disabled_until)
      : null;
    this.joinedAt = new Date(options.joined_at);
    this.premiumSince = options?.premium_since
      ? new Date(options.premium_since)
      : null;
    this.deaf = options.deaf;
    this.mute = options.mute;
  }

  public avatar: string;
  public timedOut: Date | null;
  public user: any;
  public nick: string;
  public guildId: string;
  public joinedAt: Date;
  public premiumSince: Date | null;
  public deaf: boolean;
  public mute: boolean;
  public roles: string[];
}
