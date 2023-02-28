import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import * as sql from "mssql";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        context.log("HTTP trigger function processed a request.");

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

        // Parse Query parameters
        // TODO
        const query = req.query;

        // Get Data
        const resultSet = await poolConnection
            .request()
            .query(`SELECT * FROM audiomap`);

        // Send Data
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: resultSet.recordset,
        };
    } catch (e) {
        context.res = {
            status: 500,
            body: "Error while getting the data",
        };
    }
};

export default httpTrigger;
