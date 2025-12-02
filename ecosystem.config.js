module.exports = {
  apps: [
    {
      name: "pizza-web-v3",
      script: "server.js",
      cwd: ".",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      restart_delay: 4000,
      min_uptime: "10s",
      max_restarts: 10,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      kill_timeout: 5000,
      listen_timeout: 3000,
      node_args: "--max-old-space-size=512",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
