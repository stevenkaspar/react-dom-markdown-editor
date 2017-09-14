### Usage

`npm install --save react-dom-markdown-editor`

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
    this.handleFileClick        = this.handleFileClick.bind(this);
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
    cb({ wrap: { start: '# ',     end: '' } });
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
