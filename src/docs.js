(() => {
	// all nodes per selector, with an optional root element (defaults to document)
	function $$(s, n) {
		return (n || document).querySelectorAll(s)
	};

	// single nodes per selector, with an optional root element (defaults to document)
	function $(s, n) {
		return (n || document).querySelector(s)
	};

	window.$ = $;
	window.$$ = $$;

	const elpro = Element.prototype;

	elpro.on = function(name, handler, dlgt) {
		this.addEventListener(name, (e) => {
			e.source = this;
			if (dlgt) {
				let node = e.target;
				for (; node != null && node.matches; node = node.parentNode) {
					if (node.matches(dlgt)) {
						e.source = node;
						break;
					}
				}
				if (!node || !node.matches) return;
			}
			e.preventDefault();
			e.stopPropagation();
			handler.call(e.source, e);
			return false;
		});
		return this;
	};

	elpro.hide = function() {
		if (!this.dataset.display) {
			const c = window.getComputedStyle(this).display;
			if (c !== 'none') this.dataset.display = c;
		}
		return this.setDisplay('none');
	};
	elpro.show = function() { return this.setDisplay(this.dataset.display || 'block'); };
	elpro.setDisplay = function(d) { this.style.display = d; return this; };
	elpro.shown = function() { return this.style.display != 'none'; }

	elpro.classes = function() {
		for (let i = 0; i < arguments.length; ++i) {
			const arg = arguments[i];
			const prefix = arg[0];
			const klass = arg.substr(1);
			const cl = this.classList;
			if (prefix == '+') cl.add(klass);
			else if (prefix == '-') cl.remove(klass);
			else if (prefix == '!') cl.toggle(klass);
		}
		return this;
	};
})();

// hide/show nav
(() => {
	let altNav = false;
	$('#altnav').on('click', () => {
		if (altNav) $('#nav').classes('-show');
		else $('#nav').classes('+show');
		altNav = !altNav;
	})
})();

(() => {
	$$('div.tabs li').forEach((li) => {
		const tabName = li.dataset.tab;
		const parent = li.closest('div');

		const tabs = $$('li', parent);
		const containers = $$('div[data-tab]', parent);

		li.on('click', () => {
			containers.forEach((c) => {
				if (c.dataset.tab == tabName) c.show();
				else c.hide();
			});
			tabs.forEach((t) => { t.classes('-active'); });
			li.classes('+active');
		});
	});
})();
