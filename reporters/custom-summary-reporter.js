const fs = require('fs');
const path = require('path');

/**
 * Enhanced Custom Playwright Reporter
 * - Collects test steps
 * - Links traces and screenshots
 * - Maintains execution history
 */
class CustomSummaryReporter {
  constructor() {
    this.results = [];
    this.reportDir = path.join(process.cwd(), 'custom-report');
    this.historyFile = path.join(this.reportDir, 'history.json');
    this.dataFile = path.join(this.reportDir, 'data.json');
    this.artifactsDir = path.join(this.reportDir, 'artifacts');
    
    if (!fs.existsSync(this.reportDir)) fs.mkdirSync(this.reportDir, { recursive: true });
    if (!fs.existsSync(this.artifactsDir)) fs.mkdirSync(this.artifactsDir, { recursive: true });
  }

  onTestEnd(test, result) {
    const pathParts = test.titlePath();
    const module = pathParts.length > 2 ? pathParts[2] : pathParts[1] || "Default";
    const summary = test.title;
    
    let status = result.status.charAt(0).toUpperCase() + result.status.slice(1);
    const observation = result.annotations.find(a => a.type === 'observation');
    const description = result.annotations.find(a => a.type === 'description');
    
    if (result.status === 'passed' && observation) {
      status = "Passed with Observation";
    }

    // Collect steps
    const steps = result.steps.map(s => ({
      title: s.title,
      status: s.error ? 'failed' : 'passed',
      duration: s.duration
    }));

    // Find artifacts (trace, screenshot)
    const artifacts = {
      screenshot: null,
      trace: null
    };

    result.attachments.forEach(attachment => {
      if (attachment.name === 'screenshot') {
        const destName = `screenshot_${Date.now()}_${path.basename(attachment.path)}`;
        const destPath = path.join(this.artifactsDir, destName);
        fs.copyFileSync(attachment.path, destPath);
        artifacts.screenshot = `artifacts/${destName}`;
      } else if (attachment.name === 'trace') {
        const destName = `trace_${Date.now()}_${path.basename(attachment.path)}`;
        const destPath = path.join(this.artifactsDir, destName);
        fs.copyFileSync(attachment.path, destPath);
        artifacts.trace = `artifacts/${destName}`;
      }
    });

    const testResult = {
      id: test.id,
      module,
      summary,
      status,
      description: description ? description.description : null,
      remark: observation ? observation.description : null,
      duration: result.duration,
      startTime: result.startTime,
      steps,
      artifacts
    };

    this.results.push(testResult);

    console.log(`\nMODULE    : ${module}`);
    console.log(`SUMMARY   : ${summary}`);
    console.log(`TC STATUS : ${status}`);
    console.log("-".repeat(40));
  }

  onEnd() {
    const currentRun = {
      timestamp: new Date().toISOString(),
      tests: this.results,
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status.includes('Passed')).length,
        failed: this.results.filter(r => r.status === 'Failed').length,
        observations: this.results.filter(r => r.status === 'Passed with Observation').length
      }
    };

    // Update History
    let history = [];
    if (fs.existsSync(this.historyFile)) {
      try {
        history = JSON.parse(fs.readFileSync(this.historyFile, 'utf8'));
      } catch (e) {
        history = [];
      }
    }
    history.push({
      timestamp: currentRun.timestamp,
      passed: currentRun.summary.passed,
      failed: currentRun.summary.failed,
      observations: currentRun.summary.observations,
      total: currentRun.summary.total
    });
    // Keep last 20 runs
    if (history.length > 20) history.shift();
    fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));

    // Save Current Run Data
    fs.writeFileSync(this.dataFile, JSON.stringify({ ...currentRun, history }, null, 2));
    console.log(`\n✅ Enhanced report saved to ${this.reportDir}`);
  }
}

module.exports = CustomSummaryReporter;
