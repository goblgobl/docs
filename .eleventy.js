const sass = require('sass');
const pluginSass = require('@grimlink/eleventy-plugin-sass');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function(config) {
	config.addPassthroughCopy('src/docs.js');
	config.addPassthroughCopy('src/logo.png');
	config.addPassthroughCopy('src/favicon.png');
	config.addPassthroughCopy('src/assets/tests/*');
	config.setTemplateFormats(['html', 'njk']);

	config.addPlugin(syntaxHighlight);
	config.addPlugin(pluginSass, { sass });

	config.addPairedShortcode('code', function(code) {
		let tabs = [];
		const re = /```\s*(\S+)\n([\s\S]*?)```/gm;

		let blocks = ''
		for (let m = re.exec(code); m; m = re.exec(code)) {
			let lang = m[1]
			let tab = lang;
			const code = m[2]

			let parts = lang.split(':');
			if (parts.length === 2) {
				tab = parts[1];
				lang = parts[0];
			}
			tabs.push(tab);
			blocks += `<div data-tab="${tab}">`;
			blocks += syntaxHighlight.pairedShortcode(code, lang, '');
			blocks += '</div>';
		}

		let html = '<div class="tabs code"><ul>';
		for (let i = 0; i < tabs.length; i++) {
			const cls = i == 0 ? ' class=active' : '';
			html += `<li data-tab="${tabs[i]}"${cls}>${tabs[i]}</li>`;
		}

		return html + '</ul>' + blocks + '</div>';
	});

	config.addShortcode('parameters', function(parameters) {
		let html = '<table class=parameters><thead>'
		html += '<tr><th>name<th>type<th>req<th>desc</tr></thead><tbody>';
		for (let i = 0; i < parameters.length; i++) {
			const p = parameters[i];
			html += `<tr><td><code>${p.name}</code><td>${p.type}<td>${p.required ? '✓' : ''}<td>${p.desc}</tr>`;
		}
		return html + '</table>';
	});

	config.addShortcode('response', function(parameters) {
		let html = '<table class=response><thead>'
		html += '<tr><th>name<th>type<th>desc</tr><tbody>';
		for (let i = 0; i < parameters.length; i++) {
			const p = parameters[i];
			html += `<tr><td><code>${p.name}</code><td>${p.type}<td>${p.desc}</tr>`;
		}
		return html + '</table>';
	});

	config.addShortcode('errors', function(errors) {
		let html = '<table class=errors><thead>';
		html += '<tr><th>code<th><th>desc</tr></thead><tbody>';
		for (let i = 0; i < errors.length; i++) {
			const e = errors[i];
			html += `<tr><td><code><a name=error_${e.code}></a>${e.code}</code><td>${e.desc}</tr>`;
		}
		return html + '</table>';
	});

	return {
		dir: {
			input: 'src'
		}
	};
};
