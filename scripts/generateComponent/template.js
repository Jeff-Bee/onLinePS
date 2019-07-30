// template.js
module.exports = {
    componentTemplate: compoentName => {
        return `<template>
    <div class="${compoentName}">
    </div>
</template>
<script>
    export default {
        name: '${compoentName}'
    };
</script>
<style lang="less" scoped>
</style>`
    },
    entryTemplate: compoentName=> `import ${compoentName} from './${compoentName}.vue'
export default ${compoentName}`,
    globalRegisterImportTemplate: compoentName => `import ${compoentName} from './${compoentName}'`,
    globalRegisterExportTemplate: compoentName => `Vue.component(${compoentName}.name, ${compoentName})\n}`
}
