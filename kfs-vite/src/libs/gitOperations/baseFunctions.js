
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
                console.error('Error resolving ref:', error);
                throw error;
                
            }
        },
        
        async readCommit(fs, dir, head) {
            try {
                return await git.readCommit({
                    fs, 
                    dir, 
                    oid: head 
                    });
            } catch (error) {
                console.error('Error reading commit:', error);
                throw error;
                
            }
        },

    };

