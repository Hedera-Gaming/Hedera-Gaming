<<<<<<< HEAD
import * as Phaser from "phaser";
import { BaseScene, GameLevel, Ship, ShipSupply, ShipSupplyOptions, AmmoSupply, CoolantSupply, FuelSupply, RepairsSupply, GameLevelOptions, SpaceSim, Engine, Weapon, MachineGun, ShipState, Exploder, AiController, StandardEngine, EconomyEngine, SportsEngine, Cannon, PlasmaGun, Logging, Helpers, TryCatch } from "space-sim-shared";
import { ServerShip } from "../ships/server-ship";
import { SpaceSimServer } from "../space-sim-server";
import { DynamicDataStore, lessThan } from "dynamic-data-store";

export class BattleRoyaleScene extends BaseScene {
    private readonly _supplies = new DynamicDataStore<ShipSupply>({indicies: ['id']});
    private readonly _flickering = new Array<string>(); // supplies currently flickering
    private readonly _ships = new DynamicDataStore<Ship>({indicies: ['id']});
=======
import * as Phaser from 'phaser';
import {
    BaseScene,
    GameLevel,
    Ship,
    ShipSupply,
    ShipSupplyOptions,
    AmmoSupply,
    CoolantSupply,
    FuelSupply,
    RepairsSupply,
    GameLevelOptions,
    SpaceSim,
    Engine,
    Weapon,
    MachineGun,
    ShipState,
    Exploder,
    AiController,
    StandardEngine,
    EconomyEngine,
    SportsEngine,
    Cannon,
    PlasmaGun,
    Logging,
    Helpers,
    TryCatch,
} from 'space-sim-shared';
import { ServerShip } from '../ships/server-ship';
import { SpaceSimServer } from '../space-sim-server';
import { DynamicDataStore, lessThan } from 'dynamic-data-store';

export class BattleRoyaleScene extends BaseScene {
    private readonly _supplies = new DynamicDataStore<ShipSupply>({
        indicies: ['id'],
    });
    private readonly _flickering = new Array<string>(); // supplies currently flickering
    private readonly _ships = new DynamicDataStore<Ship>({ indicies: ['id'] });
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
    private readonly _bots = new Map<string, AiController>();

    private _gameLevel: GameLevel;
    private _exploder: Exploder;

    /**
<<<<<<< HEAD
     * the communication "room" that all players in this scene must be within to 
=======
     * the communication "room" that all players in this scene must be within to
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
     * receive socket events
     */
    readonly ROOM_NAME: string;

    constructor(options?: Phaser.Types.Scenes.SettingsConfig) {
        const room = options?.key ?? Phaser.Math.RND.uuid();
        super({
            ...options,
<<<<<<< HEAD
            key: room
=======
            key: room,
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        });
        this.ROOM_NAME = room;
    }

<<<<<<< HEAD
    override queueGameLevelUpdate<T extends GameLevelOptions>(opts: T): BaseScene {
        throw new Error("Method not implemented.");
    }
    override queueShipUpdates(...opts: Array<ShipState>): BaseScene {
        throw new Error("Method not implemented.");
    }
    override queueShipRemoval(...ids: string[]): BaseScene {
        throw new Error("Method not implemented.");
    }
    override queueSupplyUpdates(...opts: Array<ShipSupplyOptions>): BaseScene {
        throw new Error("Method not implemented.");
    }
    override queueSupplyRemoval(...ids: string[]): BaseScene {
        throw new Error("Method not implemented.");
    }
    override queueSupplyFlicker(...ids: string[]): BaseScene {
        throw new Error("Method not implemented.");
    }
    override queueEndScene(): BaseScene {
        throw new Error("Method not implemented.");
    }
    override getShip<T extends Ship>(id: string): T {
        return this._ships._get({id}).first as T;
    }
    override getShips<T extends Ship>(): Array<T> {
        return this._ships._get().map(s => s as T);
    }
    override getSupply<T extends ShipSupply>(id: string): T {
        return this._supplies._get({id}).first as T;
    }
    override getSupplies<T extends ShipSupply>(): Array<T> {
        return this._supplies._get().map(s => s as T);
=======
    override queueGameLevelUpdate<T extends GameLevelOptions>(
        opts: T
    ): BaseScene {
        throw new Error('Method not implemented.');
    }
    override queueShipUpdates(...opts: Array<ShipState>): BaseScene {
        throw new Error('Method not implemented.');
    }
    override queueShipRemoval(...ids: string[]): BaseScene {
        throw new Error('Method not implemented.');
    }
    override queueSupplyUpdates(...opts: Array<ShipSupplyOptions>): BaseScene {
        throw new Error('Method not implemented.');
    }
    override queueSupplyRemoval(...ids: string[]): BaseScene {
        throw new Error('Method not implemented.');
    }
    override queueSupplyFlicker(...ids: string[]): BaseScene {
        throw new Error('Method not implemented.');
    }
    override queueEndScene(): BaseScene {
        throw new Error('Method not implemented.');
    }
    override getShip<T extends Ship>(id: string): T {
        return this._ships._get({ id }).first as T;
    }
    override getShips<T extends Ship>(): Array<T> {
        return this._ships._get().map((s) => s as T);
    }
    override getSupply<T extends ShipSupply>(id: string): T {
        return this._supplies._get({ id }).first as T;
    }
    override getSupplies<T extends ShipSupply>(): Array<T> {
        return this._supplies._get().map((s) => s as T);
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
    }
    override getLevel<T extends GameLevel>(): T {
        return this._gameLevel as T;
    }

    preload(): void {
        /* do nothing */
    }

    create(): void {
        this._exploder = new Exploder(this);
        this._createGameLevel();
        this._setupSceneEventHandling();
        for (let i = 0; i < SpaceSimServer.Constants.Rooms.MAX_BOTS; i++) {
            this.createBot();
        }

<<<<<<< HEAD
        this.addRepeatingAction('high', 'remove-ships', () => this._processRemoveShipQueue())
        .addRepeatingAction('high', 'remove-supplies', () => this._processRemoveSupplyQueue())
        .addRepeatingAction('high', 'update-ships', (time: number, delta: number) => {
            this.getShips()
                .filter(s => s.active)
                .forEach(ship => ship?.update(time, delta));
        }).addRepeatingAction('high', 'update-bot-controllers', (time: number, delta: number) => {
            this._bots.forEach((bot: AiController) => bot.update(time, delta));
        });

        this.addRepeatingAction('medium', 'send-ships-update', () => {
            const shipsState = this.getShips()
                .filter(s => s.active)
                .map(s => s.currentState);
            if (shipsState) {
                SpaceSimServer.io.sendUpdatePlayersEvent(this.ROOM_NAME, shipsState);
=======
        this.addRepeatingAction('high', 'remove-ships', () =>
            this._processRemoveShipQueue()
        )
            .addRepeatingAction('high', 'remove-supplies', () =>
                this._processRemoveSupplyQueue()
            )
            .addRepeatingAction(
                'high',
                'update-ships',
                (time: number, delta: number) => {
                    this.getShips()
                        .filter((s) => s.active)
                        .forEach((ship) => ship?.update(time, delta));
                }
            )
            .addRepeatingAction(
                'high',
                'update-bot-controllers',
                (time: number, delta: number) => {
                    this._bots.forEach((bot: AiController) =>
                        bot.update(time, delta)
                    );
                }
            );

        this.addRepeatingAction('medium', 'send-ships-update', () => {
            const shipsState = this.getShips()
                .filter((s) => s.active)
                .map((s) => s.currentState);
            if (shipsState) {
                SpaceSimServer.io.sendUpdatePlayersEvent(
                    this.ROOM_NAME,
                    shipsState
                );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            }
        });

        this.addRepeatingAction('low', 'send-supplies-update', () => {
            const suppliesState = this.getSupplies()
<<<<<<< HEAD
                .filter(s => s.active)
                .map(s => s.currentState);
            if (suppliesState.length) {
                SpaceSimServer.io.sendUpdateSuppliesEvent(this.ROOM_NAME, suppliesState);
=======
                .filter((s) => s.active)
                .map((s) => s.currentState);
            if (suppliesState.length) {
                SpaceSimServer.io.sendUpdateSuppliesEvent(
                    this.ROOM_NAME,
                    suppliesState
                );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            }
        });

        this.addRepeatingAction('ultralow', 'send-stats-update', () => {
            // TODO: filter out stats from other rooms
<<<<<<< HEAD
            SpaceSimServer.io.sendUpdateStatsToRoom(this.ROOM_NAME, SpaceSim.stats.getAllStats());
        }).addRepeatingAction('ultralow', 'send-supply-flicker', () => {
            this._processFlickerSupplyQueue();
        }).addRepeatingAction('ultralow', 'send-game-level-update', () => {
            SpaceSimServer.io.sendUpdateGameLevelToRoom(this.ROOM_NAME, this.getLevel().currentState);
        }).addRepeatingAction('ultralow', 'purge-disconnected-users', () => {
            const users = SpaceSimServer.users.delete({deleteAt: lessThan(Date.now())});
            for (let user of users) {
                this.removePlayerFromScene(user);
            }
        });
=======
            SpaceSimServer.io.sendUpdateStatsToRoom(
                this.ROOM_NAME,
                SpaceSim.stats.getAllStats()
            );
        })
            .addRepeatingAction('ultralow', 'send-supply-flicker', () => {
                this._processFlickerSupplyQueue();
            })
            .addRepeatingAction('ultralow', 'send-game-level-update', () => {
                SpaceSimServer.io.sendUpdateGameLevelToRoom(
                    this.ROOM_NAME,
                    this.getLevel().currentState
                );
            })
            .addRepeatingAction('ultralow', 'purge-disconnected-users', () => {
                const users = SpaceSimServer.users.delete({
                    deleteAt: lessThan(Date.now()),
                });
                for (let user of users) {
                    this.removePlayerFromScene(user);
                }
            });
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
    }

    createShip(data: SpaceSim.UserData, config?: Partial<ShipState>): Ship {
        const room = this.getLevel().rooms[0];
<<<<<<< HEAD
        const topleft: Phaser.Math.Vector2 = this.getLevel().getMapTileWorldLocation(room.left + 1, room.top + 1);
        const botright: Phaser.Math.Vector2 = this.getLevel().getMapTileWorldLocation(room.left+room.width - 1, room.top+room.height - 1);
=======
        const topleft: Phaser.Math.Vector2 =
            this.getLevel().getMapTileWorldLocation(
                room.left + 1,
                room.top + 1
            );
        const botright: Phaser.Math.Vector2 =
            this.getLevel().getMapTileWorldLocation(
                room.left + room.width - 1,
                room.top + room.height - 1
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        let loc: Phaser.Math.Vector2;
        do {
            let x = Phaser.Math.RND.realInRange(topleft.x, botright.x);
            let y = Phaser.Math.RND.realInRange(topleft.y, botright.y);
            loc = Helpers.vector2(x, y);
        } while (this._isMapLocationOccupied(loc, 100));
<<<<<<< HEAD
        let engine: (new (scene: BaseScene) => Engine);
=======
        let engine: new (scene: BaseScene) => Engine;
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        switch (config?.engineModel) {
            case 'economy':
                engine = EconomyEngine;
                break;
            case 'sports':
                engine = SportsEngine;
                break;
            case 'standard':
            default:
                engine = StandardEngine;
                break;
        }
<<<<<<< HEAD
        let weapon: (new (scene: BaseScene) => Weapon);
=======
        let weapon: new (scene: BaseScene) => Weapon;
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        switch (config?.weaponModel) {
            case 'cannon':
                weapon = Cannon;
                break;
            case 'plasma':
                weapon = PlasmaGun;
                break;
            case 'machinegun':
            default:
                weapon = MachineGun;
                break;
        }
        const ship = new ServerShip(this, {
            location: loc,
            name: data.name,
            weaponsKey: config?.weaponsKey ?? Phaser.Math.RND.between(1, 3),
            wingsKey: config?.wingsKey ?? Phaser.Math.RND.between(1, 3),
            cockpitKey: config?.cockpitKey ?? Phaser.Math.RND.between(1, 3),
            engineKey: config?.engineKey ?? Phaser.Math.RND.between(1, 3),
            engine: engine,
<<<<<<< HEAD
            weapon: weapon
        });
        this.physics.add.collider(ship, this.getLevel().wallsLayer, () => {
            const factor = SpaceSim.Constants.Ships.WALL_BOUNCE_FACTOR;
            ship.body.velocity.multiply({x: factor, y: factor});
=======
            weapon: weapon,
        });
        this.physics.add.collider(ship, this.getLevel().wallsLayer, () => {
            const factor = SpaceSim.Constants.Ships.WALL_BOUNCE_FACTOR;
            ship.body.velocity.multiply({ x: factor, y: factor });
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        });
        this._addPlayerCollisionPhysicsWithPlayers(ship);
        this._addPlayerCollisionPhysicsWithSupplies(ship);
        Logging.log('info', 'adding ship', ship.currentState);
        if (this._ships.add(ship)) {
            SpaceSim.stats.start(ship.currentState);

<<<<<<< HEAD
            Logging.log('debug', 'updating user', data, 'record to include shipId:', ship.id);
=======
            Logging.log(
                'debug',
                'updating user',
                data,
                'record to include shipId:',
                ship.id
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            SpaceSimServer.users.update({ shipId: ship.id }, data);

            this._updateBotEnemyIds();

            return ship;
        }
<<<<<<< HEAD
        Logging.log('error', 'unable to add ship to existing list of ships', ship.currentState);
=======
        Logging.log(
            'error',
            'unable to add ship to existing list of ships',
            ship.currentState
        );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        return null;
    }

    createBot(): void {
        const botData: SpaceSim.UserData = {
<<<<<<< HEAD
            fingerprint: Phaser.Math.RND.uuid()
        };
        let index = 1;
        const botNames = Array.from(this._bots.values()).map(ai => ai.ship.name);
        let name = `bot-${index}`;
        while (SpaceSimServer.users.size({ name: name }) > 0 || botNames.includes(name)) {
=======
            fingerprint: Phaser.Math.RND.uuid(),
        };
        let index = 1;
        const botNames = Array.from(this._bots.values()).map(
            (ai) => ai.ship.name
        );
        let name = `bot-${index}`;
        while (
            SpaceSimServer.users.size({ name: name }) > 0 ||
            botNames.includes(name)
        ) {
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            index++;
            name = `bot-${index}`;
        }
        botData.name = `bot-${index}`;
        const bot = this.createShip(botData);
        if (bot) {
            const botController = new AiController(this, bot);
            this._bots.set(bot.id, botController);
            this._updateBotEnemyIds(botController);
        }
    }

    addPlayerToScene(player: SpaceSimServer.UserData): void {
        const user = SpaceSimServer.users.select(player).first;
        if (user) {
<<<<<<< HEAD
            Logging.log('info', 'adding player:', user, 'to scene:', this.ROOM_NAME);
=======
            Logging.log(
                'info',
                'adding player:',
                user,
                'to scene:',
                this.ROOM_NAME
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            user.room = this.ROOM_NAME;
            SpaceSimServer.io.joinRoom(user.socketId, this.ROOM_NAME);
            SpaceSimServer.users.update(user);
            SpaceSimServer.io.sendJoinRoomResponse(user.socketId);
        }
    }

    removePlayerFromScene(player: SpaceSimServer.UserData): void {
        const user = SpaceSimServer.users.select(player).first;
        if (user) {
<<<<<<< HEAD
            Logging.log('info', 'removing player:', user, 'from scene:', this.ROOM_NAME);
=======
            Logging.log(
                'info',
                'removing player:',
                user,
                'from scene:',
                this.ROOM_NAME
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            const id = user.shipId;
            if (id) {
                const ship = this.getShip(id);
                TryCatch.run(() => ship.destroy());
            }
            user.room = null;
            user.shipId = null;
            SpaceSimServer.users.update(user);
            SpaceSimServer.io.leaveRoom(user.socketId, this.ROOM_NAME);
        }
    }

    private _setupSceneEventHandling(): void {
        // setup listeners for scene events
<<<<<<< HEAD
        this.events.on(SpaceSim.Constants.Events.SHIP_DEATH, (state: ShipState) => {
            Logging.log('debug', `received '${SpaceSim.Constants.Events.SHIP_DEATH}' event in scene`);
            this._removeShip(state);
        }).on(SpaceSim.Constants.Events.WEAPON_FIRING, (id: string, firing: boolean) => {
            this.getShip(id)?.weapon?.setEnabled(firing);
            SpaceSimServer.io.sendWeaponFiringEventToRoom(this.ROOM_NAME, id, firing);
        }).on(SpaceSim.Constants.Events.ENGINE_ON, (id: string, enabled: boolean) => {
            this.getShip(id)?.engine?.setEnabled(enabled);
            SpaceSimServer.io.sendEngineOnEventToRoom(this.ROOM_NAME, id, enabled);
        });
=======
        this.events
            .on(SpaceSim.Constants.Events.SHIP_DEATH, (state: ShipState) => {
                Logging.log(
                    'debug',
                    `received '${SpaceSim.Constants.Events.SHIP_DEATH}' event in scene`
                );
                this._removeShip(state);
            })
            .on(
                SpaceSim.Constants.Events.WEAPON_FIRING,
                (id: string, firing: boolean) => {
                    this.getShip(id)?.weapon?.setEnabled(firing);
                    SpaceSimServer.io.sendWeaponFiringEventToRoom(
                        this.ROOM_NAME,
                        id,
                        firing
                    );
                }
            )
            .on(
                SpaceSim.Constants.Events.ENGINE_ON,
                (id: string, enabled: boolean) => {
                    this.getShip(id)?.engine?.setEnabled(enabled);
                    SpaceSimServer.io.sendEngineOnEventToRoom(
                        this.ROOM_NAME,
                        id,
                        enabled
                    );
                }
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
    }

    private _createGameLevel(): void {
        Logging.log('debug', `creating GameLevel in room ${this.ROOM_NAME}`);
<<<<<<< HEAD
        const map = new GameLevel(this, SpaceSimServer.Constants.Map.MAP_OPTIONS);
=======
        const map = new GameLevel(
            this,
            SpaceSimServer.Constants.Map.MAP_OPTIONS
        );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        this._gameLevel = map;
    }

    private _removeShip(state: ShipState): void {
<<<<<<< HEAD
        Logging.log('debug', `emitting player death event to room '${this.ROOM_NAME}' for ship '${state.id}' with name: '${state.name}'...`);
        SpaceSimServer.io.sendShipDestroyedEventToRoom(this.ROOM_NAME, state.id);

        if (this._ships.size({id: state.id}) > 0) {
            // remove association of ship to user
            const user = SpaceSimServer.users.select({ shipId: state.id }).first;
=======
        Logging.log(
            'debug',
            `emitting player death event to room '${this.ROOM_NAME}' for ship '${state.id}' with name: '${state.name}'...`
        );
        SpaceSimServer.io.sendShipDestroyedEventToRoom(
            this.ROOM_NAME,
            state.id
        );

        if (this._ships.size({ id: state.id }) > 0) {
            // remove association of ship to user
            const user = SpaceSimServer.users.select({
                shipId: state.id,
            }).first;
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            if (user) {
                this.removePlayerFromScene(user);
            }
            if (this._bots.has(state.id)) {
                this._bots.delete(state.id);
            }
            // prevent further updates to ship
            const ship = this.getShip<ServerShip>(state.id);
<<<<<<< HEAD
            this._ships.delete({id: state.id});

            this._expelSupplies(state);

            Logging.log('debug', `calling ship.destroy() for ship: ${state.id}, with name: ${state.name}`);
            ship?.destroy();
        } else {
            Logging.log('warn', `[_removeShip] no ship with id '${state.id}' was found.`);
        }
    }

    private _isMapLocationOccupied(location: Phaser.Types.Math.Vector2Like, radius: number): boolean {
        const circleA = new Phaser.Geom.Circle(location.x, location.y, radius);

        // ensure within walls of room
        const tiles: Array<Phaser.Tilemaps.Tile> = this.getLevel().wallsLayer
            .getTilesWithinShape(circleA)?.filter(t => t.collides);
        if (tiles?.length > 0) {
            Logging.log('debug', `location collides with map tiles: `, location);
=======
            this._ships.delete({ id: state.id });

            this._expelSupplies(state);

            Logging.log(
                'debug',
                `calling ship.destroy() for ship: ${state.id}, with name: ${state.name}`
            );
            ship?.destroy();
        } else {
            Logging.log(
                'warn',
                `[_removeShip] no ship with id '${state.id}' was found.`
            );
        }
    }

    private _isMapLocationOccupied(
        location: Phaser.Types.Math.Vector2Like,
        radius: number
    ): boolean {
        const circleA = new Phaser.Geom.Circle(location.x, location.y, radius);

        // ensure within walls of room
        const tiles: Array<Phaser.Tilemaps.Tile> = this.getLevel()
            .wallsLayer.getTilesWithinShape(circleA)
            ?.filter((t) => t.collides);
        if (tiles?.length > 0) {
            Logging.log(
                'debug',
                `location collides with map tiles: `,
                location
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            return true;
        }

        // ensure space not occupied by other player(s)
        const allShips = this.getShips();
        for (var i = 0; i < allShips.length; i++) {
            const p = allShips[i];
            const loc = p.location;
            const circleB = new Phaser.Geom.Circle(loc.x, loc.y, p.width / 2);
<<<<<<< HEAD
            const occupied = Phaser.Geom.Intersects.CircleToCircle(circleA, circleB);
            if (occupied) {
                Logging.log('debug', `location collides with existing player: `, location);
=======
            const occupied = Phaser.Geom.Intersects.CircleToCircle(
                circleA,
                circleB
            );
            if (occupied) {
                Logging.log(
                    'debug',
                    `location collides with existing player: `,
                    location
                );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
                return true;
            }
        }
        return false;
    }

    private _expelSupplies(shipState: ShipState): void {
        Logging.log('debug', `expelling supplies at:`, shipState.location);
        const supplyOpts = this._exploder.emitSupplies(shipState);
        const supplies = this._addSupplyCollisionPhysics(...supplyOpts);
        for (let supply of supplies) {
            this._supplies.add(supply);
        }
<<<<<<< HEAD
        Logging.log('debug', supplyOpts.length, 'supplies expelled from ship', shipState.id);
    }

    private _addSupplyCollisionPhysics(...options: Array<ShipSupplyOptions>): Array<ShipSupply> {
=======
        Logging.log(
            'debug',
            supplyOpts.length,
            'supplies expelled from ship',
            shipState.id
        );
    }

    private _addSupplyCollisionPhysics(
        ...options: Array<ShipSupplyOptions>
    ): Array<ShipSupply> {
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        const supplies = new Array<ShipSupply>();
        for (let opts of options) {
            let supply: ShipSupply;
            switch (opts.supplyType) {
                case 'ammo':
                    supply = new AmmoSupply(this, opts);
                    break;
                case 'coolant':
                    supply = new CoolantSupply(this, opts);
                    break;
                case 'fuel':
                    supply = new FuelSupply(this, opts);
                    break;
                case 'repairs':
                    supply = new RepairsSupply(this, opts);
                    break;
                default:
<<<<<<< HEAD
                    Logging.log('warn', 'unknown supplyType sent to _addSupplyCollisionPhysicsWithPlayers:', opts.supplyType);
                    break;
            }
            this.physics.add.collider(supply, this.getLevel().wallsLayer, () => {
                const factor = SpaceSim.Constants.Ships.Supplies.WALL_BOUNCE_FACTOR;
                supply.body.velocity.multiply({x: factor, y: factor});
            });
            const activeShips = this.getShips().filter(p => p?.active);
=======
                    Logging.log(
                        'warn',
                        'unknown supplyType sent to _addSupplyCollisionPhysicsWithPlayers:',
                        opts.supplyType
                    );
                    break;
            }
            this.physics.add.collider(
                supply,
                this.getLevel().wallsLayer,
                () => {
                    const factor =
                        SpaceSim.Constants.Ships.Supplies.WALL_BOUNCE_FACTOR;
                    supply.body.velocity.multiply({ x: factor, y: factor });
                }
            );
            const activeShips = this.getShips().filter((p) => p?.active);
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            for (let activeShip of activeShips) {
                this.physics.add.collider(supply, activeShip, () => {
                    supply.apply(activeShip);
                    this._processRemoveSupplyQueue(supply.id);
<<<<<<< HEAD
                }
                );
=======
                });
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            }
            supplies.push(supply);
        }

        return supplies;
    }

    private _addPlayerCollisionPhysicsWithSupplies(ship: Ship): void {
<<<<<<< HEAD
        this.physics.add.collider(ship, this.getSupplies().filter(p => p?.active),
=======
        this.physics.add.collider(
            ship,
            this.getSupplies().filter((p) => p?.active),
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
            (shipGameObj, supplyGameObj) => {
                const s: ShipSupply = supplyGameObj as ShipSupply;
                SpaceSimServer.io.sendRemoveSuppliesEvent(s.id);
                this._supplies.delete(s.id);
                s.apply(ship);
                s.destroy();
            }
        );
    }

    private _addPlayerCollisionPhysicsWithPlayers(ship: Ship): void {
        this.physics.add.collider(ship, this.getShips());
    }

    private _processRemoveShipQueue(...shipIds: Array<string>): void {
<<<<<<< HEAD
        const removeShipIds = (shipIds?.length && shipIds[0]) 
            ? shipIds 
            : this._ships.select({destroyAtTime: lessThan(Date.now())}).map(s => s.id);
=======
        const removeShipIds =
            shipIds?.length && shipIds[0]
                ? shipIds
                : this._ships
                      .select({ destroyAtTime: lessThan(Date.now()) })
                      .map((s) => s.id);
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        for (let id of removeShipIds) {
            let ship = this.getShip(id);
            if (ship) {
                TryCatch.run(() => this._removeShip(ship.currentState));
            }
        }
    }

    private _processRemoveSupplyQueue(...supplyIds: Array<string>): void {
<<<<<<< HEAD
        const removeSupplies = (supplyIds?.length && supplyIds[0]) 
            ? supplyIds 
            : this._supplies._get({createdAt: lessThan(Date.now() - 30000)}).map(s => s.id);
=======
        const removeSupplies =
            supplyIds?.length && supplyIds[0]
                ? supplyIds
                : this._supplies
                      ._get({ createdAt: lessThan(Date.now() - 30000) })
                      .map((s) => s.id);
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        for (let id of removeSupplies) {
            let supply = this.getSupply(id);
            if (supply) {
                Logging.log('debug', 'removing supply', supply.id);
<<<<<<< HEAD
                this._supplies.delete({id});
=======
                this._supplies.delete({ id });
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
                supply.destroy();
                const index = this._flickering.indexOf(id);
                if (index >= 0) {
                    this._flickering.splice(index, 1);
                }
            }
        }
        if (removeSupplies.length) {
<<<<<<< HEAD
            SpaceSimServer.io.sendRemoveSuppliesEvent(this.ROOM_NAME, ...removeSupplies);
=======
            SpaceSimServer.io.sendRemoveSuppliesEvent(
                this.ROOM_NAME,
                ...removeSupplies
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        }
    }

    /**
     * NOTE: this is a client only event as the server doesn't flicker supplies
     */
    private _processFlickerSupplyQueue(): void {
<<<<<<< HEAD
        const flickerSupplies = this._supplies._get({createdAt: lessThan(Date.now() - 25000)})
            .map(s => s.id)
            .filter(id => id != null && !this._flickering.includes(id));
        if (flickerSupplies.length) {
            this._flickering.push(...flickerSupplies);
            SpaceSimServer.io.sendFlickerSuppliesEvent(this.ROOM_NAME, ...flickerSupplies);
=======
        const flickerSupplies = this._supplies
            ._get({ createdAt: lessThan(Date.now() - 25000) })
            .map((s) => s.id)
            .filter((id) => id != null && !this._flickering.includes(id));
        if (flickerSupplies.length) {
            this._flickering.push(...flickerSupplies);
            SpaceSimServer.io.sendFlickerSuppliesEvent(
                this.ROOM_NAME,
                ...flickerSupplies
            );
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        }
    }

    private _updateBotEnemyIds(...bots: Array<AiController>): void {
<<<<<<< HEAD
        const AIs = (bots.length > 0) ? bots : Array.from(this._bots.values());
        const botIds = Array.from(this._bots.keys());
        const allShipIds = this.getShips().map(s => s.id);
        const notBots = allShipIds.filter(id => !botIds.includes(id));
=======
        const AIs = bots.length > 0 ? bots : Array.from(this._bots.values());
        const botIds = Array.from(this._bots.keys());
        const allShipIds = this.getShips().map((s) => s.id);
        const notBots = allShipIds.filter((id) => !botIds.includes(id));
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
        for (let ai of AIs) {
            ai.setEnemyIds(...notBots);
        }
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
