/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


class Test {
  constructor(val) {
    this.string = val;
    this.idc = 0;
    this.selector = 0;
    this.psel = 0;
    this.prev = '';
  }

  element(value) {
    this.selector += 1;
    this.exception1();
    this.exception2('element');
    this.prev = 'element';
    this.string += value;
    return this;
  }

  stringify() {
    return this.string;
  }

  id(value) {
    this.idc += 1;
    this.exception1();
    this.exception2('element');
    if (this.prev === 'psel') throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    this.prev = 'id';

    this.string += `#${value}`;
    return this;
  }

  class(value) {
    if (this.prev === 'attr') throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.prev = 'id';
    this.string += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.prev === 'pscl') throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    this.prev = 'attr';
    this.string += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.prev === 'psel') throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');

    this.prev = 'pscl';
    this.string += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.prev = 'psel';

    this.psel += 1;
    this.exception1();


    this.string += `::${value}`;

    return this;
  }

  combine(selector1, combinator, selector2) {
    const a = selector1;
    const b = selector2;
    this.string += `${a.stringify()} ${combinator} ${b.stringify()}`;
    return this;
  }

  exception1() {
    if (this.idc === 2 || this.selector === 2 || this.psel === 2) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  }

  exception2(value) {
    if (this.prev !== value) {
      if (this.prev !== '') {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }
  }
}


const cssSelectorBuilder = {
  element(value) {
    return new Test('').element(value);
  },
  id(value) {
    return new Test('').id(value);
  },

  class(value) {
    return new Test('').class(value);
  },

  attr(value) {
    return new Test('').attr(value);
  },

  pseudoClass(value) {
    return new Test('').pseudoClass(value);
  },

  pseudoElement(value) {
    return new Test('').pseudoElement(value);
  },


  combine(selector1, combinator, selector2) {
    const test = new Test('');
    return test.combine(selector1, combinator, selector2);
  },
};
module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
