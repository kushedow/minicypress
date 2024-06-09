class MiniCypress {
    constructor() {
        this.el = null;
    }

    get(selector) {
        this.el = dom.querySelector(selector);
        return this;
    }

    find(selector) {
        if (!this.el) {
            throw new Error("Element not found. Make sure you have called get() with a valid selector.");
        }
        const foundElement = this.el.querySelector(selector);
        if (!foundElement) {
            throw new Error(`No elements found for selector "${selector}".`);
        }
        this.el = foundElement;
        return this;
    }

    and(method, expected, content = null) {
        return this.should(method, expected, content);
    }

    children(selector) {

        if (!this.el) {
            throw new Error("Element not found. Make sure you have called get() with a valid selector.");
        }

        const childElements = this.el.querySelectorAll(selector);
        if (!childElements) {
            throw new Error(`No elements found for selector "${selector}".`);
        }
        this.el = childElements;
        return this;

    }

    wrap(object) {
        if (object instanceof Element) {
            this.el = object;
            this.elements = null;
        } else if (NodeList.prototype.isPrototypeOf(object) || Array.isArray(object)) {
            this.elements = object;
            this.el = null;
        } else {
            this.el = object;
            this.elements = null;
        }
        return this;
    }

    each(callback) {
        if (!this.elements) {throw new Error("No elements to iterate over. Make sure you have called wrap() with a valid collection.");}

        this.elements.forEach((element, index) => {
            this.wrap(element);
            callback.call(this, this, index, element);
        });

        this.wrap(this.elements);
        return this;
    }

    should(method, expected, content = null) {

        if (!this.el) {throw new Error("Element not found. Make sure you have called get() with a valid selector.");}

        switch (method) {
            case 'exist':
                if (!this.el) {
                    throw new Error("Expected element to exist, but it does not.");
                }
                break;
            case 'have.text':
                const actualText = this.el.textContent.trim();
                if (actualText !== expected) {
                    throw new Error(`Expected element to have text "${expected}", but got "${actualText}".`);
                }
                break;

            case 'have.attr':
                if (typeof expected !== 'string') {
                    throw new Error("Expected value for 'have.attr' must be an object with attribute and value.");
                }

                const actualAttrValue = this.el.getAttribute(expected);
                if (content !== null && actualAttrValue !== content) {
                    throw new Error(`Expected element to have attribute "${expected}=${content}", but got "${expected}=${actualAttrValue}".`);
                }

                break;

            case 'have.length':
                if (this.el.length !== expected) {
                    throw new Error(`Expected element to have length "${expected}", but got "${this.el.length}".`);
                }
                break;

            case 'have.css':
                const actualCSSValue = getComputedStyle(this.el).getPropertyValue(expected).trim();
                if (actualCSSValue !== content) {
                    throw new Error(`Expected element to have CSS property "${expected}: ${content}", but got "${expected}: ${actualCSSValue}".`);
                }
                break;

            case 'contain.text':
                const outerText = this.el.textContent.trim();
                if (!outerText.includes(expected)) {
                    throw new Error(`Expected element contain text "${expected}", but "${outerText}" doesn't.`);
                }
                break;

            default:
                throw new Error(`Unsupported should method: ${method}`);
        }
        return this;
    }

    contains(text) {
        if (!this.el) {throw new Error("Element not found. Make sure you have called get() with a valid selector.");}

        const content = this.el.textContent;
        if (!content.includes(text)) {
            throw new Error(`Expected element to contain text "${text}", but it does not.`);
        }
        return this;
    }
}

// Exporting the CypressFork class to be used in other scripts if needed.
const cy = new MiniCypress();
const tests = {}

function it(test_title, function_object) {
    tests[test_title] = function_object
}

function run_tests(tests) {

    let failedTestsCount = 0

    for (const function_object of Object.values(tests)) {
        try {
            function_object();
            console.log("passed")
        } catch (error) {
            console.log("failed", error);
            failedTestsCount++
        }
    }
    return failedTestsCount === 0;

}
