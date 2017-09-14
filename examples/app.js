import React          from 'react';
import ReactDOM       from 'react-dom';
import MarkdownEditor from 'react-dom-markdown-editor';
import 'react-dom-markdown-editor/lib/styles/base.css';

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

  handleFileClick({value, files}, cb){

    let file_string = '';
    for(let file of files){
      file_string += `[file.file_name](data:${file.file.type};base64,${file.data})`;
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
      <MarkdownEditor
        height={100}
        toolbar={[
          { label: 'h1',    handler: TaskMessages.handleH1Click },
          { label: 'table', handler: TaskMessages.handleTableClick },
          { label: 'file',  handler: this.handleFileClick, is_file: true },
        ]}
        value={this.state.value}
        onChange={this.markdownEditorChange}/>
    );
  }

};


ReactDOM.render(<App />, document.getElementById('app'));
