module.exports = {
    apps: [
        {
            name: "SpaceSim-server",
            script: "npm",
            args: "run start:dev -w space-sim-server",
            watch: ["projects/server/src"],
            ignore_watch: ["node_modules", "dist"],
            env: {
                NODE_ENV: "development",
            },
        },
        {
            name: "SpaceSim-client",
            script: "npm",
            args: "run start:dev -w space-sim-client",
            watch: ["projects/client/src"],
            ignore_watch: ["node_modules", "dist"],
            env: {
                NODE_ENV: "development",
            },
        },
    ],
};
