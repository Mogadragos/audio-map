const connectionString =
    "HostName=AudioReaders.azure-devices.net;DeviceId=Capteur_1;SharedAccessKey=S6oUQS+VlDFL1/dj0zWrW8F+gQOtG+JRDL7VzzJ9C/0=";

// use factory function from AMQP-specific package
const clientFromConnectionString =
    require("azure-iot-device-amqp").clientFromConnectionString;

// AMQP-specific factory function returns Client object from core package
const client = clientFromConnectionString(connectionString);

const connectCallback = function (err) {
    if (err) {
        console.error("Could not connect: " + err);
    } else {
        console.log("Client connected");

        client.getTwin(function (err, twin) {
            if (err) {
                console.error("could not get twin");
            } else {
                const patch = {
                    position: {
                        latitude: 0.0,
                        longitude: 0.0,
                    },
                    decibels: 0.0,
                };

                twin.properties.reported.update(patch, function (err) {
                    if (err) {
                        console.error("could not update twin");
                    } else {
                        console.log("twin state reported");
                        process.exit();
                    }
                });
            }
        });
    }
};

client.open(connectCallback);

/**
 * "position": { "latitude": 0.0, "longitude": 0 }, "decibels": 0,
 */
