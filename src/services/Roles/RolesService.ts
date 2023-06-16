require("dotenv").config();
import { PartialUser, User, MessageReaction, PartialMessageReaction, Guild, GuildMember, PartialGuildMember } from "discord.js";
import LoggingService from "../Logging/LoggingService";
export class RolesService {
    private static instance: RolesService;

    private MESSAGE_ID: string = process.env.ROLES_MESSAGE_ID || "";
    private DEFAULT_ROLE_ID: string = process.env.DEFAULT_ROLE_ID || "";
    private roleMapping: Record<string, string> = require("../../../config.json");
    private LOGGER: LoggingService;

    public constructor() {
        this.LOGGER = new LoggingService();
    }

    public static getInstance(): RolesService {
        if (!RolesService.instance) {
            RolesService.instance = new RolesService();
        }

        return RolesService.instance;
    }

    public async addRolesToUser(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
        if (reaction.message.id === this.MESSAGE_ID && reaction.emoji.name && reaction.emoji.name.toString() in this.roleMapping) {
            const guild = reaction.message.guild;
            const member = await guild?.members.fetch(user.id);

            if (member) {
                const roleName = this.roleMapping[reaction.emoji.name];
                const role = guild?.roles.cache.get(roleName);

                if (role) {
                    try {
                        await member.roles.add(role);
                        this.LOGGER.info(`Assigned role '${role.name}' to user '${user.username}'`);
                    } catch (error) {
                        this.LOGGER.error((error as string));
                    }
                }
            }
        }
    }

    public async removeRolesFromUser(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
        if (reaction.message.id === this.MESSAGE_ID && reaction.emoji.name && reaction.emoji.name.toString() in this.roleMapping) {
            const guild = reaction.message.guild;
            const member = await guild?.members.fetch(user.id);

            if (member) {
                const roleName = this.roleMapping[reaction.emoji.name];
                const role = guild?.roles.cache.get(roleName);

                if (role) {
                    try {
                        await member.roles.remove(role);
                        this.LOGGER.info(`Removed role '${role.name}' from user '${user.username}'`);
                    } catch (error) {
                        this.LOGGER.error(`Failed to remove role ${(error as string)}`);
                    }
                }
            }
        }
    }

    public async addDefaultRoleToUser(member: GuildMember | PartialGuildMember) {
        const guild = member.guild;
        const role = guild.roles.cache.get(this.DEFAULT_ROLE_ID);

        if (role) {
            try {
                await member.roles.add(role);
                this.LOGGER.info(`Assigned role ${role.name} to user ${member.user.tag}`);
            } catch (error) {
                console.log("Failed to assign role: " + error);
                this.LOGGER.error(`Failed to assign role: ${(error as string)}`);
            }
        }
    }
}