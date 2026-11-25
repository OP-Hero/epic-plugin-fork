/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";
import { Button } from "@components/Button";
import { Flex } from "@components/Flex";
import { DeleteIcon } from "@components/Icons";
import { useForceUpdater } from "@utils/react";
import { Select, TextInput, useState } from "@webpack/common";

import { addBadgeEntry, applyBadges, BADGE_ENTRIES_KEY, badgeEntries, removeBadgeEntry } from "./index";
import { cl } from "./utils";
import { BadgeRarity } from "@api/Badges";
import { identity } from "@utils/misc";
import { Span } from "@components/Span";

export function BadgeEntries() {
    const update = useForceUpdater();
    const [values] = useState(badgeEntries);

    async function updateStoreAndRender() {
        await DataStore.set(BADGE_ENTRIES_KEY, badgeEntries);
        applyBadges();
        update();
    }

    async function setName(index: number, value: string) {
        badgeEntries[index].name = value;
        updateStoreAndRender();
    }

    async function setDesc(index: number, value: string) {
        badgeEntries[index].desc = value;
        updateStoreAndRender();
    }

    async function setRarity(index: number, value: BadgeRarity) {
        badgeEntries[index].rarity = value;
        updateStoreAndRender();
    }

    async function setIcon(index: number, value: string) {
        badgeEntries[index].icon = value;
        updateStoreAndRender();
    }


    const elements = badgeEntries.map((entry, i) => {

        return (
            <>
                <Flex flexDirection="row">
                    <div style={{ flexGrow: 1 }} key={entry.id}>

                        <Span size="md">
                            Enter a name for your badge.
                        </Span>
                        <br />
                        <TextInput
                            placeholder="Certified Gamer"
                            spellCheck={false}
                            value={values[i].name}
                            onChange={e => setName(i, e)} />

                        <Span size="md">
                            Enter a description for your badge.
                        </Span>
                        <br />
                        <TextInput
                            placeholder="Epic Gamer"
                            spellCheck={false}
                            value={values[i].desc}
                            onChange={e => setDesc(i, e)} />

                        <Span size="md">
                            Choose the rarity of your badge.
                        </Span>
                        <br />
                        <Select
                            placeholder="How did you do this"
                            options={Object.keys(BadgeRarity).filter(v => isNaN(+v)).map(v => { return { label: v[0] + v.substring(1).toLowerCase(), value: BadgeRarity[v] }; })}
                            select={e => setRarity(i, e)}
                            isSelected={e => badgeEntries[i].rarity === e}
                            serialize={identity} />

                        <Span size="md">
                            Enter the ID of the emoji you want to use as the badge icon (Right click an emoji from the selector and click on copy emoji id, enable developer options in settings if you don't see that option).
                        </Span>
                        <br />
                        <TextInput
                            placeholder="Icon"
                            spellCheck={false}
                            value={values[i].icon}
                            onChange={e => setIcon(i, e)} />
                    </div>
                    <Button
                        onClick={() => removeBadgeEntry(i, update)}
                        variant="none"
                        size="iconOnly"
                        className={cl("delete")}>
                        <DeleteIcon />
                    </Button>
                </Flex>
            </>
        );
    });

    return (
        <>
            {elements}
            <div><Button onClick={() => addBadgeEntry(update)}>Add Badge</Button></div>
        </>
    );
}
