import scss from "https://tfl.dev/@truffle/utils@~0.0.3/css/css.ts";
export default scss`
.tooltip {

	//triangle pre hover
	&:before {
		content: "";
		transition: transform 0.25s, filter 0.25s;
		transform: translateY(-15px) translateX(-5px);
		filter: opacity(0);
	}

	//content pre hover
	&:after {
		content: "";
		transition: transform 0.25s, filter 0.25s;
		transform: translateY(-67px) translateX(-86.6%);

		//fixes firefox bug?
		@-moz-document url-prefix() {
			transform: translateY(-65px) translateX(-86.6%);
		}

		filter: opacity(0);
	}

	//triangle
	&:hover:before {
		content: "";
		margin: none;
		display: block;
		position: absolute;
		//top: -12%;
		transform: translateY(-11px) translateX(-6px);
		z-index: 99;
		filter: opacity(1.0);
		//triangle
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid var(--background-tooltip);
	}

	//content
	&:hover:after {
		font-size: 14px;
		margin: none;
		display: block;
		content: attr(data-hover-text);
		filter: opacity(1.0);
		background: var(--background-tooltip);
		position: absolute;
		padding: 4px;
		border-radius: 4px;
		padding: 9.5px 10px 9.5px 10px;
	}

	//styles to compensate for text length
	//probably a better way to do this...
	&.help:hover:after {
		transform: translateY(-63px) translateX(-86.6%);

		//fixes firefox bug?
		@-moz-document url-prefix() {
			transform: translateY(-60px) translateX(-86.6%);
		}
	}

	&.minimize:hover:after {
		transform: translateY(-63px) translateX(-90%);
		//fixes firefox bug?
		@-moz-document url-prefix() {
			transform: translateY(-60px) translateX(-90%);
		}
	}
}`;
