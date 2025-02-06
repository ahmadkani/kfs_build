class MockFileSystem {
    constructor() {}

    // List files/folders in a directory
    list(directory, callback) {
        const dirEntry = getFileSystemEntry(directory);
        if (!dirEntry || dirEntry.type !== "directory") {
            callback([]);
            return;
        }

        const items = Object.keys(dirEntry.children).map(name => {
            const entry = dirEntry.children[name];
            return {
                filename: name,
                is_dir: entry.type === "directory",
                filesize: entry.type === "file" ? entry.content.length : 0
            };
        });

        callback(items);
    }

    // Read a file's content
    read(filePath, callback) {
        const fileEntry = getFileSystemEntry(filePath);
        if (fileEntry && fileEntry.type === "file") {
            callback(fileEntry.content);
        } else {
            callback(null);
        }
    }

    // Write/update a file
    write(filePath, content, callback) {
        const parts = filePath.split("/").filter(p => p !== "");
        const fileName = parts.pop();
        const parentDir = getFileSystemEntry("/" + parts.join("/"));

        if (parentDir && parentDir.type === "directory") {
            parentDir.children[fileName] = { type: "file", content };
            callback(true);
        } else {
            callback(false);
        }
    }

    // Delete a file
    remove(filePath, callback) {
        const parts = filePath.split("/").filter(p => p !== "");
        const fileName = parts.pop();
        const parentDir = getFileSystemEntry("/" + parts.join("/"));

        if (parentDir && parentDir.children[fileName]) {
            delete parentDir.children[fileName];
            callback(true);
        } else {
            callback(false);
        }
    }

    // Create a directory
    createDirectory(dirPath, callback) {
        const parts = dirPath.split("/").filter(p => p !== "");
        const dirName = parts.pop();
        const parentDir = getFileSystemEntry("/" + parts.join("/"));

        if (parentDir && parentDir.type === "directory") {
            parentDir.children[dirName] = { type: "directory", children: {} };
            callback(true);
        } else {
            callback(false);
        }
    }
}

// Initialize js-fileexplorer with our mock file system
document.addEventListener("DOMContentLoaded", () => {
    console.log("File Explorer script loaded!");

    const element = document.getElementById("fileexplorer");
    if (!element) {
        console.error("Element with id 'fileexplorer' not found!");
        return;
    }

    console.log("Explorer Element:", element);
    console.log("Is element a valid DOM node?", element instanceof Node);

    const options = {
        element: element,
        backend: new MockFileSystem()
    };

    console.log("Options object:", options);

    // Initialize js-fileexplorer with our mock file system
    try {
        const explorer = new FileExplorer(options);
        console.log("Initializing FileExplorer...");
    } catch (error) {
        console.error("Error initializing FileExplorer:", error);
    }
});