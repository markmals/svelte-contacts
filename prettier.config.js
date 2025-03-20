/** @type {import("prettier").Config} */
export default {
    printWidth: 100,
    tabWidth: 4,
    semi: true,
    arrowParens: "avoid",

    plugins: ["prettier-plugin-svelte"],
    overrides: [
        {
            files: "*.svelte",
            options: {
                parser: "svelte",
            },
        },
    ],
};
