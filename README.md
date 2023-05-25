# ts_ppt_text

TypeScript PowerPoint Text is a library which allows for the modification of text entries within PowerPoint (.pptx, .ppt) files.

## Usage Example

```ts
   const presentation = new Presentation(
        path.join(__dirname, `../example.pptx`),
        path.join(__dirname, `../output/`)
    )
    
    const slides = await presentation.getSlides()
    
    slides.forEach((slide) => console.log(slide.textNodes))
    
    slides.forEach((slide) => slide.editTextNode(1, 'new text'))
    
```
