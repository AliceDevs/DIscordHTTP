import { FastifyReply } from "fastify";
import Interaction from "./Interaction";

export default class CommandInteraction extends Interaction {
  constructor(options: any, res: FastifyReply) {
    super(options, res);

    this.commandId = options.data.id;
    this.commandName = options.data.name;
  }

  public commandId: string;
  public commandName: string;
}
