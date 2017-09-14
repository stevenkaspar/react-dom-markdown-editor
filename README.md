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

- `height`: integer = 200

    Initial height of the textarea. The textarea and preview window will resize together

- `value`: string = ''

    Initial value of the input

- `toolbar`: [`tool`]

    ```
    [
      {
        label: 'h1', // use html to set html instead of using a button
        handler: (data, cb) => { cb({ wrap: { start: '# ', end: '' }}) }
      }
    ]
    ```

    Array of tools to show above the editor that allow for custom value inserting

    The tools should have a `label` or `html` key to define what is displayed for the tool

    `tool.label` would be rendered inside a button

    ```
    <button>{tool.label}</button>
    ```

    `tool.html` would be rendered as the element

    ```
    <span dangerouslySetInnerHTML={ { __html: {tool.html} } ...></span>
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
