const mockFS = {
    "/": {
        type: "directory",
        children: {
            "documents": {
                type: "directory",
                children: {
                    "file1.txt": { type: "file", content: "Hello from file1!" },
                    "file2.txt": { type: "file", content: "This is file2!" }
                }
            },
            "images": { type: "directory", children: {} },
            "notes.txt": { type: "file", content: "This is a note file." }
        }
    }
};

// Utility function to navigate the mock FS
function getFileSystemEntry(path) {
    const parts = path.split("/").filter(p => p !== "");
    let current = mockFS["/"];

    for (const part of parts) {
        if (current.children[part]) {
            current = current.children[part];
        } else {
            return null;
        }
    }
    return current;
}
