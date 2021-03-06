(function () {
    'use strict';

    var n,u,i,t,o={},f=[],e=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function c(n,l){for(var u in l)n[u]=l[u];return n}function s(n){var l=n.parentNode;l&&l.removeChild(n);}function a(n,l,u){var i,t,r,o=arguments,f={};for(r in l)"key"==r?i=l[r]:"ref"==r?t=l[r]:f[r]=l[r];if(arguments.length>3)for(u=[u],r=3;r<arguments.length;r++)u.push(o[r]);if(null!=u&&(f.children=u),"function"==typeof n&&null!=n.defaultProps)for(r in n.defaultProps)void 0===f[r]&&(f[r]=n.defaultProps[r]);return v(n,f,i,t,null)}function v(l,u,i,t,r){var o={type:l,props:u,key:i,ref:t,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++n.__v:r};return null!=n.vnode&&n.vnode(o),o}function y(n){return n.children}function p(n,l){this.props=n,this.context=l;}function d(n,l){if(null==l)return n.__?d(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?d(n):null}function _(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return _(n)}}function k(l){(!l.__d&&(l.__d=!0)&&u.push(l)&&!m.__r++||t!==n.debounceRendering)&&((t=n.debounceRendering)||i)(m);}function m(){for(var n;m.__r=u.length;)n=u.sort(function(n,l){return n.__v.__b-l.__v.__b}),u=[],n.some(function(n){var l,u,i,t,r,o;n.__d&&(r=(t=(l=n).__v).__e,(o=l.__P)&&(u=[],(i=c({},t)).__v=t.__v+1,T(o,t,i,l.__n,void 0!==o.ownerSVGElement,null!=t.__h?[r]:null,u,null==r?d(t):r,t.__h),j(u,t),t.__e!=r&&_(t)));});}function b(n,l,u,i,t,r,e,c,s,a){var h,p,_,k,m,b,w,A=i&&i.__k||f,P=A.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(k=u.__k[h]=null==(k=l[h])||"boolean"==typeof k?null:"string"==typeof k||"number"==typeof k?v(null,k,null,null,k):Array.isArray(k)?v(y,{children:k},null,null,null):k.__b>0?v(k.type,k.props,k.key,null,k.__v):k)){if(k.__=u,k.__b=u.__b+1,null===(_=A[h])||_&&k.key==_.key&&k.type===_.type)A[h]=void 0;else for(p=0;p<P;p++){if((_=A[p])&&k.key==_.key&&k.type===_.type){A[p]=void 0;break}_=null;}T(n,k,_=_||o,t,r,e,c,s,a),m=k.__e,(p=k.ref)&&_.ref!=p&&(w||(w=[]),_.ref&&w.push(_.ref,null,k),w.push(p,k.__c||m,k)),null!=m?(null==b&&(b=m),"function"==typeof k.type&&null!=k.__k&&k.__k===_.__k?k.__d=s=g(k,s,n):s=x(n,k,_,A,m,s),a||"option"!==u.type?"function"==typeof u.type&&(u.__d=s):n.value=""):s&&_.__e==s&&s.parentNode!=n&&(s=d(_));}for(u.__e=b,h=P;h--;)null!=A[h]&&("function"==typeof u.type&&null!=A[h].__e&&A[h].__e==u.__d&&(u.__d=d(i,h+1)),L(A[h],A[h]));if(w)for(h=0;h<w.length;h++)I(w[h],w[++h],w[++h]);}function g(n,l,u){var i,t;for(i=0;i<n.__k.length;i++)(t=n.__k[i])&&(t.__=n,l="function"==typeof t.type?g(t,l,u):x(u,t,t,n.__k,t.__e,l));return l}function x(n,l,u,i,t,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||t!=r||null==t.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(t),o=null;else {for(f=r,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,r),o=r;}return void 0!==o?o:t.nextSibling}function A(n,l,u,i,t){var r;for(r in u)"children"===r||"key"===r||r in l||C(n,r,null,u[r],i);for(r in l)t&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||C(n,r,l[r],u[r],i);}function P(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||e.test(l)?u:u+"px";}function C(n,l,u,i,t){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||P(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||P(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?i||n.addEventListener(l,r?H:$,r):n.removeEventListener(l,r?H:$,r);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function $(l){this.l[l.type+!1](n.event?n.event(l):l);}function H(l){this.l[l.type+!0](n.event?n.event(l):l);}function T(l,u,i,t,r,o,f,e,s){var a,v,h,d,_,k,m,g,w,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(s=i.__h,e=u.__e=i.__e,u.__h=null,o=[e]),(a=n.__b)&&a(u);try{n:if("function"==typeof P){if(g=u.props,w=(a=P.contextType)&&t[a.__c],x=a?w?w.props.value:a.__:t,i.__c?m=(v=u.__c=i.__c).__=v.__E:("prototype"in P&&P.prototype.render?u.__c=v=new P(g,x):(u.__c=v=new p(g,x),v.constructor=P,v.render=M),w&&w.sub(v),v.props=g,v.state||(v.state={}),v.context=x,v.__n=t,h=v.__d=!0,v.__h=[]),null==v.__s&&(v.__s=v.state),null!=P.getDerivedStateFromProps&&(v.__s==v.state&&(v.__s=c({},v.__s)),c(v.__s,P.getDerivedStateFromProps(g,v.__s))),d=v.props,_=v.state,h)null==P.getDerivedStateFromProps&&null!=v.componentWillMount&&v.componentWillMount(),null!=v.componentDidMount&&v.__h.push(v.componentDidMount);else {if(null==P.getDerivedStateFromProps&&g!==d&&null!=v.componentWillReceiveProps&&v.componentWillReceiveProps(g,x),!v.__e&&null!=v.shouldComponentUpdate&&!1===v.shouldComponentUpdate(g,v.__s,x)||u.__v===i.__v){v.props=g,v.state=v.__s,u.__v!==i.__v&&(v.__d=!1),v.__v=u,u.__e=i.__e,u.__k=i.__k,v.__h.length&&f.push(v);break n}null!=v.componentWillUpdate&&v.componentWillUpdate(g,v.__s,x),null!=v.componentDidUpdate&&v.__h.push(function(){v.componentDidUpdate(d,_,k);});}v.context=x,v.props=g,v.state=v.__s,(a=n.__r)&&a(u),v.__d=!1,v.__v=u,v.__P=l,a=v.render(v.props,v.state,v.context),v.state=v.__s,null!=v.getChildContext&&(t=c(c({},t),v.getChildContext())),h||null==v.getSnapshotBeforeUpdate||(k=v.getSnapshotBeforeUpdate(d,_)),A=null!=a&&a.type===y&&null==a.key?a.props.children:a,b(l,Array.isArray(A)?A:[A],u,i,t,r,o,f,e,s),v.base=u.__e,u.__h=null,v.__h.length&&f.push(v),m&&(v.__E=v.__=null),v.__e=!1;}else null==o&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=z(i.__e,u,i,t,r,o,f,s);(a=n.diffed)&&a(u);}catch(l){u.__v=null,(s||null!=o)&&(u.__e=e,u.__h=!!s,o[o.indexOf(e)]=null),n.__e(l,u,i);}}function j(l,u){n.__c&&n.__c(u,l),l.some(function(u){try{l=u.__h,u.__h=[],l.some(function(n){n.call(u);});}catch(l){n.__e(l,u.__v);}});}function z(n,l,u,i,t,r,e,c){var a,v,h,y,p=u.props,d=l.props,_=l.type,k=0;if("svg"===_&&(t=!0),null!=r)for(;k<r.length;k++)if((a=r[k])&&(a===n||(_?a.localName==_:3==a.nodeType))){n=a,r[k]=null;break}if(null==n){if(null===_)return document.createTextNode(d);n=t?document.createElementNS("http://www.w3.org/2000/svg",_):document.createElement(_,d.is&&d),r=null,c=!1;}if(null===_)p===d||c&&n.data===d||(n.data=d);else {if(r=r&&f.slice.call(n.childNodes),v=(p=u.props||o).dangerouslySetInnerHTML,h=d.dangerouslySetInnerHTML,!c){if(null!=r)for(p={},y=0;y<n.attributes.length;y++)p[n.attributes[y].name]=n.attributes[y].value;(h||v)&&(h&&(v&&h.__html==v.__html||h.__html===n.innerHTML)||(n.innerHTML=h&&h.__html||""));}if(A(n,d,p,t,c),h)l.__k=[];else if(k=l.props.children,b(n,Array.isArray(k)?k:[k],l,u,i,t&&"foreignObject"!==_,r,e,n.firstChild,c),null!=r)for(k=r.length;k--;)null!=r[k]&&s(r[k]);c||("value"in d&&void 0!==(k=d.value)&&(k!==n.value||"progress"===_&&!k)&&C(n,"value",k,p.value,!1),"checked"in d&&void 0!==(k=d.checked)&&k!==n.checked&&C(n,"checked",k,p.checked,!1));}return n}function I(l,u,i){try{"function"==typeof l?l(u):l.current=u;}catch(l){n.__e(l,i);}}function L(l,u,i){var t,r,o;if(n.unmount&&n.unmount(l),(t=l.ref)&&(t.current&&t.current!==l.__e||I(t,null,u)),i||"function"==typeof l.type||(i=null!=(r=l.__e)),l.__e=l.__d=void 0,null!=(t=l.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(l){n.__e(l,u);}t.base=t.__P=null;}if(t=l.__k)for(o=0;o<t.length;o++)t[o]&&L(t[o],u,i);null!=r&&s(r);}function M(n,l,u){return this.constructor(n,u)}function N(l,u,i){var t,r,e;n.__&&n.__(l,u),r=(t="function"==typeof i)?null:i&&i.__k||u.__k,e=[],T(u,l=(!t&&i||u).__k=a(y,null,[l]),r||o,o,void 0!==u.ownerSVGElement,!t&&i?[i]:r?null:u.firstChild?f.slice.call(u.childNodes):null,e,!t&&i?i:r?r.__e:u.firstChild,t),j(e,l);}n={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n},__v:0},p.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=c({},this.state),"function"==typeof n&&(n=n(c({},u),this.props)),n&&c(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),k(this));},p.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),k(this));},p.prototype.render=y,u=[],i="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,m.__r=0,0;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function symbolObservablePonyfill(root) {
    	var result;
    	var Symbol = root.Symbol;

    	if (typeof Symbol === 'function') {
    		if (Symbol.observable) {
    			result = Symbol.observable;
    		} else {
    			result = Symbol('observable');
    			Symbol.observable = result;
    		}
    	} else {
    		result = '@@observable';
    	}

    	return result;
    }

    /* global window */

    var root;

    if (typeof self !== 'undefined') {
      root = self;
    } else if (typeof window !== 'undefined') {
      root = window;
    } else if (typeof global !== 'undefined') {
      root = global;
    } else if (typeof module !== 'undefined') {
      root = module;
    } else {
      root = Function('return this')();
    }

    var result = symbolObservablePonyfill(root);

    /**
     * These are private action types reserved by Redux.
     * For any unknown actions, you must return the current state.
     * If the current state is undefined, you must return the initial state.
     * Do not reference these action types directly in your code.
     */
    var randomString = function randomString() {
      return Math.random().toString(36).substring(7).split('').join('.');
    };

    var ActionTypes = {
      INIT: "@@redux/INIT" + randomString(),
      REPLACE: "@@redux/REPLACE" + randomString(),
      PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
        return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
      }
    };

    /**
     * @param {any} obj The object to inspect.
     * @returns {boolean} True if the argument appears to be a plain object.
     */
    function isPlainObject(obj) {
      if (typeof obj !== 'object' || obj === null) return false;
      var proto = obj;

      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }

      return Object.getPrototypeOf(obj) === proto;
    }

    /**
     * Creates a Redux store that holds the state tree.
     * The only way to change the data in the store is to call `dispatch()` on it.
     *
     * There should only be a single store in your app. To specify how different
     * parts of the state tree respond to actions, you may combine several reducers
     * into a single reducer function by using `combineReducers`.
     *
     * @param {Function} reducer A function that returns the next state tree, given
     * the current state tree and the action to handle.
     *
     * @param {any} [preloadedState] The initial state. You may optionally specify it
     * to hydrate the state from the server in universal apps, or to restore a
     * previously serialized user session.
     * If you use `combineReducers` to produce the root reducer function, this must be
     * an object with the same shape as `combineReducers` keys.
     *
     * @param {Function} [enhancer] The store enhancer. You may optionally specify it
     * to enhance the store with third-party capabilities such as middleware,
     * time travel, persistence, etc. The only store enhancer that ships with Redux
     * is `applyMiddleware()`.
     *
     * @returns {Store} A Redux store that lets you read the state, dispatch actions
     * and subscribe to changes.
     */

    function createStore(reducer, preloadedState, enhancer) {
      var _ref2;

      if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
        throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
      }

      if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
      }

      if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
          throw new Error('Expected the enhancer to be a function.');
        }

        return enhancer(createStore)(reducer, preloadedState);
      }

      if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.');
      }

      var currentReducer = reducer;
      var currentState = preloadedState;
      var currentListeners = [];
      var nextListeners = currentListeners;
      var isDispatching = false;
      /**
       * This makes a shallow copy of currentListeners so we can use
       * nextListeners as a temporary list while dispatching.
       *
       * This prevents any bugs around consumers calling
       * subscribe/unsubscribe in the middle of a dispatch.
       */

      function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
          nextListeners = currentListeners.slice();
        }
      }
      /**
       * Reads the state tree managed by the store.
       *
       * @returns {any} The current state tree of your application.
       */


      function getState() {
        if (isDispatching) {
          throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
        }

        return currentState;
      }
      /**
       * Adds a change listener. It will be called any time an action is dispatched,
       * and some part of the state tree may potentially have changed. You may then
       * call `getState()` to read the current state tree inside the callback.
       *
       * You may call `dispatch()` from a change listener, with the following
       * caveats:
       *
       * 1. The subscriptions are snapshotted just before every `dispatch()` call.
       * If you subscribe or unsubscribe while the listeners are being invoked, this
       * will not have any effect on the `dispatch()` that is currently in progress.
       * However, the next `dispatch()` call, whether nested or not, will use a more
       * recent snapshot of the subscription list.
       *
       * 2. The listener should not expect to see all state changes, as the state
       * might have been updated multiple times during a nested `dispatch()` before
       * the listener is called. It is, however, guaranteed that all subscribers
       * registered before the `dispatch()` started will be called with the latest
       * state by the time it exits.
       *
       * @param {Function} listener A callback to be invoked on every dispatch.
       * @returns {Function} A function to remove this change listener.
       */


      function subscribe(listener) {
        if (typeof listener !== 'function') {
          throw new Error('Expected the listener to be a function.');
        }

        if (isDispatching) {
          throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
        }

        var isSubscribed = true;
        ensureCanMutateNextListeners();
        nextListeners.push(listener);
        return function unsubscribe() {
          if (!isSubscribed) {
            return;
          }

          if (isDispatching) {
            throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribelistener for more details.');
          }

          isSubscribed = false;
          ensureCanMutateNextListeners();
          var index = nextListeners.indexOf(listener);
          nextListeners.splice(index, 1);
          currentListeners = null;
        };
      }
      /**
       * Dispatches an action. It is the only way to trigger a state change.
       *
       * The `reducer` function, used to create the store, will be called with the
       * current state tree and the given `action`. Its return value will
       * be considered the **next** state of the tree, and the change listeners
       * will be notified.
       *
       * The base implementation only supports plain object actions. If you want to
       * dispatch a Promise, an Observable, a thunk, or something else, you need to
       * wrap your store creating function into the corresponding middleware. For
       * example, see the documentation for the `redux-thunk` package. Even the
       * middleware will eventually dispatch plain object actions using this method.
       *
       * @param {Object} action A plain object representing “what changed”. It is
       * a good idea to keep actions serializable so you can record and replay user
       * sessions, or use the time travelling `redux-devtools`. An action must have
       * a `type` property which may not be `undefined`. It is a good idea to use
       * string constants for action types.
       *
       * @returns {Object} For convenience, the same action object you dispatched.
       *
       * Note that, if you use a custom middleware, it may wrap `dispatch()` to
       * return something else (for example, a Promise you can await).
       */


      function dispatch(action) {
        if (!isPlainObject(action)) {
          throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
        }

        if (typeof action.type === 'undefined') {
          throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
        }

        if (isDispatching) {
          throw new Error('Reducers may not dispatch actions.');
        }

        try {
          isDispatching = true;
          currentState = currentReducer(currentState, action);
        } finally {
          isDispatching = false;
        }

        var listeners = currentListeners = nextListeners;

        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];
          listener();
        }

        return action;
      }
      /**
       * Replaces the reducer currently used by the store to calculate the state.
       *
       * You might need this if your app implements code splitting and you want to
       * load some of the reducers dynamically. You might also need this if you
       * implement a hot reloading mechanism for Redux.
       *
       * @param {Function} nextReducer The reducer for the store to use instead.
       * @returns {void}
       */


      function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
          throw new Error('Expected the nextReducer to be a function.');
        }

        currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
        // Any reducers that existed in both the new and old rootReducer
        // will receive the previous state. This effectively populates
        // the new state tree with any relevant data from the old one.

        dispatch({
          type: ActionTypes.REPLACE
        });
      }
      /**
       * Interoperability point for observable/reactive libraries.
       * @returns {observable} A minimal observable of state changes.
       * For more information, see the observable proposal:
       * https://github.com/tc39/proposal-observable
       */


      function observable() {
        var _ref;

        var outerSubscribe = subscribe;
        return _ref = {
          /**
           * The minimal observable subscription method.
           * @param {Object} observer Any object that can be used as an observer.
           * The observer object should have a `next` method.
           * @returns {subscription} An object with an `unsubscribe` method that can
           * be used to unsubscribe the observable from the store, and prevent further
           * emission of values from the observable.
           */
          subscribe: function subscribe(observer) {
            if (typeof observer !== 'object' || observer === null) {
              throw new TypeError('Expected the observer to be an object.');
            }

            function observeState() {
              if (observer.next) {
                observer.next(getState());
              }
            }

            observeState();
            var unsubscribe = outerSubscribe(observeState);
            return {
              unsubscribe: unsubscribe
            };
          }
        }, _ref[result] = function () {
          return this;
        }, _ref;
      } // When a store is created, an "INIT" action is dispatched so that every
      // reducer returns their initial state. This effectively populates
      // the initial state tree.


      dispatch({
        type: ActionTypes.INIT
      });
      return _ref2 = {
        dispatch: dispatch,
        subscribe: subscribe,
        getState: getState,
        replaceReducer: replaceReducer
      }, _ref2[result] = observable, _ref2;
    }

    var got_main_annotations_file_type = "got_main_annotations_file";
    var got_main_annotations_file = function (args) {
        return __assign({ type: got_main_annotations_file_type }, args);
    };
    var is_got_main_annotations_file = function (action) {
        return action.type === got_main_annotations_file_type;
    };
    var annotations_actions = {
        got_main_annotations_file: got_main_annotations_file
    };

    function annotations_reducer(state, action) {
        if (is_got_main_annotations_file(action)) {
            var annotations = __assign(__assign({}, state.annotations), { status: "loaded", annotation_user_names: action.annotations_file.annotation_user_names, main_annotations: action.annotations_file.annotations });
            state = __assign(__assign({}, state), { annotations: annotations });
        }
        return state;
    }

    var update_loading_status_type = "update_loading_status";
    var update_loading_status = function (args) {
        return __assign({ type: update_loading_status_type }, args);
    };
    var is_update_loading_status = function (action) {
        return action.type === update_loading_status_type;
    };
    var error_during_loading_type = "error_during_loading";
    var error_during_loading = function (args) {
        return __assign({ type: error_during_loading_type }, args);
    };
    var is_error_during_loading = function (action) {
        return action.type === error_during_loading_type;
    };
    var set_vault_config_type = "set_vault_config";
    var set_vault_config = function (args) {
        return __assign({ type: set_vault_config_type }, args);
    };
    var is_set_vault_config = function (action) {
        return action.type === set_vault_config_type;
    };
    var resolved_relative_file_path_type = "resolved_relative_file_path";
    var resolved_relative_file_path = function (args) {
        return __assign({ type: resolved_relative_file_path_type }, args);
    };
    var is_resolved_relative_file_path = function (action) {
        return action.type === resolved_relative_file_path_type;
    };
    var loading_actions = {
        update_loading_status: update_loading_status,
        error_during_loading: error_during_loading,
        set_vault_config: set_vault_config,
        resolved_relative_file_path: resolved_relative_file_path,
    };

    function loading_reducer(state, action) {
        if (is_update_loading_status(action)) {
            var loading = __assign(__assign({}, state.loading_pdf), { status: action.status, loading_stage: action.stage });
            state = __assign(__assign({}, state), { loading_pdf: loading });
        }
        if (is_error_during_loading(action)) {
            var loading = __assign(__assign({}, state.loading_pdf), { status: "errored", loading_stage: action.error_stage, loading_error_type: action.error_type });
            state = __assign(__assign({}, state), { loading_pdf: loading });
        }
        if (is_set_vault_config(action)) {
            var loading = __assign(__assign({}, state.loading_pdf), { vault_config_loaded: true, labels: action.config.labels, publish_root_path: action.config.publish_root_path });
            state = __assign(__assign({}, state), { loading_pdf: loading });
        }
        if (is_resolved_relative_file_path(action)) {
            var loading = __assign(__assign({}, state.loading_pdf), { status: "resolved", resolved_relative_file_path: action.relative_file_path });
            state = __assign(__assign({}, state), { loading_pdf: loading });
        }
        return state;
    }

    function update_state(root_state, path1, replacement_state) {
        var _a;
        var current = root_state[path1];
        if (current === replacement_state)
            return root_state;
        return __assign(__assign({}, root_state), (_a = {}, _a[path1] = replacement_state, _a));
    }
    function update_substate(root_state, path1, path2, replacement_substate) {
        var replacement_state = update_state(root_state[path1], path2, replacement_substate);
        return update_state(root_state, path1, replacement_state);
    }

    var start_rendering_pdf_type = "start_rendering_pdf";
    var start_rendering_pdf = function (args) {
        return __assign({ type: start_rendering_pdf_type }, args);
    };
    var is_start_rendering_pdf = function (action) {
        return action.type === start_rendering_pdf_type;
    };
    var rendered_page_type = "rendered_page";
    var rendered_page = function (args) {
        return __assign({ type: rendered_page_type }, args);
    };
    var is_rendered_page = function (action) {
        return action.type === rendered_page_type;
    };
    var finished_rendering_pdf_type = "finished_rendering_pdf";
    var finished_rendering_pdf = function (args) {
        return __assign({ type: finished_rendering_pdf_type }, args);
    };
    var is_finished_rendering_pdf = function (action) {
        return action.type === finished_rendering_pdf_type;
    };
    var pdf_rendering_actions = {
        start_rendering_pdf: start_rendering_pdf,
        rendered_page: rendered_page,
        finished_rendering_pdf: finished_rendering_pdf,
    };

    function pdf_rendering_reducer(state, action) {
        if (is_start_rendering_pdf(action)) {
            var rendering_pdf = __assign(__assign({}, state.rendering_pdf), { max_pages: action.max_pages, status: "rendering" });
            state = __assign(__assign({}, state), { rendering_pdf: rendering_pdf });
        }
        if (is_rendered_page(action)) {
            var rendering_pdf = __assign(__assign({}, state.rendering_pdf), { last_rendered_page_canvas: action.canvas, last_rendered_page_number: action.page_number });
            state = __assign(__assign({}, state), { rendering_pdf: rendering_pdf });
        }
        if (is_finished_rendering_pdf(action)) {
            state = update_substate(state, "rendering_pdf", "status", "finished");
        }
        return state;
    }

    var root_reducer = (function (state, action) {
        state = annotations_reducer(state, action);
        state = loading_reducer(state, action);
        state = pdf_rendering_reducer(state, action);
        return state;
    });

    function get_starting_annotations_state() {
        return {
            status: "not ready",
            annotation_user_names: undefined,
            main_annotations: undefined,
        };
    }

    function get_starting_loading_state() {
        return {
            status: "not ready",
            loading_stage: undefined,
            loading_error_type: undefined,
            vault_config_loaded: false,
            labels: [],
            publish_root_path: undefined,
            resolved_relative_file_path: undefined,
        };
    }

    function get_starting_rendering_pdf_state() {
        return {
            status: "not started",
            max_pages: undefined,
            last_rendered_page_canvas: undefined,
            last_rendered_page_number: undefined,
        };
    }

    function parse_location_path() {
        var parts = window.location.pathname.split("/")
            .filter(function (p) { return !!p; });
        var naming_authority_and_vault_ids = parts[parts.length - 2];
        var _a = naming_authority_and_vault_ids.split("."), naming_authority = _a[0], vault_id = _a[1];
        var file_id = parts[parts.length - 1];
        return {
            naming_authority: naming_authority,
            vault_id: vault_id,
            file_id: file_id,
        };
    }
    function parse_location_search() {
        var query = window.location.search.substring(1);
        var vars = {};
        if (query) {
            query.split("&").forEach(function (key_var) {
                var _a = key_var.split("="), key = _a[0], _var = _a[1];
                vars[decodeURIComponent(key)] = decodeURIComponent(_var);
            });
        }
        return vars;
    }
    function get_starting_routing_state() {
        var vars = parse_location_search();
        return __assign(__assign({}, parse_location_path()), { relative_file_path: vars.relative_file_path });
    }

    function get_starting_state() {
        var running_locally = window.location.host !== "anot8.org";
        var override_naming_authority_server_url = localStorage.getItem("override_naming_authority_server_url") || "";
        return {
            annotations: get_starting_annotations_state(),
            loading_pdf: get_starting_loading_state(),
            override_naming_authority_server_url: override_naming_authority_server_url,
            rendering_pdf: get_starting_rendering_pdf_state(),
            routing: get_starting_routing_state(),
            running_locally: running_locally,
        };
    }

    var store$1;
    function get_store() {
        if (store$1)
            return store$1;
        var starting_state = get_starting_state();
        store$1 = createStore(root_reducer, starting_state);
        return store$1;
    }

    var store = get_store();
    function connect(map_state) {
        function connector(ComponentToWrap) {
            return (function (_super) {
                __extends(WrappedComponent, _super);
                function WrappedComponent(props) {
                    var _this = _super.call(this, props) || this;
                    _this.setState(map_state(store.getState()));
                    _this.unsubscribe = store.subscribe(function () {
                        _this.setState(map_state(store.getState()));
                    });
                    return _this;
                }
                WrappedComponent.prototype.componentWillUnmount = function () {
                    this.unsubscribe();
                };
                WrappedComponent.prototype.render = function () {
                    return a(ComponentToWrap, __assign({}, this.props, this.state));
                };
                return WrappedComponent;
            }(p));
        }
        return connector;
    }

    var map_state$2 = function (state) { return (__assign(__assign({}, state.loading_pdf), state.routing)); };
    var connector$2 = connect(map_state$2);
    function _LoadingProgress(props) {
        var status = props.status;
        if (status === "not ready")
            return a("div", null, "Starting...");
        if (status === "loading")
            return a("div", null, "Downloading PDF...");
        if (status === "downloaded")
            return a("div", null, "Downloaded PDF.  Rendering...");
        var stage = props.loading_stage, error_during_loading__type = props.loading_error_type, naming_authority = props.naming_authority, vault_id = props.vault_id, file_id = props.file_id;
        var error_message = "";
        if (error_during_loading__type === "404") {
            if (stage === "resolve_naming_authority_url") {
                error_message = "naming authority \"" + naming_authority + "\" not found";
            }
            else if (stage === "resolve_vault_url") {
                error_message = "vault id \"" + vault_id + "\" not found";
            }
            else if (stage === "resolve_pdf_file_url") {
                error_message = "No relative file path found for file id \"" + file_id + "\"";
            }
        }
        return a("div", null,
            "Error: ",
            error_message);
    }
    var LoadingProgress = connector$2(_LoadingProgress);

    var label_actions = {};

    var ACTIONS = {
        annotations: annotations_actions,
        label: label_actions,
        loading: loading_actions,
        pdf_rendering: pdf_rendering_actions,
    };

    function get_url_to_file(state) {
        var resolved_relative_file_path = state.loading_pdf.resolved_relative_file_path;
        if (!resolved_relative_file_path)
            return "";
        if (state.running_locally) {
            var vault_id = state.routing.vault_id;
            return "/serve_file/" + vault_id + "?relative_file_path=" + resolved_relative_file_path;
        }
        if (!state.loading_pdf.vault_config_loaded)
            return "";
        var publish_root_path = state.loading_pdf.publish_root_path;
        return "" + publish_root_path + resolved_relative_file_path;
    }
    function get_url_to_file_annotations(state) {
        var resolved_relative_file_path = state.loading_pdf.resolved_relative_file_path;
        if (!resolved_relative_file_path)
            return "";
        if (state.running_locally) {
            var vault_id = state.routing.vault_id;
            return "/serve_file/" + vault_id + "?relative_file_path=" + resolved_relative_file_path + ".annotations";
        }
        if (!state.loading_pdf.vault_config_loaded)
            return "";
        var publish_root_path = state.loading_pdf.publish_root_path;
        return "" + publish_root_path + resolved_relative_file_path + ".annotations";
    }
    function get_url_to_write_file_annotations(state) {
        if (!state.running_locally)
            return "";
        var resolved_relative_file_path = state.loading_pdf.resolved_relative_file_path;
        if (!resolved_relative_file_path)
            return "";
        var vault_id = state.routing.vault_id;
        return "/annotations/" + vault_id + "?relative_file_path=" + resolved_relative_file_path + ".annotations";
    }

    function fetch_files() {
        var store = get_store();
        fetch_annotation_files(store);
        return fetch_pdf(store);
    }
    function fetch_pdf(store) {
        var state = store.getState();
        var url_to_file = get_url_to_file(state);
        var get_doc = pdfjsLib.getDocument;
        return new Promise(function (resolve) {
            get_doc(url_to_file).promise.then(function (pdf) { return resolve(pdf); });
        });
    }
    function fetch_annotation_files(store) {
        var state = store.getState();
        var file_annotations_url = get_url_to_file_annotations(state);
        fetch(file_annotations_url)
            .then(function (resp) { return resp.json(); })
            .then(function (annotations_file) {
            store.dispatch(ACTIONS.annotations.got_main_annotations_file({ annotations_file: annotations_file }));
        });
    }

    function resolve_relative_file_path() {
        var store = get_store();
        var state = store.getState();
        var naming_authority_lookup_url = get_naming_authority_lookup_url(state);
        store.dispatch(ACTIONS.loading.update_loading_status({ status: "resolving", stage: "resolve_naming_authority_url" }));
        return fetch(naming_authority_lookup_url)
            .then(function (resp) { return resp.json(); })
            .then(function (naming_authority_lookup) {
            var naming_authority = state.routing.naming_authority;
            var vaults_map_url = naming_authority_lookup[naming_authority];
            if (!vaults_map_url) {
                var msg = "No naming_authority " + naming_authority + " in naming_authority_lookup";
                console.error(msg, naming_authority_lookup);
                store.dispatch(ACTIONS.loading.error_during_loading({ error_stage: "resolve_naming_authority_url", error_type: "404" }));
                return Promise.reject();
            }
            store.dispatch(ACTIONS.loading.update_loading_status({ status: "resolving", stage: "resolve_vault_url" }));
            return fetch(vaults_map_url);
        })
            .then(function (resp) { return resp.json(); })
            .then(function (vaults_map) {
            var vault_id = state.routing.vault_id;
            var vault_config_url = vaults_map[vault_id];
            if (!vault_config_url) {
                console.error("No vault_id " + vault_id + " in vaults_map", vaults_map);
                store.dispatch(ACTIONS.loading.error_during_loading({ error_stage: "resolve_vault_url", error_type: "404" }));
                return Promise.reject();
            }
            store.dispatch(ACTIONS.loading.update_loading_status({ status: "resolving", stage: "resolve_pdf_file_url" }));
            return fetch(vault_config_url);
        })
            .then(function (resp) { return resp.json(); })
            .then(function (config) {
            store.dispatch(ACTIONS.loading.set_vault_config({ config: config }));
            var id_to_relative_file_name = config.DO_NOT_EDIT_auto_generated_fields.id_to_relative_file_name;
            var file_id = state.routing.file_id;
            var relative_file_path = id_to_relative_file_name[file_id] || state.routing.relative_file_path;
            if (!relative_file_path) {
                console.error("No relative_file_path for file_id " + file_id + " ", id_to_relative_file_name);
                store.dispatch(ACTIONS.loading.error_during_loading({ error_stage: "resolve_pdf_file_url", error_type: "404" }));
                return Promise.reject();
            }
            store.dispatch(ACTIONS.loading.resolved_relative_file_path({ status: "resolved", relative_file_path: relative_file_path }));
        });
    }
    function get_naming_authority_lookup_url(state) {
        var running_locally = state.running_locally, override_naming_authority_server_url = state.override_naming_authority_server_url;
        var naming_authority_lookup_url = override_naming_authority_server_url
            || (running_locally
                ? "/local_naming_authority_lookup.json"
                : "https://raw.githubusercontent.com/centerofci/anot8/master/anot8_org_naming_authority_lookup.json");
        return naming_authority_lookup_url;
    }

    function load_files() {
        return resolve_relative_file_path()
            .then(fetch_files);
    }

    var get_anot8_perma_link = function (_a) {
        var routing = _a.routing;
        var naming_authority = routing.naming_authority, vault_id = routing.vault_id, file_id = routing.file_id;
        var anot8_perma_link = "";
        if (naming_authority !== "-1" && vault_id !== "-1" && file_id !== "-1") {
            anot8_perma_link = "https://anot8.org/r/" + naming_authority + "." + vault_id + "/" + file_id;
        }
        return anot8_perma_link;
    };

    var map_state$1 = function (state) { return ({
        url_to_file: get_url_to_file(state),
        anot8_perma_link: get_anot8_perma_link(state),
    }); };
    var connector$1 = connect(map_state$1);
    function _TopInfoPanel(props) {
        var url_to_file = props.url_to_file, anot8_perma_link = props.anot8_perma_link;
        if (!url_to_file)
            return null;
        var perma_link_elements = anot8_perma_link
            ? [a("br", null), a("a", { href: anot8_perma_link },
                    "PermaLink: ",
                    anot8_perma_link)]
            : [a("br", null), a("span", { style: "color: grey; font-size: small;" }, "PermaLink not available (-1 present in part of link)")];
        return a("div", null,
            a("a", { href: url_to_file },
                "Showing PDF from: ",
                url_to_file),
            perma_link_elements);
    }
    var TopInfoPanel = connector$1(_TopInfoPanel);

    function get_users_annotations(state) {
        return state.annotations.main_annotations || [];
    }

    var map_state = function (state) { return ({
        ready: state.annotations.status !== "not ready",
        loading: state.annotations.status === "loading",
        saved: state.annotations.status === "saved",
        saving: state.annotations.status === "saving",
        annotations_count: get_users_annotations(state).length,
        url_to_write_file_annotations: get_url_to_write_file_annotations(state),
    }); };
    var connector = connect(map_state);
    function _AutoSave(props) {
        var ready = props.ready, loading = props.loading, saved = props.saved, saving = props.saving, annotations_count = props.annotations_count, url_to_write_file_annotations = props.url_to_write_file_annotations;
        if (!ready || loading)
            return null;
        if (!url_to_write_file_annotations) {
            return a("div", null,
                a("span", { style: "background-color: yellow;" }, "\u26A0"),
                " Saving not enabled. Must ",
                a("a", { href: "https://github.com/centerofci/anot8" }, "run locally"),
                ".");
        }
        else if (saving) {
            return a("div", null, "Auto saving...");
        }
        else if (saved) {
            return a("div", null,
                "Saved (",
                annotations_count,
                ")");
        }
        else {
            return a("div", null,
                "Loaded (",
                annotations_count,
                ")");
        }
    }
    var AutoSave = connector(_AutoSave);

    function render_pdf(pdf, pages_container_el) {
        var store = get_store();
        ACTIONS.pdf_rendering.start_rendering_pdf({ max_pages: pdf.numPages });
        render_pdf_page({ pdf: pdf, pages_container_el: pages_container_el, page_number: 1, store: store });
    }
    function render_pdf_page(_a) {
        var pdf = _a.pdf, pages_container_el = _a.pages_container_el, page_number = _a.page_number, store = _a.store;
        pdf.getPage(page_number)
            .then(function (page) {
            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });
            var single_page_container_el = create_single_page_container_el(pages_container_el, viewport);
            var canvas = create_pdf_canvas(single_page_container_el, viewport);
            var render_context = create_canvas_context(canvas, viewport);
            create_annotations_container_el({ single_page_container_el: single_page_container_el, page_number: page_number });
            add_page_number({ pages_container_el: pages_container_el, page_number: page_number });
            page.render(render_context)
                .promise.then(function () {
                store.dispatch(ACTIONS.pdf_rendering.rendered_page({ canvas: canvas, page_number: page_number }));
                if (page_number < pdf.numPages) {
                    render_pdf_page({
                        pdf: pdf,
                        pages_container_el: pages_container_el,
                        page_number: page_number + 1,
                        store: store,
                    });
                }
                else {
                    ACTIONS.pdf_rendering.finished_rendering_pdf({});
                }
            });
        });
    }
    function create_single_page_container_el(pages_container_el, viewport) {
        var single_page_container_el = document.createElement("div");
        single_page_container_el.className = "page_container";
        single_page_container_el.style.height = viewport.height.toString();
        single_page_container_el.style.width = viewport.width.toString();
        pages_container_el.appendChild(single_page_container_el);
        return single_page_container_el;
    }
    function create_pdf_canvas(single_page_container_el, viewport) {
        var canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        single_page_container_el.appendChild(canvas);
        return canvas;
    }
    function create_canvas_context(canvas, viewport) {
        var canvasContext = canvas.getContext("2d");
        var render_context = { canvasContext: canvasContext, viewport: viewport };
        return render_context;
    }
    function create_annotations_container_el(_a) {
        var single_page_container_el = _a.single_page_container_el, page_number = _a.page_number;
        var annotations_container_el = document.createElement("div");
        annotations_container_el.className = "annotations_container";
        annotations_container_el.id = "annotations_container_el_" + page_number;
        single_page_container_el.appendChild(annotations_container_el);
    }
    function add_page_number(_a) {
        var pages_container_el = _a.pages_container_el, page_number = _a.page_number;
        var page_number_el = document.createElement("div");
        page_number_el.innerText = page_number.toString();
        pages_container_el.appendChild(page_number_el);
        pages_container_el.appendChild(document.createElement("br"));
    }

    var link_to_pdf_el = document.getElementById("link_to_pdf_file");
    N(a(TopInfoPanel, null), link_to_pdf_el);
    var loading_progress_el = document.getElementById("loading_progress");
    N(a(LoadingProgress, null), loading_progress_el);
    var auto_save_el = document.getElementById("auto_save");
    N(a(AutoSave, null), auto_save_el);
    var pages_container_el = document.getElementById("pages_container");
    load_files()
        .then(function (pdf) { return render_pdf(pdf, pages_container_el); });

}());
