const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const { spawn } = require('child_process');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let serverProcess = null;
let serverStatus = 'Offline';

io.on('connection', (socket) => {
    // Kirim status saat ini ke user yang baru konek
    socket.emit('status', serverStatus);

    socket.on('start-server', () => {
        if (serverProcess) return;

        serverStatus = 'Online';
        io.emit('status', serverStatus);
        io.emit('console', '--- Menjalankan Server... ---\n');

        // Ganti 'node' dan ['script-kamu.js'] sesuai dengan server/bot yang ingin kamu jalankan
        // Contoh untuk server Minecraft standalone: spawn('java', ['-Xmx1G', '-jar', 'server.jar', 'nogui'])
        serverProcess = spawn('node', ['-v']); // Contoh sederhana cek versi node

        serverProcess.stdout.on('data', (data) => {
            io.emit('console', data.toString());
        });

        serverProcess.stderr.on('data', (data) => {
            io.emit('console', `ERROR: ${data.toString()}`);
        });

        serverProcess.on('close', (code) => {
            serverStatus = 'Offline';
            io.emit('status', serverStatus);
            io.emit('console', `\n--- Server Berhenti (Exit Code: ${code}) ---\n`);
            serverProcess = null;
        });
    });

    socket.on('stop-server', () => {
        if (serverProcess) {
            io.emit('console', '\n--- Menghentikan Server... ---\n');
            serverProcess.kill();
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Panel berjalan di port ${PORT}`);
});
