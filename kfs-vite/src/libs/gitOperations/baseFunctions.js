import git from 'isomorphic-git'

export default {
    async resolveRef(fs, dir, _ref = 'HEAD') {
        try {
            return await git.resolveRef({
                fs, 
                dir,
                ref: _ref
            });
        } catch (error) {
            if (error.message.includes('Could not find HEAD') || 
                error.message.includes('Could not find refs/heads')) {
                // HEAD doesn't exist yet (new repository)
                console.log('HEAD reference not found, repository may be empty');
                return null;
            }
            console.error('Error resolving ref:', error);
            throw error;
        }
    },
    
    async readCommit(fs, dir, oid) {
        try {
            if (!oid) {
                console.log('No OID provided, cannot read commit');
                return null;
            }
            return await git.readCommit({
                fs, 
                dir, 
                oid: oid
            });
        } catch (error) {
            console.error('Error reading commit:', error);
            throw error;
        }
    },

    // Check if repository is properly initialized
    async isRepoInitialized(fs, dir) {
        try {
            // Check if HEAD file exists by trying to read it
            await fs.readFile(`${dir}/.git/HEAD`);
            
            // Try to resolve HEAD to see if it points to a valid branch
            try {
                await git.resolveRef({ fs, dir, ref: 'HEAD' });
                return true;
            } catch (e) {
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    // Safely get the current commit
    async getCurrentCommit(fs, dir) {
        try {
            const headRef = await this.resolveRef(fs, dir, 'HEAD');
            if (!headRef) return null;
            
            return await this.readCommit(fs, dir, headRef);
        } catch (error) {
            console.log('No current commit found:', error.message);
            return null;
        }
    }
};