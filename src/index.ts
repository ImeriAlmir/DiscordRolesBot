require("dotenv").config();
import { Client, PartialUser, User, MessageReaction, PartialMessageReaction, GatewayIntentBits, Events, Partials, GuildMember, PartialGuildMember } from "discord.js";
import { RolesService } from "./services/Roles/RolesService";
import { DiscordBot } from "./Client/Client";

const client = new DiscordBot();

client.start();