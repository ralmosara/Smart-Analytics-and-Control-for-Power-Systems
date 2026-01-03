"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBaseTables1767450226446 = void 0;
class CreateBaseTables1767450226446 {
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "converter_snapshots" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "converter_id" varchar(50) NOT NULL,
                "timestamp" timestamp with time zone NOT NULL,
                "type" varchar(20) NOT NULL,
                "voltage" decimal(10,2) NOT NULL,
                "current_d" decimal(10,2) NOT NULL,
                "current_q" decimal(10,2) NOT NULL,
                "active_power" decimal(10,2) NOT NULL,
                "reactive_power" decimal(10,2) NOT NULL,
                "frequency" decimal(5,2) NOT NULL,
                "thd" decimal(5,2) NOT NULL,
                "temperature" decimal(5,2) NOT NULL,
                "created_at" timestamp with time zone DEFAULT now() NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "bus_snapshots" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "bus_id" varchar(50) NOT NULL,
                "timestamp" timestamp with time zone NOT NULL,
                "voltage_magnitude" decimal(10,4) NOT NULL,
                "voltage_angle" decimal(10,2) NOT NULL,
                "frequency" decimal(5,2) NOT NULL,
                "active_power" decimal(10,2) NOT NULL,
                "reactive_power" decimal(10,2) NOT NULL,
                "created_at" timestamp with time zone DEFAULT now() NOT NULL
            )
        `);
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "res_snapshots" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "unit_id" varchar(50) NOT NULL,
                "timestamp" timestamp with time zone NOT NULL,
                "type" varchar(10) NOT NULL,
                "generation" decimal(10,2) NOT NULL,
                "capacity" decimal(10,2) NOT NULL,
                "utilization_factor" decimal(5,4) NOT NULL,
                "irradiance" decimal(10,2) NULL,
                "wind_speed" decimal(5,2) NULL,
                "temperature" decimal(5,2) NOT NULL,
                "created_at" timestamp with time zone DEFAULT now() NOT NULL
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS "res_snapshots"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "bus_snapshots"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "converter_snapshots"`);
    }
}
exports.CreateBaseTables1767450226446 = CreateBaseTables1767450226446;
//# sourceMappingURL=1767450226446-CreateBaseTables.js.map