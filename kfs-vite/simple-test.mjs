import { KFS } from './kfs/kfs.js';
import fs from 'fs/promises';
import path from 'path';

// 1. Mock Globals
if (typeof globalThis.navigator === 'undefined') {
    globalThis.navigator = { userAgent: 'Node.js', platform: process.platform };
}

async function run() {
    console.log('--- Simple Node Test ---');

    // Create path: ./local_repo/my-project
    const basePath = path.join(process.cwd(), 'local_repo');
    const fsName = 'my-project';
    const fullPath = path.join(basePath, fsName); // KFS mounts to path/fsName
    
    // Cleanup previous run
    await fs.rm(basePath, { recursive: true, force: true });

    const kfs = new KFS();
    await new Promise(r => setTimeout(r, 100));

    try {
        // Mount using 'node' mode to write to real disk
        // We pass 'basePath' as the mount path, and 'fsName' as the name
        await kfs.mount(basePath, 'node', fsName, 'git', {
            fetchInfo: { url: '', name: 'User', email: 'test@test.com' },
            versioning: { strategy: 'immediate' }
        });

        // Write a file
        const filePath = `${basePath}/${fsName}/hello.txt`;
        console.log(`Writing to: ${filePath}`);
        
        await kfs.create(filePath, 'file', 'Hello Real Disk!');
        
        console.log('✅ File written.');
        
        // Read it back to prove it works
        const content = await kfs.read(filePath);
        console.log(`Read back: "${content}"`);

        console.log('\n⏳ Waiting 10 seconds... Check the "local_repo" folder now!');
        await new Promise(r => setTimeout(r, 10000));

        // Unmount
        await kfs.unmount(basePath, fsName);
        console.log('Unmounted.');
        
    } catch (e) {
        console.error('Error:', e);
    }
}

run();