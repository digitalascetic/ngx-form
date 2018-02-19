export default {
    input: 'tmp/esm5/ngx-form.js',
    output: {
        file: 'dist/esm5/ngx-form.js',
        format: 'es'
    },
    external: ['@angular/core', '@angular/forms', '@digitalascetic/ngx-reflection', 'reflect-metadata']
}
