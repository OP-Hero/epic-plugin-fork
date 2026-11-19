/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import definePlugin from "@utils/types";
import { EquicordDevs } from "@utils/constants";
import { settings } from "./settings";
import { _getBadges, addProfileBadge, BadgePosition, BadgeRarity, removeProfileBadge } from "@api/Badges";
import { DataStore } from "@api/index";
import { hasBadge } from "./utils";


interface BadgeEntry {
    name: string,
    desc: string,
    rarity: BadgeRarity,
    icon: string,
    id: string;
}

export let badgeEntries: Array<BadgeEntry> = [];
let oldBadges: Array<BadgeEntry> = badgeEntries;


export const BADGE_ENTRIES_KEY = "badgeManager_badges";

export async function addBadgeEntry(forceUpdate: () => void) {
    badgeEntries.push({
        name: "",
        desc: "",
        rarity: BadgeRarity.COMMON,
        icon: "",
        id: crypto.randomUUID()
    });
    await DataStore.set(BADGE_ENTRIES_KEY, badgeEntries);
    forceUpdate();
    applyBadges();
}

export async function removeBadgeEntry(idx: number, forceUpdate: () => void) {
    badgeEntries.splice(idx, 1);
    await DataStore.set(BADGE_ENTRIES_KEY, badgeEntries);
    forceUpdate();
    applyBadges();
}

export function applyBadges() {

    for (const entry of oldBadges) {

        let badge = {
            id: entry.id,
            name: entry.name,
            description: entry.desc,
            infoLabel: "Custom Badge",
            rarity: entry.rarity,
            iconSrc: `https://cdn.discordapp.com/emojis/${entry.icon}.png`,
            largeIconSrc: `https://cdn.discordapp.com/emojis/${entry.icon}.png`,
            position: BadgePosition.START,
            shouldShow: () => hasBadge(entry.id)
        };

        removeProfileBadge(badge);

        addProfileBadge(badge);
    }
    oldBadges = badgeEntries;
}

export default definePlugin({
    name: "BadgeManager",
    description: "Manage your Badges",
    dependencies: ["BadgeAPI"],
    tags: ["Appearance", "Customisation", "Emotes", "Friends", "Fun"],
    authors: [EquicordDevs.OP_Hero],
    settings,

    async start() {
        this.onUpdate = () => null;

        badgeEntries = await DataStore.get(BADGE_ENTRIES_KEY) ?? [];
        await DataStore.set(BADGE_ENTRIES_KEY, badgeEntries);
        oldBadges = badgeEntries;

        applyBadges();

    }
});
