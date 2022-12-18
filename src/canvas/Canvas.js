import React from "react";
import PropTypes from "prop-types";

class Block {
	constructor(context, width, height) {
		// position
		this.x = width - width * (0.33 * Math.random());
		this.y = Math.random() * height;

		// velocity;
		this.vx = 2;
		this.vy = 2;

		// acceleration
		this.ax = -0.009;
		this.ay = 0.002;

		this.context = context;
		this.width = width;
		this.height = height;

		if (Math.random() > 0.7) {
			this.context.fillStyle = "#67d4dd";
		} else {
			this.context.fillStyle = "#c9fd5c";
		}
	}
	draw() {
		// Insert your canvas API code to draw an image
		// clear canvas
		this.context.clearRect(0, 0, this.width, this.height);

		//draw rectangle
		this.context.fillRect(this.x, this.y, 20, 20);

		// udpate velocity based in acceleration
		this.vx += this.ax;
		this.vy += this.ay;

		// update position with velocity
		this.x += this.vx;
		this.y += this.vy;

		if (this.y > this.height || this.x > this.width) {
			this.x = this.width - this.width * (0.33 * Math.random());
			this.y = 0;
			this.vx = 2;
			this.vy = 2;

			if (Math.random() > 0.7) {
				this.context.fillStyle = "#67d4dd";
			} else {
				this.context.fillStyle = "#c9fd5c";
			}
		}
	}
}

class FallingBlocksAnimation {
	constructor(context, width, height) {
		this.numBlocks = 10;
		this.blocks = [];
		for (let i = 0; i < this.numBlocks; i++) {
			this.blocks[i] = new Block(context, width, height);
		}
	}

	draw() {
		for (let i = 0; i < this.numBlocks; i++) {
			this.blocks[i].draw();
		}
		requestAnimationFrame(this.draw.bind(this));
	}
}

const Canvas = ({ draw, height, width }) => {
	const canvas = React.useRef();

	React.useEffect(() => {
		const context = canvas.current.getContext("2d");
		const animation = new FallingBlocksAnimation(context, width, height);
		animation.draw();
	});
	return <canvas ref={canvas} height={height} width={width} />;
};

Canvas.propTypes = {
	height: PropTypes.number.isRequired,
	width: PropTypes.number.isRequired,
};
export default Canvas;
