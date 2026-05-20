import { KFS } from './kfs/kfs.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

// 1. Mock Browser Globals for Node.js
if (typeof globalThis.navigator === 'undefined') {
    globalThis.navigator = {
        userAgent: 'Node.js',
        platform: process.platform,
        language: 'en-US'
    };
}

// Helper to clean directories
async function cleanDir(dirPath) {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
    } catch (e) {
        // Ignore if doesn't exist
    }
}

const testResults = [];

async function runTest() {
    console.log('--- Starting Node.js KFS Test Suite ---\n');

    // Calculate paths we will use
    const memoryMountPath = '/memory-test-repo';
    const nodeMountPath = path.join(os.tmpdir(), 'kfs_explicit_node_test');
    
    // Calculate the internal temp path used by 'memory' mode so we can clean it
    const memoryInternalPath = path.join(os.tmpdir(), 'kfs_node_temp', memoryMountPath.replace(/\//g, '_') + '_testFs');

    // --- Test 1: Memory Mode ---
    await cleanDir(memoryInternalPath);
    await runScenario('Memory Mode (Temp Disk Backed)', 'memory', memoryMountPath);

    // --- Test 2: Explicit Node Mode ---
    await cleanDir(nodeMountPath);
    await runScenario('Node Mode (Explicit Disk Path)', 'node', nodeMountPath);

    // --- Print Summary ---
    printSummary();
}

async function runScenario(scenarioName, fsType, mountBasePath) {
    console.log(`\n[Scenario] ${scenarioName}`);
    const kfs = new KFS();

    // Wait for KFS internal async init
    await new Promise(resolve => setTimeout(resolve, 100));

    const mountPath = mountBasePath;
    const fsName = 'testFs';
    let success = false;
    let errorMsg = '';

    try {
        console.log(`[Test] Mounting filesystem at ${mountPath} (type: ${fsType})...`);
        
        await kfs.mount(mountPath, fsType, fsName, 'git', {
            fetchInfo: {
                url: '', // Empty URL = local repo
                name: 'Node Tester',
                email: 'test@node.com'
            },
            versioning: { strategy: 'immediate' }
        });
        console.log('[Test] ✅ Mount successful.');

        const filePath = `${mountPath}/${fsName}/hello.txt`;
        const content = `Hello from ${scenarioName}!`;
        
        // Create
        console.log(`[Test] Creating file: ${filePath}...`);
        await kfs.create(filePath, 'file', content, 'w');
        console.log('[Test] ✅ File created.');

        // Read
        const readContent = await kfs.read(filePath);
        if (readContent !== content) {
            throw new Error(`Content mismatch! Expected "${content}", got "${readContent}"`);
        }
        console.log(`[Test] ✅ File read verified: "${readContent}"`);

        // Update (Append)
        const appendContent = " Appended data.";
        await kfs.create(filePath, 'file', appendContent, 'a');
        const updatedContent = await kfs.read(filePath);
        if (updatedContent !== content + appendContent) {
             throw new Error(`Append mismatch!`);
        }
        console.log('[Test] ✅ Append operation verified.');

        // Unmount
        await kfs.unmount(mountPath, fsName);
        console.log('[Test] ✅ Unmounted successfully.\n');
        
        success = true;

    } catch (error) {
        console.error(`[Test] ❌ ${scenarioName} Failed:`, error.message || error);
        errorMsg = error.message;
        // Attempt cleanup
        try { await kfs.unmount(mountPath, fsName); } catch (e) { /* ignore */ }
    }
    
    testResults.push({ scenarioName, success, errorMsg });
    if (!success) process.exitCode = 1;
}

function printSummary() {
    console.log('\n==========================================');
    console.log('           TEST SUMMARY REPORT            ');
    console.log('==========================================');
    
    let passed = 0;
    let failed = 0;

    testResults.forEach((r, i) => {
        const status = r.success ? '✅ PASS' : '❌ FAIL';
        console.log(`${i + 1}. ${r.scenarioName}: ${status}`);
        if (!r.success) {
            console.log(`   Error: ${r.errorMsg}`);
            failed++;
        } else {
            passed++;
        }
    });

    console.log('------------------------------------------');
    console.log(`Total: ${testResults.length} | Passed: ${passed} | Failed: ${failed}`);
    console.log('==========================================');
    
    if (failed > 0) {
        console.log('\n❌ Some tests failed.');
    } else {
        console.log('\n✅ All tests passed successfully.');
    }
}

// Run the test
runTest();