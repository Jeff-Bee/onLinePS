// template.js
module.exports = {
    viewTemplate: compoenntName => {
        return `<template>
	<div class="${compoenntName}">
	</div>
</template>
<script>
export default {
	name: '${compoenntName}'
};
</script>
<style lang="less" scoped>
</style>`
    },
    entryTemplate: compoenntName => {
        return `import ${compoenntName} from './${compoenntName}.vue'
                export {
                    ${compoenntName}
                }`
    },
    viewRouterTemplate: compoenntName => `{
        path: '/${compoenntName.toLocaleLowerCase?compoenntName.toLocaleLowerCase():compoenntName}',
        name: '${compoenntName.toLocaleLowerCase?compoenntName.toLocaleLowerCase():compoenntName}',
        component: () => import("@/views/${compoenntName}/${compoenntName}")
    }\n`
}
