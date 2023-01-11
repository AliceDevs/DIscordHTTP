export default class User {
  constructor(options: any) {
    this.id = options.id;

    this.avatar = `https://cdn.discordapp.com/avatars/${this.id}/${options.avatar}.png`;

    this.discriminator = options.discriminator;
    this.tag = options.username + "#" + options.discriminator;
    this.username = options.username;
    this.flags = options.public_flags;
    this.bot = options?.bot === true;
  }

  public avatar: string;
  public discriminator: string;
  public tag: string;
  public id: string;
  public username: string;
  public flags: string;
  public bot?: Boolean;
}
