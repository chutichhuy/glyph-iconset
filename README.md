# Glyph, a versatile SVG icon set 

http://glyph.smarticons.co

![Preview](https://raw.githubusercontent.com/frexy/glyph-iconset/master/cover.png)

Glyph is a collection of ~800 beautiful pixel-perfect SVG icons, designed for the modern web. Glyph is 16x16, but because it's SVG, it can be any size you want.

## Updates

### Version 1.1
*   Fixed some typos.
*   Sprite generator.

## Usage

There are many ways to put an SVG icon into your web page. 

### IMG tag

```html
<img src="svg/si-glyph-bicycle-man.svg">
```

### Inline SVG

Or you can copy the SVG content and paste it into your HTML.

### SVG Sprite

An elegant way to use SVG icons is SVG sprite, demonstrated in ```sample.html```.

```html
<svg xmlns="http://www.w3.org/2000/svg" class="si-glyph-bubble-message-hi">
    <use xlink:href="sprite.svg#si-glyph-bubble-message-hi" />
</svg>
```

This method makes use of the ```<use>``` tag to link a part of SVG content from a SVG sprite file into your HTML.

### Use as a web component

The [icon web component](https://github.com/frexy/svg-icon-webcomponent) provides a great way to embed icons in your design by using a custom tag. Please check ```sprite/sample-iwc.html``` for code snippets.

```html
<svg-icon>
    <src href="sprite.svg#si-glyph-bubble-message-hi"/>
</svg-icon>
```

## Style with CSS

Using inline SVG and web component methods, you can style your icon with CSS easily. Glyph is carefully made so that you can change all or some icons color with just these simple CSS snippet below.


Style the whole set

```css
.si-glyph * {
    fill: red;
}
```

Style some specified icons

```css
.si-glyph-bubble-message-hi {
    fill: blue;
}
```

## Custom sprite generator

From version 1.1, Glyph comes with a custom sprite generator script. You need [Node.js](http://nodejs.org) in order to use this script. 

With your favorite terminal, change to the glyph directory, then:

```
node generator/generate.js 
```

A few options:

*   ```-f <csv-file>``` path to a one-column CSV file specified what icon you want to include in the sprite.
*   ```-l <list-of-icons>``` a list of icons separated by commas. For example: bubble-message-hi,camera,car,alarm-clock
*   ```-o <path-to-sprite>``` path lead to the output sprite file.

For example:

```
node generator/generate.js -l camera,car,alarm-clock -o some-icons.sprite 
```

## Todo

*   New icons.

## License

Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
