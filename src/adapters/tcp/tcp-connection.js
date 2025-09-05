export default function wrapSocket(socket, id) {
    return {
        id,
        remoteAddress: socket.remoteAddress,
        onData(cb) {
            socket.on('data', cb);
        },
        onClose(cb) {
            socket.on('close', cb);
        },
        onError(cb) {
            socket.on('error', cb);
        },
        write(data) {
            try {
                if (typeof data === 'string') socket.write(data);
                else socket.write(data);
            } catch (err) {
            }
        },
        end() {
            try { socket.end(); } catch (e) { }
        },
        pause() {
            try { socket.pause(); } catch (e) { }
        },
        resume() {
            try { socket.resume(); } catch (e) { }
        },
        rawSocket: socket
    };
}
