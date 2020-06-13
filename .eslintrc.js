module.exports = {
    env: {
        jest: true,
        node: true,
        es6: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020,
    },
    rules: {
        'linebreak-style': 0,
        'no-trailing-spaces': 0,
        'class-methods-use-this': 0,
        indent: ['warn', 4],
    },
};
