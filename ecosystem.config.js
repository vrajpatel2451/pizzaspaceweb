module.exports = {
  apps: [
    {
      name: "pizza-web-v2",
      script: "yarn",
      args: "start",
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
    },
  ],
};
