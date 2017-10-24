`npm install --save react-dom-markdown-editor`

Mimimal Markdown editor meant to be basic for easy styling and customization

### Demo

https://stevenkaspar.github.io/react-dom-markdown-editor/

### Example

```
import React          from 'react';
import ReactDOM       from 'react-dom';
import marked         from 'marked';
import MarkdownEditor from 'react-dom-markdown-editor';
import 'react-dom-markdown-editor/styles/base.css';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: ''
    };

    this.markdownEditorChange = this.markdownEditorChange.bind(this);
  }

  markdownEditorChange(value){
    this.setState({
      value: value
    });
  }

  static handleFileClick({value, files}, cb){

    let file_string = '';
    for(let file of files){
      file_string += `[${file.file_name}](data:${file.file.type};base64,${file.data})`;
    }

    cb({ new_value: `${value}\n\n${file_string}` });
  }

  static handleH1Click(data, cb){
    cb({ wrap: { start: '# ', end: '' } });
  }
  static handleListClick(data, cb){
    cb({ wrap: { start: '- ', end: '' } });
  }
  static handleTableClick(data, cb){
    cb({ wrap: { start: '|',      end: '|b|\n|---|---|\n|1|2|' } });
  }

  render(){
    return (
      <div>
        <h4>React Markdown Editor</h4>
        <MarkdownEditor
          height={400}
          toolbar={[
            { html: '<span style="background: aliceblue;">- list</span>',    handler: App.handleListClick },
            { label: 'h1',    handler: App.handleH1Click },
            { label: 'table', handler: App.handleTableClick },
            { label: 'file',  handler: App.handleFileClick, is_file: true },
          ]}
          value={this.state.value}
          onChange={this.markdownEditorChange}/>
        <button onClick={() => alert(this.state.value)}>alert input value</button>
        <button onClick={() => alert(marked(this.state.value))}>alert HTML output</button>
      </div>
    );
  }

};
```

### Props

- **height** `PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])`

    `Default`: `'auto'`

    Initial height of the textarea. The textarea and preview window will resize together

- **value** `PropTypes.string`

    `Default`: `''`

    Initial value of the input

- **marked_options** `PropTypes.object`

    `Default`: `{}`

    Options to pass to `marked.setOptions`

    ```
    marked.setOptions(marked_options)
    ```

- **toolbar**

    ```
      PropTypes.arrayOf(PropTypes.shape({
      className: PropTypes.string,
      html:      PropTypes.string,
      label:     PropTypes.string,
      handler:   PropTypes.func.isRequired,
      is_file:   PropTypes.bool
    }))
    ```

    `tool.handler` will be called with 2 arguments `data`, `cb`

    `data`

    ```
    {
      value: '',        //current value,
      selection: {
        value: '',      // selection value,
        start: 0,       // selection start index,
        end:   10       // selection end index
      },
      target: textarea, // HTML DOM Element
      files: []         // if is_file: true
    }
   ```

    `cb`

    cb should be executed to either set a new value or wrap the selection

    To set a new value execute the cb with

    ```
    // set the value to xxx. This is useful for async needs
    cb({
        new_value: 'xxx'
    })
    ```

    To wrap the selection execute the cb with

    ```
    // create a link making the selection the link target
    cb({
        wrap: {
          start: '[Display Text](', /* selection here */ end: ')'
        }
    })
    ```

    `tool.is_file` if true then on click the browsers file selector will be shown and the cb will include a `files` key which will be an array of file data

    ```
    {
        file_name: 'xxx.png',
        data: base64 String,
        file: File
    }
    ```

- **tabs** `PropTypes.bool`

    `Default`: `false`

    use `true` to show as tabs with a `Markdown` and `Preview` tab

- **onChange** `PropTypes.func`

    callback function which will receive the markdown string value when it changes

    ```
    onChange={(value) => {
        this.setState({
          value: value
        });
    }}
    ```


- **markdown_tab_label** `PropTypes.string`

  `Default`: `Markdown`

- **preview_tab_label** `PropTypes.string`

  `Default`: `Preview`

### CSS / Styling

`react-dom-markdown-editor` comes with some basic styling to get you going

#### Base

To have the base styling for side by side view and what not

```
import 'react-dom-markdown-editor/styles/base.css';
```

#### Flex

To have the `MarkdownEditor` `flex: auto` you must import that `flex.css`

```
import 'react-dom-markdown-editor/styles/flex.css';
```

> Note: The parent element must have something like `display: flex; flex-direction: column` for this to do anything

#### Markdown Style

To use a somewhat standard markdown CSS

```
import 'react-dom-markdown-editor/styles/markdown/standard.css';
```

### Development

```
git clone git@github.com:stevenkaspar/react-dom-markdown-editor.git
cd react-dom-markdown-editor
npm install
npm run dev
...
npm run build
// create pull request
```
