"use server";

import { DISCORD_WEBHOOK_URL } from "@/common/venv";
import { SendDiscordMessageResponse } from "./_response";

export const sendDiscordMessage = async (
    prevState: unknown, 
    formData: Iterable<readonly [PropertyKey, unknown]>
): Promise<SendDiscordMessageResponse> => {
    try {
        console.log(prevState);

        if (!formData) {
            throw new Error("formData is undefined or not provided");
        }

        const rawFormEntries = Object.fromEntries(formData);

        console.log(rawFormEntries);

        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: rawFormEntries?.fullname,
                avatar_url: rawFormEntries?.dp || "https://i.imgur.com/mDKlggm.png",
                content: rawFormEntries?.message,
                embeds: [
                    {
                        fields: [
                            {
                                name: "Email",
                                value: rawFormEntries?.email,
                                inline: true,
                            },
                        ],
                    },
                ],
            }),
        });
        return {
            success: true,
            message: `Your message has been sent successfully.`,
        };

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: `Problem is sending message: ${err}`,
        };
    }
};