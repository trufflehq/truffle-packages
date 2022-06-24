export { loadNodeStreamModule };
export { nodeStreamModuleIsAvailable };
async function loadNodeStreamModule() {
    const streamModule = await loadStreamModule();
    const { Readable, Writable } = streamModule;
    return { Readable, Writable };
}
async function nodeStreamModuleIsAvailable() {
    try {
        await loadStreamModule();
        return true;
    }
    catch (err) {
        return false;
    }
}
function loadStreamModule() {
    return loadModule('stream');
}
function loadModule(id) {
    return import(/*webpackIgnore: true*/ id);
}
