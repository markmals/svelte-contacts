import type { Kv } from "@deno/kv";

const contacts = [
    {
        id: "1",
        first: "Scott",
        last: "Spence",
        avatar: "https://userstock.io/data/wp-content/uploads/2020/05/warren-wong-VVEwJJRRHgk-1024x1024.jpg",
        bsky: "scottspence.dev",
    },
    {
        id: "2",
        first: "Rich",
        last: "Harris",
        avatar: "https://userstock.io/data/wp-content/uploads/2020/06/jack-finnigan-rriAI0nhcbc-1024x1024.jpg",
        bsky: "rich-harris.dev",
    },
    {
        id: "3",
        first: "Geoff",
        last: "Rich",
        avatar: "https://userstock.io/data/wp-content/uploads/2017/09/yingchou-han-261533-1024x987.jpg",
        bsky: "geoffrich.net",
    },
    {
        id: "4",
        first: "Zeu",
        last: "Capua",
        avatar: "https://userstock.io/data/wp-content/uploads/2020/06/women-s-white-and-black-button-up-collared-shirt-774909-2-1024x1024.jpg",
        bsky: "zeu.dev",
    },
    {
        id: "5",
        first: "Thomas G.",
        last: "Lopes",
        avatar: "https://userstock.io/data/wp-content/uploads/2020/06/kimson-doan-HD8KlyWRYYM-4-1024x1024.jpg",
        bsky: "thomas.rocks",
    },
    {
        id: "9",
        first: "Jacob",
        last: "Stordahl",
        avatar: "https://userstock.io/data/wp-content/uploads/2020/05/imansyah-muhamad-putera-n4KewLKFOZw-1024x1024.jpg",
        bsky: "stordahl.dev",
    },
    {
        id: "7",
        first: "Paolo",
        last: "Ricciuti",
        avatar: "https://userstock.io/data/wp-content/uploads/2020/06/aiony-haust-3TLl_97HNJo-1024x1024.jpg",
        bsky: "paolo.ricciuti.me",
    },
    {
        id: "8",
        first: "Jean-Yves",
        last: "Couët",
        avatar: "https://userstock.io/data/wp-content/uploads/2017/09/yingchou-han-241463-1024x1005.jpg",
        bsky: "jyc.dev",
    },
];

export async function seed(kv: Kv, namespace: string) {
    for (const contact of contacts) {
        const key = [namespace, contact.id];
        const existing = await kv.get(key);

        if (!existing.value) {
            await kv.set(key, contact);
        }
    }
}
