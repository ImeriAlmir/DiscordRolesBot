require("dotenv").config();
import { Client, GatewayIntentBits, Partials, Events, MessageReaction, PartialMessageReaction, User, PartialUser, GuildMember, PartialGuildMember } from "discord.js";
import { RolesService } from "../services/Roles/RolesService";
import LoggingService from "../services/Logging/LoggingService";

export class DiscordBot {
    private static instance: DiscordBot;
    private client: Client;
    private BOT_TOKEN = process.env.BOT_TOKEN;
    private LOGGER: LoggingService;

    public constructor() {
        this.LOGGER = new LoggingService();

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages
            ],
            partials: [
                Partials.Message,
                Partials.Channel,
                Partials.Reaction
            ]
        });

        this.client.once(Events.ClientReady, () => {
            this.LOGGER.info("BOT IS UP AND READY");
        });

        this.client.on(Events.MessageReactionAdd, async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
            RolesService.getInstance().addRolesToUser(reaction, user);
        });

        this.client.on(Events.MessageReactionRemove, async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
            RolesService.getInstance().removeRolesFromUser(reaction, user);
        });

        this.client.on(Events.GuildMemberAdd, async (member: GuildMember | PartialGuildMember) => {
            RolesService.getInstance().addDefaultRoleToUser(member);
        });
    }

    public static getInstance(): DiscordBot {
        if (!DiscordBot.instance) {
            DiscordBot.instance = new DiscordBot();
        }

        return DiscordBot.instance;
    }

    public start(): void {
        this.client.login(this.BOT_TOKEN);
    }
}