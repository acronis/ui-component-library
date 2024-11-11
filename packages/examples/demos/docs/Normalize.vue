<script setup lang="ts">
</script>

<template>
  <div class="body">
    <header>
      <h1>Normalized HTML5 Elements</h1>
      <p>
        This is a test page filled with common HTML elements with minimal styles,
        to be used to provide visual feedback whilst building CSS systems and frameworks.
        This list is adapted to light and dark.
        These are the elements you might use to build UI components.
      </p>
      <p>
        Based on <a href="https://cbracco.github.io/html5-test-page">this html5 test page</a>.
      </p>
    </header>

    <nav role="navigation">
      <ul id="top">
        <li>
          <a href="#text">Text</a>
          <ul>
            <li><a href="#text-headings">Headings</a></li>
            <li><a href="#text-paragraphs">Paragraphs</a></li>
            <li><a href="#text-lists">Lists</a></li>
            <li><a href="#text-blockquotes">Blockquotes</a></li>
            <li><a href="#text-details">Details / Summary</a></li>
            <li><a href="#text-address">Address</a></li>
            <li><a href="#text-hr">Horizontal rules</a></li>
            <li><a href="#text-tables">Tabular data</a></li>
            <li><a href="#text-code">Code</a></li>
            <li><a href="#text-inline">Inline elements</a></li>
            <li><a href="#text-comments">HTML Comments</a></li>
          </ul>
        </li>
        <li>
          <a href="#embedded">Embedded content</a>
          <ul>
            <li><a href="#embedded__images">Images</a></li>
            <li><a href="#embedded__bgimages">Background images</a></li>
            <li><a href="#embedded__audio">Audio</a></li>
            <li><a href="#embedded__video">Video</a></li>
            <li><a href="#embedded__canvas">Canvas</a></li>
            <li><a href="#embedded__meter">Meter</a></li>
            <li><a href="#embedded__progress">Progress</a></li>
            <li><a href="#embedded__svg">Inline SVG</a></li>
            <li><a href="#embedded__iframe">IFrames</a></li>
            <li><a href="#embedded__embed">Embed</a></li>
            <li><a href="#embedded__object">Object</a></li>
          </ul>
        </li>
        <li>
          <a href="#forms">Form elements</a>
          <ul>
            <li><a href="#forms__input">Input fields</a></li>
            <li><a href="#forms__select">Select menus</a></li>
            <li><a href="#forms__checkbox">Checkboxes</a></li>
            <li><a href="#forms__radio">Radio buttons</a></li>
            <li><a href="#forms__textareas">Textareas</a></li>
            <li><a href="#form-html5">HTML5 inputs</a></li>
            <li><a href="#forms__action">Action buttons</a></li>
          </ul>
        </li>
      </ul>
    </nav>

    <main role="main">
      <section id="text">
        <article id="text-headings">
          <div>
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-paragraphs">
          <header><h2>Paragraphs</h2></header>
          <div>
            <p>A paragraph (from the Greek paragraphos, “to write beside” or “written beside”) is a self-contained unit of a discourse in writing dealing with a particular point or idea. A paragraph consists of one or more sentences. Though not required by the syntax of any language, paragraphs are usually an expected part of formal writing, used to organize longer prose.</p>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-blockquotes">
          <header><h2>Blockquotes</h2></header>
          <div>
            <blockquote>
              <p>A block quotation (also known as a long quotation or extract) is a quotation in a written document, that is set off from the main text as a paragraph, or block of text.</p>
              <p>It is typically distinguished visually using indentation and a different typeface or smaller size quotation. It may or may not include a citation, usually placed at the bottom.</p>
              <cite><a href="#!">Said no one, ever.</a></cite>
            </blockquote>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-lists">
          <header><h2>Lists</h2></header>
          <div class="demo">
            <h3>Definition list</h3>
            <dl>
              <dt>Definition List Title</dt>
              <dd>This is a definition list division.</dd>
              <dt>Definition List Title 2</dt>
              <dd>This is a definition list division.</dd>
            </dl>
            <h3>Ordered List</h3>
            <ol type="1">
              <li>List Item 1</li>
              <li>
                List Item 2
                <ol type="A">
                  <li>List Item 1</li>
                  <li>
                    List Item 2
                    <ol type="a">
                      <li>List Item 1</li>
                      <li>
                        List Item 2
                        <ol type="I">
                          <li>List Item 1</li>
                          <li>
                            List Item 2
                            <ol type="i">
                              <li>List Item 1</li>
                              <li>List Item 2</li>
                              <li>List Item 3</li>
                            </ol>
                          </li>
                          <li>List Item 3</li>
                        </ol>
                      </li>
                      <li>List Item 3</li>
                    </ol>
                  </li>
                  <li>List Item 3</li>
                </ol>
              </li>
              <li>List Item 3</li>
            </ol>
            <h3>Unordered List</h3>
            <ul>
              <li>List Item 1</li>
              <li>
                List Item 2
                <ul>
                  <li>List Item 1</li>
                  <li>
                    List Item 2
                    <ul>
                      <li>List Item 1</li>
                      <li>
                        List Item 2
                        <ul>
                          <li>List Item 1</li>
                          <li>
                            List Item 2
                            <ul>
                              <li>List Item 1</li>
                              <li>List Item 2</li>
                              <li>List Item 3</li>
                            </ul>
                          </li>
                          <li>List Item 3</li>
                        </ul>
                      </li>
                      <li>List Item 3</li>
                    </ul>
                  </li>
                  <li>List Item 3</li>
                </ul>
              </li>
              <li>List Item 3</li>
            </ul>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-details">
          <header><h1>Details</h1></header>
          <details>
            <summary>Details and summary</summary>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, odio! Odio natus ullam ad quaerat, eaque necessitatibus, aliquid distinctio similique voluptatibus dicta consequuntur animi. Quaerat facilis quidem unde eos! Ipsa.</p>
          </details>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-address">
          <header><h1>Address</h1></header>
          <address>
            Written by <a href="mailto:webmaster@example.com">Jon Doe</a>.<br>
            Visit us at:<br>
            Example.com<br>
            Box 564, Disneyland<br>
            USA
          </address>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-hr">
          <header><h2>Horizontal rules</h2></header>
          <div>
            <hr>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-tables">
          <header><h2>Tabular data</h2></header>
          <table>
            <caption>Table Caption</caption>
            <thead>
              <tr>
                <th>Table Heading 1</th>
                <th>Table Heading 2</th>
                <th>Table Heading 3</th>
                <th>Table Heading 4</th>
                <th>Table Heading 5</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <th>Table Footer 1</th>
                <th>Table Footer 2</th>
                <th>Table Footer 3</th>
                <th>Table Footer 4</th>
                <th>Table Footer 5</th>
              </tr>
            </tfoot>
            <tbody>
              <tr>
                <td>Table Cell 1</td>
                <td>Table Cell 2</td>
                <td>Table Cell 3</td>
                <td>Table Cell 4</td>
                <td>Table Cell 5</td>
              </tr>
              <tr>
                <td>Table Cell 1</td>
                <td>Table Cell 2</td>
                <td>Table Cell 3</td>
                <td>Table Cell 4</td>
                <td>Table Cell 5</td>
              </tr>
              <tr>
                <td>Table Cell 1</td>
                <td>Table Cell 2</td>
                <td>Table Cell 3</td>
                <td>Table Cell 4</td>
                <td>Table Cell 5</td>
              </tr>
              <tr>
                <td>Table Cell 1</td>
                <td>Table Cell 2</td>
                <td>Table Cell 3</td>
                <td>Table Cell 4</td>
                <td>Table Cell 5</td>
              </tr>
            </tbody>
          </table>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-code">
          <header><h2>Code</h2></header>
          <div class="demo">
            <p><strong>Keyboard input:</strong> <kbd>Cmd</kbd></p>
            <p><strong>Inline code:</strong> <code>&lt;div&gt;code&lt;/div&gt;</code></p>
            <p><strong>Sample output:</strong> <samp>This is sample output from a computer program.</samp></p>
            <h2>Pre-formatted text</h2>
            <pre>P R E F O R M A T T E D T E X T
  ! " # $ % &amp; ' ( ) * + , - . /
  0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ?
  @ A B C D E F G H I J K L M N O
  P Q R S T U V W X Y Z [ \ ] ^ _
  ` a b c d e f g h i j k l m n o
  p q r s t u v w x y z { | } ~ </pre>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-inline">
          <header><h2>Inline elements</h2></header>
          <div class="demo">
            <p><a href="#!">This is a text link</a>.</p>
            <p><strong>Strong is used to indicate strong importance.</strong></p>
            <p><em>This text has added emphasis.</em></p>
            <p>The <b>b element</b> is stylistically different text from normal text, without any special importance.</p>
            <p>The <i>i element</i> is text that is offset from the normal text.</p>
            <p>The <u>u element</u> is text with an unarticulated, though explicitly rendered, non-textual annotation.</p>
            <p><del>This text is deleted</del> and <ins>This text is inserted</ins>.</p>
            <p><s>This text has a strikethrough</s>.</p>
            <p>Superscript<sup>®</sup>.</p>
            <p>Subscript for things like H<sub>2</sub>O.</p>
            <p><small>This small text is small for fine print, etc.</small></p>
            <p>Abbreviation: <abbr title="HyperText Markup Language">HTML</abbr></p>
            <p><q cite="https://developer.mozilla.org/en-US/docs/HTML/Element/q">This text is a short inline quotation.</q></p>
            <p><cite>This is a citation.</cite></p>
            <p>The <dfn>dfn element</dfn> indicates a definition.</p>
            <p>The <mark>mark element</mark> indicates a highlight.</p>
            <p>The <var>variable element</var>, such as <var>x</var> = <var>y</var>.</p>
            <p>The time element: <time datetime="2013-04-06T12:32+00:00">2 weeks ago</time></p>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>

        <article id="text-comments">
          <header><h2>HTML Comments</h2></header>
          <div>
            <p>There is comment here: <!-- This comment should not be displayed --></p>
            <p>There is a comment spanning multiple tags and lines below here.</p>
          <!-- <p><a href="#!">This is a text link. But it should not be displayed in a comment</a>.</p>
          <p><strong>Strong is used to indicate strong importance. But, it should not be displayed in a comment</strong></p>
          <p><em>This text has added emphasis. But, it should not be displayed in a comment</em></p> -->
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
      </section>
      <section id="embedded">
        <header><h2>Embedded content</h2></header>
        <article id="embedded__images">
          <header><h2>Images</h2></header>
          <div>
            <h3>Plain <code>&lt;img&gt;</code> element</h3>
            <p>
              <img
                src="https://placecats.com/bella/480/480"
                alt="Photo of a kitten"
              >
            </p>
            <h3><code>&lt;figure&gt;</code> element with <code>&lt;img&gt;</code> element</h3>
            <figure>
              <img
                src="https://placecats.com/bella/420/420"
                alt="Photo of a kitten"
              >
            </figure>
            <h3><code>&lt;figure&gt;</code> element with <code>&lt;img&gt;</code> and <code>&lt;figcaption&gt;</code> elements</h3>
            <figure>
              <img
                src="https://placecats.com/bella/420/420"
                alt="Photo of a kitten"
              >
              <figcaption>Here is a caption for this image.</figcaption>
            </figure>
            <h3><code>&lt;figure&gt;</code> element with a <code>&lt;picture&gt;</code> element</h3>
            <figure>
              <picture>
                <source
                  srcset="https://placecats.com/bella/800/800"
                  media="(min-width: 800px)"
                >
                <img
                  src="https://placecats.com/bella/420/420"
                  alt="Photo of a kitten"
                >
              </picture>
            </figure>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__bgimages">
          <header><h2>Background images</h2></header>
          <div style="background-image:url('https://placecats.com/bella/300/300'); width:300px; height: 300px;" />
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__audio">
          <header><h2>Audio</h2></header>
          <div><audio controls="true">audio</audio></div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__video">
          <header><h2>Video</h2></header>
          <div><video controls="true">video</video></div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__canvas">
          <header><h2>Canvas</h2></header>
          <div><canvas>canvas</canvas></div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__meter">
          <header><h2>Meter</h2></header>
          <div>
            <meter
              value="2"
              min="0"
              max="10"
            >
              2 out of 10
            </meter>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__progress">
          <header><h2>Progress</h2></header>
          <div>
            <progress indeterminate="indeterminate">
              progress
            </progress>
            <progress value=".5">
              progress
            </progress>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__svg">
          <header><h2>Inline SVG</h2></header>
          <div>
            <svg
              width="100px"
              height="100px"
            ><circle
              cx="100"
              cy="100"
              r="100"
              fill="#1fa3ec"
            /></svg>
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__iframe">
          <header><h2>IFrame</h2></header>
          <div>
            <iframe
              src="/#/Normalize.vue"
              height="300"
            />
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__embed">
          <header><h2>Embed</h2></header>
          <div>
            <embed
              src="index.html"
              height="300"
            >
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
        <article id="embedded__object">
          <header><h2>Object</h2></header>
          <div>
            <object
              data="index.html"
              height="300"
            />
          </div>
          <footer><p><a href="#top">[Top]</a></p></footer>
        </article>
      </section>
      <section id="forms">
        <header><h2>Form elements</h2></header>
        <form>
          <fieldset id="forms__input">
            <legend>Input fields</legend>
            <p>
              <label for="input__text">Text Input</label>
              <input
                id="input__text"
                type="text"
                placeholder="Text Input"
              >
            </p>
            <p>
              <label for="input__password">Password</label>
              <input
                id="input__password"
                type="password"
                placeholder="Type your Password"
              >
            </p>
            <p>
              <label for="input__webaddress">Web Address</label>
              <input
                id="input__webaddress"
                type="url"
                placeholder="https://yoursite.com"
              >
            </p>
            <p>
              <label for="input__emailaddress">Email Address</label>
              <input
                id="input__emailaddress"
                type="email"
                placeholder="name@email.com"
              >
            </p>
            <p>
              <label for="input__phone">Phone Number</label>
              <input
                id="input__phone"
                type="tel"
                placeholder="(999) 999-9999"
              >
            </p>
            <p>
              <label for="input__search">Search</label>
              <input
                id="input__search"
                type="search"
                placeholder="Enter Search Term"
              >
            </p>
            <p>
              <label for="input__text2">Number Input</label>
              <input
                id="input__text2"
                type="number"
                placeholder="Enter a Number"
              >
            </p>
            <p>
              <label for="input__file">File Input</label>
              <input
                id="input__file"
                type="file"
              >
            </p>
            <p>
              <label
                for="input__text3"
                class="error"
              >Error</label>
              <input
                id="input__text3"
                class="is-error"
                type="text"
                placeholder="Text Input"
              >
            </p>
            <p>
              <label
                for="input__text4"
                class="valid"
              >Valid</label>
              <input
                id="input__text4"
                class="is-valid"
                type="text"
                placeholder="Text Input"
              >
            </p>
          </fieldset>
          <p><a href="#top">[Top]</a></p>
          <fieldset id="forms__select">
            <legend>Select menus</legend>
            <p>
              <label for="select">Select</label>
              <select id="select">
                <optgroup label="Option Group">
                  <option>Option One</option>
                  <option>Option Two</option>
                  <option>Option Three</option>
                </optgroup>
              </select>
            </p>
            <p>
              <label for="select_multiple">Select (multiple)</label>
              <select
                id="select_multiple"
                multiple="multiple"
              >
                <optgroup label="Option Group">
                  <option>Option One</option>
                  <option>Option Two</option>
                  <option>Option Three</option>
                </optgroup>
              </select>
            </p>
          </fieldset>
          <p><a href="#top">[Top]</a></p>
          <fieldset id="forms__checkbox">
            <legend>Checkboxes</legend>
            <ul>
              <li>
                <label for="checkbox1"><input
                  id="checkbox1"
                  name="checkbox"
                  type="checkbox"
                  checked="checked"
                > Choice A</label>
              </li>
              <li>
                <label for="checkbox2"><input
                  id="checkbox2"
                  name="checkbox"
                  type="checkbox"
                > Choice B</label>
              </li>
              <li>
                <label for="checkbox3"><input
                  id="checkbox3"
                  name="checkbox"
                  type="checkbox"
                > Choice C</label>
              </li>
            </ul>
          </fieldset>
          <p><a href="#top">[Top]</a></p>
          <fieldset id="forms__radio">
            <legend>Radio buttons</legend>
            <ul>
              <li>
                <label for="radio1"><input
                  id="radio1"
                  name="radio"
                  type="radio"
                  checked="checked"
                > Option 1</label>
              </li>
              <li>
                <label for="radio2"><input
                  id="radio2"
                  name="radio"
                  type="radio"
                > Option 2</label>
              </li>
              <li>
                <label for="radio3"><input
                  id="radio3"
                  name="radio"
                  type="radio"
                > Option 3</label>
              </li>
            </ul>
          </fieldset>
          <p><a href="#top">[Top]</a></p>
          <fieldset id="forms__textareas">
            <legend>Textareas</legend>
            <p>
              <label for="textarea">Textarea</label>
              <textarea
                id="textarea"
                rows="8"
                cols="48"
                placeholder="Enter your message here"
              />
            </p>
          </fieldset>
          <p><a href="#top">[Top]</a></p>
          <fieldset id="form-html5">
            <legend>HTML5 inputs</legend>
            <p>
              <label for="ic">Color input</label>
              <input
                id="ic"
                type="color"
                value="#000000"
              >
            </p>
            <p>
              <label for="in">Number input</label>
              <input
                id="in"
                type="number"
                min="0"
                max="10"
                value="5"
              >
            </p>
            <p>
              <label for="ir">Range input</label>
              <input
                id="ir"
                type="range"
                value="10"
              >
            </p>
            <p>
              <label for="ir">Progress input</label>
              <progress />
              <progress value=".5">
                50%
              </progress>
            </p>
            <p>
              <label for="idd">Date input</label>
              <input
                id="idd"
                type="date"
                value="1970-01-01"
              >
            </p>
            <p>
              <label for="idm">Month input</label>
              <input
                id="idm"
                type="month"
                value="1970-01"
              >
            </p>
            <p>
              <label for="idw">Week input</label>
              <input
                id="idw"
                type="week"
                value="1970-W01"
              >
            </p>
            <p>
              <label for="idt">Datetime input</label>
              <input
                id="idt"
                type="datetime"
                value="1970-01-01T00:00:00Z"
              >
            </p>
            <p>
              <label for="idtl">Datetime-local input</label>
              <input
                id="idtl"
                type="datetime-local"
                value="1970-01-01T00:00"
              >
            </p>
            <p>
              <label for="idl">Datalist</label>
              <input
                id="idl"
                type="text"
                list="example-list"
              >
              <datalist id="example-list">
                <option value="Example #1" />
                <option value="Example #2" />
                <option value="Example #3" />
              </datalist>
            </p>
          </fieldset>
          <p><a href="#top">[Top]</a></p>
          <fieldset id="forms__action">
            <legend>Action buttons</legend>
            <p>
              <input
                type="submit"
                value="<input type=submit>"
              >
              <input
                type="button"
                value="<input type=button>"
              >
              <input
                type="reset"
                value="<input type=reset>"
              >
              <input
                type="submit"
                value="<input disabled>"
                disabled
              >
            </p>
            <p>
              <button type="submit">
                &lt;button type=submit&gt;
              </button>
              <button type="button">
                &lt;button type=button&gt;
              </button>
              <button type="reset">
                &lt;button type=reset&gt;
              </button>
              <button
                type="button"
                disabled
              >
                &lt;button disabled&gt;
              </button>
            </p>
          </fieldset>
          <p><a href="/#top">[Top]</a></p>
        </form>
      </section>

      <section id="scheme">
        <article>
          <h4>Adaptive props</h4>
          <h3>Surface Colors</h3>
          <p>Great for cards, buttons, borders, sidenavs, wells, etc. When you want to change the perception of layering and grouping.</p>
          <div class="surface-samples">
            <div class="acv-surface-primary ">
              acv-surface-primary
            </div>
            <div class="acv-surface-secondary ">
              acv-surface-secondary
            </div>
            <div class="acv-surface-inversed-primary ">
              acv-surface-inversed-primary
            </div>
            <div class="acv-surface-inversed-dark-primary ">
              acv-surface-inversed-dark-primary
            </div>
            <div class="acv-surface-inversed-secondary ">
              acv-surface-inversed-secondary
            </div>
            <div class="acv-surface-fixed-primary ">
              acv-surface-fixed-primary
            </div>
            <div class="acv-surface-fixed-secondary">
              acv-surface-fixed-secondary
            </div>
          </div>
        </article>
        <article class="text-samples">
          <h3>Text and link colors</h3>
          <h5 class="text1">
            <span class="swatch link " />
            var(--acv-link-color)
          </h5>
          <h5 class="text1">
            <span class="swatch link-visited " />
            var(--acv-link-color-visited)
          </h5>
          <h5 class="text1">
            <span class="swatch text1 " />
            var(--acv-color-text-primary)
          </h5>
          <h5 class="text2">
            <span class="swatch text2" />
            var(--acv-color-text-secondary)
          </h5>
          <p>Using these props results in colors that adapt to the users system theme preference automatically.</p>
          <p>
            The brand color is used sparingly, find it used in the HTML elements below!
            The link color is useful for buttons and other custom components
            you want to have consistent interactive text for.
          </p>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.body {
  display: grid;
  place-content: center;
  padding: var(--acv-size-relative-2);
  gap: var(--acv-size-relative-2);
}

article,
section,
form,
fieldset,
header,
#text-lists > .demo,
#text-code > .demo,
#text-inline > .demo {
  display: grid;
  gap: var(--acv-size-relative-1-25);
}

nav > ul {
  display: flex;
  list-style-type: none;
  padding-inline-start: 0;
  gap: var(--acv-size-relative-1-5);
}

@media (width <= 480px) {
  .surface-samples {
    --size: 40vw;
  }
}

.text-samples {
  display: grid;
  gap: var(--acv-size-relative-1);
}

.text-samples > h5 {
  display: inline-flex;
  align-items: center;
  gap: var(--acv-size-relative-1);
}

.text1 {
  color: var(--acv-color-text-primary);
}

p.text1 {
  font-weight: var(--acv-base-font-weight-300);
}

.text2 {
  color: var(--acv-color-text-secondary);
}

.brand {
  color: var(--acv-color-primary);
  background-color: var(--acv-color-primary);
}

.link {
  color: var(--acv-link-color);
  background-color: var(--acv-link-color);
}

.link-visited {
  color: var(--acv-link-color-visited);
  background-color: var(--acv-link-color-visited);
}

.swatch {
  display: inline-block;
  flex-shrink: 0;
  inline-size: var(--acv-size-relative-3);
  block-size: var(--acv-size-relative-3);
  border-radius: var(--acv-border-radius-circle);
  box-shadow: var(--acv-shadow-base-large);
}

.swatch.text1 { background-color: var(--acv-color-text-primary); }
.swatch.text2 { background-color: var(--acv-color-text-secondary); }

.buttons-list {
  display: flex;
  align-items: flex-start;
  gap: var(--acv-size-relative-1);
  flex-wrap: wrap;
}

#form-html5 > p {
  display: flex;
  align-items: center;
  gap: var(--acv-size-relative-1);
}

.surface-samples {
  --size: var(--acv-size-content-45ch);
  display: grid;
  grid-template-columns: var(--size) var(--size);
  grid-auto-rows: var(--size);
  gap: var(--acv-size-relative-1-5);
  margin-block-start: var(--acv-size-relative-1-75);
}

.surface-samples > * {
  border-radius: var(--acv-radius-large);
  display: grid;
  place-content: center;
  font-size: var(--acv-font-size-relative-1-25);
  font-weight: var(--acv-font-weight-regular);
  box-shadow: var(--acv-shadow-large);
}
</style>
