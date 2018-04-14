import Point3 from '../Point3';
import Cube from '../Cube';

const UP = 0;
const DOWN = 1;
const FORWARDX = 2;
const FORWARDY = 3;
const BACKWARDX = 4;
const BACKWARDY = 5;
const ISOPHYSICS = 'IsoPhysics';

/**
 * @class Isometric.Body
 *
 * @classdesc
 * The Physics Body is linked to a single IsoSprite. All physics operations should be performed against the body rather than
 * the IsoSprite itself. For example you can set the velocity, acceleration, bounce values etc all on the Body.
 */
export default class Body {
  /*
   * @constructor
   * @param {IsoSprite} sprite - The IsoSprite object this physics body belongs to.
   */
  constructor(sprite) {
    /**
     * @property {IsoSprite} sprite - Reference to the parent IsoSprite.
     */
    this.sprite = sprite;

    /**
     * @property {Phaser.Scene} scene - Local reference to scene.
     */
    this.scene = sprite.scene;

    /**
     * @property {number} type - The type of physics system this body belongs to.
     */
    this.type = ISOPHYSICS;

    /**
     * @property {boolean} enable - A disabled body won't be checked for any form of collision or overlap or have its pre/post updates run.
     * @default
     */
    this.enable = true;

    /**
     * @property {Phaser.Point} offset - The offset of the Physics Body from the IsoSprite x/y/z position.
     */
    this.offset = new Point3();

    /**
     * @property {Point3} position - The position of the physics body.
     * @readonly
     */
    this.position = new Point3(sprite.isoX, sprite.isoY, sprite.isoZ);

    /**
     * @property {Phaser.Point} prev - The previous position of the physics body.
     * @readonly
     */
    this.prev = new Point3(this.position.x, this.position.y, this.position.z);

    /**
     * @property {boolean} allowRotation - Allow this Body to be rotated? (via angularVelocity, etc)
     * @default
     */
    this.allowRotation = true;

    /**
     * @property {number} rotation - The amount the Body is rotated.
     */
    this.rotation = sprite.rotation;

    /**
     * @property {number} preRotation - The previous rotation of the physics body.
     * @readonly
     */
    this.preRotation = sprite.rotation;

    /**
     * @property {number} sourceWidthX - The un-scaled original size.
     * @readonly
     */
    this.sourceWidthX = sprite.width / sprite.scaleX;

    /**
     * @property {number} sourceWidthY - The un-scaled original size.
     * @readonly
     */
    this.sourceWidthY = sprite.width / sprite.scaleX;

    /**
     * @property {number} sourceHeight - The un-scaled original size.
     * @readonly
     */
    this.sourceHeight = sprite.height / sprite.scaleY;

    /**
     * @property {number} widthX - The calculated X width (breadth) of the physics body.
     */
    this.widthX = Math.ceil(sprite.width * 0.5);

    /**
     * @property {number} widthY - The calculated Y width (depth) of the physics body.
     */
    this.widthY = Math.ceil(sprite.width * 0.5);

    /**
     * @property {number} height - The calculated height of the physics body.
     */
    this.height = sprite.height - Math.ceil(sprite.width * 0.5);

    /**
     * @property {number} halfWidthX - The calculated X width / 2 of the physics body.
     */
    this.halfWidthX = Math.abs(this.widthX * 0.5);

    /**
     * @property {number} halfWidthX - The calculated X width / 2 of the physics body.
     */
    this.halfWidthY = Math.abs(this.widthY * 0.5);

    /**
     * @property {number} halfHeight - The calculated height / 2 of the physics body.
     */
    this.halfHeight = Math.abs(this.height * 0.5);

    /**
     * @property {Point3} center - The center coordinate of the physics body.
     */
    this.center = new Point3(sprite.isoX + this.halfWidthX, sprite.isoY + this.halfWidthY, sprite.isoZ + this.halfHeight);

    /**
     * @property {Point3} velocity - The velocity in pixels per second sq. of the Body.
     */
    this.velocity = new Point3();

    /**
     * @property {Point3} newVelocity - New velocity.
     * @readonly
     */
    this.newVelocity = new Point3();

    /**
     * @property {Point3} deltaMax - The Sprite position is updated based on the delta x/y values. You can set a cap on those (both +-) using deltaMax.
     */
    this.deltaMax = new Point3();

    /**
     * @property {Point3} acceleration - The velocity in pixels per second sq. of the Body.
     */
    this.acceleration = new Point3();

    /**
     * @property {Point3} drag - The drag applied to the motion of the Body.
     */
    this.drag = new Point3();

    /**
     * @property {boolean} allowGravity - Allow this Body to be influenced by gravity? Either world or local.
     * @default
     */
    this.allowGravity = true;

    /**
     * @property {Point3} gravity - A local gravity applied to this Body. If non-zero this over rides any world gravity, unless Body.allowGravity is set to false.
     */
    this.gravity = new Point3();

    /**
     * @property {Point3} bounce - The elasticitiy of the Body when colliding. bounce.x/y/z = 1 means full rebound, bounce.x/y/z = 0.5 means 50% rebound velocity.
     */
    this.bounce = new Point3();

    /**
     * @property {Point3} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxVelocity = new Point3(10000, 10000, 10000);

    /**
     * @property {number} angularVelocity - The angular velocity in pixels per second sq. of the Body.
     * @default
     */
    this.angularVelocity = 0;

    /**
     * @property {number} angularAcceleration - The angular acceleration in pixels per second sq. of the Body.
     * @default
     */
    this.angularAcceleration = 0;

    /**
     * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
     * @default
     */
    this.angularDrag = 0;

    /**
     * @property {number} maxAngular - The maximum angular velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxAngular = 1000;

    /**
     * @property {number} mass - The mass of the Body.
     * @default
     */
    this.mass = 1;

    /**
     * @property {number} angle - The angle of the Body in radians as calculated by its velocity, rather than its visual angle.
     * @readonly
     */
    this.angle = 0;

    /**
     * @property {number} speed - The speed of the Body as calculated by its velocity.
     * @readonly
     */
    this.speed = 0;

    /**
     * @property {number} facing - A const reference to the direction the Body is traveling or facing.
     * @default
     */
    this.facing = Phaser.NONE;

    /**
     * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
     * @default
     */
    this.immovable = false;

    /**
     * If you have a Body that is being moved around the world via a tween or a Group motion, but its local x/y position never
     * actually changes, then you should set Body.moves = false. Otherwise it will most likely fly off the screen.
     * If you want the physics system to move the body around, then set moves to true.
     * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
     * @default
     */
    this.moves = true;

    /**
     * This flag allows you to disable the custom x separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateX = false;

    /**
     * This flag allows you to disable the custom y separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateY = false;

    /**
     * This flag allows you to disable the custom z separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateZ - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateZ = false;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapX - The amount of horizontal overlap during the collision.
     */
    this.overlapX = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapY = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapZ = 0;

    /**
     * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
     * @property {boolean} embedded - Body embed value.
     */
    this.embedded = false;

    /**
     * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
     * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
     */
    this.collideWorldBounds = false;

    /**
     * Set the checkCollision properties to control which directions collision is processed for this Body.
     * For example checkCollision.up = false means it won't collide when the collision happened while moving up.
     * @property {object} checkCollision - An object containing allowed collision.
     */
    this.checkCollision = {
      none: false,
      any: true,
      up: true,
      down: true,
      frontX: true,
      frontY: true,
      backX: true,
      backY: true
    };

    /**
     * This object is populated with boolean values when the Body collides with another.
     * touching.up = true means the collision happened to the top of this Body for example.
     * @property {object} touching - An object containing touching results.
     */
    this.touching = {
      none: true,
      up: false,
      down: false,
      frontX: false,
      frontY: false,
      backX: false,
      backY: false
    };

    /**
     * This object is populated with previous touching values from the bodies previous collision.
     * @property {object} wasTouching - An object containing previous touching results.
     */
    this.wasTouching = {
      none: true,
      up: false,
      down: false,
      frontX: false,
      frontY: false,
      backX: false,
      backY: false
    };

    /**
     * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
     * For example if blocked.up is true then the Body cannot move up.
     * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
     */
    this.blocked = {
      up: false,
      down: false,
      frontX: false,
      frontY: false,
      backX: false,
      backY: false
    };

    /**
     * @property {number} phase - Is this Body in a preUpdate (1) or postUpdate (2) state?
     */
    this.phase = 0;

    /**
     * @property {boolean} skipTree - If true and you collide this IsoSprite against a Group, it will disable the collision check from using a QuadTree/Octree.
     */
    this.skipTree = false;

    /**
     * @property {boolean} _reset - Internal cache var.
     * @private
     */
    this._reset = true;

    /**
     * @property {number} _sx - Internal cache var.
     * @private
     */
    this._sx = sprite.scaleX;

    /**
     * @property {number} _sy - Internal cache var.
     * @private
     */
    this._sy = sprite.scaleY;

    /**
     * @property {number} _dx - Internal cache var.
     * @private
     */
    this._dx = 0;

    /**
     * @property {number} _dy - Internal cache var.
     * @private
     */
    this._dy = 0;

    /**
     * @property {number} _dz - Internal cache var.
     * @private
     */
    this._dz = 0;

    /**
     * @property {Array.<Point3>} _corners - The 8 corners of the bounding cube.
     * @private
     */
    this._corners = [new Point3(this.x, this.y, this.z),
      new Point3(this.x, this.y, this.z + this.height),
      new Point3(this.x, this.y + this.widthY, this.z),
      new Point3(this.x, this.y + this.widthY, this.z + this.height),
      new Point3(this.x + this.widthX, this.y, this.z),
      new Point3(this.x + this.widthX, this.y, this.z + this.height),
      new Point3(this.x + this.widthX, this.y + this.widthY, this.z),
      new Point3(this.x + this.widthX, this.y + this.widthY, this.z + this.height)
    ];
  }

  /**
   * Internal method.
   *
   * @method Body#updateBounds
   * @protected
   */
  updateBounds() {
    var asx = Math.abs(this.sprite.scaleX);
    var asy = Math.abs(this.sprite.scaleY);

    if (asx !== this._sx || asy !== this._sy) {
      this.widthX = Math.ceil(this.sprite.width * 0.5);
      this.widthY = Math.ceil(this.sprite.width * 0.5);
      this.height = Math.ceil(this.sprite.height - (this.sprite.width * 0.5));
      this.halfWidthX = Math.floor(this.widthX * 0.5);
      this.halfWidthY = Math.floor(this.widthY * 0.5);
      this.halfHeight = Math.floor(this.height * 0.5);
      this._sx = asx;
      this._sy = asy;
      this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

      this._reset = true;
    }
  }

  /**
   * Internal method.
   *
   * @method Body#preUpdate
   * @protected
   */
  preUpdate(time, delta) {
    if (!this.enable) { return; }

    this.phase = 1;

    //  Store and reset collision flags
    this.wasTouching.none = this.touching.none;
    this.wasTouching.up = this.touching.up;
    this.wasTouching.down = this.touching.down;
    this.wasTouching.backX = this.touching.backX;
    this.wasTouching.backY = this.touching.backY;
    this.wasTouching.frontX = this.touching.frontX;
    this.wasTouching.frontY = this.touching.frontY;

    this.touching.none = true;
    this.touching.up = false;
    this.touching.down = false;
    this.touching.backX = false;
    this.touching.backY = false;
    this.touching.frontX = false;
    this.touching.frontY = false;

    this.blocked.up = false;
    this.blocked.down = false;
    this.blocked.frontY = false;
    this.blocked.frontX = false;
    this.blocked.backY = false;
    this.blocked.backX = false;

    this.embedded = false;

    this.updateBounds();

    //  Working out how to incorporate anchors into this was... fun.
    this.position.x = this.sprite.isoX + ((this.widthX * -this.sprite.originX) + this.widthX * 0.5) + this.offset.x;
    this.position.y = this.sprite.isoY + ((this.widthY * this.sprite.originX) - this.widthY * 0.5) + this.offset.y;
    this.position.z = this.sprite.isoZ - (Math.abs(this.sprite.height) * (1 - this.sprite.originY)) + (Math.abs(this.sprite.width * 0.5)) + this.offset.z;


    this.rotation = this.sprite.angle;

    this.preRotation = this.rotation;

    if (this._reset || this.sprite.fresh === true) {
      this.prev.x = this.position.x;
      this.prev.y = this.position.y;
      this.prev.z = this.position.z;
    }

    if (this.moves) {
      delta /= 1000;
      this.scene.isoPhysics.updateMotion(this, delta);

      this.newVelocity.set(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);

      this.position.x += this.newVelocity.x;
      this.position.y += this.newVelocity.y;
      this.position.z += this.newVelocity.z;

      if (this.position.x !== this.prev.x || this.position.y !== this.prev.y || this.position.z !== this.prev.z) {
        this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y + this.velocity.z * this.velocity.z);
        this.angle = Math.atan2(this.velocity.y, this.velocity.x);
      }

      //  Now the State update will throw collision checks at the Body
      //  And finally we'll integrate the new position back to the Sprite in postUpdate

      if (this.collideWorldBounds) {
        this.checkWorldBounds();
      }

      if (this.sprite.outOfBoundsKill && !this.scene.isoPhysics.bounds.intersects(this.sprite.isoBounds)){
        this.sprite.kill();
      }
    }

    this._dx = this.deltaX();
    this._dy = this.deltaY();
    this._dz = this.deltaZ();

    this._reset = false;
  }

  /**
   * Internal method.
   *
   * @method Body#postUpdate
   * @protected
   */
  postUpdate() {
    //  Only allow postUpdate to be called once per frame
    if (!this.enable || this.phase === 2) { return; }

    this.phase = 2;

    // stops sprites flying off if isoPosition is changed during update
    if (this._reset) {
      this.prev.x = this.position.x;
      this.prev.y = this.position.y;
      this.prev.z = this.position.z;
    }

    if (this.deltaAbsX() >= this.deltaAbsY() && this.deltaAbsX() >= this.deltaAbsZ()){
      if (this.deltaX() < 0) {
        this.facing = BACKWARDX;
      } else if (this.deltaX() > 0) {
        this.facing = FORWARDX;
      }
    } else if (this.deltaAbsY() >= this.deltaAbsX() && this.deltaAbsY() >= this.deltaAbsZ()){
      if (this.deltaY() < 0) {
        this.facing = BACKWARDY;
      } else if (this.deltaY() > 0) {
        this.facing = FORWARDY;
      }
    } else {
      if (this.deltaZ() < 0) {
        this.facing = DOWN;
      } else if (this.deltaZ() > 0) {
        this.facing = UP;
      }
    }

    if (this.moves) {
      this._dx = this.deltaX();
      this._dy = this.deltaY();
      this._dz = this.deltaZ();

      if (this.deltaMax.x !== 0 && this._dx !== 0) {
        if (this._dx < 0 && this._dx < -this.deltaMax.x) {
          this._dx = -this.deltaMax.x;
        } else if (this._dx > 0 && this._dx > this.deltaMax.x) {
          this._dx = this.deltaMax.x;
        }
      }

      if (this.deltaMax.y !== 0 && this._dy !== 0) {
        if (this._dy < 0 && this._dy < -this.deltaMax.y) {
          this._dy = -this.deltaMax.y;
        } else if (this._dy > 0 && this._dy > this.deltaMax.y) {
          this._dy = this.deltaMax.y;
        }
      }

      if (this.deltaMax.z !== 0 && this._dz !== 0) {
        if (this._dz < 0 && this._dz < -this.deltaMax.z) {
          this._dz = -this.deltaMax.z;
        } else if (this._dz > 0 && this._dz > this.deltaMax.z) {
          this._dz = this.deltaMax.z;
        }
      }

      this.sprite.isoX += this._dx;
      this.sprite.isoY += this._dy;
      this.sprite.isoZ += this._dz;
    }

    this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

    if (this.allowRotation) {
      this.sprite.angle += this.deltaR();
    }

    this.prev.x = this.position.x;
    this.prev.y = this.position.y;
    this.prev.z = this.position.z;

    this._reset = false;
  }

  /**
   * Removes this body's reference to its parent sprite, freeing it up for gc.
   *
   * @method Body#destroy
   */
  destroy() {
    this.sprite = null;
  }

  /**
   * Internal method.
   *
   * @method Body#checkWorldBounds
   * @protected
   */
  checkWorldBounds() {
    if (this.position.x < this.scene.isoPhysics.bounds.x && this.scene.isoPhysics.checkCollision.backX) {
      this.position.x = this.scene.isoPhysics.bounds.x;
      this.velocity.x *= -this.bounce.x;
      this.blocked.backX = true;
    } else if (this.frontX > this.scene.isoPhysics.bounds.frontX && this.scene.isoPhysics.checkCollision.frontX) {
      this.position.x = this.scene.isoPhysics.bounds.frontX - this.widthX;
      this.velocity.x *= -this.bounce.x;
      this.blocked.frontX = true;
    }

    if (this.position.y < this.scene.isoPhysics.bounds.y && this.scene.isoPhysics.checkCollision.backY) {
      this.position.y = this.scene.isoPhysics.bounds.y;
      this.velocity.y *= -this.bounce.y;
      this.blocked.backY = true;
    } else if (this.frontY > this.scene.isoPhysics.bounds.frontY && this.scene.isoPhysics.checkCollision.frontY) {
      this.position.y = this.scene.isoPhysics.bounds.frontY - this.widthY;
      this.velocity.y *= -this.bounce.y;
      this.blocked.frontY = true;
    }

    if (this.position.z < this.scene.isoPhysics.bounds.z && this.scene.isoPhysics.checkCollision.down) {
      this.position.z = this.scene.isoPhysics.bounds.z;
      this.velocity.z *= -this.bounce.z;
      this.blocked.down = true;
    } else if (this.top > this.scene.isoPhysics.bounds.top && this.scene.isoPhysics.checkCollision.up) {
      this.position.z = this.scene.isoPhysics.bounds.top - this.height;
      this.velocity.z *= -this.bounce.z;
      this.blocked.up = true;
    }
  }

  /**
   * You can modify the size of the physics Body to be any dimension you need.
   * So it could be smaller or larger than the parent Sprite. You can also control the x, y and z offset, which
   * is the position of the Body relative to the center of the Sprite.
   *
   * @method Body#setSize
   * @param {number} widthX - The X width (breadth) of the Body.
   * @param {number} widthY - The Y width (depth) of the Body.
   * @param {number} height - The height of the Body.
   * @param {number} [offsetX] - The X offset of the Body from the Sprite position.
   * @param {number} [offsetY] - The Y offset of the Body from the Sprite position.
   * @param {number} [offsetZ] - The Z offset of the Body from the Sprite position.
   */
  setSize(widthX, widthY, height, offsetX, offsetY, offsetZ) {
    if (typeof offsetX === 'undefined') {
      offsetX = this.offset.x;
    }
    if (typeof offsetY === 'undefined') {
      offsetY = this.offset.y;
    }
    if (typeof offsetZ === 'undefined') {
      offsetZ = this.offset.z;
    }

    this.sourceWidthX = widthX;
    this.sourceWidthY = widthY;
    this.sourceHeight = height;
    this.widthX = (this.sourceWidthX) * this._sx;
    this.widthY = (this.sourceWidthY) * this._sx;
    this.height = (this.sourceHeight) * this._sy;
    this.halfWidthX = Math.floor(this.widthX * 0.5);
    this.halfWidthY = Math.floor(this.widthY * 0.5);
    this.halfHeight = Math.floor(this.height * 0.5);
    this.offset.setTo(offsetX, offsetY, offsetZ);

    this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);
  }

  /**
   * Resets all Body values (velocity, acceleration, rotation, etc)
   *
   * @method Body#reset
   * @param {number} x - The new x position of the Body.
   * @param {number} y - The new y position of the Body.
   * @param {number} z - The new z position of the Body.
   */
  reset(x, y, z) {
    this.velocity.set(0);
    this.acceleration.set(0);

    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this.position.x = x + ((this.widthX * -this.sprite.anchor.x) + this.widthX * 0.5) + this.offset.x;
    this.position.y = y + ((this.widthY * this.sprite.anchor.x) - this.widthY * 0.5) + this.offset.y;
    this.position.z = z - (Math.abs(this.sprite.height) * (1 - this.sprite.anchor.y)) + (Math.abs(this.sprite.width * 0.5)) + this.offset.z;

    this.prev.x = this.position.x;
    this.prev.y = this.position.y;
    this.prev.z = this.position.z;

    this.rotation = this.sprite.angle;
    this.preRotation = this.rotation;

    this._sx = this.sprite.scaleX;
    this._sy = this.sprite.scaleY;

    this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

    this.sprite._isoPositionChanged = true;
  }

  /**
   * Tests if a world point lies within this Body.
   *
   * @method Body#hitTest
   * @param {number} x - The world x coordinate to test.
   * @param {number} y - The world y coordinate to test.
   * @param {number} z - The world z coordinate to test.
   * @return {boolean} True if the given coordinates are inside this Body, otherwise false.
   */
  hitTest(x, y, z) {
    return Cube.contains(this, x, y, z);
  }

  /**
   * Returns true if the bottom of this Body is in contact with either the world bounds.
   *
   * @method Body#onFloor
   * @return {boolean} True if in contact with either the world bounds.
   */
  onFloor() {
    return this.blocked.down;
  }

  /**
   * Returns true if either side of this Body is in contact with either the world bounds.
   *
   * @method Body#onWall
   * @return {boolean} True if in contact with world bounds.
   */
  onWall() {
    return (this.blocked.frontX || this.blocked.frontY || this.blocked.backX || this.blocked.backY);
  }

  /**
   * Returns the absolute delta x value.
   *
   * @method Body#deltaAbsX
   * @return {number} The absolute delta value.
   */
  deltaAbsX() {
    return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());
  }

  /**
   * Returns the absolute delta y value.
   *
   * @method Body#deltaAbsY
   * @return {number} The absolute delta value.
   */
  deltaAbsY() {
    return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());
  }

  /**
   * Returns the absolute delta z value.
   *
   * @method Body#deltaAbsZ
   * @return {number} The absolute delta value.
   */
  deltaAbsZ() {
    return (this.deltaZ() > 0 ? this.deltaZ() : -this.deltaZ());
  }

  /**
   * Returns the delta x value. The difference between Body.x now and in the previous step.
   *
   * @method Body#deltaX
   * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
   */
  deltaX() {
    return this.position.x - this.prev.x;
  }

  /**
   * Returns the delta y value. The difference between Body.y now and in the previous step.
   *
   * @method Body#deltaY
   * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
   */
  deltaY() {
    return this.position.y - this.prev.y;
  }

  /**
   * Returns the delta z value. The difference between Body.z now and in the previous step.
   *
   * @method Body#deltaZ
   * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
   */
  deltaZ() {
    return this.position.z - this.prev.z;
  }

  /**
   * Returns the delta r value. The difference between Body.rotation now and in the previous step.
   *
   * @method Body#deltaR
   * @return {number} The delta value. Positive if the motion was clockwise, negative if anti-clockwise.
   */
  deltaR() {
    return this.rotation - this.preRotation;
  }

  /**
   * Returns the 8 corners that make up the body's bounding cube.
   *
   * @method Body#getCorners
   * @return {Array.<Point3>} An array of Point3 values specifying each corner co-ordinate.
   */
  getCorners() {
    this._corners[0].setTo(this.x, this.y, this.z);
    this._corners[1].setTo(this.x, this.y, this.z + this.height);
    this._corners[2].setTo(this.x, this.y + this.widthY, this.z);
    this._corners[3].setTo(this.x, this.y + this.widthY, this.z + this.height);
    this._corners[4].setTo(this.x + this.widthX, this.y, this.z);
    this._corners[5].setTo(this.x + this.widthX, this.y, this.z + this.height);
    this._corners[6].setTo(this.x + this.widthX, this.y + this.widthY, this.z);
    this._corners[7].setTo(this.x + this.widthX, this.y + this.widthY, this.z + this.height);

    return this._corners;
  }

  /**
   * @name Body#top
   * @property {number} bottom - The top value of this Body (same as Body.z + Body.height)
   * @readonly
   */
  get top() {
    return this.position.z + this.height;
  }

  /**
   * @name Body#frontX
   * @property {number} right - The front X value of this Body (same as Body.x + Body.widthX)
   * @readonly
   */

  get frontX() {
    return this.position.x + this.widthX;
  }

  /**
   * @name Body#right
   * @property {number} right - The front X value of this Body (same as Body.x + Body.widthX) - alias used for QuadTree
   * @readonly
   */

  get right() {
    return this.position.x + this.widthX;
  }

  /**
   * @name Body#frontY
   * @property {number} right - The front Y value of this Body (same as Body.y + Body.widthY)
   * @readonly
   */

  get frontY() {
    return this.position.y + this.widthY;
  }

  /**
   * @name Body#bottom
   * @property {number} right - The front Y value of this Body (same as Body.y + Body.widthY) - alias used for QuadTree
   * @readonly
   */

  get bottom() {
    return this.position.y + this.widthY;
  }

  /**
   * @name Body#x
   * @property {number} x - The x position.
   */

  get x() {
    return this.position.x;
  }

  set x(value) {
    this.position.x = value;
  }

  /**
   * @name Body#y
   * @property {number} y - The y position.
   */

  get y() {
    return this.position.y;
  }

  set y(value) {
    this.position.y = value;
  }

  /**
   * @name Body#z
   * @property {number} z - The z position.
   */

  get z() {
    return this.position.z;
  }

  set z(value) {
    this.position.z = value;
  }

  debugRender(context, color = 'rgba(0,255,0,0.4)', filled = true) {
    var points = [];
    var corners = this.getCorners();

    var posX = -this.scene.cameras.main.x;
    var posY = -this.scene.cameras.main.y;

    if (filled) {
      points = [corners[1], corners[3], corners[2], corners[6], corners[4], corners[5], corners[1]];

      points = points.map(p => {
        var newPos = this.scene.iso.projector.project(p);
        newPos.x += posX;
        newPos.y += posY;
        return newPos;
      });

      context.beginPath();
      context.fillStyle = color;
      context.moveTo(points[0].x, points[0].y);

      for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }

      context.fill();
    } else {
      points = corners.slice(0, corners.length);
      points = points.map(p => {
        var newPos = this.scene.iso.projector.project(p);
        newPos.x += posX;
        newPos.y += posY;
        return newPos;
      });

      context.moveTo(points[0].x, points[0].y);
      context.beginPath();
      context.strokeStyle = color;

      context.lineTo(points[1].x, points[1].y);
      context.lineTo(points[3].x, points[3].y);
      context.lineTo(points[2].x, points[2].y);
      context.lineTo(points[6].x, points[6].y);
      context.lineTo(points[4].x, points[4].y);
      context.lineTo(points[5].x, points[5].y);
      context.lineTo(points[1].x, points[1].y);
      context.lineTo(points[0].x, points[0].y);
      context.lineTo(points[4].x, points[4].y);
      context.moveTo(points[0].x, points[0].y);
      context.lineTo(points[2].x, points[2].y);
      context.moveTo(points[3].x, points[3].y);
      context.lineTo(points[7].x, points[7].y);
      context.lineTo(points[6].x, points[6].y);
      context.moveTo(points[7].x, points[7].y);
      context.lineTo(points[5].x, points[5].y);
      context.stroke();
      context.closePath();
    }
  }
}

/**
 * Render IsoSprite Body Physics Data as text.
 *
 * @method Body#renderBodyInfo
 * @param {Body} body - The Body to render the info of.
 * @param {number} x - X position of the debug info to be rendered.
 * @param {number} y - Y position of the debug info to be rendered.
 * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
 */
// Body.renderBodyInfo = function (debug, body) {
//
//     debug.line('x: ' + body.x.toFixed(2), 'y: ' + body.y.toFixed(2), 'z: ' + body.z.toFixed(2), 'widthX: ' + body.widthX, 'widthY: ' + body.widthY, 'height: ' + body.height);
//     debug.line('velocity x: ' + body.velocity.x.toFixed(2), 'y: ' + body.velocity.y.toFixed(2), 'z: ' + body.velocity.z.toFixed(2), 'deltaX: ' + body._dx.toFixed(2), 'deltaY: ' + body._dy.toFixed(2), 'deltaZ: ' + body._dz.toFixed(2));
//     debug.line('acceleration x: ' + body.acceleration.x.toFixed(2), 'y: ' + body.acceleration.y.toFixed(2), 'z: ' + body.acceleration.z.toFixed(2), 'speed: ' + body.speed.toFixed(2), 'angle: ' + body.angle.toFixed(2));
//     debug.line('gravity x: ' + body.gravity.x, 'y: ' + body.gravity.y, 'z: ' + body.gravity.z);
//     debug.line('bounce x: ' + body.bounce.x.toFixed(2), 'y: ' + body.bounce.y.toFixed(2), 'z: ' + body.bounce.z.toFixed(2));
//     debug.line('touching: ', 'frontX: ' + (body.touching.frontX ? 1 : 0) + ' frontY: ' + (body.touching.frontY ? 1 : 0) + ' backX: ' + (body.touching.backX ? 1 : 0) + ' backY: ' + (body.touching.backY ? 1 : 0) + ' up: ' + (body.touching.up ? 1 : 0) + ' down: ' + (body.touching.down ? 1 : 0));
//     debug.line('blocked: ', 'frontX: ' + (body.blocked.frontX ? 1 : 0) + ' frontY: ' + (body.blocked.frontY ? 1 : 0) + ' backX: ' + (body.blocked.backX ? 1 : 0) + ' backY: ' + (body.blocked.backY ? 1 : 0) + ' up: ' + (body.blocked.up ? 1 : 0) + ' down: ' + (body.blocked.down ? 1 : 0));
//
// };

// Phaser.Utils.Debug.prototype.body = (function (_super) {
//
//     return function (sprite, color, filled, depth) {
//         if (sprite.body && sprite.body.type === ISOPHYSICS) {
//             this.start();
//             Body.render(this.context, sprite.body, color, filled);
//             if (depth) {
//                 this.text(sprite.depth.toFixed(2), sprite.x, sprite.y, color, '12px Courier');
//             }
//             this.stop();
//         }
//
//         return _super.call(this, sprite, color, filled);
//     };
//
// })(Phaser.Utils.Debug.prototype.body);

// Phaser.Utils.Debug.prototype.bodyInfo = (function (_super) {
//
//     return function (sprite, x, y, color) {
//         if (sprite.body && sprite.body.type === ISOPHYSICS) {
//             this.start(x, y, color, 210);
//             Body.renderBodyInfo(this, sprite.body);
//             this.stop();
//         }
//
//         return _super.call(this, sprite, x, y, color);
//     };
//
// })(Phaser.Utils.Debug.prototype.bodyInfo);
