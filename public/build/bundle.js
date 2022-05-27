
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.48.0 */

    const file$8 = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$8, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$8, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$8($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.48.0 */
    const file$7 = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$7, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$7, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$7($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.48.0 */
    const file$6 = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$6(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$6, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    /* src\components\ItmsAsstbody.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\components\\ItmsAsstbody.svelte";

    function create_fragment$5(ctx) {
    	let tr;
    	let th0;
    	let label;
    	let input;
    	let t0;
    	let td0;
    	let div5;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let div4;
    	let div2;
    	let t3;
    	let div3;
    	let t5;
    	let td1;
    	let t6;
    	let br;
    	let t7;
    	let span;
    	let t9;
    	let td2;
    	let t11;
    	let td3;
    	let t13;
    	let th1;
    	let div6;
    	let button;
    	let svg;
    	let path;
    	let t14;
    	let ul;
    	let li0;
    	let a0;
    	let t16;
    	let li1;
    	let a1;
    	let t18;
    	let li2;
    	let a2;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			td0 = element("td");
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div2.textContent = "Hart Hagerty";
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "United States";
    			t5 = space();
    			td1 = element("td");
    			t6 = text("Zemlak, Daniel and Leannon\r\n        ");
    			br = element("br");
    			t7 = space();
    			span = element("span");
    			span.textContent = "Desktop Support Technician";
    			t9 = space();
    			td2 = element("td");
    			td2.textContent = "PurZemlak, Daniel and Leannonple";
    			t11 = space();
    			td3 = element("td");
    			td3.textContent = "Zemlak, Daniel and Leannon";
    			t13 = space();
    			th1 = element("th");
    			div6 = element("div");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t14 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Details one CV";
    			t16 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Renew";
    			t18 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Delete";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "checkbox");
    			add_location(input, file$5, 3, 12, 45);
    			add_location(label, file$5, 2, 8, 24);
    			add_location(th0, file$5, 1, 4, 10);
    			if (!src_url_equal(img.src, img_src_value = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA+VBMVEWlxa7///8dHRsAAAAdHR2mxK7y8vCkxa+jxq4aGhj8/Pz5+fn4+Pbp6ekICABXV1etyrNISEhUX1Z4i3lbZ10MCAvd3d22trQQCAN4kYE1NDVldWkUFBIOBg+szraBmIWQppNvfXKcnJuMnZF3in5AS0F6enqgyK0ACQBjY2OasKCswrFmcGjQ0NDCwsIPDw8gJCGnp6cpKSnKyshJUkwQGBC7u7tubm5dXVyQkI5NTU2EhIQ8PDwxMTCctaQqMio3QTmOrZcYExVLWUweKR4ZJh2yyrmkuahYbF1dWlwSFAkTAww3Qjw9Rj8tNS+XpJl5g3ywwLRqhHE8m/VoAAAQYUlEQVR4nO1c+0PayhKOLiEbKLgioJY0oFADiRpAFJ+02p7Q29va0/7/f8yd3U02DyAEao967n4/KCT7+nZmZ2YfrKJISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISPx/QVUVBVvpwOpz4WkoKhgr6XWs3TooGf5k/gAf40+ehCAtN01GtAt4oufAEzEkREsB1kyyHlZuy1OUMafM++bOQTo6O2uguRZaCdzfT9alqapgQDynM0Ko9nLwDiVRQ7XtA9sjzFSsxBDMJ5lWz7tGbabQlwa3jD521JUFaVlOo/y1jN5endaLGwkU1kF+HZSWoF6/uNpC6Gv5c5usaHeI/cE10PgkSe4lIj+4Qw/ok5qdoapopFnW0Vb9udueAQX2d/cBff1sgxgzjkVMOtApg2du+0ooHqGHrp1VUy3SRjo68bvntWCA9K+2ZmViqNnlB/QaNDSOXaT3HS0TQ+/RQGevTIIUA2SMvGXkqB6b4zI6XLn4BR2SpZ9+I2scRwi1TWWJsaGxAfq6vXLhLwLF4fk5UZbYU4y9RjkchNCPJ0fDDIGF0bugkUCkOvrldJzLkDc3Pp2T96JnZMg7PDoR0i5snKLyDsHp4RvGTv/rZVhX6RrV9FwGuGgYt76Fjfo2cjPm3a4n8p4MkZslq+6i61Iojlvj83KG7RqYGdFI5G7mNpcjtwmVod2YzpwiI0NOljtnoNMYQbCLuVymmjc3XRR0T2HjAqHWErePzUptGHRnoYT0jI1kEF1DUV8prx5zT2dolWp1VApaXHRrVTPd62Pvr9qRqOnSnVNeMDzKRpKCrkdG021WCW6yYozbiAx1XrIbjLZyoqZw+PN04bAa1z54qQwxnnZDZavPdKUOY/vyanBxdnY6uLrchHEWrzmM9C5QNh3bNMqoDP9y6ELkHfB6yzeHPq7ivYUGwYsxf4FOwqzdaer6DVZ+dMPkV+VEY9DdYVSZCifggWIJQjczdnO8s90ZUQe9ZTAZXV6dDaCenDsWebf9dou68vGuRiLlbtAXwYMT1LVTGapmcw+VEjX5yKGt6DjzFf8GGaGwdJQPXvQpr/Lh2eF42/cYbs2lqAW6N7w+OjwtiXbqfcGnpvP6BMPSEoZhz5bQXtNKszSqub+HxIw3Lp+EqeRSBFW+rYUURe+8YXl5lmK+fnoxuLq5OWK4uTrcPT0p5cMhy7USvYnzWYFh+KSI9vbNVIZWlGF0gJe3hWiTLC+FMueSDLPNwH6boV6OMkyXIV7AsHz9prAwfrwOtPmpGOb+eYbGbdEPjqI8Az8rDMHLYJjq8RcwjPhUYHR2ddQb3wzqYfh/hV47Q/BVQnaH4PFdF7xYZB2ntIjhHOM0B7vPztDYCqRVzN+GwZgBnrMY4bOcYUzP6b/SGdjYoy3juRmG8WZx6IauIZdDvslfJENjvHtSL+VZgYViqX4CTqNXD7ShdHULbhG8pO/gn4+hcSdEsBUPVMHT0sXeheMwjCwFtoq+HPNjiGxj7X4+huGaxkzMj3o08WCRLU0ih3pBX525yaj+ORmKmq5n5gsu6vVqov5lDI23QUmns3OrVIZ6FE/NUB8u6EpOyoiOzCUMRZuBxMzUI41h7i4K44kZGr3g+2Bus6N00xkaQkfH7uzcKoXhQjwNw/JV8P1ozoR4FYZiCpif+/bZGIaBydJp+zKGwdu5yvCMDMXkOzptj/sBNxvDIHAYz1OGZ2QYzPkLEfuHLk9KJbGRCXP9DAyFX51jk18KQyHD0Pr44EN0CcOtIPXbeQsbz8jwTOQWDFFyc5gvWr1WhiJ8jjBMVl5cieHdC2MobOlQDJ/YEvWfZ5i/3ooiXNF7an/YEybQuP5HGZaQEcVTR21hww7DZru3MC+i+IcYxlM+MUO9H0zoomvgur/o+W9gGDEr20k/JhabXzlDMT+8mJkfnoiSXzND/U4sqm25udgqxjgs+VUzDP17/m102uMOi2HJr5nhphHuzxWvw+AUbefD56+bYejg4dXuEKGyW0bIiC73vnaGwmGwf/XBzdHRoYjH/xUMN8vJuYRA4V/CcBOFm/sRydHKT/8lDPnKaHJ/rbCRd68iDJM7pOsy3PzDDAWP2JqmO5zd496o52o8Bs8/rwxje8DpDK3F+/g6ujzhggv+5K+QQWO6NwW/qsg+/lCfWS9MZZgLl2XzKBktrrSPv2SH1GqhsOCbmbMYt1dnAYfi2VGZlm/c1ekSNk8QHorpza6IpjN0Q2N2m/kshh9Ghmcx6gi1ljCc7IVz+pMZVaPbhu52rze+HIoFNnaCKBHBFuadp9GH4x7DeIbf/PM0h7s+BvG1ORQ83/VXcMOg6wLtTdJPfVme3k0/E0XPwbiuoc8uy2/qblEcGJsnJ52eNqFT2HmlhsHvRtE/glMWZ6ISiRefiYJx46WfhMZe5Z0YECuea8vF1jZ+51wbKH3GE1U8b7gHf+uOvFQZalhpv4udTcx8Oi2nJ3btL7LnBU2/iOUdoFlDtThveOyzjtwO0dIOewND51yMeYhXStvJs2vzoRvIiJ8NL2yc3CFQt2W5dZr3LvnLgDMdLTotFs/tou1SEFgVNm5q3SnGaQxVzSINF9UjZ0pOe1nOCG9u7c45bnPR21yeFW1ezjnQUNzdypJ32IuMjEIePVQ8K90fapYyRe5WvLYMP1B6szGLN6zSbHnn5s+QN5q+sHHkIluxlp1lV8jBHoyoRSegXiwK7FRyJdNv2LwPDzOr9q8BeffhfJqFoGLZ3YdafTbOfskAlSu+faA/t8jEkHSQ7tZfF8ON/K2LGl62XwUpmreDkt7tpaOec7tfvOw/lDWbXR39Z9GJ0peHAkRrqJFNRX2Q1ueygY5exy/YCoMhMrqdpb/qSsBpdA0X3R6elmZ+B7ykvj9DYxHyp0cQgaP3E7Li/QNYIZNLxI6du8O3q+DudnsdbK2F6yE9+4eGTYKt1W9YwKa68/4r2tvbe/dS8V8A+lxprX23AiHEae3vNJahug4qa+F9HJ8anZbjkXUvOaHXmrDrWcx0rHkvxhOA1m6Beq59jYuaMeuz3W0isC7DrDfPpN198kfBG6g8zTUuEhIvDviprmH6TfyRRoBpMtVJ637iEGaKwfUTYrFVSEw8AKY3R4EfMfHEbk1Uk95QhR1scetNjfiyCypobsskkxbNTm8Lgyo8EvU/iqVCCg/a0ZrSJKxdQRpaEW2bCi2JZPM8ku3WCIvYFb4Y+xGCISi3afT75xPaZst2+32jyQy0aVfOWapvHZi1YPAs530fj6OOkxomQtPoBT8s+2OHwNcDvR+FOwHWpP2Npeh+atF2KLhtBO8/fKuytuH9WD63lYmh2QnXskYO6Mk+/WRzhvRjG4JAxavSj/wKog82wZoyja2C2amTUey1w6TfHdU8TiyiTS1t+hh+rXgaZRhL8uhgegtLDD8yMWxFs1SJRXYEQwwM36E2FcEoVvLETDJE0xSKFrajSUfEbMwwnPaj3++8GYboo4fJ3yh2z1MmGZpMNfqjEa9hYvF+sjG9usymYtsnCjng8vv4/i/24dxR8SRef7js5WhskTZyEwA2KzTJ+fvRB5a9ZQkZ1oIuu2X/je/f+dMKmIIEQ9SekWEmhoSmrMKoJUwPOxbmDFnwwLoexqHKSTiEeG22+XRMOMMD8tOZHrC3UYb8xo1IN3Zpdg/sC0vbsByA6tCijj3np6MSNjRQx/E8hxdnW1yGtvPzp+OwtlVNjbVtqjocaqZ1Gtb4DhhIy2EsTCzGIQ4YcqWqUKuKCVc4wZAa2U9MDEGJFoaO8EjU8ps8LVhR1qHvCbt/0aEGrgFj2rI8Ngjp/VZQHKPxyfQZMkvs0Y8jn+FE3OCYybmwKlHVhlbtd9pt27c0E1OwAYZspd/hUS9hdFsmG4cH1PibrNfvBUO10kXucfSqKpPZ0WoLlKANlbR4fKl2mWAsYDDhxGn5Pt2u6jPkj6IMncDJZGS4zVX6fLQPJh9rvq4fs/v1qpyh3/FU9WBu/YN++8Vl2DFBw7wP9GOolJ9ZgR8j81Q+DmGYjTpTzzR5HG1pjCGxVIUPuR14AcwxYaPUNtnDKXV8XEsPfIbVxjFHO9tajS2GO/reApEkRzNq8h5umL7WT/mYYP8qnU7ngNmoviAE+Y3mR9A5UYWKI4b3tm3yFQhLpYsmX0zwrVwxW+yxpnK+Tc4wginW4m1rZJvsk2hBMFbmMLznr/wM/nhNeItO8JrmN36C0JoRhlrUXTRIhGGDMWR6Pokx3E8y7JAkw+NsDGm4EWZqYyUjw7i3+BRWRqnTtoebCuBQtelxeMVOx5zL0E5j+Nj21BmG2ZZMYWiZTrvhRxSPhHqLGvp7H9A84AwZmS/+8ggfgNU4w4PIFSN+wJLYVDBNtdXgYRk6V5IMWcubAUP+jTMccj999xMk6DPs+FdjtidZ4lJ18qP5614DczHdYdHphIQW2eS21CI+d0zn11yrD7iWjn7R+z5bjsctJ4xUlcVE0EXOBDyGovFO+dHcaZoQSjsddmKcR70BQ8e3NFRLqBfldmnCbelPT/1I//9Fr+f0/SGfFkBVy20pVpgdpLeCYd8PTYKYRgniUvAW36gxsiE8BVPqsQDunsvwgFrt0PNpEJIHulVBxi9/C9qkWR49jaoLe92KMYTHrLv6PODGbBgYjvAWDvM1IxIwpGF65gUbrDLvZodubS5D9ujRoT7SY58Nz/f4cT3RQMSgid9/cJL7PkNywNVWw74daylxhthjwdoX2gzNYyKskoChxlUJNYmQoZWVISidxgLv87bjB1+GaibnFk2sqawX+zQVt0o7ZC5D8Gw0FPvBpxIgBs6Qx7fdztSZdhAdC2qSIeHx/3vbcX4wsqCkgiGNqUCHuo7PsN1q+7CXM4QeC08mULcIAecsQ5wMgh+Juoihl6O6SyWJHqcmZ2hxEUEj+b8RiTOEQJaNvci8AdyW0FKIQpi5CeLSEP/J5C5iE5s+9Gc4e7JY37cVCAP+DuuvoQ80gJvOYUjl9SXS1A5m7xMTERAGY4ipOI81vkpL3keTVD2FzS1qLGoLgmEbdDw2e6pmYmja5yLHxykM9lCGPPKG0QQz4HaYqvITWucznBPd3/FU1IRN+UihHj+c/j1OFW4MVb+RjCHmg5VjhyiB4jCGKg+GPyejkWwnFSDeb4+G3bLxWGkT6g5alUq1wmYK2qRSrVbu6TRD07zO6K6MNr8d2x5dMFFUuhnRnLNKDgkfHz+1wSTZ/lvq8b326LGMaCWQnUvWgQKq+4GbVYhz8L3f7fZHHUej0wbVhnZUJpitADtV2pRWqxLbC+lk2+a2LIUQiHgJ8Q0Unftg3st0t4Df+UY70qOp6AVpKnV/iy7Y1jRagApRNAnmiOyqc56dkGByzL5AIBB8AzHSdrD7xGl9mqmx1KxNGuFNIV6wiQHlZ9zHp9OF2JYA/cNjYxjjzEFxdx5Jwhgustd0uoMVP2HAUOWPg+y8J3hKVXSCqIF90YL2iBfa021gSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEi8GvwPu1KU6zrRmq0AAAAASUVORK5CYII=")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$5, 10, 20, 293);
    			attr_dev(div0, "class", "mask mask-squircle w-12 h-12");
    			add_location(div0, file$5, 9, 16, 229);
    			attr_dev(div1, "class", "avatar");
    			add_location(div1, file$5, 8, 12, 191);
    			attr_dev(div2, "class", "font-bold");
    			add_location(div2, file$5, 17, 16, 6504);
    			attr_dev(div3, "class", "text-sm opacity-50");
    			add_location(div3, file$5, 18, 16, 6563);
    			add_location(div4, file$5, 16, 12, 6481);
    			attr_dev(div5, "class", "flex items-center space-x-3");
    			add_location(div5, file$5, 7, 8, 136);
    			add_location(td0, file$5, 6, 4, 122);
    			add_location(br, file$5, 26, 8, 6757);
    			attr_dev(span, "class", "badge badge-ghost badge-sm");
    			add_location(span, file$5, 27, 8, 6773);
    			add_location(td1, file$5, 24, 4, 6707);
    			add_location(td2, file$5, 31, 4, 6888);
    			add_location(td3, file$5, 32, 4, 6935);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z");
    			add_location(path, file$5, 36, 132, 7227);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "class", "inline-block w-5 h-5 stroke-current");
    			add_location(svg, file$5, 36, 16, 7111);
    			attr_dev(button, "tabindex", "0");
    			attr_dev(button, "class", "btn btn-square btn-ghost");
    			add_location(button, file$5, 35, 12, 7039);
    			add_location(a0, file$5, 39, 18, 7579);
    			add_location(li0, file$5, 39, 14, 7575);
    			add_location(a1, file$5, 40, 18, 7625);
    			add_location(li1, file$5, 40, 14, 7621);
    			add_location(a2, file$5, 41, 18, 7662);
    			add_location(li2, file$5, 41, 14, 7658);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52");
    			add_location(ul, file$5, 38, 12, 7472);
    			attr_dev(div6, "class", "dropdown dropdown-end");
    			add_location(div6, file$5, 34, 8, 6990);
    			add_location(th1, file$5, 33, 4, 6976);
    			add_location(tr, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, label);
    			append_dev(label, input);
    			append_dev(tr, t0);
    			append_dev(tr, td0);
    			append_dev(td0, div5);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(tr, t5);
    			append_dev(tr, td1);
    			append_dev(td1, t6);
    			append_dev(td1, br);
    			append_dev(td1, t7);
    			append_dev(td1, span);
    			append_dev(tr, t9);
    			append_dev(tr, td2);
    			append_dev(tr, t11);
    			append_dev(tr, td3);
    			append_dev(tr, t13);
    			append_dev(tr, th1);
    			append_dev(th1, div6);
    			append_dev(div6, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div6, t14);
    			append_dev(div6, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t16);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t18);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItmsAsstbody', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItmsAsstbody> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ItmsAsstbody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItmsAsstbody",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\assistabel.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\pages\\assistabel.svelte";

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let label;
    	let input0;
    	let t0;
    	let th1;
    	let t2;
    	let th2;
    	let t4;
    	let th3;
    	let t6;
    	let th4;
    	let t8;
    	let th5;
    	let div1;
    	let button0;
    	let a0;
    	let t10;
    	let div0;
    	let button1;
    	let svg;
    	let path;
    	let t11;
    	let ul;
    	let li0;
    	let a1;
    	let t13;
    	let li1;
    	let a2;
    	let t15;
    	let tbody;
    	let itmsasstbody;
    	let t16;
    	let div8;
    	let div7;
    	let h3;
    	let t18;
    	let div5;
    	let input1;
    	let t19;
    	let div6;
    	let button2;
    	let t21;
    	let a3;
    	let current;
    	itmsasstbody = new ItmsAsstbody({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			label = element("label");
    			input0 = element("input");
    			t0 = space();
    			th1 = element("th");
    			th1.textContent = "Name";
    			t2 = space();
    			th2 = element("th");
    			th2.textContent = "Job";
    			t4 = space();
    			th3 = element("th");
    			th3.textContent = "Company";
    			t6 = space();
    			th4 = element("th");
    			th4.textContent = "Inform";
    			t8 = space();
    			th5 = element("th");
    			div1 = element("div");
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "Create Resume";
    			t10 = space();
    			div0 = element("div");
    			button1 = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t11 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Delete All";
    			t13 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Save";
    			t15 = space();
    			tbody = element("tbody");
    			create_component(itmsasstbody.$$.fragment);
    			t16 = space();
    			div8 = element("div");
    			div7 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Create Person";
    			t18 = space();
    			div5 = element("div");
    			input1 = element("input");
    			t19 = space();
    			div6 = element("div");
    			button2 = element("button");
    			button2.textContent = "Create";
    			t21 = space();
    			a3 = element("a");
    			a3.textContent = "Yay!";
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "class", "checkbox");
    			add_location(input0, file$4, 12, 16, 329);
    			add_location(label, file$4, 11, 14, 304);
    			add_location(th0, file$4, 10, 12, 284);
    			add_location(th1, file$4, 15, 12, 428);
    			add_location(th2, file$4, 16, 12, 455);
    			add_location(th3, file$4, 17, 12, 481);
    			add_location(th4, file$4, 18, 12, 511);
    			attr_dev(a0, "href", "#my-modal-2");
    			add_location(a0, file$4, 24, 18, 735);
    			attr_dev(button0, "class", "btn");
    			add_location(button0, file$4, 22, 16, 642);
    			attr_dev(path, "d", "M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z");
    			add_location(path, file$4, 35, 23, 1215);
    			attr_dev(svg, "class", "swap-off fill-current");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "32");
    			attr_dev(svg, "height", "32");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			add_location(svg, file$4, 29, 20, 961);
    			attr_dev(button1, "tabindex", "0");
    			attr_dev(button1, "class", "btn");
    			add_location(button1, file$4, 27, 18, 861);
    			add_location(a1, file$4, 41, 24, 1566);
    			add_location(li0, file$4, 41, 20, 1562);
    			add_location(a2, file$4, 42, 24, 1614);
    			add_location(li1, file$4, 42, 20, 1610);
    			attr_dev(ul, "tabindex", "0");
    			attr_dev(ul, "class", "menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52");
    			add_location(ul, file$4, 40, 18, 1421);
    			attr_dev(div0, "class", "dropdown");
    			add_location(div0, file$4, 26, 16, 819);
    			attr_dev(div1, "class", "btn-group ");
    			add_location(div1, file$4, 21, 14, 600);
    			add_location(th5, file$4, 20, 12, 580);
    			add_location(tr, file$4, 9, 10, 266);
    			add_location(thead, file$4, 8, 8, 247);
    			add_location(tbody, file$4, 49, 8, 1765);
    			attr_dev(table, "class", "table w-full");
    			add_location(table, file$4, 6, 6, 186);
    			attr_dev(div2, "class", "w-full");
    			add_location(div2, file$4, 5, 4, 157);
    			attr_dev(div3, "class", "flex flex-col");
    			add_location(div3, file$4, 4, 2, 124);
    			attr_dev(div4, "class", "container-sm");
    			add_location(div4, file$4, 3, 0, 94);
    			attr_dev(h3, "class", "font-bold text-2xl");
    			add_location(h3, file$4, 61, 4, 2005);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Name");
    			attr_dev(input1, "class", "input input-bordered w-full");
    			add_location(input1, file$4, 63, 6, 2106);
    			attr_dev(div5, "class", "flex flex-col gap-2 mt-4");
    			add_location(div5, file$4, 62, 4, 2060);
    			attr_dev(button2, "class", "btn btn-primary");
    			add_location(button2, file$4, 70, 6, 2268);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "btn");
    			add_location(a3, file$4, 71, 6, 2323);
    			attr_dev(div6, "class", "modal-action");
    			add_location(div6, file$4, 69, 4, 2234);
    			attr_dev(div7, "class", "modal-box");
    			add_location(div7, file$4, 60, 2, 1976);
    			attr_dev(div8, "class", "modal");
    			attr_dev(div8, "id", "my-modal-2");
    			add_location(div8, file$4, 59, 0, 1937);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(th0, label);
    			append_dev(label, input0);
    			append_dev(tr, t0);
    			append_dev(tr, th1);
    			append_dev(tr, t2);
    			append_dev(tr, th2);
    			append_dev(tr, t4);
    			append_dev(tr, th3);
    			append_dev(tr, t6);
    			append_dev(tr, th4);
    			append_dev(tr, t8);
    			append_dev(tr, th5);
    			append_dev(th5, div1);
    			append_dev(div1, button0);
    			append_dev(button0, a0);
    			append_dev(div1, t10);
    			append_dev(div1, div0);
    			append_dev(div0, button1);
    			append_dev(button1, svg);
    			append_dev(svg, path);
    			append_dev(div0, t11);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t13);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(table, t15);
    			append_dev(table, tbody);
    			mount_component(itmsasstbody, tbody, null);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, h3);
    			append_dev(div7, t18);
    			append_dev(div7, div5);
    			append_dev(div5, input1);
    			append_dev(div7, t19);
    			append_dev(div7, div6);
    			append_dev(div6, button2);
    			append_dev(div6, t21);
    			append_dev(div6, a3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itmsasstbody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itmsasstbody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(itmsasstbody);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(div8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Assistabel', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Assistabel> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ItmsAsstbody });
    	return [];
    }

    class Assistabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Assistabel",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\about.svelte generated by Svelte v3.48.0 */

    const file$3 = "src\\pages\\about.svelte";

    function create_fragment$3(ctx) {
    	let div7;
    	let div0;
    	let h2;
    	let t1;
    	let p0;
    	let t3;
    	let div6;
    	let div1;
    	let img;
    	let img_src_value;
    	let t4;
    	let div5;
    	let h3;
    	let t6;
    	let p1;
    	let t8;
    	let div4;
    	let div2;
    	let ul0;
    	let li0;
    	let strong0;
    	let t10;
    	let span0;
    	let t12;
    	let li1;
    	let strong1;
    	let t14;
    	let span1;
    	let t16;
    	let li2;
    	let strong2;
    	let t18;
    	let span2;
    	let t20;
    	let li3;
    	let strong3;
    	let t22;
    	let span3;
    	let t24;
    	let div3;
    	let ul1;
    	let li4;
    	let strong4;
    	let t26;
    	let span4;
    	let t28;
    	let li5;
    	let strong5;
    	let t30;
    	let span5;
    	let t32;
    	let li6;
    	let strong6;
    	let t34;
    	let span6;
    	let t36;
    	let li7;
    	let strong7;
    	let t38;
    	let span7;
    	let t40;
    	let p2;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "About";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Learn more about me";
    			t3 = space();
    			div6 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t4 = space();
    			div5 = element("div");
    			h3 = element("h3");
    			h3.textContent = "UI/UX & Graphic Designer";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod\r\n        tempor incididunt ut labore et dolore magna aliqua.";
    			t8 = space();
    			div4 = element("div");
    			div2 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			strong0 = element("strong");
    			strong0.textContent = "Birthday:";
    			t10 = space();
    			span0 = element("span");
    			span0.textContent = "1 May 1995";
    			t12 = space();
    			li1 = element("li");
    			strong1 = element("strong");
    			strong1.textContent = "Website:";
    			t14 = space();
    			span1 = element("span");
    			span1.textContent = "www.example.com";
    			t16 = space();
    			li2 = element("li");
    			strong2 = element("strong");
    			strong2.textContent = "Phone:";
    			t18 = space();
    			span2 = element("span");
    			span2.textContent = "+123 456 7890";
    			t20 = space();
    			li3 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "City:";
    			t22 = space();
    			span3 = element("span");
    			span3.textContent = "New York, USA";
    			t24 = space();
    			div3 = element("div");
    			ul1 = element("ul");
    			li4 = element("li");
    			strong4 = element("strong");
    			strong4.textContent = "Age:";
    			t26 = space();
    			span4 = element("span");
    			span4.textContent = "30";
    			t28 = space();
    			li5 = element("li");
    			strong5 = element("strong");
    			strong5.textContent = "Degree:";
    			t30 = space();
    			span5 = element("span");
    			span5.textContent = "Master";
    			t32 = space();
    			li6 = element("li");
    			strong6 = element("strong");
    			strong6.textContent = "PhEmailone:";
    			t34 = space();
    			span6 = element("span");
    			span6.textContent = "email@example.com";
    			t36 = space();
    			li7 = element("li");
    			strong7 = element("strong");
    			strong7.textContent = "Freelance:";
    			t38 = space();
    			span7 = element("span");
    			span7.textContent = "Available";
    			t40 = space();
    			p2 = element("p");
    			p2.textContent = "Officiis eligendi itaque labore et dolorum mollitia officiis optio vero.\r\n        Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt\r\n        officia tempore. Et eius omnis. Cupiditate ut dicta maxime officiis\r\n        quidem quia. Sed et consectetur qui quia repellendus itaque neque.\r\n        Aliquid amet quidem ut quaerat cupiditate. Ab et eum qui repellendus\r\n        omnis culpa magni laudantium dolores.";
    			add_location(h2, file$3, 4, 4, 51);
    			add_location(p0, file$3, 5, 4, 71);
    			add_location(div0, file$3, 3, 2, 40);
    			if (!src_url_equal(img.src, img_src_value = "assets/img/me.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$3, 10, 6, 171);
    			attr_dev(div1, "data-aos", "fade-right");
    			add_location(div1, file$3, 9, 4, 136);
    			add_location(h3, file$3, 13, 6, 261);
    			add_location(p1, file$3, 14, 6, 306);
    			add_location(strong0, file$3, 21, 16, 537);
    			add_location(span0, file$3, 21, 43, 564);
    			add_location(li0, file$3, 21, 12, 533);
    			add_location(strong1, file$3, 22, 16, 610);
    			add_location(span1, file$3, 22, 42, 636);
    			add_location(li1, file$3, 22, 12, 606);
    			add_location(strong2, file$3, 23, 16, 687);
    			add_location(span2, file$3, 23, 40, 711);
    			add_location(li2, file$3, 23, 12, 683);
    			add_location(strong3, file$3, 24, 16, 760);
    			add_location(span3, file$3, 24, 39, 783);
    			add_location(li3, file$3, 24, 12, 756);
    			add_location(ul0, file$3, 20, 10, 515);
    			add_location(div2, file$3, 19, 8, 498);
    			add_location(strong4, file$3, 29, 16, 896);
    			add_location(span4, file$3, 29, 38, 918);
    			add_location(li4, file$3, 29, 12, 892);
    			add_location(strong5, file$3, 30, 16, 956);
    			add_location(span5, file$3, 30, 41, 981);
    			add_location(li5, file$3, 30, 12, 952);
    			add_location(strong6, file$3, 31, 16, 1023);
    			add_location(span6, file$3, 31, 45, 1052);
    			add_location(li6, file$3, 31, 12, 1019);
    			add_location(strong7, file$3, 32, 16, 1105);
    			add_location(span7, file$3, 32, 44, 1133);
    			add_location(li7, file$3, 32, 12, 1101);
    			add_location(ul1, file$3, 28, 10, 874);
    			add_location(div3, file$3, 27, 8, 857);
    			attr_dev(div4, "class", "row");
    			add_location(div4, file$3, 18, 6, 471);
    			add_location(p2, file$3, 36, 6, 1215);
    			attr_dev(div5, "data-aos", "fade-left");
    			add_location(div5, file$3, 12, 4, 227);
    			attr_dev(div6, "class", "row");
    			add_location(div6, file$3, 8, 2, 113);
    			add_location(div7, file$3, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, div1);
    			append_dev(div1, img);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, h3);
    			append_dev(div5, t6);
    			append_dev(div5, p1);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, ul0);
    			append_dev(ul0, li0);
    			append_dev(li0, strong0);
    			append_dev(li0, t10);
    			append_dev(li0, span0);
    			append_dev(ul0, t12);
    			append_dev(ul0, li1);
    			append_dev(li1, strong1);
    			append_dev(li1, t14);
    			append_dev(li1, span1);
    			append_dev(ul0, t16);
    			append_dev(ul0, li2);
    			append_dev(li2, strong2);
    			append_dev(li2, t18);
    			append_dev(li2, span2);
    			append_dev(ul0, t20);
    			append_dev(ul0, li3);
    			append_dev(li3, strong3);
    			append_dev(li3, t22);
    			append_dev(li3, span3);
    			append_dev(div4, t24);
    			append_dev(div4, div3);
    			append_dev(div3, ul1);
    			append_dev(ul1, li4);
    			append_dev(li4, strong4);
    			append_dev(li4, t26);
    			append_dev(li4, span4);
    			append_dev(ul1, t28);
    			append_dev(ul1, li5);
    			append_dev(li5, strong5);
    			append_dev(li5, t30);
    			append_dev(li5, span5);
    			append_dev(ul1, t32);
    			append_dev(ul1, li6);
    			append_dev(li6, strong6);
    			append_dev(li6, t34);
    			append_dev(li6, span6);
    			append_dev(ul1, t36);
    			append_dev(ul1, li7);
    			append_dev(li7, strong7);
    			append_dev(li7, t38);
    			append_dev(li7, span7);
    			append_dev(div5, t40);
    			append_dev(div5, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Details.svelte generated by Svelte v3.48.0 */

    const file$2 = "src\\pages\\Details.svelte";

    function create_fragment$2(ctx) {
    	let div5;
    	let div4;
    	let div3;
    	let div2;
    	let figure;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let h20;
    	let t2;
    	let p;
    	let t4;
    	let div0;
    	let label0;
    	let t6;
    	let input;
    	let t7;
    	let label2;
    	let label1;
    	let div8;
    	let div6;
    	let h1;
    	let t8;
    	let br0;
    	let t9;
    	let t10;
    	let button0;
    	let a0;
    	let t12;
    	let div7;
    	let h21;
    	let t13;
    	let br1;
    	let t14;
    	let t15;
    	let button1;
    	let a1;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			figure = element("figure");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Name";
    			t2 = space();
    			p = element("p");
    			p.textContent = "If a dog chews shoes whose shoes does he choose?";
    			t4 = space();
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "open modal";
    			t6 = space();
    			input = element("input");
    			t7 = space();
    			label2 = element("label");
    			label1 = element("label");
    			div8 = element("div");
    			div6 = element("div");
    			h1 = element("h1");
    			t8 = text("Temur ");
    			br0 = element("br");
    			t9 = text("\r\n                    +99851454634");
    			t10 = space();
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "Phone";
    			t12 = space();
    			div7 = element("div");
    			h21 = element("h2");
    			t13 = text("Send a Message ");
    			br1 = element("br");
    			t14 = text("\r\n                    temurpulatov.888@gmail.com");
    			t15 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "Message";
    			if (!src_url_equal(img.src, img_src_value = "https://api.lorem.space/image/shoes?w=400&h=225")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Shoes");
    			add_location(img, file$2, 8, 20, 274);
    			add_location(figure, file$2, 7, 16, 244);
    			attr_dev(h20, "class", "card-title");
    			add_location(h20, file$2, 14, 20, 508);
    			add_location(p, file$2, 15, 20, 562);
    			attr_dev(label0, "for", "my-modal-4");
    			attr_dev(label0, "class", "btn modal-button");
    			add_location(label0, file$2, 18, 24, 762);
    			attr_dev(div0, "class", "card-actions justify-end");
    			add_location(div0, file$2, 16, 20, 639);
    			attr_dev(div1, "class", "card-body");
    			add_location(div1, file$2, 13, 16, 463);
    			attr_dev(div2, "class", "card w-full bg-base-100 shadow-xl");
    			add_location(div2, file$2, 6, 12, 179);
    			attr_dev(div3, "class", "grid gap-4 grid-cols-5");
    			add_location(div3, file$2, 4, 8, 100);
    			attr_dev(div4, "class", "flex flex-col");
    			add_location(div4, file$2, 3, 4, 63);
    			attr_dev(div5, "class", "container-sm");
    			add_location(div5, file$2, 2, 0, 31);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "my-modal-4");
    			attr_dev(input, "class", "modal-toggle");
    			add_location(input, file$2, 29, 0, 1040);
    			add_location(br0, file$2, 35, 26, 1305);
    			add_location(h1, file$2, 34, 16, 1273);
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$2, 38, 36, 1406);
    			attr_dev(button0, "class", "btn");
    			add_location(button0, file$2, 38, 16, 1386);
    			add_location(div6, file$2, 33, 12, 1250);
    			add_location(br1, file$2, 42, 35, 1534);
    			add_location(h21, file$2, 41, 16, 1493);
    			attr_dev(a1, "type", "email");
    			attr_dev(a1, "href", "temurpulatov.888 ");
    			add_location(a1, file$2, 46, 21, 1671);
    			attr_dev(button1, "class", "btn");
    			add_location(button1, file$2, 45, 16, 1629);
    			add_location(div7, file$2, 40, 12, 1470);
    			attr_dev(div8, "class", "flex-row");
    			add_location(div8, file$2, 32, 8, 1214);
    			attr_dev(label1, "class", "modal-box relative");
    			attr_dev(label1, "for", "");
    			add_location(label1, file$2, 31, 4, 1163);
    			attr_dev(label2, "for", "my-modal-4");
    			attr_dev(label2, "class", "modal cursor-pointer");
    			add_location(label2, file$2, 30, 0, 1104);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, figure);
    			append_dev(figure, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t2);
    			append_dev(div1, p);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, label0);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, label2, anchor);
    			append_dev(label2, label1);
    			append_dev(label1, div8);
    			append_dev(div8, div6);
    			append_dev(div6, h1);
    			append_dev(h1, t8);
    			append_dev(h1, br0);
    			append_dev(h1, t9);
    			append_dev(div6, t10);
    			append_dev(div6, button0);
    			append_dev(button0, a0);
    			append_dev(div8, t12);
    			append_dev(div8, div7);
    			append_dev(div7, h21);
    			append_dev(h21, t13);
    			append_dev(h21, br1);
    			append_dev(h21, t14);
    			append_dev(div7, t15);
    			append_dev(div7, button1);
    			append_dev(button1, a1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(label2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Details', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Details> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Details extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Details",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Contact.svelte generated by Svelte v3.48.0 */

    const file$1 = "src\\pages\\Contact.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let div21;
    	let div0;
    	let h2;
    	let t1;
    	let p0;
    	let t3;
    	let div10;
    	let div2;
    	let div1;
    	let i0;
    	let t4;
    	let h30;
    	let t6;
    	let p1;
    	let t8;
    	let div5;
    	let div4;
    	let i1;
    	let t9;
    	let h31;
    	let t11;
    	let div3;
    	let a0;
    	let i2;
    	let t12;
    	let a1;
    	let i3;
    	let t13;
    	let a2;
    	let i4;
    	let t14;
    	let a3;
    	let i5;
    	let t15;
    	let a4;
    	let i6;
    	let t16;
    	let div7;
    	let div6;
    	let i7;
    	let t17;
    	let h32;
    	let t19;
    	let p2;
    	let t21;
    	let div9;
    	let div8;
    	let i8;
    	let t22;
    	let h33;
    	let t24;
    	let p3;
    	let t26;
    	let form;
    	let div13;
    	let div11;
    	let input0;
    	let t27;
    	let div12;
    	let input1;
    	let t28;
    	let div14;
    	let input2;
    	let t29;
    	let div15;
    	let textarea;
    	let t30;
    	let div19;
    	let div16;
    	let t32;
    	let div17;
    	let t33;
    	let div18;
    	let t35;
    	let div20;
    	let button;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div21 = element("div");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Contact";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Contact Me";
    			t3 = space();
    			div10 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t4 = space();
    			h30 = element("h3");
    			h30.textContent = "My Address";
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "A108 Adam Street, New York, NY 535022";
    			t8 = space();
    			div5 = element("div");
    			div4 = element("div");
    			i1 = element("i");
    			t9 = space();
    			h31 = element("h3");
    			h31.textContent = "Social Profiles";
    			t11 = space();
    			div3 = element("div");
    			a0 = element("a");
    			i2 = element("i");
    			t12 = space();
    			a1 = element("a");
    			i3 = element("i");
    			t13 = space();
    			a2 = element("a");
    			i4 = element("i");
    			t14 = space();
    			a3 = element("a");
    			i5 = element("i");
    			t15 = space();
    			a4 = element("a");
    			i6 = element("i");
    			t16 = space();
    			div7 = element("div");
    			div6 = element("div");
    			i7 = element("i");
    			t17 = space();
    			h32 = element("h3");
    			h32.textContent = "Email Me";
    			t19 = space();
    			p2 = element("p");
    			p2.textContent = "contact@example.com";
    			t21 = space();
    			div9 = element("div");
    			div8 = element("div");
    			i8 = element("i");
    			t22 = space();
    			h33 = element("h3");
    			h33.textContent = "Call Me";
    			t24 = space();
    			p3 = element("p");
    			p3.textContent = "+1 5589 55488 55";
    			t26 = space();
    			form = element("form");
    			div13 = element("div");
    			div11 = element("div");
    			input0 = element("input");
    			t27 = space();
    			div12 = element("div");
    			input1 = element("input");
    			t28 = space();
    			div14 = element("div");
    			input2 = element("input");
    			t29 = space();
    			div15 = element("div");
    			textarea = element("textarea");
    			t30 = space();
    			div19 = element("div");
    			div16 = element("div");
    			div16.textContent = "Loading";
    			t32 = space();
    			div17 = element("div");
    			t33 = space();
    			div18 = element("div");
    			div18.textContent = "Your message has been sent. Thank you!";
    			t35 = space();
    			div20 = element("div");
    			button = element("button");
    			button.textContent = "Send Message";
    			add_location(h2, file$1, 4, 8, 114);
    			add_location(p0, file$1, 5, 8, 140);
    			attr_dev(div0, "class", "section-title");
    			add_location(div0, file$1, 3, 6, 77);
    			attr_dev(i0, "class", "bx bx-map");
    			add_location(i0, file$1, 12, 12, 312);
    			add_location(h30, file$1, 13, 12, 351);
    			add_location(p1, file$1, 14, 12, 384);
    			attr_dev(div1, "class", "info-box");
    			add_location(div1, file$1, 11, 10, 276);
    			attr_dev(div2, "class", "col-md-6 d-flex align-items-stretch");
    			add_location(div2, file$1, 10, 8, 215);
    			attr_dev(i1, "class", "bx bx-share-alt");
    			add_location(i1, file$1, 20, 12, 584);
    			add_location(h31, file$1, 21, 12, 629);
    			attr_dev(i2, "class", "bi bi-twitter");
    			add_location(i2, file$1, 23, 42, 737);
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "twitter");
    			add_location(a0, file$1, 23, 14, 709);
    			attr_dev(i3, "class", "bi bi-facebook");
    			add_location(i3, file$1, 24, 43, 815);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "facebook");
    			add_location(a1, file$1, 24, 14, 786);
    			attr_dev(i4, "class", "bi bi-instagram");
    			add_location(i4, file$1, 25, 44, 895);
    			attr_dev(a2, "href", "#");
    			attr_dev(a2, "class", "instagram");
    			add_location(a2, file$1, 25, 14, 865);
    			attr_dev(i5, "class", "bi bi-skype");
    			add_location(i5, file$1, 26, 46, 978);
    			attr_dev(a3, "href", "#");
    			attr_dev(a3, "class", "google-plus");
    			add_location(a3, file$1, 26, 14, 946);
    			attr_dev(i6, "class", "bi bi-linkedin");
    			add_location(i6, file$1, 27, 43, 1054);
    			attr_dev(a4, "href", "#");
    			attr_dev(a4, "class", "linkedin");
    			add_location(a4, file$1, 27, 14, 1025);
    			attr_dev(div3, "class", "social-links");
    			add_location(div3, file$1, 22, 12, 667);
    			attr_dev(div4, "class", "info-box");
    			add_location(div4, file$1, 19, 10, 548);
    			attr_dev(div5, "class", "col-md-6 mt-4 mt-md-0 d-flex align-items-stretch");
    			add_location(div5, file$1, 18, 8, 474);
    			attr_dev(i7, "class", "bx bx-envelope");
    			add_location(i7, file$1, 34, 12, 1256);
    			add_location(h32, file$1, 35, 12, 1300);
    			add_location(p2, file$1, 36, 12, 1331);
    			attr_dev(div6, "class", "info-box");
    			add_location(div6, file$1, 33, 10, 1220);
    			attr_dev(div7, "class", "col-md-6 mt-4 d-flex align-items-stretch");
    			add_location(div7, file$1, 32, 8, 1154);
    			attr_dev(i8, "class", "bx bx-phone-call");
    			add_location(i8, file$1, 41, 12, 1503);
    			add_location(h33, file$1, 42, 12, 1549);
    			add_location(p3, file$1, 43, 12, 1579);
    			attr_dev(div8, "class", "info-box");
    			add_location(div8, file$1, 40, 10, 1467);
    			attr_dev(div9, "class", "col-md-6 mt-4 d-flex align-items-stretch");
    			add_location(div9, file$1, 39, 8, 1401);
    			attr_dev(div10, "class", "row mt-2");
    			add_location(div10, file$1, 8, 6, 181);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "class", "form-control");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Your Name");
    			input0.required = true;
    			add_location(input0, file$1, 51, 12, 1833);
    			attr_dev(div11, "class", "col-md-6 form-group");
    			add_location(div11, file$1, 50, 10, 1786);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-control");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "id", "email");
    			attr_dev(input1, "placeholder", "Your Email");
    			input1.required = true;
    			add_location(input1, file$1, 54, 12, 2018);
    			attr_dev(div12, "class", "col-md-6 form-group mt-3 mt-md-0");
    			add_location(div12, file$1, 53, 10, 1958);
    			attr_dev(div13, "class", "row");
    			add_location(div13, file$1, 49, 8, 1757);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "class", "form-control");
    			attr_dev(input2, "name", "subject");
    			attr_dev(input2, "id", "subject");
    			attr_dev(input2, "placeholder", "Subject");
    			input2.required = true;
    			add_location(input2, file$1, 58, 10, 2202);
    			attr_dev(div14, "class", "form-group mt-3");
    			add_location(div14, file$1, 57, 8, 2161);
    			attr_dev(textarea, "class", "form-control");
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "rows", "5");
    			attr_dev(textarea, "placeholder", "Message");
    			textarea.required = true;
    			add_location(textarea, file$1, 61, 10, 2368);
    			attr_dev(div15, "class", "form-group mt-3");
    			add_location(div15, file$1, 60, 8, 2327);
    			attr_dev(div16, "class", "loading");
    			add_location(div16, file$1, 64, 10, 2521);
    			attr_dev(div17, "class", "error-message");
    			add_location(div17, file$1, 65, 10, 2567);
    			attr_dev(div18, "class", "sent-message");
    			add_location(div18, file$1, 66, 10, 2612);
    			attr_dev(div19, "class", "my-3");
    			add_location(div19, file$1, 63, 8, 2491);
    			attr_dev(button, "type", "submit");
    			add_location(button, file$1, 68, 33, 2733);
    			attr_dev(div20, "class", "text-center");
    			add_location(div20, file$1, 68, 8, 2708);
    			attr_dev(form, "action", "forms/contact.php");
    			attr_dev(form, "method", "post");
    			attr_dev(form, "role", "form");
    			attr_dev(form, "class", "php-email-form mt-4");
    			add_location(form, file$1, 48, 6, 1660);
    			attr_dev(div21, "class", "container");
    			add_location(div21, file$1, 1, 4, 44);
    			attr_dev(section, "id", "contact");
    			attr_dev(section, "class", "contact");
    			add_location(section, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div21);
    			append_dev(div21, div0);
    			append_dev(div0, h2);
    			append_dev(div0, t1);
    			append_dev(div0, p0);
    			append_dev(div21, t3);
    			append_dev(div21, div10);
    			append_dev(div10, div2);
    			append_dev(div2, div1);
    			append_dev(div1, i0);
    			append_dev(div1, t4);
    			append_dev(div1, h30);
    			append_dev(div1, t6);
    			append_dev(div1, p1);
    			append_dev(div10, t8);
    			append_dev(div10, div5);
    			append_dev(div5, div4);
    			append_dev(div4, i1);
    			append_dev(div4, t9);
    			append_dev(div4, h31);
    			append_dev(div4, t11);
    			append_dev(div4, div3);
    			append_dev(div3, a0);
    			append_dev(a0, i2);
    			append_dev(div3, t12);
    			append_dev(div3, a1);
    			append_dev(a1, i3);
    			append_dev(div3, t13);
    			append_dev(div3, a2);
    			append_dev(a2, i4);
    			append_dev(div3, t14);
    			append_dev(div3, a3);
    			append_dev(a3, i5);
    			append_dev(div3, t15);
    			append_dev(div3, a4);
    			append_dev(a4, i6);
    			append_dev(div10, t16);
    			append_dev(div10, div7);
    			append_dev(div7, div6);
    			append_dev(div6, i7);
    			append_dev(div6, t17);
    			append_dev(div6, h32);
    			append_dev(div6, t19);
    			append_dev(div6, p2);
    			append_dev(div10, t21);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, i8);
    			append_dev(div8, t22);
    			append_dev(div8, h33);
    			append_dev(div8, t24);
    			append_dev(div8, p3);
    			append_dev(div21, t26);
    			append_dev(div21, form);
    			append_dev(form, div13);
    			append_dev(div13, div11);
    			append_dev(div11, input0);
    			append_dev(div13, t27);
    			append_dev(div13, div12);
    			append_dev(div12, input1);
    			append_dev(form, t28);
    			append_dev(form, div14);
    			append_dev(div14, input2);
    			append_dev(form, t29);
    			append_dev(form, div15);
    			append_dev(div15, textarea);
    			append_dev(form, t30);
    			append_dev(form, div19);
    			append_dev(div19, div16);
    			append_dev(div19, t32);
    			append_dev(div19, div17);
    			append_dev(div19, t33);
    			append_dev(div19, div18);
    			append_dev(form, t35);
    			append_dev(form, div20);
    			append_dev(div20, button);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */
    const file = "src\\App.svelte";

    // (34:24) <Link to="/about">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(34:24) <Link to=\\\"/about\\\">",
    		ctx
    	});

    	return block;
    }

    // (35:24) <Link to="/assistabel">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Assistant");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(35:24) <Link to=\\\"/assistabel\\\">",
    		ctx
    	});

    	return block;
    }

    // (36:24) <Link to="/details">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Details");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(36:24) <Link to=\\\"/details\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:24) <Link to="/contact">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Contact");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(37:24) <Link to=\\\"/contact\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:24) <Link to="/" class="singbtn rounded-lg text-white">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Sing-in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(38:24) <Link to=\\\"/\\\" class=\\\"singbtn rounded-lg text-white\\\">",
    		ctx
    	});

    	return block;
    }

    // (8:0) <Router>
    function create_default_slot(ctx) {
    	let main;
    	let div6;
    	let div0;
    	let h1;
    	let t1;
    	let div3;
    	let div2;
    	let div1;
    	let input;
    	let t2;
    	let button;
    	let svg;
    	let path;
    	let t3;
    	let div5;
    	let div4;
    	let ul;
    	let li0;
    	let link0;
    	let t4;
    	let li1;
    	let link1;
    	let t5;
    	let li2;
    	let link2;
    	let t6;
    	let li3;
    	let link3;
    	let t7;
    	let li4;
    	let link4;
    	let t8;
    	let route0;
    	let t9;
    	let route1;
    	let t10;
    	let route2;
    	let t11;
    	let route3;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/about",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/assistabel",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/details",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/contact",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/",
    				class: "singbtn rounded-lg text-white",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: {
    				path: "/assistabel",
    				component: Assistabel
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: { path: "/about", component: About },
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: { path: "/details", component: Details },
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: { path: "/contact", component: Contact },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div6 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "daisyUI";
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t3 = space();
    			div5 = element("div");
    			div4 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t4 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t5 = space();
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t6 = space();
    			li3 = element("li");
    			create_component(link3.$$.fragment);
    			t7 = space();
    			li4 = element("li");
    			create_component(link4.$$.fragment);
    			t8 = space();
    			create_component(route0.$$.fragment);
    			t9 = space();
    			create_component(route1.$$.fragment);
    			t10 = space();
    			create_component(route2.$$.fragment);
    			t11 = space();
    			create_component(route3.$$.fragment);
    			attr_dev(h1, "class", "text-ghost normal-case text-5xl");
    			add_location(h1, file, 12, 16, 428);
    			attr_dev(div0, "class", "navbar-start");
    			add_location(div0, file, 11, 12, 385);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search…");
    			attr_dev(input, "class", "input input-bordered");
    			add_location(input, file, 18, 20, 654);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
    			add_location(path, file, 20, 134, 913);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file, 20, 24, 803);
    			attr_dev(button, "class", "btn btn-square");
    			add_location(button, file, 19, 20, 747);
    			attr_dev(div1, "class", "input-group");
    			add_location(div1, file, 17, 20, 608);
    			attr_dev(div2, "class", "form-control");
    			add_location(div2, file, 16, 16, 561);
    			attr_dev(div3, "class", "navbar-center");
    			add_location(div3, file, 14, 12, 516);
    			add_location(li0, file, 33, 20, 1419);
    			add_location(li1, file, 34, 20, 1479);
    			add_location(li2, file, 35, 20, 1548);
    			add_location(li3, file, 36, 20, 1612);
    			add_location(li4, file, 37, 20, 1682);
    			attr_dev(ul, "class", "menu menu-horizontal flex justify-between ");
    			add_location(ul, file, 31, 20, 1289);
    			attr_dev(div4, "class", "flex justify-around");
    			add_location(div4, file, 29, 16, 1233);
    			attr_dev(div5, "class", "navbar-end");
    			add_location(div5, file, 26, 12, 1175);
    			attr_dev(div6, "class", "navbar h-24 bg-base-100");
    			add_location(div6, file, 10, 8, 335);
    			attr_dev(main, "class", "container mx-auto");
    			add_location(main, file, 8, 4, 289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div6);
    			append_dev(div6, div0);
    			append_dev(div0, h1);
    			append_dev(div6, t1);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(div6, t3);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t4);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			mount_component(link2, li2, null);
    			append_dev(ul, t6);
    			append_dev(ul, li3);
    			mount_component(link3, li3, null);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			mount_component(link4, li4, null);
    			append_dev(main, t8);
    			mount_component(route0, main, null);
    			append_dev(main, t9);
    			mount_component(route1, main, null);
    			append_dev(main, t10);
    			mount_component(route2, main, null);
    			append_dev(main, t11);
    			mount_component(route3, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Link: Link$1,
    		Route: Route$1,
    		Assistabel,
    		About,
    		Details,
    		Contact
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
