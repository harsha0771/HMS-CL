module.exports = (port, refreshPorts) => {
    var app = require('../app');
    var debug = require('debug')('node:server');
    var http = require('http');

    var port = normalizePort(port);
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    var server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        var port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            console.log(error);;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();

        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        // console.log(addr);
        debug('Listening on ' + bind);
    }

    var fs = require('fs');
    if (refreshPorts) {
        fs.mkdir("./tmp", { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating folder:', err);
            } else {
                fs.writeFile("./tmp/ports.txt", `,${port}`, (err) => {
                    if (err) {
                        console.error('Error creating file:', err);
                        return;
                    }
                });
            }
        });
    } else {

        fs.appendFile("./tmp/ports.txt", "," + port, (err) => {
            if (err) {
                console.error('Error creating file:', err);
                return;
            }
        });
    }
}
