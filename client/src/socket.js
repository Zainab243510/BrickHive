import { io } from 'socket.io-client';

// Vercel's serverless runtime can't hold persistent socket connections, so this
// only does anything during local dev. In production we point at the same
// origin and cap retries so a failed handshake doesn't spam the console.
const url = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';

const socket = io(url, {
  autoConnect: false,
  reconnectionAttempts: import.meta.env.PROD ? 0 : Infinity,
});

export default socket;
