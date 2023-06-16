require("dotenv").config();
import { Client, PartialUser, User, MessageReaction, PartialMessageReaction, GatewayIntentBits, Events, Partials, GuildMember, PartialGuildMember } from "discord.js";

let BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
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

const roleMapping: Record<string, string> = require('./config.json');

const MESSAGE_ID = process.env.ROLES_MESSAGE_ID;

const DEFAULT_ROLE_ID = process.env.DEFAULT_ROLE_ID || "";

client.once("ready", () => {
    console.log("Bot is ready");
});

client.on(Events.MessageReactionAdd, async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (reaction.message.id === MESSAGE_ID && reaction.emoji.name && reaction.emoji.name.toString() in roleMapping) {
        const guild = reaction.message.guild;
        const member = await guild?.members.fetch(user.id);

        if (member) {
            const roleName = roleMapping[reaction.emoji.name];
            const role = guild?.roles.cache.get(roleName);

            if (role) {
                member.roles.add(role);
                console.log(`Assigned role '${role.name}' to user '${user.username}'`);
            }
        }
    }
});

client.on('messageReactionRemove', async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    if (reaction.message.id === MESSAGE_ID && reaction.emoji.name && reaction.emoji.name.toString() in roleMapping) {
        const guild = reaction.message.guild;
        const member = await guild?.members.fetch(user.id);

        if (member) {
            const roleName = roleMapping[reaction.emoji.name];
            const role = guild?.roles.cache.get(roleName);

            if (role) {
                member.roles.remove(role);
                console.log(`Removed role '${role.name}' from user '${user.username}'`);
            }
        }
    }
});


client.on(Events.GuildMemberAdd, async (member: GuildMember | PartialGuildMember) => {
    const guild = member.guild;
    const role = guild.roles.cache.get(DEFAULT_ROLE_ID);

    if (role) {
        try {
            await member.roles.add(role);
            console.log(`Assigned role ${role.name} to user ${member.user.tag}`);
        } catch (error) {
            console.log("Failed to assign role: " + error);
        }
    }
});


client.login(BOT_TOKEN);