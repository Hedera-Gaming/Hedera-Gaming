<<<<<<< HEAD
import { GameServerEngine } from "phaser-game-server-engine";
import { GameLevelOptions, Logging, SpaceSim } from "space-sim-shared";
import { BattleRoyaleScene } from "./scenes/battle-royale-scene";
import { ServerSocketManager } from "./utilities/server-socket-manager";
import { DynamicDataStore } from "dynamic-data-store";

export class SpaceSimServer extends GameServerEngine {
    constructor() {
        super({scene: [BattleRoyaleScene]});

        this.game.events.on(Phaser.Core.Events.READY, () => {
            SpaceSimServer.io = new ServerSocketManager({io: this.io});
=======
import { GameServerEngine } from 'phaser-game-server-engine';
import { GameLevelOptions, Logging, SpaceSim } from 'space-sim-shared';
import { BattleRoyaleScene } from './scenes/battle-royale-scene';
import { ServerSocketManager } from './utilities/server-socket-manager';
import { DynamicDataStore } from 'dynamic-data-store';

export class SpaceSimServer extends GameServerEngine {
    constructor() {
        super({ scene: [BattleRoyaleScene] });

        this.game.events.on(Phaser.Core.Events.READY, () => {
            SpaceSimServer.io = new ServerSocketManager({ io: this.io });
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        });
    }
}

export module SpaceSimServer {
    export var io: ServerSocketManager;
<<<<<<< HEAD
    export const users = new DynamicDataStore<SpaceSimServer.UserData>({indicies: ['fingerprint', 'name']});
    export const rooms = (): Array<BattleRoyaleScene> => SpaceSim.game.scene.getScenes(true)
        .map(s => s as BattleRoyaleScene);
=======
    export const users = new DynamicDataStore<SpaceSimServer.UserData>({
        indicies: ['fingerprint', 'name'],
    });
    export const rooms = (): Array<BattleRoyaleScene> =>
        SpaceSim.game.scene.getScenes(true).map((s) => s as BattleRoyaleScene);
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
    export type UserData = SpaceSim.UserData & {
        socketId?: string;
        room?: string;
        shipId?: string;
        deleteAt?: number; // leave undefined or null if active
<<<<<<< HEAD
    }
    export module Constants {
        export module Rooms {
            export const MAX_BOTS = 25;
=======
    };
    export module Constants {
        export module Rooms {
            export const MAX_BOTS = 2; //25;
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        }
        export module Map {
            export const MAP_WIDTH = 50; // tiles, not pixels
            export const MAP_HEIGHT = 50;
            export const MAP_OPTIONS: GameLevelOptions = {
                seed: 'bicarbon8',
                width: MAP_WIDTH, // in tiles, not pixels
                height: MAP_HEIGHT,
                maxRooms: 1,
<<<<<<< HEAD
                roomWidth: {min: MAP_WIDTH-1, max: MAP_WIDTH},
                roomHeight: {min: MAP_HEIGHT-1, max: MAP_HEIGHT},
                doorPadding: 0
=======
                roomWidth: { min: MAP_WIDTH - 1, max: MAP_WIDTH },
                roomHeight: { min: MAP_HEIGHT - 1, max: MAP_HEIGHT },
                doorPadding: 0,
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            } as const;
        }
    }
}

SpaceSim.debug = false;
Logging.loglevel = 'info';
const server = new SpaceSimServer();
<<<<<<< HEAD
SpaceSim.game = server.game;
=======
SpaceSim.game = server.game;
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
