class Monitoring {
    constructor() {
        this.systemMetrics = new Map();
        this.alertThresholds = new Map();
    }

    monitorSystem() {
        console.log("Monitoring system...");
        // Simulate system metrics
        this.systemMetrics.set('CPU Usage', '45%');
        this.systemMetrics.set('Memory Usage', '70%');
    }

    generateAlert(metric) {
        if (this.alertThresholds.has(metric)) {
            console.log(`Alert: ${metric} exceeded threshold!`);
        }
    }

    setThreshold(metric, value) {
        this.alertThresholds.set(metric, value);
        console.log(`Threshold for ${metric} set to ${value}`);
    }
}

module.exports = Monitoring;
