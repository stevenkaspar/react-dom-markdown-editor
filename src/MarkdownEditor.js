import React, { PropTypes } from 'react';
import marked from 'marked';

// configure markdown
(() => {
  let renderer = new marked.Renderer();
  renderer.link = (href, title, text) => {
    return `<a href="${href}" target="_blank" title="${title}">${text}</a>`;
  }
  marked.setOptions({
    renderer: renderer
  });
})();

class MarkdownEditor extends React.Component {
  constructor({value, height = 200}) {
    super();

    this.state = {
      value:       value,
      height:      height,
      file_inputs: []
    };

    this.markdownChange = this.markdownChange.bind(this);
    this.toolbarButtonMouseDown = this.toolbarButtonMouseDown.bind(this);
    this.toolbarButtonMouseUp = this.toolbarButtonMouseUp.bind(this);

    this.handleTextareaMouseDown       = this.handleTextareaMouseDown.bind(this);
    this.handleMouseMoveAfterMouseDown = this.handleMouseMoveAfterMouseDown.bind(this);
    this.handleMouseUpAfterMouseDown   = this.handleMouseUpAfterMouseDown.bind(this);
  }

  componentWillReceiveProps(new_props){
    this.setState({
      value: new_props.value
    })
  }

  handleTextareaMouseDown(event){
    this.mousemove_target = event.currentTarget;
    document.addEventListener('mousemove', this.handleMouseMoveAfterMouseDown, false);
    document.addEventListener('mouseup',   this.handleMouseUpAfterMouseDown,   false);
  }

  handleMouseMoveAfterMouseDown(){
    this.setHeight(this.mousemove_target.offsetHeight);
  }
  handleMouseUpAfterMouseDown(){
    this.setHeight(this.mousemove_target.offsetHeight);
    document.removeEventListener('mousemove', this.handleMouseMoveAfterMouseDown, false);
    document.removeEventListener('mouseup',   this.handleMouseUpAfterMouseDown,   false);
  }

  setHeight(height = this.state.height){
    if(height === this.state.height){
      return;
    }
    this.setState({
      height: height
    });
  }

  markdownChange(event){
    this.setValue(event.target.value);
  }

  setValue(value, cb = () => {}){
    this.setState({
      value: value
    }, cb);
    this.props.onChange(value);
  }

  toolbarButtonMouseDown(event){
    event.preventDefault();
  }

  toolbarButtonMouseUp(event, {is_file = false, handler = () => {}}){
    event.preventDefault();

    let selection = MarkdownEditor.getInputSelection(this.textarea);

    let fileInputChanged = event => {
      var files = event.target.files;
      var promises = [];
      for(var i = 0; i < files.length; i++){
        promises.push(promiseDataURLForFile(files[i]));
      }
      return Promise.all(promises).then(file_data_array => {
        handler({
          ...this.tool_callback_data,
          files:     file_data_array
        }, this.toolHandleCallback.bind(this));
      });
    }
    let promiseDataURLForFile = file => {
      return new Promise(resolve => {
        var reader  = new FileReader();

        reader.addEventListener("load", () => {
          resolve({
            file_name: file.name,
            data:      reader.result.split(',')[1],
            file: file
          });
        }, false);

        if(file){
          reader.readAsDataURL(file);
        }
      })
    }

    if(is_file){
      let input_ref = null;
      let input = <input key={this.state.file_inputs.length} multiple='true' ref={i => {input_ref = i;}} type='file' onChange={fileInputChanged} />;

      this.state.file_inputs.push(input);
      this.setState({
        file_inputs: this.state.file_inputs
      }, () => { input_ref.click() });

      return;
    }
    handler(this.tool_callback_data, this.toolHandleCallback.bind(this));

  }

  get tool_callback_data(){

    let selection = MarkdownEditor.getInputSelection(this.textarea);

    return {
      value:     this.textarea.innerHTML,
      selection: {
        ...selection,
        _:     selection
      },
      target:    this.textarea
    };
  }

  /**
   * Callback function that will be called by the toolbar.handler functions
   *
   * To overwrite the value use the new_value property
   *
   * To wrap the selection use {wrap: {start: 'xx', end: '\n\n'}}
   *
   * @param  {[String]} new_value [description]
   * @param  {[Object]} wrap      {start: 'xx', end: '\n\n'}
   */
  toolHandleCallback({new_value, wrap}){
    let selection    = MarkdownEditor.getInputSelection(this.textarea);
    let value        = this.state.value;
    let no_selection = (selection.start === selection.end);

    if(new_value){
      this.setValue(new_value, () => {
        this.textarea.setSelectionRange(selection.start, selection.end);
      })
    }
    else if(wrap){
      value = `${value.slice(0,selection.start)}${wrap.start}${selection.value}${wrap.end}${value.slice(selection.end)}`;
      this.setValue(value, () => {
        if(no_selection){
          const cursor_pos = selection.start + (wrap.start ? wrap.start.length : 0) + (wrap.end ? wrap.end.length : 0);
          this.textarea.setSelectionRange(cursor_pos, cursor_pos);
        }
        else {
          this.textarea.setSelectionRange(selection.start, selection.end + (wrap.start ? wrap.start.length : 0) + (wrap.end ? wrap.end.length : 0))
        }
      })
    }
  }

  compileMarkdownToHTML(markdown){
    return { __html: marked(markdown) };
  }

  getToolbarJSX(){
    let jsx = [];
    let index = 1;

    for(let tool of this.props.toolbar){
      if(tool.label){
        jsx.push(
          <button
            key={index++}
            onMouseDown={this.toolbarButtonMouseDown}
            onMouseUp={event => this.toolbarButtonMouseUp(event, tool)}
            >{tool.label}</button>
        );
      }
      else if(tool.html){
        jsx.push(
          <span
            key={index++}
            onMouseDown={this.toolbarButtonMouseDown}
            onMouseUp={event => this.toolbarButtonMouseUp(event, tool)}
            dangerouslySetInnerHTML={{__html: tool.html}}></span>
        );
      }
    }

    return jsx;
  }

  render(){
    const style = {
      height: `${this.state.height}px`
    };
    return (
      <div className='react-dom-markdown-editor'>
        <div className='react-dom-markdown-editor-toolbar' unselectable='on'>
          { this.getToolbarJSX() }
        </div>
        <div className='react-dom-markdown-editor-workspace'>
          <textarea ref={(textarea) => { this.textarea = textarea; }} className='react-dom-markdown-editor-textarea' onMouseDown={this.handleTextareaMouseDown} style={style} value={this.state.value} onChange={this.markdownChange}></textarea>
          <div className='react-dom-markdown-editor-preview' style={style}
            dangerouslySetInnerHTML={this.compileMarkdownToHTML(this.state.value)}>
          </div>
        </div>
        <div className='react-dom-markdown-editor-footer'>
          <div style={{display: 'none'}} ref={(file_container) => { this.file_container = file_container; }}>
            {this.state.file_inputs}
          </div>
        </div>
      </div>
    );
  }

  static getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
      value: el.value.substring(start, (start === end) ? start : end + start),
      start: start,
      end: end
    };
  }

};

MarkdownEditor.propTypes = {
  height: PropTypes.number,
  value:  PropTypes.string
};

export default MarkdownEditor;
