export default {
    input: 'tmp/esm5/ngx-form.js',
    output: {
        file: 'dist/bundles/ngx-form.umd.js',
        format: 'umd'
    },
    name: 'ngx-form',
    external: ['@angular/core', '@angular/forms', '@digitalascetic/ngx-reflection', 'reflect-metadata'],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/forms': 'ng.forms',
        '@digitalascetic/ngx-reflection': 'ngxReflection'
    }
}
