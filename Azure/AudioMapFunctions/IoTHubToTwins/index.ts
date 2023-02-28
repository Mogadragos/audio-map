import { AzureFunction, Context } from "@azure/functions";
import { DeviceTelemetryEvent, EventGridEvent } from "@azure/eventgrid";

import * as sql from "mssql";

const eventGridTrigger: AzureFunction = async function (
    context: Context,
    eventGridEvent: EventGridEvent<DeviceTelemetryEvent>
): Promise<void> {
    try {
        // Get data from body
        const body = JSON.parse(
            Buffer.from(eventGridEvent.data.body, "base64").toString("utf8")
        );

        // Connect to DB
        const poolConnection = await sql.connect({
            user: process.env.DB_USER, // better stored in an app setting such as process.env.DB_USER
            password: process.env.DB_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
            server: process.env.DB_SERVER, // better stored in an app setting such as process.env.DB_SERVER
            port: Number(process.env.DB_PORT), // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
            database: process.env.DB_NAME, // better stored in an app setting such as process.env.DB_NAME
            authentication: {
                type: "default",
                options: {},
            },
            options: {
                encrypt: true,
            },
        });

        // Prepare data to insert to DB (TODO : Add security, ensure types...)

        const row = {
            device: body.device,
            latitude: body.position.latitude,
            longitude: body.position.longitude,
            decibels: body.position.decibels,
            report_date: new Date().toISOString(),
        };

        // Insert DATA into DB

        const table = new sql.Table("audiomap");
        table.create = true; // Try to create table if necessary
        table.columns.add("id", sql.Int, { nullable: true, primary: true });
        table.columns.add("device", sql.VarChar(50), { nullable: false });
        table.columns.add("latitude", sql.VarChar(50), { nullable: false });
        table.columns.add("longitude", sql.VarChar(50), { nullable: false });
        table.columns.add("decibels", sql.VarChar(50), { nullable: false });
        table.columns.add("report_date", sql.DateTime, { nullable: false });

        table.rows.add(
            null,
            row.device,
            row.latitude,
            row.longitude,
            row.decibels,
            row.report_date
        );

        const request = new sql.Request();
        request.bulk(table, (err, result) => {
            if (err) {
                context.log(err);
            }
        });
    } catch (e) {
        context.log(e);
    }
};

export default eventGridTrigger;
