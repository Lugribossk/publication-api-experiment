Ext.data.JsonP.LazyPromise({"tagname":"class","name":"LazyPromise","extends":null,"mixins":[],"alternateClassNames":[],"aliases":{},"singleton":false,"requires":[],"uses":[],"enum":null,"override":null,"inheritable":null,"inheritdoc":null,"meta":{"author":["Bo Gotthardt"]},"private":null,"id":"class-LazyPromise","members":{"cfg":[],"property":[],"method":[{"name":"constructor","tagname":"method","owner":"LazyPromise","meta":{},"id":"method-constructor"},{"name":"_trigger","tagname":"method","owner":"LazyPromise","meta":{"private":true},"id":"method-_trigger"},{"name":"done","tagname":"method","owner":"LazyPromise","meta":{},"id":"method-done"},{"name":"fail","tagname":"method","owner":"LazyPromise","meta":{},"id":"method-fail"},{"name":"progress","tagname":"method","owner":"LazyPromise","meta":{},"id":"method-progress"},{"name":"then","tagname":"method","owner":"LazyPromise","meta":{},"id":"method-then"}],"event":[],"css_var":[],"css_mixin":[]},"linenr":5,"files":[{"filename":"LazyPromise.js","href":"LazyPromise.html#LazyPromise"}],"html_meta":{"author":null},"statics":{"cfg":[],"property":[],"method":[],"event":[],"css_var":[],"css_mixin":[]},"component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/LazyPromise.html#LazyPromise' target='_blank'>LazyPromise.js</a></div></pre><div class='doc-contents'><p>A \"lazy\" Promise that does not start calculating its value until the first handler is added to it.\nUseful to set up Ajax requests that are not actually fired until needed.</p>\n\n<p>@implements Promise</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='LazyPromise'>LazyPromise</span><br/><a href='source/LazyPromise.html#LazyPromise-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/LazyPromise-method-constructor' class='name expandable'>LazyPromise</a>( <span class='pre'>valueGenerator</span> ) : <a href=\"#!/api/LazyPromise\" rel=\"LazyPromise\" class=\"docClass\">LazyPromise</a></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>valueGenerator</span> : Function<div class='sub-desc'><p>A function that generates the promised value.</p>\n\n<pre><code>                             If it returns a <a href=\"#!/api/Promise\" rel=\"Promise\" class=\"docClass\">Promise</a>, it's resolution/rejection/progress will be used for the lazy promise.\n                             If it returns any other kind of value, the lazy promise will resolve with this.\n</code></pre>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/LazyPromise\" rel=\"LazyPromise\" class=\"docClass\">LazyPromise</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_trigger' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='LazyPromise'>LazyPromise</span><br/><a href='source/LazyPromise.html#LazyPromise-method-_trigger' target='_blank' class='view-source'>view source</a></div><a href='#!/api/LazyPromise-method-_trigger' class='name expandable'>_trigger</a>( <span class='pre'></span> )<strong class='private signature' >private</strong></div><div class='description'><div class='short'>Trigger the value generation if this has not already been done. ...</div><div class='long'><p>Trigger the value generation if this has not already been done.</p>\n</div></div></div><div id='method-done' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='LazyPromise'>LazyPromise</span><br/><a href='source/LazyPromise.html#LazyPromise-method-done' target='_blank' class='view-source'>view source</a></div><a href='#!/api/LazyPromise-method-done' class='name expandable'>done</a>( <span class='pre'>callback</span> )</div><div class='description'><div class='short'>See deferred.done(). ...</div><div class='long'><p>See <a href=\"http://api.jquery.com/deferred.done/\">deferred.done()</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-fail' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='LazyPromise'>LazyPromise</span><br/><a href='source/LazyPromise.html#LazyPromise-method-fail' target='_blank' class='view-source'>view source</a></div><a href='#!/api/LazyPromise-method-fail' class='name expandable'>fail</a>( <span class='pre'>callback</span> )</div><div class='description'><div class='short'>See deferred.fail(). ...</div><div class='long'><p>See <a href=\"http://api.jquery.com/deferred.fail/\">deferred.fail()</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-progress' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='LazyPromise'>LazyPromise</span><br/><a href='source/LazyPromise.html#LazyPromise-method-progress' target='_blank' class='view-source'>view source</a></div><a href='#!/api/LazyPromise-method-progress' class='name expandable'>progress</a>( <span class='pre'>callback</span> )</div><div class='description'><div class='short'>See deferred.progress(). ...</div><div class='long'><p>See <a href=\"http://api.jquery.com/deferred.progress/\">deferred.progress()</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>callback</span> : Function<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-then' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='LazyPromise'>LazyPromise</span><br/><a href='source/LazyPromise.html#LazyPromise-method-then' target='_blank' class='view-source'>view source</a></div><a href='#!/api/LazyPromise-method-then' class='name expandable'>then</a>( <span class='pre'>doneFilter, [failFilter], [progressFilter]</span> )</div><div class='description'><div class='short'>See deferred.then(). ...</div><div class='long'><p>See <a href=\"http://api.jquery.com/deferred.then/\">deferred.then()</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>doneFilter</span> : Function<div class='sub-desc'>\n</div></li><li><span class='pre'>failFilter</span> : Function (optional)<div class='sub-desc'>\n</div></li><li><span class='pre'>progressFilter</span> : Function (optional)<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>"});