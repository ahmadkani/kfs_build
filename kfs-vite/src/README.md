
# Git Filesystem Manager (KFS)

A lightweight JavaScript library to manage a virtual filesystem in the browser using Git and Service Workers.

> Mount, read, write, and remove files, and synchronize changes to a Git repository easily!

## Installation

```bash
npm install kfs
```

or via CDN:

```html
<script type="module" src="https://unpkg.com/kfs/dist/kfs.js"></script>
```

## Features

- Mount and unmount virtual filesystems
    
- Read and write files easily
    
- Remove files
    
- Auto versioning and merging
    
- Service Worker support for offline and sync
    
- Git synchronization (fetch, push)
    

## Usage

### HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Git Filesystem Manager</title>
</head>
<body>
  <input type="text" id="mountPath" placeholder="/repo1" />
  <button onclick="mountFS()">Mount Filesystem</button>

  <input type="text" id="filePath" placeholder="/repo1/file.txt" />
  <button onclick="writeFile()">Write File</button>
  <button onclick="readFile()">Read File</button>
  <button onclick="removeFile()">Remove File</button>

  <div id="output"></div>

  <script type="module">
    import { KFS, serviceWorker } from './dist/kfs.js';

    const kfs = new KFS();

    window.mountFS = async function() {
      const path = document.getElementById('mountPath').value.trim();
      if (!path) return;

      await kfs.mount(path, 'memory', '1', 'git', {
        fetchInfo: {
          url: 'your-repository-url',
          username: 'your-github-PAT',
          password: '',
          name: 'your-name',
          email: 'your-email@example.com',
        },
        useSW: true,
        merging: {
          strategy: 'immediate',
          interval: 60,
        },
        versioning: {
          strategy: 'immediate',
          interval: 10,
          number: 5,
        },
      });

      await kfs.setUserConfigs({
        username: 'your-github-PAT',
        password: '',
        name: 'your-name',
        email: 'your-email@example.com',
      });
    };

    window.writeFile = async function() {
      const filePath = document.getElementById('filePath').value.trim();
      if (!filePath) return;

      await kfs.create(filePath, 'file', 'Hello from KFS!');
    };

    window.readFile = async function() {
      const filePath = document.getElementById('filePath').value.trim();
      if (!filePath) return;

      const content = await kfs.read(filePath);
      document.getElementById('output').textContent = content || 'File not found or empty';
    };

    window.removeFile = async function() {
      const filePath = document.getElementById('filePath').value.trim();
      if (!filePath) return;

      const result = await kfs.remove(filePath);
      document.getElementById('output').textContent = result.success
        ? `Removed ${filePath}`
        : result.message;
    };
  </script>
</body>
</html>
```

### Service Worker Management

```javascript
// Register Service Worker
await serviceWorker.register({
  scope: '/',
  enableSync: true,
});

// Unregister Service Worker
await serviceWorker.unregister();
```

## API

### KFS methods

|Method|Description|
|:--|:--|
|`mount(path, backendType, backendId, mountType, options)`|Mounts a virtual filesystem|
|`unmount(path, backendId)`|Unmounts a filesystem|
|`create(path, type, content)`|Creates a file or directory|
|`read(path)`|Reads the content of a file|
|`remove(path)`|Removes a file or directory|
|`setUserConfigs({username, password, name, email})`|Sets Git credentials for operations|

### Service Worker methods

|Method|Description|
|:--|:--|
|`register(options)`|Registers the Service Worker|
|`unregister()`|Unregisters the Service Worker|

## Options for `mount`

```javascript
{
  fetchInfo: {
    url: 'https://github.com/your/repo.git',
    username: 'your-username',
    password: 'your-password',
    name: 'your-name',
    email: 'your-email@example.com'
  },
  useSW: true, // Whether to use Service Worker
  merging: {
    strategy: 'immediate',
    interval: 60 // seconds
  },
  versioning: {
    strategy: 'immediate',
    interval: 10, // seconds
    number: 5 // number of versions to keep
  }
}
```

## License

MIT

---

Made with ❤️ by Ahmad Kani