export default {
    input: 'tmp/esm2015/ngx-form.js',
    output: {
        file: 'dist/esm2015/ngx-form.js',
        format: 'es'
    },
    external: ['@angular/core', '@angular/forms', '@digitalascetic/ngx-reflection', 'reflect-metadata']
}
