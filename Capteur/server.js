const connectionString =
    "HostName=AudioReaders.azure-devices.net;DeviceId=Capteur_1;SharedAccessKey=S6oUQS+VlDFL1/dj0zWrW8F+gQOtG+JRDL7VzzJ9C/0=";

// use factory function from AMQP-specific package
const clientFromConnectionString =
    require("azure-iot-device-amqp").clientFromConnectionString;

// AMQP-specific factory function returns Client object from core package
const client = clientFromConnectionString(connectionString);

// use Message object from core package
const Message = require("azure-iot-device").Message;

const intervalInMinutes = 2;

const sendMessage = () => {
    try {
        var msg = new Message(
            JSON.stringify({
                device: "Device_1",
                position: { latitude: 0.0, longitude: 0.0 },
                decibels: Math.random() * 100,
            })
        );
        client.sendEvent(msg, function (err) {
            if (err) {
                console.log(err.toString());
            } else {
                console.log("Message sent at " + new Date().toISOString());
            }
        });
    } catch (e) {
        console.log(e);
    }
};

const connectCallback = function (err) {
    if (err) {
        console.error("Could not connect: " + err);
    } else {
        console.log(
            "Client connected, send a message every " +
                intervalInMinutes +
                " minutes."
        );

        sendMessage();

        const interval = setInterval(
            sendMessage,
            1000 * 60 * intervalInMinutes
        );

        // client.getTwin(function (err, twin) {
        //     if (err) {
        //         console.error("could not get twin");
        //     } else {
        //         const patch = {
        //             position: {
        //                 latitude: 0.0,
        //                 longitude: 0.0,
        //             },
        //             decibels: 0.0,
        //         };

        //         twin.properties.reported.update(patch, function (err) {
        //             if (err) {
        //                 console.error("could not update twin");
        //             } else {
        //                 console.log("twin state reported");
        //                 process.exit();
        //             }
        //         });
        //     }
        // });
    }
};

client.open(connectCallback);
