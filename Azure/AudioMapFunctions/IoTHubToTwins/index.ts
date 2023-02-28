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

        // TODO

        // var resultSet = await poolConnection.request()
        //     .query(`INSERT INTO table (nom_colonne_1, nom_colonne_2, ...
        //         VALUES ('valeur 1', 'valeur 2', ...)`);
    } catch (e) {
        context.log(e);
    }
};

export default eventGridTrigger;
