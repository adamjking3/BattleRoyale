// ------------------------------------------------------------------
//
// This namespace holds the Viewport component (a kind of camera).
//
// ------------------------------------------------------------------
MyGame.components.Viewport = function(spec) {
	'use strict';
	var that = {
		get left() { return spec.left; },
		get top() { return spec.top; },
		get width() { return 1; },	// Width and height are always going to be 1
		get height() { return 1; },
		get buffer() { return spec.buffer; }, // This can't really be any larger than world.buffer, guess I could protect against that.
		get worldWidth() { return spec.worldWidth; },
		get worldHeight() { return spec.worldHeight; }
	};

	Object.defineProperty(that, 'right', {
		get: function() { return that.left + that.width; },
		enumerable: true,
		configurable: false
	});

	Object.defineProperty(that, 'bottom', {
		get: function() { return that.top + that.height; },
		enumerable: true,
		configurable: false
	});

	// ------------------------------------------------------------------
	//
	// This function is used to ensure the viewport moves to keep the specified
	// model visible.  Based upon the game-world location of the model and the
	// current state of the viewport, the viewport is updated to ensure the
	// model is visible.  The viewport is analagous to a camera.
	//
	// ------------------------------------------------------------------
	that.update = function(model) {
		//
		// Compute how close the model is to the visible edge in screen-space
		// and move the viewport accordingly.
		var diffRight = that.right - model.position.x,
			diffLeft = Math.abs(spec.left - model.position.x),
			diffBottom = that.bottom - model.position.y,
			diffTop = Math.abs(spec.top - model.position.y);

		if (diffRight < spec.buffer && (spec.worldWidth - model.position.x) >= spec.buffer ) {
			spec.left += (spec.buffer - diffRight);
		}

		if (diffLeft < spec.buffer && model.position.x >= spec.buffer) {
			spec.left -= (spec.buffer - diffLeft);
		}

		if (diffBottom < spec.buffer && (spec.worldHeight - model.position.y) >= spec.buffer) {
			spec.top += (spec.buffer - diffBottom);
		}

		if (diffTop < spec.buffer && model.position.y >= spec.buffer) {
			spec.top -= (spec.buffer - diffTop);
		}
	};

	// ------------------------------------------------------------------
	//
	// Use to specify new properties for the viewport.
	//
	// ------------------------------------------------------------------
	that.set = function(left, top, buffer, worldWidth, worldHeight) {
		spec.left = left;
		spec.top = top;
		spec.buffer = buffer;
		spec.worldWidth = worldWidth;
		spec.worldHeight = worldHeight;
	};

	return that;
};