import React          from 'react';
import ReactDOM       from 'react-dom';
import marked         from 'marked';
import MarkdownEditor from '../src/MarkdownEditor';
import jsPDF          from 'jspdf';
import html2canvas    from 'html2canvas';


let styles = {
  app:      require('./app.scss').toString(),
  flex:     require('../src/styles/flex.scss').toString(),
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
      value: `### react-dom-markdown-editor

here is some \`inline code\`

> a quote

[some link](#)

|Column 1|Column 2|
|---|---|
|Data 1| Data 2|`,
      view: 'basic',
      markdown_style: 'standard',
      height_radio: 'flex'
    };

    // marked options
    let renderer = new marked.Renderer();
    renderer.link = (href, title, text) => {
      return `<a href="${href}" target="_blank" title="${title}">${text}</a>`;
    }

    this.marked_options = {
      renderer: renderer
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
  static handleH3Click(data, cb){
    cb({ wrap: { start: '### ' , end: ''} });
  }
  static handleHRClick(data, cb){
    cb({ wrap: { start: '' , end: '---\n\n'} });
  }
  static handleListClick(data, cb){
    cb({ wrap: { start: '- ' , end: ''} });
  }
  static handleNumberedListClick(data, cb){
    cb({ wrap: { start: '1. ' , end: ''} });
  }
  static handleTableClick(data, cb){
    cb({ wrap: { start: '|',      end: '|b|\n|---|---|\n|1|2|' } });
  }

  render(){
    const btn_class = 'btn btn-tight mx-4 mb-4';
    const toolbar = [
      { label: '-    list',   handler: App.handleListClick,                 className: btn_class },
      { label: '1.   numbered list',   handler: App.handleNumberedListClick,    className: btn_class },
      { label: '#    h1',     handler: App.handleH1Click,                   className: btn_class },
      { label: '###  h3',     handler: App.handleH3Click,                   className: btn_class },
      { label: '---  hr',     handler: App.handleHRClick,                   className: btn_class },
      { label: '|-|  table',  handler: App.handleTableClick,                className: btn_class },
      { label: '![]() image', handler: App.handleImageClick, is_file: true, className: btn_class }
    ];

    return (
      <div>
        <style>{styles.app}</style>
        <style>{styles.base}</style>

        { this.state.view === 'tabs' ? <style>{styles.tabs}</style> : null }
        <style>{styles[this.state.markdown_style]}</style>
        { this.state.height_radio === 'flex' ? <style>{styles.flex}</style> : null }

        <div className='flex-column absolute-full'>
          <header className='flex-none text-right p-4'>
            <h1>React Markdown Editor</h1>
            <span>{'<'}{'/>'} by <a href='https://www.linkedin.com/in/stevenkaspar/' target='_blank'>Steven Kaspar</a></span>
          </header>
          <div className='flex-none flex-row justify-content-between py-10 px-4 bg-gray-darkest mb-4'>
            <div>
              <div className='radio-group mr-10'>
                <label>View</label>
                <button className={`btn radio-btn ${this.state.view === 'basic' ? 'selected' : ''}`} onClick={() => this.setState({ view: 'basic' })}>Side by Side</button>
                <button className={`btn radio-btn ${this.state.view === 'tabs' ? 'selected' : ''}`} onClick={() => this.setState({ view: 'tabs' })}>Tabs</button>
              </div>
              <div className='radio-group mr-10'>
                <label>Markdown Style</label>
                <button className={`btn radio-btn ${this.state.markdown_style === 'standard' ? 'selected' : ''}`} onClick={() => this.setState({ markdown_style: 'standard' })}>Standard</button>
                <button className={`btn radio-btn ${this.state.markdown_style === null ? 'selected' : ''}`} onClick={() => this.setState({ markdown_style: null })}>None</button>
              </div>
              <div className='radio-group'>
                <label>Height</label>
                <button className={`btn radio-btn ${this.state.height_radio === 'flex' ? 'selected' : ''}`} onClick={() => this.setState({ height_radio: 'flex' })}>Flex Auto</button>
                <button className={`btn radio-btn ${this.state.height_radio === 'fixed' ? 'selected' : ''}`} onClick={() => this.setState({ height_radio: 'fixed' })}>Fixed</button>
              </div>
            </div>
            <div>
              <button className='btn mr-10' onClick={() => App.htmlToPdf('<div class="react-dom-markdown-editor-preview">'+marked(this.state.value) + `<style>${styles[this.state.markdown_style]}</style>`+'</div>')}>download PDF</button>
              <button className='btn' onClick={() => App.copyTextToClipboard(marked(this.state.value))}>copy HTML output</button>
            </div>
          </div>
          <div className='flex-auto overflow-auto flex-column'>
          {
            this.state.view === 'basic' ?
              <MarkdownEditor
                height={400}
                marked_options={this.marked_options}
                toolbar={toolbar}
                value={this.state.value}
                onChange={this.markdownEditorChange}/>
              : null
          }
          {
            this.state.view === 'tabs' ?
              <MarkdownEditor
                height={400}
                marked_options={this.marked_options}
                tabs={true}
                toolbar={toolbar}
                value={this.state.value}
                onChange={this.markdownEditorChange}/>
              : null
          }
          </div>
        </div>
      </div>
    )
  }


  static copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      alert('Copying text command was ' + msg);
    } catch (err) {
      alert('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
  }

  static htmlToPdf(html){

    let html2pdf  = (html, pdf, callback) => {
    	var canvas = pdf.canvas;
    	if (!canvas) {
    		alert('jsPDF canvas plugin not installed');
    		return;
    	}
    	canvas.pdf = pdf;
    	pdf.annotations = {

    		_nameMap : [],

    		createAnnotation : function(href,bounds) {
    			var x = pdf.context2d._wrapX(bounds.left);
    			var y = pdf.context2d._wrapY(bounds.top);
    			var page = pdf.context2d._page(bounds.top);
    			var options;
    			var index = href.indexOf('#');
    			if (index >= 0) {
    				options = {
    					name : href.substring(index + 1)
    				};
    			} else {
    				options = {
    					url : href
    				};
    			}
    			pdf.link(x, y, bounds.right - bounds.left, bounds.bottom - bounds.top, options);
    		},

    		setName : function(name,bounds) {
    			var x = pdf.context2d._wrapX(bounds.left);
    			var y = pdf.context2d._wrapY(bounds.top);
    			var page = pdf.context2d._page(bounds.top);
    			this._nameMap[name] = {
    				page : page,
    				x : x,
    				y : y
    			};
    		}

    	};
    	canvas.annotations = pdf.annotations;

    	pdf.context2d._pageBreakAt = function(y) {
    		this.pageBreaks.push(y);
    	};

    	pdf.context2d._gotoPage = function(pageOneBased) {
    		while (pdf.internal.getNumberOfPages() < pageOneBased) {
    			pdf.addPage();
    		}
    		pdf.setPage(pageOneBased);
    	}

    	if (typeof html === 'string') {
    		// remove all scripts
    		html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    		var iframe = document.createElement('iframe');
    		//iframe.style.width = canvas.width;
    		//iframe.src = "";
    		//iframe.document.domain =
    		document.body.appendChild(iframe);
    		var doc;
    		doc = iframe.contentDocument;
    		if (doc == undefined || doc == null) {
    			doc = iframe.contentWindow.document;
    		}
    		//iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:500px');

    		doc.open();
    		doc.write(html);
    		doc.close();

    		var promise = html2canvas(doc.body, {
    			canvas : canvas,
    			onrendered : function(canvas) {
    				if (callback) {
    					if (iframe) {
    						iframe.parentElement.removeChild(iframe);
    					}
    					callback(pdf);
    				}
    			}
    		});

    	} else {
    		var body = html;
    		var promise = html2canvas(body, {
    			canvas : canvas,
    			onrendered : function(canvas) {
    				if (callback) {
    					if (iframe) {
    						iframe.parentElement.removeChild(iframe);
    					}
    					callback(pdf);
    				}
    			}
    		});
    	}

    }

	  var pdf = new jsPDF('p', 'pt', 'letter');
	  pdf.canvas.height = 72 * 11;
	  pdf.canvas.width = 72 * 8.5;

	  html2pdf(html, pdf, function(pdf){
      pdf.save('react-dom-markdown-editor.pdf', 'datauristring');
	  });


  }


};


ReactDOM.render(<App />, document.getElementById('app'));
