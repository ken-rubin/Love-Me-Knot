module.exports = { apps : [{
    name: 'love-me-knot',
    cwd: '/home/ubuntu/Love-Me-Knot',
    script: 'sudo "$(which node)"',
    args: 'index.js',
    watch: true,
    max_memory_restart: "200M",
    restart_delay: 10000,
}]}
