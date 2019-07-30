// template.js
module.exports = {
    storeTemplate: compoenntName => {
        return `const ${compoenntName} = {
    state: {
    },
    getters: {
    },
    actions: {
    },
    mutations: {
    }
}
export default {...${compoenntName}}`
    },
    storeRegisterImportTemplate: compoenntName => {
        return `import ${compoenntName} from './modules/${compoenntName}'`;
    },
    storeRegisterExportTemplate: compoenntName => {
        return `${compoenntName}`;
    }
}
