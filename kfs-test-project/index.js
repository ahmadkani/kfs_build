// ✅ FIXED test-build.js
import { KFS } from "js-kfs";
import fs from 'fs/promises';
import path from 'path';
import { Buffer } from 'buffer';

// ✅ Ensure Buffer is globally available (for bundled code)
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

// ✅ More complete navigator polyfill
if (typeof globalThis.navigator === 'undefined') {
  globalThis.navigator = { 
    userAgent: `Node.js/${process.version}`, 
    platform: process.platform,
    language: 'en-US',
    languages: ['en-US', 'en'],
  };
}

async function run() {
  console.log('--- KFS Node.js Test ---');
  console.log(`Node.js ${process.version}`);
  console.log(`CWD: ${process.cwd()}`);

  const basePath = path.join(process.cwd(), 'local_repo');
  const fsName = 'my-project';
  
  // ✅ Clean up with error handling
  try {
    await fs.rm(basePath, { recursive: true, force: true });
  } catch (e) {
    // Ignore if doesn't exist
  }

  // ✅ Ensure base directory exists
  await fs.mkdir(basePath, { recursive: true });

  const kfs = new KFS();

  try {
    console.log('Mounting filesystem...');

    await kfs.mount(basePath, 'node', fsName, 'git', {
      fetchInfo: { 
        url: '', 
        name: 'TestUser', 
        email: 'test@test.com' 
      },
      versioning: { strategy: 'immediate' }
    });

    console.log('✅ Mounted successfully!');

    // Write a file
    const filePath = path.join(basePath, fsName, 'hello.txt');
    console.log(`Writing to: ${filePath}`);
    
    await kfs.create(filePath, 'file', 'Hello Real Disk!');
    console.log('✅ File written.');
    
    // Read it back
    const content = await kfs.read(filePath);
    console.log(`✅ Read back: "${content}"`);

    // List files
    const files = await kfs.read(path.join(basePath, fsName));
    console.log('✅ Files:', files);

    // Cleanup
    await kfs.unmount(basePath, fsName);
    console.log('✅ Unmounted.');

  } catch (e) {
    console.error('❌ Error:', e.message || e);
    console.error(e.stack);
  }
}

run().catch(console.error);