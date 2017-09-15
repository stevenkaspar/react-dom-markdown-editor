import React          from 'react';
import ReactDOM       from 'react-dom';
import marked         from 'marked';
import MarkdownEditor from '../src/MarkdownEditor';


let styles = {
  app:      require('./app.scss').toString(),
  base:     require('../src/styles/base.scss').toString(),
  tabs:     require('react-tabs/style/react-tabs.scss').toString(),
  standard: require('../src/styles/markdown/standard.scss').toString()
}

// const base_scss =  require('./styles/base.scss').toString();
// console.log(base_scss);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: `
### react-dom-markdown-editor

here is some \`inline code\`

> a quote

[some link](#)

|Column 1|Column 2|
|---|---|
|Data 1| Data 2|
      `,
      view: 'basic',
      markdown_style: 'standard'
    };

    this.markdownEditorChange = this.markdownEditorChange.bind(this);
  }

  markdownEditorChange(value){
    this.setState({
      value: value
    });
  }

  static handleImageClick({value, files}, cb){

    let file_string = '';
    for(let file of files){
      file_string += `![${file.file_name}](data:${file.file.type};base64,${file.data})\n\n`;
    }

    cb({ new_value: `${value}\n\n${file_string}` });
  }

  static handleH1Click(data, cb){
    cb({ wrap: { start: '# ' , end: ''} });
  }
  static handleListClick(data, cb){
    cb({ wrap: { start: '- ' , end: ''} });
  }
  static handleTableClick(data, cb){
    cb({ wrap: { start: '|',      end: '|b|\n|---|---|\n|1|2|' } });
  }

  render(){
    const toolbar = [
      { label: '-    list',   handler: App.handleListClick },
      { label: '#    h1',     handler: App.handleH1Click },
      { label: '|-|  table',  handler: App.handleTableClick },
      { label: '![]() image', handler: App.handleImageClick, is_file: true }
    ];

    return (
      <div>
        <style>{styles.app}</style>
        <style>{styles.base}</style>
        <h1>React Markdown Editor</h1>
        <div>
          <strong>Views</strong>
          <button className={`btn radio-btn ${this.state.view === 'basic' ? 'selected' : ''}`} onClick={() => this.setState({ view: 'basic' })}>Side by Side</button>
          <button className={`btn radio-btn ${this.state.view === 'tabs' ? 'selected' : ''}`} onClick={() => this.setState({ view: 'tabs' })}>Tabs</button><br/>
          <br/>
          <strong>Markdown Style</strong>
          <button className={`btn radio-btn ${this.state.markdown_style === 'standard' ? 'selected' : ''}`} onClick={() => this.setState({ markdown_style: 'standard' })}>Standard</button>
          <button className={`btn radio-btn ${this.state.markdown_style === null ? 'selected' : ''}`} onClick={() => this.setState({ markdown_style: null })}>None</button><br/>
          <style>{styles[this.state.markdown_style]}</style>
        </div>
        {
          this.state.view === 'basic' ?
          <div>
            <MarkdownEditor
              height={400}
              toolbar={toolbar}
              value={this.state.value}
              onChange={this.markdownEditorChange}/>
          </div>
            : null
        }
        {
          this.state.view === 'tabs' ?
          <div>
            <style>{styles.tabs}</style>
            <MarkdownEditor
              height={400}
              tabs={true}
              toolbar={toolbar}
              value={this.state.value}
              onChange={this.markdownEditorChange}/>
          </div>
            : null
        }
        <button onClick={() => alert(this.state.value)}>alert input value</button>
        <button onClick={() => alert(marked(this.state.value))}>alert HTML output</button>
      </div>
    );
  }

};


ReactDOM.render(<App />, document.getElementById('app'));
