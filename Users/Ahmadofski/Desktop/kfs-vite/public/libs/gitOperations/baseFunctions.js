
define(['./../isomorphicgit129', './../../configAMD'], function(git, config) {
        
    return {
        async resolveRef(fs, dir, _ref = 'HEAD') {
            return await git.resolveRef({
            fs, 
            dir,
            ref: _ref
            });
        },
        
        async readCommit(fs, dir, head) {
            return await git.readCommit({
            fs, 
            dir, 
            oid: head 
            });
        },

    };
});