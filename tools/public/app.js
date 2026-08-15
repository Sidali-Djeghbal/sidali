(function () {
	'use strict';

	/* ================================================================
	 * CONFIG — edit these links to point at your real services.
	 * Groups are rendered as Homepage-style columns.
	 * ================================================================ */
	var SERVICES = [
		{
			label: 'Notes',
			items: [
				{
					name: 'Notes',
					url: '/notes',
					desc: 'Synced on D1',
					icon: 'note',
					internal: true,
				},
			],
		},
		{
			label: 'Books',
			items: [
				{
					name: 'My Bookshelf',
					url: 'https://example.com/bookshelf',
					desc: 'Replace with your book link',
					icon: 'book',
				},
			],
		},
		{
			label: 'Docs & Notes',
			items: [
				{
					name: 'Docmost',
					url: 'https://docmost.sidali-djeghbal.dev',
					desc: 'Collaborative docs',
					icon: 'docmost',
				},
				{
					name: 'Notion',
					url: 'https://www.notion.so',
					desc: 'Notes & knowledge',
					icon: 'notion',
				},
			],
		},
		{
			label: 'Passwords',
			items: [
				{
					name: 'Vaultwarden',
					url: 'https://vaultwarden.example.com',
					desc: 'Password manager',
					icon: 'vaultwarden',
				},
			],
		},
		{
			label: 'Mail',
			items: [
				{
					name: 'Gmail',
					url: 'https://mail.google.com',
					desc: 'Inbox',
					icon: 'gmail',
				},
			],
		},
	];

	var ICONS = {
		note: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5Z"/><path d="M15 3v5h5"/></svg>',
		docmost:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
		notion:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/></svg>',
		vaultwarden:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>',
		gmail:
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
		book: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
		moon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
		sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
	};

	/* ================================================================
	 * Render service groups
	 * ================================================================ */
	function renderGroups() {
		var mount = document.getElementById('tools');
		if (!mount) return;

		SERVICES.forEach(function (group) {
			var section = document.createElement('section');
			section.className = 'group';

			var heading = document.createElement('h2');
			heading.textContent = group.label;
			section.appendChild(heading);

			group.items.forEach(function (item) {
				var link = document.createElement('a');
				link.className = 'service';
				link.href = item.url;
				if (!item.internal) {
					link.target = '_blank';
					link.rel = 'noreferrer';
				}
				link.setAttribute('aria-label', item.name);

				var icon = document.createElement('span');
				icon.className = 'icon';
				icon.innerHTML = ICONS[item.icon] || ICONS.book;

				var text = document.createElement('span');
				var name = document.createElement('span');
				name.className = 'name';
				name.textContent = item.name;
				var desc = document.createElement('span');
				desc.className = 'desc';
				desc.textContent = item.desc || '';
				text.appendChild(name);
				text.appendChild(desc);

				link.appendChild(icon);
				link.appendChild(text);
				section.appendChild(link);
			});

			mount.appendChild(section);
		});
	}

	/* ================================================================
	 * Theme toggle (sun/moon + view-transition circle)
	 * ================================================================ */
	function setupTheme() {
		var button = document.getElementById('theme-toggle');
		if (!button) return;

		var dark = document.documentElement.classList.contains('dark');

		function paint() {
			dark = document.documentElement.classList.contains('dark');
			button.innerHTML = dark ? ICONS.sun : ICONS.moon;
		}

		button.addEventListener('click', function () {
			var next = !dark;
			var apply = function () {
				document.documentElement.classList.toggle('dark', next);
				try {
					localStorage.setItem('tools-theme', next ? 'dark' : 'light');
				} catch (e) {}
				paint();
			};
			if (document.startViewTransition) {
				document.startViewTransition(apply);
			} else {
				apply();
			}
		});

		paint();
	}

	/* ================================================================
	 * Splash cursor — fluid WebGL trail (ported from portfolio)
	 * ================================================================ */
	function initSplash() {
		var container = document.getElementById('splash');
		if (!container) return;

		var canvas = document.createElement('canvas');
		container.insertBefore(canvas, container.firstChild);

		var isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
		if (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
			!isTouchDevice
		) {
			return;
		}
		var isMobile = window.innerWidth < 768;

		function Pointer() {
			this.id = -1;
			this.texcoordX = 0;
			this.texcoordY = 0;
			this.prevTexcoordX = 0;
			this.prevTexcoordY = 0;
			this.deltaX = 0;
			this.deltaY = 0;
			this.down = false;
			this.moved = false;
			this.color = { r: 0, g: 0, b: 0 };
		}

		var config = {
			SIM_RESOLUTION: isMobile ? 96 : 128,
			DYE_RESOLUTION: isMobile ? 512 : 800,
			CAPTURE_RESOLUTION: isMobile ? 256 : 512,
			DENSITY_DISSIPATION: 3.5,
			VELOCITY_DISSIPATION: 2,
			PRESSURE: 0.1,
			PRESSURE_ITERATIONS: 20,
			CURL: 3,
			SPLAT_RADIUS: 0.2,
			SPLAT_FORCE: 6000,
			SHADING: true,
			COLOR_UPDATE_SPEED: 10,
			PAUSED: false,
			BACK_COLOR: { r: 0, g: 0, b: 0 },
			TRANSPARENT: true,
		};

		var pointers = [new Pointer()];

		var glState = getWebGLContext(canvas);
		var gl = glState.gl;
		var ext = glState.ext;
		if (!ext.supportLinearFiltering) {
			config.DYE_RESOLUTION = 256;
			config.SHADING = false;
		}

		function getWebGLContext(canvas) {
			var params = {
				alpha: true,
				depth: false,
				stencil: false,
				antialias: false,
				preserveDrawingBuffer: false,
			};
			var gl =
				canvas.getContext('webgl2', params) ||
				canvas.getContext('webgl', params) ||
				canvas.getContext('experimental-webgl', params);
			if (!gl) throw new Error('WebGL not supported');
			var isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' &&
				gl instanceof WebGL2RenderingContext;

			var halfFloat = null;
			var supportLinearFiltering = null;
			if (isWebGL2) {
				gl.getExtension('EXT_color_buffer_float');
				supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
			} else {
				halfFloat = gl.getExtension('OES_texture_half_float');
				supportLinearFiltering = gl.getExtension(
					'OES_texture_half_float_linear',
				);
			}
			gl.clearColor(0.0, 0.0, 0.0, 1.0);

			var halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES) || gl.UNSIGNED_BYTE;
			var formatRGBA;
			var formatRG;
			var formatR;

			if (isWebGL2) {
				formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
				formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
				formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
			} else {
				formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
				formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
				formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
			}

			return {
				gl: gl,
				ext: {
					formatRGBA: formatRGBA,
					formatRG: formatRG,
					formatR: formatR,
					halfFloatTexType: halfFloatTexType,
					supportLinearFiltering: supportLinearFiltering,
				},
			};
		}

		function getSupportedFormat(gl, internalFormat, format, type) {
			if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
				switch (internalFormat) {
					case gl.R16F:
						return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
					case gl.RG16F:
						return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
					default:
						return null;
				}
			}
			return { internalFormat: internalFormat, format: format };
		}

		function supportRenderTextureFormat(gl, internalFormat, format, type) {
			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
			var fbo = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D,
				texture,
				0,
			);
			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			return status === gl.FRAMEBUFFER_COMPLETE;
		}

		function Material(vertexShader, fragmentShaderSource) {
			this.vertexShader = vertexShader;
			this.fragmentShaderSource = fragmentShaderSource;
			this.programs = {};
			this.activeProgram = null;
			this.uniforms = {};
		}
		Material.prototype.setKeywords = function (keywords) {
			var hash = 0;
			for (var i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
			var program = this.programs[hash];
			if (program == null) {
				var fragmentShader = compileShader(
					gl.FRAGMENT_SHADER,
					this.fragmentShaderSource,
					keywords,
				);
				program = createProgram(this.vertexShader, fragmentShader);
				this.programs[hash] = program;
			}
			if (program === this.activeProgram) return;
			this.uniforms = getUniforms(program);
			this.activeProgram = program;
		};
		Material.prototype.bind = function () {
			gl.useProgram(this.activeProgram);
		};

		function Program(vertexShader, fragmentShader) {
			this.program = createProgram(vertexShader, fragmentShader);
			this.uniforms = getUniforms(this.program);
		}
		Program.prototype.bind = function () {
			gl.useProgram(this.program);
		};

		function createProgram(vertexShader, fragmentShader) {
			var program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			if (!gl.getProgramParameter(program, gl.LINK_STATUS))
				console.trace(gl.getProgramInfoLog(program));
			return program;
		}

		function getUniforms(program) {
			var uniforms = {};
			var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
			for (var i = 0; i < uniformCount; i++) {
				var uniformName = gl.getActiveUniform(program, i).name;
				uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
			}
			return uniforms;
		}

		function compileShader(type, source, keywords) {
			source = addKeywords(source, keywords);
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
				console.trace(gl.getShaderInfoLog(shader));
			return shader;
		}

		function addKeywords(source, keywords) {
			if (!keywords) return source;
			var keywordsString = '';
			keywords.forEach(function (keyword) {
				keywordsString += '#define ' + keyword + '\n';
			});
			return keywordsString + source;
		}

		var baseVertexShader = compileShader(
			gl.VERTEX_SHADER,
			[
				'precision highp float;',
				'attribute vec2 aPosition;',
				'varying vec2 vUv;',
				'varying vec2 vL;',
				'varying vec2 vR;',
				'varying vec2 vT;',
				'varying vec2 vB;',
				'uniform vec2 texelSize;',
				'',
				'void main () {',
				'    vUv = aPosition * 0.5 + 0.5;',
				'    vL = vUv - vec2(texelSize.x, 0.0);',
				'    vR = vUv + vec2(texelSize.x, 0.0);',
				'    vT = vUv + vec2(0.0, texelSize.y);',
				'    vB = vUv - vec2(0.0, texelSize.y);',
				'    gl_Position = vec4(aPosition, 0.0, 1.0);',
				'}',
			].join('\n'),
		);

		var copyShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision mediump float;',
				'precision mediump sampler2D;',
				'varying highp vec2 vUv;',
				'uniform sampler2D uTexture;',
				'',
				'void main () {',
				'    gl_FragColor = texture2D(uTexture, vUv);',
				'}',
			].join('\n'),
		);

		var clearShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision mediump float;',
				'precision mediump sampler2D;',
				'varying highp vec2 vUv;',
				'uniform sampler2D uTexture;',
				'uniform float value;',
				'',
				'void main () {',
				'    gl_FragColor = value * texture2D(uTexture, vUv);',
				'}',
			].join('\n'),
		);

		var displayShaderSource = [
			'precision highp float;',
			'precision highp sampler2D;',
			'varying vec2 vUv;',
			'varying vec2 vL;',
			'varying vec2 vR;',
			'varying vec2 vT;',
			'varying vec2 vB;',
			'uniform sampler2D uTexture;',
			'uniform sampler2D uDithering;',
			'uniform vec2 ditherScale;',
			'uniform vec2 texelSize;',
			'uniform float uLightMode;',
			'',
			'vec3 linearToGamma (vec3 color) {',
			'    color = max(color, vec3(0));',
			'    return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));',
			'}',
			'',
			'void main () {',
			'    vec3 c = texture2D(uTexture, vUv).rgb;',
			'    #ifdef SHADING',
			'        vec3 lc = texture2D(uTexture, vL).rgb;',
			'        vec3 rc = texture2D(uTexture, vR).rgb;',
			'        vec3 tc = texture2D(uTexture, vT).rgb;',
			'        vec3 bc = texture2D(uTexture, vB).rgb;',
			'',
			'        float dx = length(rc) - length(lc);',
			'        float dy = length(tc) - length(bc);',
			'',
			'        vec3 n = normalize(vec3(dx, dy, length(texelSize)));',
			'        vec3 l = vec3(0.0, 0.0, 1.0);',
			'',
			'        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);',
			'        c *= diffuse;',
			'    #endif',
			'',
			'    float a = max(c.r, max(c.g, c.b));',
			'    vec3 dyeColor = mix(vec3(1.0), vec3(0.0), uLightMode);',
			'    gl_FragColor = vec4(dyeColor * a, a);',
			'}',
		].join('\n');

		var splatShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision highp float;',
				'precision highp sampler2D;',
				'varying vec2 vUv;',
				'uniform sampler2D uTarget;',
				'uniform float aspectRatio;',
				'uniform vec3 color;',
				'uniform vec2 point;',
				'uniform float radius;',
				'',
				'void main () {',
				'    vec2 p = vUv - point.xy;',
				'    p.x *= aspectRatio;',
				'    vec3 splat = exp(-dot(p, p) / radius) * color;',
				'    vec3 base = texture2D(uTarget, vUv).xyz;',
				'    gl_FragColor = vec4(base + splat, 1.0);',
				'}',
			].join('\n'),
		);

		var advectionShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision highp float;',
				'precision highp sampler2D;',
				'varying vec2 vUv;',
				'uniform sampler2D uVelocity;',
				'uniform sampler2D uSource;',
				'uniform vec2 texelSize;',
				'uniform vec2 dyeTexelSize;',
				'uniform float dt;',
				'uniform float dissipation;',
				'',
				'vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {',
				'    vec2 st = uv / tsize - 0.5;',
				'    vec2 iuv = floor(st);',
				'    vec2 fuv = fract(st);',
				'',
				'    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);',
				'    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);',
				'    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);',
				'    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);',
				'',
				'    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);',
				'}',
				'',
				'void main () {',
				'    #ifdef MANUAL_FILTERING',
				'        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;',
				'        vec4 result = bilerp(uSource, coord, dyeTexelSize);',
				'    #else',
				'        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;',
				'        vec4 result = texture2D(uSource, coord);',
				'    #endif',
				'    float decay = 1.0 + dissipation * dt;',
				'    gl_FragColor = result / decay;',
				'}',
			].join('\n'),
			ext.supportLinearFiltering ? null : ['MANUAL_FILTERING'],
		);

		var divergenceShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision mediump float;',
				'precision mediump sampler2D;',
				'varying highp vec2 vUv;',
				'varying highp vec2 vL;',
				'varying highp vec2 vR;',
				'varying highp vec2 vT;',
				'varying highp vec2 vB;',
				'uniform sampler2D uVelocity;',
				'',
				'void main () {',
				'    float L = texture2D(uVelocity, vL).x;',
				'    float R = texture2D(uVelocity, vR).x;',
				'    float T = texture2D(uVelocity, vT).y;',
				'    float B = texture2D(uVelocity, vB).y;',
				'',
				'    vec2 C = texture2D(uVelocity, vUv).xy;',
				'    if (vL.x < 0.0) { L = -C.x; }',
				'    if (vR.x > 1.0) { R = -C.x; }',
				'    if (vT.y > 1.0) { T = -C.y; }',
				'    if (vB.y < 0.0) { B = -C.y; }',
				'',
				'    float div = 0.5 * (R - L + T - B);',
				'    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);',
				'}',
			].join('\n'),
		);

		var curlShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision mediump float;',
				'precision mediump sampler2D;',
				'varying highp vec2 vUv;',
				'varying highp vec2 vL;',
				'varying highp vec2 vR;',
				'varying highp vec2 vT;',
				'varying highp vec2 vB;',
				'uniform sampler2D uVelocity;',
				'',
				'void main () {',
				'    float L = texture2D(uVelocity, vL).y;',
				'    float R = texture2D(uVelocity, vR).y;',
				'    float T = texture2D(uVelocity, vT).x;',
				'    float B = texture2D(uVelocity, vB).x;',
				'    float vorticity = R - L - T + B;',
				'    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);',
				'}',
			].join('\n'),
		);

		var vorticityShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision highp float;',
				'precision highp sampler2D;',
				'varying vec2 vUv;',
				'varying vec2 vL;',
				'varying vec2 vR;',
				'varying vec2 vT;',
				'varying vec2 vB;',
				'uniform sampler2D uVelocity;',
				'uniform sampler2D uCurl;',
				'uniform float curl;',
				'uniform float dt;',
				'',
				'void main () {',
				'    float L = texture2D(uCurl, vL).x;',
				'    float R = texture2D(uCurl, vR).x;',
				'    float T = texture2D(uCurl, vT).x;',
				'    float B = texture2D(uCurl, vB).x;',
				'    float C = texture2D(uCurl, vUv).x;',
				'',
				'    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));',
				'    force /= length(force) + 0.0001;',
				'    force *= curl * C;',
				'    force.y *= -1.0;',
				'',
				'    vec2 velocity = texture2D(uVelocity, vUv).xy;',
				'    velocity += force * dt;',
				'    velocity = min(max(velocity, -1000.0), 1000.0);',
				'    gl_FragColor = vec4(velocity, 0.0, 1.0);',
				'}',
			].join('\n'),
		);

		var pressureShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision mediump float;',
				'precision mediump sampler2D;',
				'varying highp vec2 vUv;',
				'varying highp vec2 vL;',
				'varying highp vec2 vR;',
				'varying highp vec2 vT;',
				'varying highp vec2 vB;',
				'uniform sampler2D uPressure;',
				'uniform sampler2D uDivergence;',
				'',
				'void main () {',
				'    float L = texture2D(uPressure, vL).x;',
				'    float R = texture2D(uPressure, vR).x;',
				'    float T = texture2D(uPressure, vT).x;',
				'    float B = texture2D(uPressure, vB).x;',
				'    float C = texture2D(uPressure, vUv).x;',
				'    float divergence = texture2D(uDivergence, vUv).x;',
				'    float pressure = (L + R + B + T - divergence) * 0.25;',
				'    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);',
				'}',
			].join('\n'),
		);

		var gradientSubtractShader = compileShader(
			gl.FRAGMENT_SHADER,
			[
				'precision mediump float;',
				'precision mediump sampler2D;',
				'varying highp vec2 vUv;',
				'varying highp vec2 vL;',
				'varying highp vec2 vR;',
				'varying highp vec2 vT;',
				'varying highp vec2 vB;',
				'uniform sampler2D uPressure;',
				'uniform sampler2D uVelocity;',
				'',
				'void main () {',
				'    float L = texture2D(uPressure, vL).x;',
				'    float R = texture2D(uPressure, vR).x;',
				'    float T = texture2D(uPressure, vT).x;',
				'    float B = texture2D(uPressure, vB).x;',
				'    vec2 velocity = texture2D(uVelocity, vUv).xy;',
				'    velocity.xy -= vec2(R - L, T - B);',
				'    gl_FragColor = vec4(velocity, 0.0, 1.0);',
				'}',
			].join('\n'),
		);

		var blit = (function () {
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
				gl.STATIC_DRAW,
			);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
			gl.bufferData(
				gl.ELEMENT_ARRAY_BUFFER,
				new Uint16Array([0, 1, 2, 0, 2, 3]),
				gl.STATIC_DRAW,
			);
			gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(0);
			return function (target, clear) {
				if (target == null) {
					gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
					gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				} else {
					gl.viewport(0, 0, target.width, target.height);
					gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
				}
				if (clear) {
					gl.clearColor(0.0, 0.0, 0.0, 1.0);
					gl.clear(gl.COLOR_BUFFER_BIT);
				}
				gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
			};
		})();

		var dye;
		var velocity;
		var divergence;
		var curl;
		var pressure;

		var copyProgram = new Program(baseVertexShader, copyShader);
		var clearProgram = new Program(baseVertexShader, clearShader);
		var splatProgram = new Program(baseVertexShader, splatShader);
		var advectionProgram = new Program(baseVertexShader, advectionShader);
		var divergenceProgram = new Program(baseVertexShader, divergenceShader);
		var curlProgram = new Program(baseVertexShader, curlShader);
		var vorticityProgram = new Program(baseVertexShader, vorticityShader);
		var pressureProgram = new Program(baseVertexShader, pressureShader);
		var gradientSubtractProgram = new Program(
			baseVertexShader,
			gradientSubtractShader,
		);
		var displayMaterial = new Material(baseVertexShader, displayShaderSource);

		function initFramebuffers() {
			var simRes = getResolution(config.SIM_RESOLUTION);
			var dyeRes = getResolution(config.DYE_RESOLUTION);
			var texType = ext.halfFloatTexType;
			var rgba = ext.formatRGBA;
			var rg = ext.formatRG;
			var r = ext.formatR;
			var filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
			gl.disable(gl.BLEND);

			if (!rgba || !rg || !r) {
				console.error('Required texture formats not supported');
				return;
			}

			if (!dye)
				dye = createDoubleFBO(
					dyeRes.width,
					dyeRes.height,
					rgba.internalFormat,
					rgba.format,
					texType,
					filtering,
				);
			else
				dye = resizeDoubleFBO(
					dye,
					dyeRes.width,
					dyeRes.height,
					rgba.internalFormat,
					rgba.format,
					texType,
					filtering,
				);

			if (!velocity)
				velocity = createDoubleFBO(
					simRes.width,
					simRes.height,
					rg.internalFormat,
					rg.format,
					texType,
					filtering,
				);
			else
				velocity = resizeDoubleFBO(
					velocity,
					simRes.width,
					simRes.height,
					rg.internalFormat,
					rg.format,
					texType,
					filtering,
				);

			divergence = createFBO(
				simRes.width,
				simRes.height,
				r.internalFormat,
				r.format,
				texType,
				gl.NEAREST,
			);
			curl = createFBO(
				simRes.width,
				simRes.height,
				r.internalFormat,
				r.format,
				texType,
				gl.NEAREST,
			);
			pressure = createDoubleFBO(
				simRes.width,
				simRes.height,
				r.internalFormat,
				r.format,
				texType,
				gl.NEAREST,
			);
		}

		function createFBO(w, h, internalFormat, format, type, param) {
			gl.activeTexture(gl.TEXTURE0);
			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

			var fbo = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D,
				texture,
				0,
			);
			gl.viewport(0, 0, w, h);
			gl.clear(gl.COLOR_BUFFER_BIT);

			var texelSizeX = 1.0 / w;
			var texelSizeY = 1.0 / h;
			return {
				texture: texture,
				fbo: fbo,
				width: w,
				height: h,
				texelSizeX: texelSizeX,
				texelSizeY: texelSizeY,
				attach: function (id) {
					gl.activeTexture(gl.TEXTURE0 + id);
					gl.bindTexture(gl.TEXTURE_2D, texture);
					return id;
				},
			};
		}

		function createDoubleFBO(w, h, internalFormat, format, type, param) {
			var fbo1 = createFBO(w, h, internalFormat, format, type, param);
			var fbo2 = createFBO(w, h, internalFormat, format, type, param);
			return {
				width: w,
				height: h,
				texelSizeX: fbo1.texelSizeX,
				texelSizeY: fbo1.texelSizeY,
				get read() {
					return fbo1;
				},
				set read(value) {
					fbo1 = value;
				},
				get write() {
					return fbo2;
				},
				set write(value) {
					fbo2 = value;
				},
				swap: function () {
					var temp = fbo1;
					fbo1 = fbo2;
					fbo2 = temp;
				},
			};
		}

		function resizeFBO(target, w, h, internalFormat, format, type, param) {
			var newFBO = createFBO(w, h, internalFormat, format, type, param);
			copyProgram.bind();
			gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
			blit(newFBO);
			return newFBO;
		}

		function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
			if (target.width === w && target.height === h) return target;
			target.read = resizeFBO(
				target.read,
				w,
				h,
				internalFormat,
				format,
				type,
				param,
			);
			target.write = createFBO(w, h, internalFormat, format, type, param);
			target.width = w;
			target.height = h;
			target.texelSizeX = 1.0 / w;
			target.texelSizeY = 1.0 / h;
			return target;
		}

		function updateKeywords() {
			var displayKeywords = [];
			if (config.SHADING) displayKeywords.push('SHADING');
			displayMaterial.setKeywords(displayKeywords);
		}

		updateKeywords();
		initFramebuffers();
		var lastUpdateTime = Date.now();
		var colorUpdateTimer = 0.0;

		var IDLE_TIMEOUT = isTouchDevice ? Number.POSITIVE_INFINITY : 3000;

		function updateFrame() {
			if (!running) return;
			if (Date.now() - lastActivity > IDLE_TIMEOUT) {
				stop();
				return;
			}
			var dt = calcDeltaTime();
			if (resizeCanvas()) initFramebuffers();
			updateColors(dt);
			applyInputs();
			step(dt);
			render(null);
			rafId = requestAnimationFrame(updateFrame);
		}

		var rafId = 0;
		var running = false;
		var lastActivity = Date.now();

		function start() {
			if (running) return;
			running = true;
			lastActivity = Date.now();
			rafId = requestAnimationFrame(updateFrame);
		}

		function stop() {
			running = false;
			cancelAnimationFrame(rafId);
		}

		function markActivity() {
			lastActivity = Date.now();
			if (!running) start();
		}

		function calcDeltaTime() {
			var now = Date.now();
			var dt = (now - lastUpdateTime) / 1000;
			dt = Math.min(dt, 0.016666);
			lastUpdateTime = now;
			return dt;
		}

		function resizeCanvas() {
			var width = scaleByPixelRatio(canvas.clientWidth);
			var height = scaleByPixelRatio(canvas.clientHeight);
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
				return true;
			}
			return false;
		}

		function updateColors(dt) {
			colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
			if (colorUpdateTimer >= 1) {
				colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
				pointers.forEach(function (p) {
					p.color = generateColor();
				});
			}
		}

		function applyInputs() {
			pointers.forEach(function (p) {
				if (p.moved) {
					p.moved = false;
					splatPointer(p);
				}
			});
		}

		function step(dt) {
			gl.disable(gl.BLEND);
			curlProgram.bind();
			gl.uniform2f(
				curlProgram.uniforms.texelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
			gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
			blit(curl);

			vorticityProgram.bind();
			gl.uniform2f(
				vorticityProgram.uniforms.texelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
			gl.uniform1i(
				vorticityProgram.uniforms.uVelocity,
				velocity.read.attach(0),
			);
			gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
			gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
			gl.uniform1f(vorticityProgram.uniforms.dt, dt);
			blit(velocity.write);
			velocity.swap();

			divergenceProgram.bind();
			gl.uniform2f(
				divergenceProgram.uniforms.texelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
			gl.uniform1i(
				divergenceProgram.uniforms.uVelocity,
				velocity.read.attach(0),
			);
			blit(divergence);

			clearProgram.bind();
			gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
			gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
			blit(pressure.write);
			pressure.swap();

			pressureProgram.bind();
			gl.uniform2f(
				pressureProgram.uniforms.texelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
			gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
			for (var i = 0; i < config.PRESSURE_ITERATIONS; i++) {
				gl.uniform1i(
					pressureProgram.uniforms.uPressure,
					pressure.read.attach(1),
				);
				blit(pressure.write);
				pressure.swap();
			}

			gradientSubtractProgram.bind();
			gl.uniform2f(
				gradientSubtractProgram.uniforms.texelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
			gl.uniform1i(
				gradientSubtractProgram.uniforms.uPressure,
				pressure.read.attach(0),
			);
			gl.uniform1i(
				gradientSubtractProgram.uniforms.uVelocity,
				velocity.read.attach(1),
			);
			blit(velocity.write);
			velocity.swap();

			advectionProgram.bind();
			gl.uniform2f(
				advectionProgram.uniforms.texelSize,
				velocity.texelSizeX,
				velocity.texelSizeY,
			);
			if (!ext.supportLinearFiltering)
				gl.uniform2f(
					advectionProgram.uniforms.dyeTexelSize,
					velocity.texelSizeX,
					velocity.texelSizeY,
				);
			var velocityId = velocity.read.attach(0);
			gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
			gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
			gl.uniform1f(advectionProgram.uniforms.dt, dt);
			gl.uniform1f(
				advectionProgram.uniforms.dissipation,
				config.VELOCITY_DISSIPATION,
			);
			blit(velocity.write);
			velocity.swap();

			if (!ext.supportLinearFiltering)
				gl.uniform2f(
					advectionProgram.uniforms.dyeTexelSize,
					dye.texelSizeX,
					dye.texelSizeY,
				);
			gl.uniform1i(
				advectionProgram.uniforms.uVelocity,
				velocity.read.attach(0),
			);
			gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
			gl.uniform1f(
				advectionProgram.uniforms.dissipation,
				config.DENSITY_DISSIPATION,
			);
			blit(dye.write);
			dye.swap();
		}

		function render(target) {
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			gl.enable(gl.BLEND);
			drawDisplay(target);
		}

		function drawDisplay(target) {
			var width = target == null ? gl.drawingBufferWidth : target.width;
			var height = target == null ? gl.drawingBufferHeight : target.height;
			displayMaterial.bind();
			if (config.SHADING)
				gl.uniform2f(
					displayMaterial.uniforms.texelSize,
					1.0 / width,
					1.0 / height,
				);
			gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
			gl.uniform1f(
				displayMaterial.uniforms.uLightMode,
				document.documentElement.classList.contains('dark') ? 0.0 : 1.0,
			);
			blit(target);
		}

		function splatPointer(pointer) {
			var dx = pointer.deltaX * config.SPLAT_FORCE;
			var dy = pointer.deltaY * config.SPLAT_FORCE;
			splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
		}

		function clickSplat(pointer) {
			var color = generateColor();
			color.r *= 10.0;
			color.g *= 10.0;
			color.b *= 10.0;
			var dx = 10 * (Math.random() - 0.5);
			var dy = 30 * (Math.random() - 0.5);
			splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
		}

		function splat(x, y, dx, dy, color) {
			splatProgram.bind();
			gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
			gl.uniform1f(
				splatProgram.uniforms.aspectRatio,
				canvas.width / canvas.height,
			);
			gl.uniform2f(splatProgram.uniforms.point, x, y);
			gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
			gl.uniform1f(
				splatProgram.uniforms.radius,
				correctRadius(config.SPLAT_RADIUS / 100.0),
			);
			blit(velocity.write);
			velocity.swap();

			gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
			gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
			blit(dye.write);
			dye.swap();
		}

		function correctRadius(radius) {
			var aspectRatio = canvas.width / canvas.height;
			if (aspectRatio > 1) radius *= aspectRatio;
			return radius;
		}

		function updatePointerDownData(pointer, id, posX, posY) {
			pointer.id = id;
			pointer.down = true;
			pointer.moved = false;
			pointer.texcoordX = posX / canvas.width;
			pointer.texcoordY = 1.0 - posY / canvas.height;
			pointer.prevTexcoordX = pointer.texcoordX;
			pointer.prevTexcoordY = pointer.texcoordY;
			pointer.deltaX = 0;
			pointer.deltaY = 0;
			pointer.color = generateColor();
		}

		function updatePointerMoveData(pointer, posX, posY, color) {
			pointer.prevTexcoordX = pointer.texcoordX;
			pointer.prevTexcoordY = pointer.texcoordY;
			pointer.texcoordX = posX / canvas.width;
			pointer.texcoordY = 1.0 - posY / canvas.height;
			pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
			pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
			pointer.moved =
				Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
			pointer.color = color;
		}

		function updatePointerUpData(pointer) {
			pointer.down = false;
		}

		function correctDeltaX(delta) {
			var aspectRatio = canvas.width / canvas.height;
			if (aspectRatio < 1) delta *= aspectRatio;
			return delta;
		}

		function correctDeltaY(delta) {
			var aspectRatio = canvas.width / canvas.height;
			if (aspectRatio > 1) delta /= aspectRatio;
			return delta;
		}

		function generateColor() {
			return { r: 0.15, g: 0.15, b: 0.15 };
		}

		function wrap(value, min, max) {
			var range = max - min;
			if (range === 0) return min;
			return ((value - min) % range) + min;
		}

		function getResolution(resolution) {
			var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
			if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
			var min = Math.round(resolution);
			var max = Math.round(resolution * aspectRatio);
			if (gl.drawingBufferWidth > gl.drawingBufferHeight)
				return { width: max, height: min };
			else return { width: min, height: max };
		}

		function scaleByPixelRatio(input) {
			var pixelRatio = window.devicePixelRatio || 1;
			return Math.floor(input * pixelRatio);
		}

		function hashCode(s) {
			if (s.length === 0) return 0;
			var hash = 0;
			for (var i = 0; i < s.length; i++) {
				hash = (hash << 5) - hash + s.charCodeAt(i);
				hash |= 0;
			}
			return hash;
		}

		function shouldSkipSplash(target) {
			if (!target || !(target instanceof Element)) return false;
			var element = target;
			while (element) {
				if (element.hasAttribute('data-skip-splash-cursor')) return true;
				element = element.parentElement;
			}
			return false;
		}

		function getRelativePosition(clientX, clientY) {
			var rect = container.getBoundingClientRect();
			return { x: clientX - rect.left, y: clientY - rect.top };
		}

		var handleMouseDown = function (e) {
			markActivity();
			if (shouldSkipSplash(e.target)) return;
			var pos = getRelativePosition(e.clientX, e.clientY);
			var pointer = pointers[0];
			var posX = scaleByPixelRatio(pos.x);
			var posY = scaleByPixelRatio(pos.y);
			updatePointerDownData(pointer, -1, posX, posY);
			clickSplat(pointer);
		};

		var firstMouseMove = true;
		var handleMouseMove = function (e) {
			markActivity();
			if (shouldSkipSplash(e.target)) return;
			var pos = getRelativePosition(e.clientX, e.clientY);
			var pointer = pointers[0];
			var posX = scaleByPixelRatio(pos.x);
			var posY = scaleByPixelRatio(pos.y);
			if (firstMouseMove) {
				var color = generateColor();
				updatePointerMoveData(pointer, posX, posY, color);
				firstMouseMove = false;
			} else {
				updatePointerMoveData(pointer, posX, posY, pointer.color);
			}
		};

		var handleTouchStart = function (e) {
			markActivity();
			if (shouldSkipSplash(e.target)) return;
			var touches = e.targetTouches;
			var pointer = pointers[0];
			for (var i = 0; i < touches.length; i++) {
				var pos = getRelativePosition(touches[i].clientX, touches[i].clientY);
				var posX = scaleByPixelRatio(pos.x);
				var posY = scaleByPixelRatio(pos.y);
				updatePointerDownData(pointer, touches[i].identifier, posX, posY);
			}
		};

		var handleTouchMove = function (e) {
			markActivity();
			if (shouldSkipSplash(e.target)) return;
			var touches = e.targetTouches;
			var pointer = pointers[0];
			for (var i = 0; i < touches.length; i++) {
				var pos = getRelativePosition(touches[i].clientX, touches[i].clientY);
				var posX = scaleByPixelRatio(pos.x);
				var posY = scaleByPixelRatio(pos.y);
				updatePointerMoveData(pointer, posX, posY, pointer.color);
			}
		};

		var handleTouchEnd = function (e) {
			var touches = e.changedTouches;
			var pointer = pointers[0];
			for (var i = 0; i < touches.length; i++) {
				updatePointerUpData(pointer);
			}
		};

		var handleVisibilityChange = function () {
			if (document.hidden) {
				stop();
			} else {
				start();
			}
		};

		container.addEventListener('mousedown', handleMouseDown);
		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('touchstart', handleTouchStart);
		container.addEventListener('touchmove', handleTouchMove, false);
		container.addEventListener('touchend', handleTouchEnd);
		document.addEventListener('visibilitychange', handleVisibilityChange);

		start();
	}

	/* ================================================================ */
	document.addEventListener('DOMContentLoaded', function () {
		renderGroups();
		setupTheme();
		initSplash();
	});
})();
