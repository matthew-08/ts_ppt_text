"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortSlides = (slides) => {
    if (slideValidityChecks(slides)) {
        return slides.sort((a, b) => {
            a = a.replace('slide', '').replace('.xml', '');
            b = b.replace('slide', '').replace('.xml', '');
            if (+a > +b)
                return 1;
            else if (+a < +b)
                return -1;
            else
                return 0;
        });
    }
};
const slideValidityChecks = (slides) => {
    if (!slides.every((slide) => slide.includes('slide'))) {
        throw new Error('Invalid slide files.  Slide .xml files must be in the format "slide[number].xml"');
    }
    if (!slides.every((slide) => slide.includes('.xml'))) {
        throw new Error('All slide files must be valid .xml files');
    }
    return true;
};
exports.default = sortSlides;
