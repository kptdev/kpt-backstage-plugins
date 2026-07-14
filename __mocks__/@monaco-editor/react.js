const React = require('react');

const Editor = React.forwardRef(() => React.createElement('div', { 'data-testid': 'monaco-editor' }));
const DiffEditor = React.forwardRef(() => React.createElement('div', { 'data-testid': 'monaco-diff-editor' }));
const loader = { config: () => {} };

module.exports = { default: Editor, DiffEditor, loader };
