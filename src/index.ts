import fastify, { FastifyInstance } from "fastify";
import EventEmitter from "events";
import {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} from "discord-interactions";
import CommandInteraction from "./classes/CommandInteraction";
import fetch from "node-fetch";

const app = fastify();

// User can test, if app is running
app.get("/", (req, res) => {
  return { hello: "world!" };
});

const events = new EventEmitter();

let client;

export function getClient() {
  return client;
}

export class Client {
  constructor(options: ClientOptions) {
    if (!options.port) throw new Error("No port provided");
    if (!options.token) throw new Error("No token provided");
    if (!options.publicKey) throw new Error("No public key provided");

    this.port = options.port;
    this.token = options.token;
    this.publicKey = options.publicKey;
    this.events = events;

    app.post("/", (req, res) => {
      // Lazy to make interface for the body 😔
      const body: any = req.body;

      // Check if the request is from Discord
      const discord = verifyKey(
        JSON.stringify(body),
        req.headers["x-signature-ed25519"] as string,
        req.headers["x-signature-timestamp"] as string,
        this.publicKey
      );

      // If the request is not from Discord, return an error
      if (!discord)
        return res.status(401).send({ error: "Invalid request signature" });

      // Request is from Discord! Let's handle the request now.
      switch (body.type) {
        // Discord is pinging us, let's answer with a pong
        case InteractionType.PING:
          return res.send({ type: InteractionResponseType.PONG });

        // Discord is sending us a command, let's handle it
        case InteractionType.APPLICATION_COMMAND:
          const interaction = new CommandInteraction(body, res);
          this.events.emit("command", interaction);
      }
    });
  }

  public start() {
    client = this;
    app.listen({ port: this.port }, (err) => {
      if (err) {
        throw err;
      }
      this.events.emit("ready");
      return;
    });
  }

  public async sendRequest(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    data?: any
  ) {
    const res = await fetch(`https://discord.com/api/v10${endpoint}`, {
      method: method,
      headers: {
        Authorization: `Bot ${this.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status >= 400) throw new Error(await res.text());
    if (res.status === 204) return;
    try {
      return res.json();
    } catch (err) {
      return res.text();
    }
  }

  public fastify: FastifyInstance = app;
  public port: number;
  public token: string;
  public publicKey: string;
  public events: EventEmitter;
}
